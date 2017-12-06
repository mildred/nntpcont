SUDO=
DOCKER=$(SUDO) docker
DOCKER_BUILD=$(DOCKER) build
IMAGE=nntpcont

-include config.make

build:
	$(DOCKER_BUILD) -f Dockerfile.go -t $(IMAGE):go-assets .
	-$(DOCKER) rm -f $(IMAGE)-extract
	$(DOCKER) create --name $(IMAGE)-extract $(IMAGE):go-assets
	$(SUDO) rm -rf result.go
	$(DOCKER) cp $(IMAGE)-extract:/result result.go
	-$(SUDO) chown -R $(shell id -u):$(shell id -g) results.go
	-$(DOCKER) rm -f $(IMAGE)-extract
	$(DOCKER_BUILD) -f Dockerfile -t $(IMAGE) .

run:
	$(DOCKER) run \
		-v /run/cjdnserver/:/run/cjdnserver/ \
		-p 8080:80 \
		-e CJDNS_PRIVKEY=$(CJDNS_PRIVKEY) \
		--rm -it --name nntp --privileged nntpcont

