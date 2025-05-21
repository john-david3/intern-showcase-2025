package utils

import (
	"crypto/sha256"
	"fmt"
	"strings"
)

func HashData(data string) string {
	h := sha256.New()
	h.Write([]byte(data))
	bs := h.Sum(nil)
	res := strings.TrimSpace(fmt.Sprintf("%x", bs))
	return res
}
