// cmd/main.go
package main

import (
	"net/http"

	"github.com/ayushh2k/21BKT0080_Backend/internal/handlers"
	"github.com/ayushh2k/21BKT0080_Backend/internal/initializers"
	"github.com/ayushh2k/21BKT0080_Backend/internal/middleware"
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
	r.POST("/register", handlers.Signup)
	r.POST("/login", handlers.Login)
	r.GET("/test", middleware.AuthMiddleware, handlers.TestLogin)
	r.POST("/upload", middleware.AuthMiddleware, handlers.UploadFile)
	r.GET("/files", middleware.AuthMiddleware, handlers.GetFiles)
	r.GET("/share/:file_id", middleware.AuthMiddleware, handlers.ShareFile)
	r.DELETE("/files/:file_id", middleware.AuthMiddleware, handlers.DeleteFile)
	r.PUT("/files/:file_id", middleware.AuthMiddleware, handlers.UpdateFileInfo)
	r.GET("/search", middleware.AuthMiddleware, handlers.SearchFiles)

	r.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "Trademarkia Backend Task: 21BKT0080 Ayush Mishra",
		})
	})

	r.Run(":8080")
}
