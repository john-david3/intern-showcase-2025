package utils

import (
	"fmt"
	"io"
	"log/slog"
	"net/http"
)

func SendErrorResponse(w http.ResponseWriter, err error, message string, responseKey string) {
	slog.Error(message, "error", err)
	response := fmt.Sprintf(`{"message": "%s"}`, responseKey)
	w.WriteHeader(http.StatusInternalServerError)
	w.Write([]byte(response))
}

func ReadData(body io.Reader) ([]byte, error) {
	res, err := io.ReadAll(body)
	if err != nil {
		return nil, err
	}
	return res, nil
}
