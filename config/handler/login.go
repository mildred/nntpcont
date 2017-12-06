package handler

import (
	"context"
	"net/http"
	"sync"
)

type LoginHandler struct {
	ctx context.Context
	wg  *sync.WaitGroup
}

func NewLoginHandler(ctx context.Context, wg *sync.WaitGroup) *LoginHandler {
	var h LoginHandler
	h.ctx = ctx
	h.wg = wg
	return &h
}

func (h *LoginHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
}
