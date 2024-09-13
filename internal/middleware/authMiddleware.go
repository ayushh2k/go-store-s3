// internal/middleware/authMiddleware.go

package middleware

import (
	"fmt"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/ayushh2k/21BKT0080_Backend/internal/initializers"
	"github.com/ayushh2k/21BKT0080_Backend/internal/models"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

func AuthMiddleware(c *gin.Context) {

	authHeader := c.GetHeader("Authorization")
	if authHeader == "" {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
			"error": "Authorization header missing",
		})
		return
	}

	if !strings.HasPrefix(authHeader, "Bearer ") {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
			"error": "Invalid token format",
		})
		return
	}

	tokenString := strings.TrimPrefix(authHeader, "Bearer ")

	// Parse the JWT token
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(os.Getenv("JWT_SECRET")), nil
	})

	// Handle invalid token or parsing errors
	if err != nil || !token.Valid {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
			"error": "Invalid or expired token",
		})
		return
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok {
		if float64(time.Now().Unix()) > claims["exp"].(float64) {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"error": "Token has expired",
			})
			return
		}

		var user models.User
		initializers.DB.Db.First(&user, claims["sub"])

		// Check if user exists
		if user.ID == 0 {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"error": "User not found",
			})
			return
		}

		c.Set("user", user)

		c.Next()
	} else {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
			"error": "Invalid token claims",
		})
	}
}
