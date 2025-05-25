package core

import (
	"fmt"
	"intern-showcase-2025/utils"
	"net/http"
	"time"
	"encoding/json"
)

type LoginInfo struct {
	HashedPassword string
	SessionToken   string
	CSRFToken      string
}

var users = map[string]LoginInfo{}

func Signup(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		err := http.StatusMethodNotAllowed
		http.Error(w, "Invalid method", err)
		return
	}

	email := r.FormValue("email")
	password := r.FormValue("password")
	// password2 := r.FormValue("password2")
	// location := r.FormValue("location")

	if _, ok := users[email]; ok {
		err := http.StatusConflict
		http.Error(w, "Username already taken", err)
		return
	}

	hashedPassword, _ := utils.HashData(password)
	users[email] = LoginInfo{
		HashedPassword: hashedPassword,
	}

	fmt.Println("User registered with email: ", email)
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"message": "Signup Successful"}`))

}

func Login(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		err := http.StatusMethodNotAllowed
		http.Error(w, "Invalid method", err)
		return
	}

	email := r.FormValue("email")
	password := r.FormValue("password")

	user, ok := users[email]
	if !ok || !utils.CheckPasswordHash(password, user.HashedPassword) {
		err := http.StatusUnauthorized
		http.Error(w, "Invalid username or password", err)
		return
	}

	users[email] = user

	fmt.Println("User logged in with username: ", email)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message": "Login Successful",
		"user_id": 2,
	})
}

func Logout(w http.ResponseWriter, r *http.Request) {
	if err := Authorize(r); err != nil {
		err := http.StatusUnauthorized
		http.Error(w, "Unauthorized", err)
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:     "session_token",
		Value:    "",
		Expires:  time.Now().Add(-time.Hour),
		HttpOnly: true,
	})

	http.SetCookie(w, &http.Cookie{
		Name:     "csrf_token",
		Value:    "",
		Expires:  time.Now().Add(-time.Hour),
		HttpOnly: false,
	})

	username := r.FormValue("username")
	user, _ := users[username]
	user.SessionToken = ""
	user.CSRFToken = ""
	users[username] = user

	fmt.Fprintln(w, "Logout successful")
}
