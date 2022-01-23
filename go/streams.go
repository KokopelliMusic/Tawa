package main

import (
	"io"
	"time"

	"github.com/gin-gonic/gin"
)

// Stream that sends the current time every 10 seconds
// This is for clients to check if they still have a connection and testing shizzle
func Alive(c *gin.Context) {
	go func() {
		for {
			time.Sleep(time.Second * 10)
			now := time.Now().Format("2006-01-02 15:04:05")

			// Send current time to clients message channel
			aliveStream.Message <- now
		}
	}()

	c.Stream(func(w io.Writer) bool {
		// Stream message to client from message channel
		if msg, ok := <-aliveStream.Message; ok {
			c.SSEvent("message", msg)
			return true
		}
		return false
	})
}

func SessionStream(session string) gin.HandlerFunc {
	fn := func(c *gin.Context) {

		c.Stream(func(w io.Writer) bool {
			if msg, ok := <-sources[session].Message; ok {
				c.SSEvent("message", gin.H{
					"session": session,
					"echo":    msg,
					"date":    time.Now().Format("2006-01-02 15:04:05"),
				})
				return true
			}
			return false
		})

	}
	return gin.HandlerFunc(fn)
}
