.PHONY: dist dev prod

dist:
	@rm -rf dist
	tsc

dev: dist
	NODE_ENV=development node dist/main.js

run:
	NODE_ENV=production node dist/main.js