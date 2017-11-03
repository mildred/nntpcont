package main

import (
	"github.com/mildred/nntpcont/config/genpass"
	"github.com/mildred/nntpcont/config/handler"

	"context"
	"flag"
	"log"
	"net/http"
	"os"
	"sync"
	"syscall"
)

type LogRequest struct {
	parent http.Handler
}

func (lr *LogRequest) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	idstr := genpass.Generate(8)
	prefix := log.Prefix()
	// TODO
	// <https://github.com/funkygao/golib/commit/06ddeaa8873717b178401bcbfaf9d7cc3ab4a8f5>
	l := log.New(os.Stdout, prefix+"["+idstr+"] ", log.Flags())
	l.Printf("%s %s %s", r.Method, r.URL.Path, r.RemoteAddr)
	w.Header().Set("X-Request-ID", idstr)
	lr.parent.ServeHTTP(w, r)
	l.Printf("Completed")
}

func main() {
	ctx, cancelContext := context.WithCancel(context.Background())
	var wg sync.WaitGroup
	var server http.Server
	var ui_dir string
	var mux http.ServeMux

	flag.StringVar(&server.Addr, "listen", ":80", "Listening address and port")
	flag.StringVar(&ui_dir, "ui-dir", "", "Where the UI files are located")
	flag.Parse()

	mux.Handle("/v1/", handler.NewConfigHandler(ctx, &wg))

	if ui_dir == "" {
		mux.Handle("/", http.FileServer(assetFS()))
	} else {
		mux.Handle("/", http.FileServer(http.Dir(ui_dir)))
	}

	server.Handler = &LogRequest{&mux}

	cancelSignals(ctx, &wg, cancelContext, syscall.SIGINT, syscall.SIGTERM)

	log.Printf("Listening on %s", server.Addr)
	err := listen(ctx, &wg, &server)
	if err != nil {
		log.Fatal(err)
	}

	log.Println("Waiting for background tasks to terminate...")
	wg.Wait()
	defer log.Println("Terminated.")
	os.Exit(0)
}
