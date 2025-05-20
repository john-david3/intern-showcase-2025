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
	response := map[string]bool{}

	// Read form data from frontend
	body, err := io.ReadAll(r.Body)
	if err != nil {
		slog.Error("error reading signup data", "error", err)
	}

	// Unmarshall the data
	signupData := make(map[string]string)
	err = json.Unmarshal(body, &signupData)
	fmt.Println(signupData)

	// Collect & check the data
	email := utils.Sanitise(signupData["email"])
	password := utils.Sanitise(signupData["password"])
	password2 := utils.Sanitise(signupData["password2"])
	location := utils.Sanitise(signupData["location"])

	passwordHash := utils.HashData(password)
	password2Hash := utils.HashData(password2)

	if string(passwordHash) != string(password2Hash) {
		slog.Error("passwords do not match")
		response["account_created"] = false
		json.NewEncoder(w).Encode(response)
	}

	// Add user to the database
	db.CreateConnection()
	defer db.CloseConnection()

	// Check if email already exists
	rows, err := db.Fetch("SELECT * FROM users WHERE email = ?", email)
	if err != nil || rows != nil {
		slog.Error("error creating user", "error", err)
		response["account_created"] = false
		json.NewEncoder(w).Encode(response)
	}

	// Add user to database
	if email != "" && password != "" && location != "" && password2 != "" {
		err = db.Execute("INSERT INTO users (email, password, location) VALUES (?, ?, ?)", email, string(passwordHash), location)
		if err != nil {
			slog.Error("error creating user", "error", err)
			response["account_created"] = false
			json.NewEncoder(w).Encode(response)

		}
	}

	// Successful Creation
	slog.Info("user created", "email", email)
	response["account_created"] = true
	json.NewEncoder(w).Encode(response)

}

func login(w http.ResponseWriter, r *http.Request) {

}

func logout(w http.ResponseWriter, r *http.Request) {

}
