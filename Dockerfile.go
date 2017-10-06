FROM golang
RUN go get github.com/mildred/cjdnserver/cmd/cjdnsclient
RUN go get github.com/elazarl/go-bindata-assetfs/...
RUN go get github.com/elazarl/go-bindata/...
RUN go get github.com/mildred/clearcss
RUN go get github.com/braintree/manners
RUN go get github.com/jbenet/go-base58

COPY config src/github.com/mildred/nntpcont/config
RUN make -C src/github.com/mildred/nntpcont/config dep generate build install
RUN mkdir -p /result
RUN cp bin/cjdnsclient /result/cjdnsclient
RUN cp bin/config /result/config
