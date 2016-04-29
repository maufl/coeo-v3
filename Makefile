all:
	@echo "There's no default target"

deploy:
	git checkout gh-pages
	git merge -m "Auto merge master" master
	npm run build
	git add -u
	git commit -m "Update build"
	git push
	git checkout master