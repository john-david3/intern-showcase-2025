package core

import (
	"encoding/json"
	"fmt"
	"intern-showcase-2025/db"
	"intern-showcase-2025/utils"
	"io"
	"log/slog"
	"net/http"
)

func signup(w http.ResponseWriter, r *http.Request) {
	// Set up a writer
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	w.Header().Set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
	response := map[string]bool{"account_created": false}

	// Read form data from frontend
	body, err := io.ReadAll(r.Body)
	if err != nil {
		slog.Error("error reading signup data", "error", err)

		_ = json.NewEncoder(w).Encode(response)
		return
	}

	// Unmarshall the data
	signupData := make(map[string]string)
	fmt.Println(signupData)
	err = json.Unmarshal(body, &signupData)
	if err != nil {
		slog.Error("error unmarshalling signup data", "error", err)
		_ = json.NewEncoder(w).Encode(response)
		return
	}

	// Collect & check the data
	email := utils.Sanitise(signupData["email"])
	password := utils.Sanitise(signupData["password"])
	password2 := utils.Sanitise(signupData["password2"])
	location := utils.Sanitise(signupData["location"])

	if password != password2 {
		slog.Error("passwords do not match")
		_ = json.NewEncoder(w).Encode(response)
		return
	}

	// Add user to the database
	err = db.CreateConnection()
	if err != nil {
		slog.Error("error creating connection", "error", err)
		_ = json.NewEncoder(w).Encode(response)
		return
	}
	defer db.CloseConnection()

	// Check if email already exists
	rows, err := db.Fetch("SELECT * FROM users WHERE email = ?", email)
	if err != nil || rows != nil {
		slog.Error("error creating user", "error", err)
		_ = json.NewEncoder(w).Encode(response)
	}

	// Add user to database
	if email != "" && password != "" && location != "" && password2 != "" {
		err = db.Execute("INSERT INTO users (email, password, location) VALUES (?, ?, ?)", email, password, location)
		if err != nil {
			slog.Error("error creating user", "error", err)
			_ = json.NewEncoder(w).Encode(response)
			return
		}
	}

	// Successful Creation
	slog.Info("user created", "email", email)
	response["account_created"] = true
	_ = json.NewEncoder(w).Encode(response)

}

func login(w http.ResponseWriter, r *http.Request) {

}

func logout(w http.ResponseWriter, r *http.Request) {

}
