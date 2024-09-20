// internal/ws/hub.go
package ws

import (
	"sync"

	"github.com/google/uuid"
	"github.com/gorilla/websocket"
)

// WebSocket client
type Client struct {
	ID     uuid.UUID
	Conn   *websocket.Conn
	Send   chan []byte
	Hub    *Hub
	UserID uuid.UUID
}

// Hub of active clients
type Hub struct {
	Clients    map[uuid.UUID]*Client
	Broadcast  chan []byte
	Register   chan *Client
	Unregister chan *Client
	mu         sync.Mutex
}

func NewHub() *Hub {
	return &Hub{
		Broadcast:  make(chan []byte),
		Register:   make(chan *Client),
		Unregister: make(chan *Client),
		Clients:    make(map[uuid.UUID]*Client),
	}
}

func (h *Hub) Run() {
	for {
		select {
		case client := <-h.Register:
			h.mu.Lock()
			h.Clients[client.UserID] = client
			h.mu.Unlock()
		case client := <-h.Unregister:
			if _, ok := h.Clients[client.UserID]; ok {
				h.mu.Lock()
				delete(h.Clients, client.UserID)
				close(client.Send)
				h.mu.Unlock()
			}
		case message := <-h.Broadcast:
			for userID, client := range h.Clients {
				select {
				case client.Send <- message:
				default:
					h.mu.Lock()
					close(client.Send)
					delete(h.Clients, userID)
					h.mu.Unlock()
				}
			}
		}
	}
}

func (c *Client) WritePump() {
	defer func() {
		c.Hub.Unregister <- c
		c.Conn.Close()
	}()

	for {
		message, ok := <-c.Send
		if !ok {
			return
		}
		w, err := c.Conn.NextWriter(websocket.TextMessage)
		if err != nil {
			return
		}
		w.Write(message)

		if err := w.Close(); err != nil {
			return
		}
	}
}
