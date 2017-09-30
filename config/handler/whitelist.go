package handler

import (
	"github.com/mildred/nntpcont/config/whitelists"

	"context"
	"log"
	"net/http"
	"sync"
)

type WhitelistHandler struct {
	ctx  context.Context
	wg   *sync.WaitGroup
	list *whitelists.Whitelist
}

func NewWhitelistHandler(ctx context.Context, wg *sync.WaitGroup, list *whitelists.Whitelist) *WhitelistHandler {
	var h WhitelistHandler
	h.ctx = ctx
	h.wg = wg
	h.list = list
	return &h
}

func (h *WhitelistHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	addr := addressFromRemoteAddr(r.RemoteAddr)
	log.Printf("Whitelist %s", addr)
	err := h.list.AddToWhitelist(addr)
	if err != nil {
		panic(err)
	}
}
