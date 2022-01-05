package main

import (
	"encoding/json"
	"log"

	"github.com/ThreeDotsLabs/watermill"
	"github.com/ThreeDotsLabs/watermill/message"
	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
)

type EventInputJSON struct {
	SessionCode string `json:"session"`
	ClientType  string `json:"clientType"`
	Data        string `json:"data"`
}

func InputStream(c *gin.Context) {
	var data EventInputJSON

	// Bind JSON to struct
	if err := c.ShouldBindBodyWith(&data, binding.JSON); err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	log.Println(data)

	// Marschal the JSON to []byte
	rawData, err := json.Marshal(data.Data)

	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	// Create the message to be send to the channel
	msg := message.NewMessage(watermill.NewUUID(), rawData)

	// Publish the message to the session channel
	if err = channel.Publish(data.SessionCode, msg); err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, gin.H{"status": "ok"})
}

func SessionInputStream(c *gin.Context) {
	// sessionCode := c.Params.ByName("sessionCode")

}
