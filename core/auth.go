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

func readData(body io.Reader) ([]byte, error) {
	res, err := io.ReadAll(body)
	if err != nil {
		return nil, err
	}
	return res, nil
}

func Signup(w http.ResponseWriter, r *http.Request) {
	// Set up a writer
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	w.Header().Set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")

	// Read form data from frontend
	body, err := readData(r.Body)
	if err != nil {
		utils.SendErrorResponse(w, err, "error reading body")
		return
	}

	// Unmarshall the data
	signupData := make(map[string]string)
	err = json.Unmarshal(body, &signupData)
	if err != nil {
		utils.SendErrorResponse(w, err, "error unmarshalling body")
		return
	}

	// Collect & check the data
	email := utils.Sanitise(signupData["email"])
	password := utils.HashData(utils.Sanitise(signupData["password"]))
	password2 := utils.HashData(utils.Sanitise(signupData["password2"]))
	location := utils.Sanitise(signupData["location"])

	if password != password2 {
		utils.SendErrorResponse(w, err, "passwords do not match")
		return
	}

	// Add user to the database
	err = db.CreateConnection()
	if err != nil {
		utils.SendErrorResponse(w, err, "error creating connection")
		return
	}
	defer db.CloseConnection()

	// Check if email already exists
	rows, err := db.Fetch("SELECT uid FROM users WHERE email = ?", email)
	var strRows []string

	for rows.Next() {
		strRows, err = db.DBRowToStringList(rows)
		if err != nil || strRows != nil {
			utils.SendErrorResponse(w, err, "error fetching rows")
			return
		}
	}

	// Add user to database
	if email != "" && password != "" && location != "" && password2 != "" {
		err = db.Execute("INSERT INTO users (email, password, location) VALUES (?, ?, ?)", email, password, location)
		if err != nil {
			utils.SendErrorResponse(w, err, "error inserting user")
			return
		}
	}

	// Successful Creation
	slog.Info("user created", "email", email)
	_ = json.NewEncoder(w).Encode(map[string]bool{"account_created": true})

}

func Login(w http.ResponseWriter, r *http.Request) {
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

	// Check if user is in the database
	rows, err := db.Fetch(
		"SELECT uid, email, password FROM users WHERE email = ? AND password = ?",
		email,
		utils.HashData(password),
	)
	if err != nil {
		slog.Error("user does not exist", "error", err)
		_ = json.NewEncoder(w).Encode(response)
		return
	}

	var dataset []string
	for rows.Next() {
		dataset, err = db.DBRowToStringList(rows)
		if err != nil {
			slog.Error("error converting dataset", "error", err)
			_ = json.NewEncoder(w).Encode(response)
			return
		}
	}

	fmt.Println(password, dataset[2])
	if len(dataset) == 3 && dataset[2] == utils.HashData(password) {
		slog.Info("user logged in", "email", email)
		response["account_created"] = true
		_ = json.NewEncoder(w).Encode(response)
	} else {
		slog.Error("user does not exist")
		_ = json.NewEncoder(w).Encode(response)
		return
	}

	// Update session information
	userId := dataset[0]
	session, err := store.Get(r, "session")
	session.Values["user_id"] = userId
	session.Values["email"] = email
	err = session.Save(r, w)
	if err != nil {
		slog.Error("error saving session", "error", err)
		_ = json.NewEncoder(w).Encode(response)
		return
	}
}

func Logout(w http.ResponseWriter, r *http.Request) {
	response := map[string]bool{"account_created": false}

	session, err := store.Get(r, "session")
	if err != nil {
		slog.Error("error getting session", "error", err)
		return
	}
	session.Values["users"] = make(map[interface{}]interface{})
	session.Options.MaxAge = -1
	err = session.Save(r, w)
	if err != nil {
		slog.Error("error saving session", "error", err)
		_ = json.NewEncoder(w).Encode(response)
		return
	}

	response["account_created"] = true
	slog.Info("user logged out")
	_ = json.NewEncoder(w).Encode(response)
}
