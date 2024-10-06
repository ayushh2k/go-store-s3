// server/cmd/main.go
package main

import (
	"net/http"

	"github.com/ayushh2k/go-store-s3/server/internal/handlers"
	"github.com/ayushh2k/go-store-s3/server/internal/initializers"
	"github.com/ayushh2k/go-store-s3/server/internal/middleware"
	"github.com/ayushh2k/go-store-s3/server/internal/workers"
	"github.com/gin-gonic/gin"
)

func init() {
	// initializers.LoadEnv()
	initializers.ConnectToDb()
	initializers.ConnectS3()
	initializers.ConnectRedis()
	initializers.SyncDatabase()
}

func main() {
	r := gin.Default()
	r.Use(corsMiddleware())

	// handlers.InitHub()

	// Authentication routes
	r.POST("/register", handlers.Signup)
	r.POST("/login", handlers.Login)

	// File routes
	r.POST("/upload", middleware.AuthMiddleware, middleware.RateLimitMiddleware(), handlers.UploadFile)            //upload
	r.GET("/files", middleware.AuthMiddleware, middleware.RateLimitMiddleware(), handlers.GetFiles)                //get all files
	r.GET("/share/:file_id", middleware.AuthMiddleware, middleware.RateLimitMiddleware(), handlers.ShareFile)      //share file
	r.DELETE("/files/:file_id", middleware.AuthMiddleware, middleware.RateLimitMiddleware(), handlers.DeleteFile)  //delete file
	r.PUT("/files/:file_id", middleware.AuthMiddleware, middleware.RateLimitMiddleware(), handlers.UpdateFileInfo) //update file info

	r.GET("/search", middleware.AuthMiddleware, middleware.RateLimitMiddleware(), handlers.SearchFiles)

	r.GET("/user/email", middleware.AuthMiddleware, middleware.RateLimitMiddleware(), handlers.GetUserEmail)
	r.GET("/user/total-files", middleware.AuthMiddleware, middleware.RateLimitMiddleware(), handlers.GetTotalFiles)
	r.GET("/user/storage-used", middleware.AuthMiddleware, middleware.RateLimitMiddleware(), handlers.GetStorageUsed)

	r.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "https://github.com/ayushh2k/go-store-s3",
			"docs":    "https://documenter.getpostman.com/view/25648449/2sAXqp83yv",
		})
	})

	// Websockets
	// var hub *ws.Hub
	// r.GET("/ws", middleware.AuthMiddleware, func(c *gin.Context) {
	// 	handlers.ServeWs(hub, c)
	// })

	// Start the background worker for file deletion
	go workers.StartFileDeletionWorker()

	r.Run("0.0.0.0:8080")
}

func corsMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}
