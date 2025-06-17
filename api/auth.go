package api

import (
	"errors"
	"fmt"
	"intern-showcase-2025/db"
	"intern-showcase-2025/utils"
	"log/slog"
	"net/http"
	"strconv"
)

func Signup(w http.ResponseWriter, r *http.Request) {
	utils.CheckMethod(r, w, http.MethodPost)

	email := r.FormValue("email")
	password := r.FormValue("password")
	password2 := r.FormValue("password2")
	location := r.FormValue("location")

	if password != password2 {
		utils.SendErrorResponse(w, errors.New("passwords do not match"), "password do not match", "password")
		return
	}

	err := db.CreateConnection()
	if err != nil {
		utils.SendErrorResponse(w, err, "error creating db connection", "account_created")
		return
	}
	defer db.CloseConnection()

	rows, err := db.Fetch("SELECT * FROM users WHERE email = ?", email)
	if err != nil {
		utils.SendErrorResponse(w, err, "error fetching user", "account_created")
		return
	}

	var data []string
	for rows.Next() {
		data, err = db.DBRowToStringList(rows)
		if err != nil || len(data) != 0 {
			utils.SendErrorResponse(w, err, "user already exists", "account_created")
			return
		}
	}

	hashedPassword, _ := utils.HashData(password)
	err = db.Execute("INSERT INTO users (email, password, location) VALUES (?, ?, ?)", email, hashedPassword, location)
	if err != nil {
		utils.SendErrorResponse(w, err, "error inserting user", "account_created")
		return
	}

	added := AddDefaultGroup(email, location)
	if !added {
		utils.SendErrorResponse(w, nil, "error adding default group", "account_created")
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"message": "Signup Successful"}`))
	slog.Info("user registered with email: ", email)

}

func Login(w http.ResponseWriter, r *http.Request) {
	utils.CheckMethod(r, w, http.MethodPost)

	email := r.FormValue("email")
	password := r.FormValue("password")

	err := db.CreateConnection()
	if err != nil {
		utils.SendErrorResponse(w, err, "error creating db connection", "logged_in")
		return
	}
	defer db.CloseConnection()

	rows, err := db.Fetch("SELECT uid, password FROM users WHERE email = ?", email)
	if err != nil {
		utils.SendErrorResponse(w, err, "error fetching user", "logged_in")
		return
	}

	var data []string
	for rows.Next() {
		data, err = db.DBRowToStringList(rows)
		if err != nil || len(data) == 0 {
			utils.SendErrorResponse(w, err, "user does not exist", "logged_in")
			return
		}
	}

	if !utils.CheckPasswordHash(password, data[1]) {
		utils.SendErrorResponse(w, errors.New("passwords do not match"), "password do not match", "logged_in")
	}

	userId, _ := strconv.Atoi(data[0])
	res := fmt.Sprintf(`{"message": "Login Successful", "user_id": %d}`, userId)
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(res))
	slog.Info("User logged in with email: ", email)
}
