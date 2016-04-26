all:
	@echo "There's no default target"

deploy:
	git checkout gh-pages
	git merge master
	npm run build
	git add -u
	git commit
	git push
	git checkout master