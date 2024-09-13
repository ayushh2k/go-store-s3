package main

import (
	"github.com/ayushh2k/21BKT0080_Backend/initializers"
	"github.com/gin-gonic/gin"
)

func init() {
	initializers.LoadEnv()
	initializers.ConnectToDb()
}

func main() {
	r := gin.Default()
	r.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "21BKT0080 Ayush Mishra, Trademarkia Backend Task",
		})
	})
	r.Run()
}
