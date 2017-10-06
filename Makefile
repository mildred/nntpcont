SUDO=
DOCKER=$(SUDO) docker
DOCKER_BUILD=$(DOCKER) build
IMAGE=nntpcont

build:
	$(DOCKER_BUILD) -f Dockerfile.go -t $(IMAGE):go-assets .
	-$(DOCKER) rm -f $(IMAGE)-extract
	$(DOCKER) create --name $(IMAGE)-extract $(IMAGE):go-assets
	$(SUDO) rm -rf result.go
	$(DOCKER) cp $(IMAGE)-extract:/result result.go
	-$(SUDO) chown -R $(shell id -u):$(shell id -g) results.go
	-$(DOCKER) rm -f $(IMAGE)-extract
	$(DOCKER_BUILD) -f Dockerfile -t $(IMAGE) .
