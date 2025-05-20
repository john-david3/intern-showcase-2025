package utils

import "crypto/sha256"

func HashData(data string) []byte {
	h := sha256.New()
	h.Write([]byte(data))
	bs := h.Sum(nil)
	return bs
}
