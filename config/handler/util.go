package handler

import (
	"strings"
)

func addressFromRemoteAddr(remoteAddr string) string {
	addr := remoteAddr
	last := strings.LastIndex(addr, ":")
	if last > 0 {
		addr = addr[:last]
	}
	return addr
}
