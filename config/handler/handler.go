package handler

import (
	"github.com/mildred/nntpcont/config/genpass"
	"github.com/mildred/nntpcont/config/whitelists"

	"context"
	"log"
	"net/http"
	"strings"
	"sync"
)

type ConfigHandler struct {
	ctx       context.Context
	wg        *sync.WaitGroup
	password  string
	mux       http.ServeMux
	whitelist *whitelists.Whitelist
}

func NewConfigHandler(ctx context.Context, wg *sync.WaitGroup) *ConfigHandler {
	var h ConfigHandler
	h.ctx = ctx
	h.wg = wg
	h.password = genpass.Generate(32)
	h.whitelist = whitelists.NewWhitelist("whitelist")
	err := h.whitelist.Refresh()
	if err != nil {
		panic(err)
	}
	log.Printf("First login using password: %s", h.password)
	prefix := "/v1"
	h.mux.Handle(prefix+"/whitelist", NewWhitelistHandler(ctx, wg, h.whitelist))
	return &h
}

func (h *ConfigHandler) CheckAuth(r *http.Request) bool {
	addr := addressFromRemoteAddr(r.RemoteAddr)
	h.whitelist.Refresh() // ignore error
	for _, a := range h.whitelist.Addresses {
		if a == addr {
			log.Printf("Whitelisted: %s", addr)
			return true
		}
	}
	authz := r.Header.Get("Authorization")
	elems := strings.SplitN(authz, " ", 2)
	if len(elems) != 2 {
		log.Printf("Unauthorized: %s", authz)
		return false
	}
	if strings.TrimSpace(strings.ToLower(elems[0])) == "bearer" && strings.TrimSpace(elems[1]) == h.password {
		return true
	}
	log.Printf("Unauthorized: %s", authz)
	return false
}

func (h *ConfigHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	if !h.CheckAuth(r) {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}
	h.mux.ServeHTTP(w, r)
}
