// internal/handlers/wsHandler.go
package handlers

import (
	"net/http"

	"github.com/ayushh2k/21BKT0080_Backend/internal/models"
	"github.com/ayushh2k/21BKT0080_Backend/internal/ws"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func ServeWs(hub *ws.Hub, c *gin.Context) {
	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to upgrade to WebSocket"})
		return
	}

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

	client := &ws.Client{
		ID:     uuid.New(),
		Conn:   conn,
		Send:   make(chan []byte, 256),
		Hub:    hub,
		UserID: userObj.ID,
	}

	client.Hub.Register <- client

	go client.WritePump()
}
