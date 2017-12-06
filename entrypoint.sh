#!/bin/bash

export PATH="$PATH:/usr/lib/news/bin"

ls -l /run/cjdnserver/

set -x
/bin/cjdnsclient -privkey "$CJDNS_PRIVKEY" || exit $?
ip address show cjdns0

clean_exit(){
  svc -d /service/*/ /service/*/log/
  exit 0
}

if [ $# -eq 0 ]; then

  svscan /service &
  svscan=$!
  trap clean_exit 0 2 15
  wait $svscan

else
  exec "$@"
fi
