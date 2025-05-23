package core

import (
	"encoding/json"
	"fmt"
	"intern-showcase-2025/db"
	"intern-showcase-2025/session"
	"intern-showcase-2025/utils"
	"log/slog"
	"net/http"
	"time"
)

func Signup(w http.ResponseWriter, r *http.Request) {
	// Set up a writer
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	w.Header().Set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")

	// Read form data from frontend
	body, err := utils.ReadData(r.Body)
	if err != nil {
		utils.SendErrorResponse(w, err, "error reading body", "account_created")
		return
	}

	// Unmarshall the data
	signupData := make(map[string]string)
	err = json.Unmarshal(body, &signupData)
	if err != nil {
		utils.SendErrorResponse(w, err, "error unmarshalling body", "account_created")
		return
	}

	// Collect & check the data
	email := utils.Sanitise(signupData["email"])
	password := utils.HashData(utils.Sanitise(signupData["password"]))
	password2 := utils.HashData(utils.Sanitise(signupData["password2"]))
	location := utils.Sanitise(signupData["location"])

	if password != password2 {
		utils.SendErrorResponse(w, err, "passwords do not match", "account_created")
		return
	}

	// Add user to the database
	err = db.CreateConnection()
	if err != nil {
		utils.SendErrorResponse(w, err, "error creating connection", "account_created")
		return
	}
	defer db.CloseConnection()

	// Check if email already exists
	rows, err := db.Fetch("SELECT uid FROM users WHERE email = ?", email)
	var strRows []string

	for rows.Next() {
		strRows, err = db.DBRowToStringList(rows)
		if err != nil || strRows != nil {
			utils.SendErrorResponse(w, err, "error fetching rows", "account_created")
			return
		}
	}

	// Add user to database
	if email != "" && password != "" && location != "" && password2 != "" {
		err = db.Execute("INSERT INTO users (email, password, location) VALUES (?, ?, ?)", email, password, location)
		if err != nil {
			utils.SendErrorResponse(w, err, "error inserting user", "account_created")
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
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	w.Header().Set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
	response := map[string]bool{"account_created": false}

	// Read form data from frontend
	body, err := utils.ReadData(r.Body)
	if err != nil {
		utils.SendErrorResponse(w, err, "error reading body", "account_created")
		return
	}

	// Unmarshall the data
	loginData := make(map[string]string)
	err = json.Unmarshal(body, &loginData)
	if err != nil {
		utils.SendErrorResponse(w, err, "error unmarshalling body", "account_created")
		return
	}

	// Collect & check the data
	email := utils.Sanitise(loginData["email"])
	password := utils.Sanitise(loginData["password"])

	// Create connection to the database
	err = db.CreateConnection()
	if err != nil {
		utils.SendErrorResponse(w, err, "error creating connection", "account_created")
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
		utils.SendErrorResponse(w, err, "user does not exist", "account_created")
		return
	}

	// Add the user to the data if not exists
	var dataset []string
	for rows.Next() {
		dataset, err = db.DBRowToStringList(rows)
		if err != nil {
			utils.SendErrorResponse(w, err, "error converting dataset", "account_created")
			return
		}
	}

	fmt.Println(password, dataset[2])
	if len(dataset) == 3 && dataset[2] == utils.HashData(password) {
		slog.Info("user logged in", "email", email)
		response["account_created"] = true
		_ = json.NewEncoder(w).Encode(response)
	} else {
		utils.SendErrorResponse(w, err, "user does not exist", "account_created")
		return
	}

	// Update session information
	userId := dataset[0]
	sessionId, err := session.GenerateSession()
	if err != nil {
		utils.SendErrorResponse(w, err, "error generating session id", "account_created")
		return
	}
	expiry := time.Now().Add(24 * time.Hour)

	err = db.Execute("INSERT INTO session(sid, uid, expires) VALUES (?, ?, ?);",
		sessionId, userId, expiry)

	if err != nil {
		utils.SendErrorResponse(w, err, "error inserting session", "account_created")
		return
	}

	cookie := &http.Cookie{
		Name:     "session_id",
		Value:    sessionId,
		Path:     "/",
		HttpOnly: true,
		Secure:   false,
		Expires:  expiry,
		SameSite: http.SameSiteLaxMode,
	}
	http.SetCookie(w, cookie)
}

func Logout(w http.ResponseWriter, r *http.Request) {

}
