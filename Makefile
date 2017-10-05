SUDO=
DOCKER=$(SUDO) docker
DOCKER_BUILD=$(DOCKER) build
IMAGE=nntpcont

build:
	$(DOCKER_BUILD) -f Dockerfile.go -t $(IMAGE):go-assets .
	$(DOCKER) create --name $(IMAGE)-extract $(IMAGE):go-assets
	$(DOCKER) cp $(IMAGE)-extract:/result result.go
	$(DOCKER) rm -f $(IMAGE)-extract
	$(DOCKER_BUILD) -f Dockerfile -t $(IMAGE) .
