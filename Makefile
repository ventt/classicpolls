.PHONY: update
update:
	@echo "Fetching latest changes from remote repository..."
	git fetch origin
	@echo "Resetting local branch to match remote..."
	git reset --hard origin/main
	@echo "Repository updated successfully."
	@echo "Rebuilding and restarting the application..."
	docker compose up -d --build --pull=always --remove-orphans
	@echo "Application restarted successfully."

.PHONY: watch
watch:
	@echo "Tailing application logs..."
	docker compose logs -f

.PHONY: update-watch
update-watch: update watch
