.DEFAULT_GOAL := help

.PHONY: help install start stop clean build test

help: ## Show this help message
	@echo "Client commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | \
	awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

install: ## Install client dependencies
	@echo "Installing client dependencies..."
	pnpm install

start: ## Start the React client (Vite dev server)
	@echo "Starting React client on http://localhost:5173"
	pnpm run dev

stop: ## Stop the React client
	@echo "Stopping React client..."
	pkill -f "pnpm run dev" || true

clean: ## Clean client build artifacts
	@echo "Cleaning client build artifacts..."
	rm -rf node_modules dist

build: ## Build the React client for production
	@echo "Building React client for production..."
	pnpm run build

test: ## Run client tests
	@echo "Running client tests..."
	pnpm test
