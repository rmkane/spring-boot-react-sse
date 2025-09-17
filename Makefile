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
	cd client && pnpm install
	@echo "Installing server dependencies..."
	cd server && mvn clean install -DskipTests

# =============================================================================
# DEVELOPMENT (START/STOP)
# =============================================================================

start-client: ## Start the React client (Vite dev server)
	@echo "Starting React client on http://localhost:5173"
	cd client && pnpm run dev

start-server: ## Start the Spring Boot server
	@echo "Starting Spring Boot server on http://localhost:8080"
	cd server && mvn spring-boot:run

start-all: ## Start both client and server concurrently
	@echo "Starting both client and server..."
	@echo "Client will be available at http://localhost:5173"
	@echo "Server will be available at http://localhost:8080"
	@echo "Press Ctrl+C to stop both services"
	@trap 'kill %1 %2' INT; \
	cd client && pnpm run dev & \
	cd server && mvn spring-boot:run & \
	wait

stop-client: ## Stop the React client
	@echo "Stopping React client..."
	pkill -f "pnpm run dev" || true

stop-server: ## Stop the Spring Boot server
	@echo "Stopping Spring Boot server..."
	pkill -f "mvn spring-boot:run" || true

stop-all: stop-client stop-server ## Stop all running services
	@echo "All services stopped"

# =============================================================================
# CLEANUP
# =============================================================================

clean-client: ## Clean client build artifacts
	@echo "Cleaning client build artifacts..."
	cd client && rm -rf node_modules dist

clean-server: ## Clean server build artifacts
	@echo "Cleaning server build artifacts..."
	cd server && mvn clean

clean-all: clean-client clean-server ## Clean build artifacts
	@echo "Clean completed"

# =============================================================================
# BUILD
# =============================================================================

build-client: ## Build the React client for production
	@echo "Building React client for production..."
	cd client && pnpm run build

build-server: ## Build the Spring Boot server
	@echo "Building Spring Boot server..."
	cd server && mvn clean package -DskipTests

build-all: build-client build-server ## Build both client and server

# =============================================================================
# TESTING
# =============================================================================

test-client: ## Run client tests
	@echo "Running client tests..."
	cd client && pnpm test

test-server: ## Run server tests
	@echo "Running server tests..."
	cd server && mvn test

test-all: test-client test-server ## Run all tests
