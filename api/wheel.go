package api

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"intern-showcase-2025/db"
	"intern-showcase-2025/utils"
	"log/slog"
	"net/http"
)

func GetOptions(w http.ResponseWriter, r *http.Request) {
	utils.CheckMethod(r, w, http.MethodPost)

	slog.Info("attempting to get wheel options")
	groupId := r.FormValue("group_id")
	item := r.FormValue("item")

	err := db.CreateConnection()
	if err != nil {
		utils.SendErrorResponse(w, err, "db connection could not be created", "options_loaded")
		return
	}
	defer db.CloseConnection()

	var rows *sql.Rows
	if item == "options" {
		rows, err = db.Fetch(`
			SELECT w.option
			FROM groups AS g
			INNER JOIN group_wheel AS gw
			ON g.gid = gw.gid
			INNER JOIN wheel_options AS w
			ON gw.option = w.option
			WHERE g.gid = ?;`, groupId,
		)
	} else {
		rows, err = db.Fetch(`
			SELECT w.category
			FROM groups AS g
			INNER JOIN group_wheel AS gw
			ON g.gid = gw.gid
			INNER JOIN wheel_options AS w
			ON gw.option = w.option
			WHERE g.gid = ?;`, groupId,
		)
	}

	var options []string
	for rows.Next() {
		option, err := db.DBRowToStringList(rows)
		if err != nil {
			utils.SendErrorResponse(w, err, "db row could not be parsed", "options_loaded")
			return
		}
		options = append(options, option[0])
	}

	if len(options) == 0 {
		utils.SendErrorResponse(w, fmt.Errorf("options not found"), "no options found", "options_loaded")
		return
	}

	_ = json.NewEncoder(w).Encode(options)
	slog.Info("successfully sent options!")

}

func AddOptions(w http.ResponseWriter, r *http.Request) {
	utils.CheckMethod(r, w, http.MethodPost)

	slog.Info("attempting to add options")
	groupId := r.FormValue("group_id")
	option := r.FormValue("option")
	category := r.FormValue("category")

	err := db.CreateConnection()
	if err != nil {
		utils.SendErrorResponse(w, err, "db connection could not be created", "options_loaded")
		return
	}
	defer db.CloseConnection()

	rows, err := db.Fetch("SELECT option FROM wheel_options WHERE option = ?;", option)
	if err != nil {
		utils.SendErrorResponse(w, err, "db row could not be parsed", "options_loaded")
		return
	}

	var options [][]string
	for rows.Next() {
		option, err := db.DBRowToStringList(rows)
		if err != nil {
			utils.SendErrorResponse(w, err, "db row could not be parsed", "options_loaded")
			return
		}
		options = append(options, option)
	}

	if len(options) > 0 {
		utils.SendErrorResponse(w, fmt.Errorf("options already exists"), "options already exists", "options_loaded")
		return
	}

	err = db.Execute("INSERT INTO wheel_options(option, category) VALUES (?, ?);", option, category)
	if err != nil {
		utils.SendErrorResponse(w, err, "db row could not be parsed", "options_loaded")
		return
	}

	err = db.Execute("INSERT INTO group_wheel (gid, option) VALUES (?, ?);", groupId, option)
	if err != nil {
		utils.SendErrorResponse(w, err, "db row could not be parsed", "options_loaded")
		return
	}

	w.Write([]byte(`{"added_option": "true"}`))
	slog.Info("successfully added options!")

}
