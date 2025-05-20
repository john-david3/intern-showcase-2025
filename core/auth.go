package core

import (
	"encoding/json"
	"intern-showcase-2025/db"
	"intern-showcase-2025/utils"
	"io"
	"log/slog"
	"net/http"
)

func readData(body io.Reader) ([]byte, error) {
	res, err := io.ReadAll(body)
	if err != nil {
		return nil, err
	}
	return res, nil
}

func signup(w http.ResponseWriter, r *http.Request) {
	// Set up a writer
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	w.Header().Set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
	response := map[string]bool{"account_created": false}

	// Read form data from frontend
	body, err := readData(r.Body)
	if err != nil {
		slog.Error("error reading from frontend", "error", err)
	}

	// Unmarshall the data
	signupData := make(map[string]string)
	err = json.Unmarshal(body, &signupData)
	if err != nil {
		slog.Error("error unmarshalling signup data", "error", err)
		_ = json.NewEncoder(w).Encode(response)
		return
	}

	// Collect & check the data
	email := utils.Sanitise(signupData["email"])
	password := utils.HashData(utils.Sanitise(signupData["password"]))
	password2 := utils.HashData(utils.Sanitise(signupData["password2"]))
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
	rows, err := db.Fetch("SELECT uid FROM users WHERE email = ?", email)
	strRows, err := db.DBRowToStringList(rows)
	if err != nil || strRows != nil {
		slog.Error("error creating user", "error", err)
		_ = json.NewEncoder(w).Encode(response)
		return
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
	// Set up a writer
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	w.Header().Set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
	response := map[string]bool{"account_created": false}

	// Read form data from frontend
	body, err := readData(r.Body)
	if err != nil {
		slog.Error("error reading from frontend", "error", err)
		_ = json.NewEncoder(w).Encode(response)
		return
	}

	// Unmarshall the data
	loginData := make(map[string]string)
	err = json.Unmarshal(body, &loginData)
	if err != nil {
		slog.Error("error unmarshalling login data", "error", err)
		_ = json.NewEncoder(w).Encode(response)
		return
	}

	// Collect & check the data
	email := utils.Sanitise(loginData["email"])
	password := utils.Sanitise(loginData["password"])

	// Add user to the database
	err = db.CreateConnection()
	if err != nil {
		slog.Error("error creating connection", "error", err)
		_ = json.NewEncoder(w).Encode(response)
		return
	}
	defer db.CloseConnection()

	rows, err := db.Fetch("SELECT * FROM users WHERE email = ?", email)
	if err != nil || rows != nil {
		slog.Error("error creating user", "error", err)
		_ = json.NewEncoder(w).Encode(response)
		return
	}

	dataset, err := db.DBRowToStringList(rows)
	if err != nil {
		slog.Error("error getting dataset", "error", err)
		_ = json.NewEncoder(w).Encode(response)
		return
	}

	if dataset[2] == password {
		slog.Info("user logged in", "email", email)
		response["account_created"] = true
		_ = json.NewEncoder(w).Encode(response)
	}

	// Update session information
	user_id := dataset[0]
	session, err := store.Get(r, "users")
	session.Values["user_id"] = user_id
	session.Values["email"] = email
	session.Save(r, w)
}

func logout(w http.ResponseWriter, r *http.Request) {
	session, err := store.Get(r, "user-id")
	if err != nil {
		slog.Error("error getting session", "error", err)
		return
	}
	session.Values["users"] = make(map[interface{}]interface{})
	session.Options.MaxAge = -1
	session.Save(r, w)
}
