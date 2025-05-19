package core

import (
	"fmt"
	"io"
	"log/slog"
	"net/http"
)

func signup(w http.ResponseWriter, r *http.Request) {
	body, err := io.ReadAll(r.Body)
	if err != nil {
		slog.Error("error reading signup data", "error", err)
	}

	fmt.Println(body)

}

func login(w http.ResponseWriter, r *http.Request) {

}

func logout(w http.ResponseWriter, r *http.Request) {

}
