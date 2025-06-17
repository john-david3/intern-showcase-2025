package api

import (
	"github.com/gorilla/websocket"
	"log/slog"
	"net/http"
)

// Upgrader is used to upgrade HTTP connections to WebSocket connections.
var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func messageHandler(w http.ResponseWriter, r *http.Request) {
	// Upgrade the HTTP connection to a WebSocket connection
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		slog.Error("Error upgrading:", "error", err)
		return
	}
	defer conn.Close()

	// Listen for incoming messages
	for {
		// Read message from the client
		_, message, err := conn.ReadMessage()
		if err != nil {
			slog.Error("Error reading message:", "error", err)
			break
		}

		// Echo the message back to the client
		slog.Info("Received: %s\\n", message)
		if err := conn.WriteMessage(websocket.TextMessage, message); err != nil {
			slog.Error("Error writing message:", "error", err)
			break
		}
	}
}
