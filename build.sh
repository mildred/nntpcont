#!/bin/sh

buildah(){
  (set -x; command buildah --storage-driver btrfs "$@")
}

deb=
clean=false

while true; do
  case "$1" in
    *=*)
      eval "${1%%=*}=\"\${1#*=}\""
      ;;
    *)
      break
      ;;
  esac
  shift
done

: ${deb:=$(buildah from debian:stable-slim)}

echo running "$deb"

set -e

buildah run "$deb" -- apt-get update
buildah run "$deb" -- env DEBIAN_FRONTEND=noninteractive apt-get install -y inn2 || true
if $clean; then
  buildah run "$deb" -- apt-get clean
  buildah run "$deb" -- sh -c "rm -rf /var/lib/apt/lists/*"
fi

buildah config --cmd "/bin/echo hello" "$deb"
buildah export -o nntpcont.tar "$deb"
