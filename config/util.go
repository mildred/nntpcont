package main

import (
	"context"
	"github.com/braintree/manners"
	"log"
	"net/http"
	"os"
	"os/signal"
	"sync"
)

func listen(ctx context.Context, wg *sync.WaitGroup, server *http.Server) error {
	server2 := manners.NewWithServer(server)
	wg.Add(1)
	go func() {
		defer wg.Done()
		<-ctx.Done()
		server2.Close()
	}()
	return server2.ListenAndServe()
}

func cancelSignals(ctx context.Context, wg *sync.WaitGroup, cancelContext context.CancelFunc, signals ...os.Signal) {
	signalChan := make(chan os.Signal, 1)
	signal.Notify(signalChan, signals...)
	wg.Add(1)
	go func() {
		defer wg.Done()
		select {
		case s := <-signalChan:
			log.Printf("Captured %v. Exiting...", s)
			cancelContext()
		case <-ctx.Done():
		}
		signal.Reset(signals...)
	}()
}
