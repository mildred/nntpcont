#!/bin/bash

set -x
/bin/cjdnsclient -privkey "$CJDNS_PRIVKEY"

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
