// cmd/main.go
package main

import (
	"net/http"

	"github.com/ayushh2k/21BKT0080_Backend/internal/handlers"
	"github.com/ayushh2k/21BKT0080_Backend/internal/initializers"
	"github.com/ayushh2k/21BKT0080_Backend/internal/middleware"
	"github.com/ayushh2k/21BKT0080_Backend/internal/workers"
	"github.com/gin-gonic/gin"
)

func init() {
	initializers.LoadEnv()
	initializers.ConnectToDb()
	initializers.ConnectS3()
	initializers.ConnectRedis()
	initializers.SyncDatabase()
}

func main() {
	r := gin.Default()

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

	r.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "Trademarkia Backend Task: 21BKT0080 Ayush Mishra",
		})
	})

	// Websockets
	// var hub *ws.Hub
	// r.GET("/ws", middleware.AuthMiddleware, func(c *gin.Context) {
	// 	handlers.ServeWs(hub, c)
	// })

	// Start the background worker for file deletion
	go workers.StartFileDeletionWorker()

	r.Run(":8080")
}
