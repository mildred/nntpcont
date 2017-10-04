assetfs:
	go-bindata-assetfs data/...
	sed -ri -e '/package/ a import "os"' 'bindata_assetfs.go'

dep:
	go get github.com/elazarl/go-bindata-assetfs/...
	go get github.com/elazarl/go-bindata/...
	go get github.com/mildred/clearcss

%.css: %.in.css
	clearcss $< > $@

data/css/style.css: data/bootstrap/css/bootstrap.css

css: data/css/style.css always

.PHONY: always

