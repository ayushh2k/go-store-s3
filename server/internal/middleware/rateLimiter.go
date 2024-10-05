// internal/middleware/rateLimiter.go
package middleware

import (
	"net/http"
	"sync"
	"time"

	"github.com/ayushh2k/21BKT0080_Backend/internal/models"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"golang.org/x/time/rate"
)

// Create a map to hold the rate limiter for each user
var userRateLimiters = make(map[uuid.UUID]*rate.Limiter)
var mu sync.Mutex

func RateLimitMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		user, exists := c.Get("user")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found in context"})
			c.Abort()
			return
		}
		userObj, ok := user.(models.User)
		if !ok {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid user object"})
			c.Abort()
			return
		}

		userID := userObj.ID

		// Lock the mutex to protect the map from concurrent writes
		mu.Lock()
		limiter, exists := userRateLimiters[userID]
		if !exists {
			limiter = rate.NewLimiter(rate.Every(time.Minute), 500)
			userRateLimiters[userID] = limiter
		}
		mu.Unlock()

		if !limiter.Allow() {
			c.JSON(http.StatusTooManyRequests, gin.H{"error": "Rate limit exceeded"})
			c.Abort()
			return
		}

		c.Next()
	}
}
