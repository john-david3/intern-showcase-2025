package api

import (
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
	fmt.Println(groupId)

	err := db.CreateConnection()
	if err != nil {
		utils.SendErrorResponse(w, err, "db connection could not be created", "options_loaded")
		return
	}
	defer db.CloseConnection()

	rows, err := db.Fetch(`
			SELECT w.option
			FROM groups AS g
			INNER JOIN group_wheel AS gw
			ON g.gid = gw.gid
			INNER JOIN wheel_options AS w
			ON gw.wid = w.wid
			WHERE g.gid = ?;`, groupId,
	)

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

	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(options)
	slog.Info("successfully sent options!")

}
