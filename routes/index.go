package routes

import "github.com/gin-gonic/gin"

func Index(c *gin.Context) {
	c.JSON(200, gin.H{
		"message": "Welcome to Tawa, the backend API for Kokopelli",
	})
}
