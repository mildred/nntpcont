FROM docker.io/debian:stable-slim
RUN apt-get update
RUN env DEBIAN_FRONTEND=noninteractive apt-get install -y inn2 || true
RUN sed -i -re 's/#?(domain:)\s*.*$/\1 localhost/' /etc/news/inn.conf
RUN env DEBIAN_FRONTEND=noninteractive apt-get install -y daemontools curl
RUN env DEBIAN_FRONTEND=noninteractive apt-get install -y iproute2 vim-tiny
COPY entrypoint.sh /entrypoint.sh
COPY service /service
COPY result.go/cjdnsclient /bin/cjdnsclient
VOLUME ["/run/cjdnserver"]
ENTRYPOINT ["/bin/bash", "/entrypoint.sh"]
CMD ["svscan", "/service"]

