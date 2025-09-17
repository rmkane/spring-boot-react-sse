.DEFAULT_GOAL := help

.PHONY: help install start stop clean build test

help: ## Show this help message
	@echo "Server commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | \
	awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

install: ## Install server dependencies
	@echo "Installing server dependencies..."
	mvn clean install -DskipTests

start: ## Start the Spring Boot server
	@echo "Starting Spring Boot server on http://localhost:8080"
	mvn spring-boot:run

stop: ## Stop the Spring Boot server
	@echo "Stopping Spring Boot server..."
	pkill -f "mvn spring-boot:run" || true

clean: ## Clean server build artifacts
	@echo "Cleaning server build artifacts..."
	mvn clean

build: ## Build the Spring Boot server
	@echo "Building Spring Boot server..."
	mvn clean package -DskipTests

test: ## Run server tests
	@echo "Running server tests..."
	mvn test
