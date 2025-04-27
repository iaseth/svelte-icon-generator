
default: build

build: clean
	npm run build

clean:
	rm -rf dist
