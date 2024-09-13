package main

import (
	"github.com/ayushh2k/21BKT0080_Backend/internal/handlers"
	"github.com/ayushh2k/21BKT0080_Backend/internal/initializers"
	"github.com/ayushh2k/21BKT0080_Backend/internal/middleware"
	"github.com/gin-gonic/gin"
)

func init() {
	initializers.LoadEnv()
	initializers.ConnectToDb()
}

func main() {
	r := gin.Default()
	r.POST("/register", handlers.Signup)
	r.POST("/login", handlers.Login)
	r.GET("/test", middleware.AuthMiddleware, handlers.TestLogin)
	r.Run()
}
