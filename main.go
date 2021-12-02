package main

import (
	"github.com/KokopelliMusic/Tawa/v2/routes"
	"github.com/gin-gonic/gin"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func setupDB() *gorm.DB {
	db, err := gorm.Open(sqlite.Open("tawa.db"), &gorm.Config{})
	if err != nil {
		panic(err)
	}

	return db
}

func main() {
	var (
		r  = gin.Default()
		db = setupDB()
	)

	genDB, _ := db.DB()
	defer genDB.Close()

	// Define all REST routes
	r.GET("/", routes.Index)

	r.Run()
}
