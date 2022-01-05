package main

import (
	"context"
)

func SessionInputConsumer(topic string) {
	msgs, err := channel.Subscribe(context.Background(), topic)

	if err != nil {
		panic(err)
	}

	stream, ok := sources[topic]

	if !ok {
		panic("no stream")
	}

	go func() {
		for msg := range msgs {
			stream.Message <- string(msg.Payload)
		}
	}()
}
