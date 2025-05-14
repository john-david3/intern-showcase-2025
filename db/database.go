package db

import (
	"database/sql"
	"errors"
	"log/slog"

	_ "github.com/mattn/go-sqlite3"
)

var db *sql.DB

func CreateConnection() error {
	var err error

	db, err = sql.Open("sqlite3", "/identifier.sqlite")

	return err
}

func Execute(query string, args ...interface{}) error {
	if db == nil {
		slog.Error("DB needs to be initialised before executed on")
		return errors.New("database not initialised")
	}
	_, err := db.Exec(query, args...)

	return err
}

func Fetch(query string, args ...interface{}) (*sql.Rows, error) {
	if db == nil {
		slog.Error("DB needs to be initialised before queried on")
		return nil, errors.New("database not initialised")
	}
	rows, err := db.Query(query, args...)

	return rows, err
}

func CloseConnection() {
	err := db.Close()
	if err != nil {
		slog.Error("Error closing database")
	}
}

func DBRowToStringList(rows *sql.Rows) ([]string, error) {
	var result []string
	defer rows.Close()

	for rows.Next() {
		var value string

		err := rows.Scan(&value)
		if err != nil {
			return nil, err
		}
		result = append(result, value)
	}

	return result, nil
}
