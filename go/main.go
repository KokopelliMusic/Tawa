package main

import (
	"context"
	"log"
	"net/http"

	"github.com/ThreeDotsLabs/watermill"
	"github.com/ThreeDotsLabs/watermill/message"
	"github.com/ThreeDotsLabs/watermill/pubsub/gochannel"
	"github.com/gin-gonic/gin"
)

type EventSources map[string]*Event

type Event struct {
	// Events are pushed to this channel by the main events-gathering routine
	Message chan string

	// New client connections
	NewClients chan chan string

	// Closed client connections
	ClosedClients chan chan string

	// Total client connections
	TotalClients map[chan string]bool
}

type ClientChan chan string

// Global variables
var (
	// The main channel that all events move over
	channel = gochannel.NewGoChannel(gochannel.Config{}, watermill.NewStdLogger(true, false))

	// A stream that clients can use to check whether they still have a connection
	aliveStream = NewServer()

	// A map of all available event streams (for sessions)
	sources = make(EventSources)
)

func NewServer() (event *Event) {

	event = &Event{
		Message:       make(chan string),
		NewClients:    make(chan chan string),
		ClosedClients: make(chan chan string),
		TotalClients:  make(map[chan string]bool),
	}

	go event.listen()

	return
}

func (stream *Event) listen() {
	for {
		select {
		// Add new available client
		case client := <-stream.NewClients:
			stream.TotalClients[client] = true
			log.Printf("New client. %d registered clients", len(stream.TotalClients))

		// Remove closed client
		case client := <-stream.ClosedClients:
			delete(stream.TotalClients, client)
			log.Printf("Client disconnected. %d registered clients", len(stream.TotalClients))

		// Broadcast message to client
		case msg := <-stream.Message:
			for client := range stream.TotalClients {
				client <- msg
			}
		}
	}
}

func (stream *Event) EventSource(sessionCode string) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Initialize client channel
		clientChan := make(ClientChan)

		var stream, ok = sources[sessionCode]

		if !ok {
			stream = NewServer()
			sources[sessionCode] = stream
		}

		// Send new connection to event server
		stream.NewClients <- clientChan

		defer func() {
			// Send closed connection to event server
			stream.ClosedClients <- clientChan
		}()

		go func() {
			// Send connection that is closed by client to event server
			<-c.Done()
			stream.ClosedClients <- clientChan
		}()

		c.Next()
	}
}

func HeadersMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Content-Type", "text/event-stream")
		c.Writer.Header().Set("Cache-Control", "no-cache")
		c.Writer.Header().Set("Connection", "keep-alive")
		c.Writer.Header().Set("Transfer-Encoding", "chunked")
		c.Next()
	}
}

func runEventStream() {
	messages, err := channel.Subscribe(context.Background(), "test")

	if err != nil {
		panic(err)
	}

	go process(messages)
}

func process(msgs <-chan *message.Message) {
	for msg := range msgs {
		log.Printf("recv: %s, %s\n", msg.UUID, string(msg.Payload))
	}
}

func main() {
	router := gin.Default()

	sources["TEST"] = NewServer()

	streamGroup := router.Group("/stream")
	{
		streamGroup.Use(sources["TEST"].EventSource("TEST"))
		streamGroup.Use(HeadersMiddleware())

		streamGroup.GET("/time", Alive)
		streamGroup.GET("/session/TEST", SessionStream("TEST"))
	}

	inputGroup := router.Group("/input")
	{
		inputGroup.POST("/test", InputStream)
		inputGroup.POST("/session/:sessionCode", SessionInputStream)
	}

	// Base router "/"
	{
		router.StaticFile("/", "./public/index.html")
		router.StaticFS("/public", http.Dir("public"))
		router.StaticFile("/favicon.ico", "./public/favicon.ico")
	}

	testMsgs, err := channel.Subscribe(context.Background(), "TEST")

	if err != nil {
		panic(err)
	}

	go SessionInputConsumer("TEST")
	go process(testMsgs)

	router.Run("127.0.0.1:8080")
}
