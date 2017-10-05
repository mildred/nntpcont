FROM golang
RUN go get github.com/mildred/cjdnserver/cmd/cjdnsclient
RUN mkdir -p /result
RUN cp bin/cjdnsclient /result/cjdnsclient
