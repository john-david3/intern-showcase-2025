package core

import (
	"encoding/json"
	"fmt"
	"intern-showcase-2025/utils"
	"net/http"
	"time"
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

	body, err := utils.ReadData(r.Body)
	if err != nil {
		utils.SendErrorResponse(w, err, "error reading body", "account_created")
		return
	}

	data := make(map[string]string)
	err = json.Unmarshal(body, &data)
	if err != nil {
		utils.SendErrorResponse(w, err, "error unmarshalling body", "account_created")
		return
	}

	email := data["email"]
	password := data["password"]

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
	response := map[string]string{"account_created": "true"}
	_ = json.NewEncoder(w).Encode(response)

}

func Login(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		err := http.StatusMethodNotAllowed
		http.Error(w, "Invalid method", err)
		return
	}

	body, err := utils.ReadData(r.Body)
	if err != nil {
		utils.SendErrorResponse(w, err, "error reading body", "logged_in")
		return
	}

	data := make(map[string]string)
	err = json.Unmarshal(body, &data)
	if err != nil {
		utils.SendErrorResponse(w, err, "error unmarshalling body", "logged_in")
		return
	}

	email := data["email"]
	password := data["password"]

	user, ok := users[email]
	if !ok || !utils.CheckPasswordHash(password, user.HashedPassword) {
		err := http.StatusUnauthorized
		http.Error(w, "Invalid username or password", err)
		return
	}

	sessionToken := utils.GenerateToken(32)
	csrfToken := utils.GenerateToken(32)

	http.SetCookie(w, &http.Cookie{
		Name:     "session_token",
		Value:    sessionToken,
		Expires:  time.Now().Add(24 * time.Hour),
		HttpOnly: true,
	})

	http.SetCookie(w, &http.Cookie{
		Name:     "csrf_token",
		Value:    csrfToken,
		Expires:  time.Now().Add(24 * time.Hour),
		HttpOnly: false,
	})

	user.SessionToken = sessionToken
	user.CSRFToken = csrfToken
	users[email] = user

	fmt.Println("User logged in with username: ", users[email])
	response := map[string]string{"logged_in": "true"}
	_ = json.NewEncoder(w).Encode(response)
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
