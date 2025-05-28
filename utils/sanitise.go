package utils

import "strings"

func Sanitise(input string) string {
	res := strings.TrimSpace(input)
	return res
}
