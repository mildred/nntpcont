#!/bin/sh

set -x
/bin/cjdnsclient -privkey "$CJDNS_PRIVKEY"
exec "$@"
