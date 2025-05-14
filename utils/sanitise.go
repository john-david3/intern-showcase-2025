package utils

import "strings"

func sanitise(input string) string {
	res := strings.TrimSpace(input)
	return res
}
