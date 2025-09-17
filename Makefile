.DEFAULT_GOAL := help

.PHONY: help install
.PHONY: start-client start-server start-all
.PHONY: stop-client stop-server stop-all
.PHONY: clean-client clean-server clean-all
.PHONY: build-client build-server build-all
.PHONY: test-client test-server test-all

help: ## Show this help message
	@echo "Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | \
	awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# =============================================================================
# INSTALLATION
# =============================================================================

install: ## Install dependencies for both client and server
	@echo "Installing client dependencies..."
	cd client && $(MAKE) install
	@echo "Installing server dependencies..."
	cd server && $(MAKE) install

# =============================================================================
# DEVELOPMENT (START/STOP)
# =============================================================================

start-client: ## Start the React client (Vite dev server)
	cd client && $(MAKE) start

start-server: ## Start the Spring Boot server
	cd server && $(MAKE) start

start-all: ## Start both client and server concurrently
	@echo "Starting both client and server..."
	@echo "Client will be available at http://localhost:5173"
	@echo "Server will be available at http://localhost:8080"
	@echo "Press Ctrl+C to stop both services"
	@trap 'kill %1 %2' INT; \
	cd client && $(MAKE) start & \
	cd server && $(MAKE) start & \
	wait

stop-client: ## Stop the React client
	cd client && $(MAKE) stop

stop-server: ## Stop the Spring Boot server
	cd server && $(MAKE) stop

stop-all: stop-client stop-server ## Stop all running services
	@echo "All services stopped"

# =============================================================================
# CLEANUP
# =============================================================================

clean-client: ## Clean client build artifacts
	cd client && $(MAKE) clean

clean-server: ## Clean server build artifacts
	cd server && $(MAKE) clean

clean-all: clean-client clean-server ## Clean build artifacts
	@echo "Clean completed"

# =============================================================================
# BUILD
# =============================================================================

build-client: ## Build the React client for production
	cd client && $(MAKE) build

build-server: ## Build the Spring Boot server
	cd server && $(MAKE) build

build-all: build-client build-server ## Build both client and server

# =============================================================================
# TESTING
# =============================================================================

test-client: ## Run client tests
	cd client && $(MAKE) test

test-server: ## Run server tests
	cd server && $(MAKE) test

test-all: test-client test-server ## Run all tests
