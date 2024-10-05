package handlers

import (
	"net/http"

	"github.com/ayushh2k/21BKT0080_Backend/internal/initializers"
	"github.com/ayushh2k/21BKT0080_Backend/internal/models"
	"github.com/gin-gonic/gin"
)

func GetUserEmail(c *gin.Context) {
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found in context"})
		return
	}
	userObj, ok := user.(models.User)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid user object"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"email": userObj.Email,
	})
}

func GetTotalFiles(c *gin.Context) {
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found in context"})
		return
	}
	userObj, ok := user.(models.User)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid user object"})
		return
	}

	var totalFiles int64
	result := initializers.DB.Db.Model(&models.FileMetadata{}).Where("user_id = ?", userObj.ID).Count(&totalFiles)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve total files"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"total_files": totalFiles,
	})
}

func GetStorageUsed(c *gin.Context) {
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found in context"})
		return
	}
	userObj, ok := user.(models.User)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid user object"})
		return
	}

	var totalStorage int64
	result := initializers.DB.Db.Model(&models.FileMetadata{}).Where("user_id = ?", userObj.ID).Select("SUM(file_size)").Row().Scan(&totalStorage)
	if result != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve storage used"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"storage_used": totalStorage,
	})
}
