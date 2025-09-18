<!-- omit in toc -->
# Spring Boot + React SSE Demo

This project demonstrates Server-Sent Events (SSE) communication between a Spring Boot backend and a React TypeScript frontend with comprehensive Docker support, internationalization, and advanced date formatting.

<!-- omit in toc -->
## Table of Contents

- [Project Structure](#project-structure)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
  - [Option 1: Local Development](#option-1-local-development)
  - [Option 2: Docker Development](#option-2-docker-development)
  - [Option 3: Docker Production](#option-3-docker-production)
- [Available Commands](#available-commands)
  - [Development Commands](#development-commands)
  - [Docker Commands](#docker-commands)
- [Manual Setup](#manual-setup)
  - [Start the Spring Boot Server](#start-the-spring-boot-server)
  - [Start the React Client](#start-the-react-client)
- [API Endpoints](#api-endpoints)
- [Development](#development)
  - [Server Configuration](#server-configuration)
  - [Client Configuration](#client-configuration)
  - [Event Model](#event-model)
  - [Date Formatting Features](#date-formatting-features)
- [Troubleshooting](#troubleshooting)
  - [Local Development](#local-development)
  - [Docker Issues](#docker-issues)
  - [Date/Time Issues](#datetime-issues)
- [Architecture](#architecture)
  - [Server-Side (Spring Boot)](#server-side-spring-boot)
  - [Client-Side (React + TypeScript)](#client-side-react--typescript)
- [License](#license)

## Project Structure

```none
├── client/                    # React TypeScript client (Vite)
│   ├── Dockerfile             # Production Docker image
│   ├── Dockerfile.dev         # Development Docker image
│   ├── nginx.conf             # Nginx configuration for production
│   └── src/
│       ├── components/        # React components
│       ├── hooks/             # Custom React hooks
│       ├── utils/             # Utility functions (date formatting, etc.)
│       └── types/             # TypeScript type definitions
├── server/                    # Spring Boot server
│   ├── Dockerfile             # Production Docker image
│   ├── Dockerfile.dev         # Development Docker image
│   └── src/main/java/         # Java source code
├── docker-compose.yml         # Production Docker Compose
├── docker-compose.dev.yml     # Development Docker Compose
├── Makefile                   # Commands to run both services
└── README.md                  # This file
```

## Features

- **Spring Boot Server**: Provides SSE endpoint at `/api/events/stream`
- **React TypeScript Client**: Consumes SSE messages and displays them in real-time
- **Docker Support**: Full containerization for both development and production
- **Internationalization**: Locale-aware date formatting with support for multiple languages
- **Live Timestamps**: Real-time updating timestamps that refresh every second
- **Smart Date Formatting**: Relative time for recent events, formatted dates for older ones
- **Cross-Origin Support**: Configured for all environments (dev, Docker, production)
- **Real-time Updates**: Events created/updated/deleted every 10 seconds
- **Dynamic Event Management**: Server generates random CRUD operations on events
- **Event Highlighting**: Recently updated events are highlighted for 15 seconds
- **UTC Timestamps**: Server always sends UTC timestamps for consistency
- **In-memory Storage**: Events stored in ConcurrentHashMap for fast access
- **Lombok Integration**: Reduces boilerplate code in Java
- **Tailwind CSS**: Modern, responsive UI styling
- **Comprehensive Testing**: Unit tests for date utilities with locale support

## Prerequisites

- Node.js (v16 or higher)
- pnpm (v8 or higher)
- Java 17 or higher
- Maven 3.6 or higher
- Docker and Docker Compose (for containerized deployment)

## Quick Start

### Option 1: Local Development

1. **Install dependencies**:

   ```bash
   make install
   ```

2. **Start both services**:

   ```bash
   make start-all
   ```

3. **Access the application**:
   - React client: <http://localhost:5173>
   - Spring Boot server: <http://localhost:8080>
   - Health check: <http://localhost:8080/actuator/health>

### Option 2: Docker Development

1. **Start development environment**:

   ```bash
   make docker-dev
   ```

2. **Access the application**:
   - React client: <http://localhost:5173>
   - Spring Boot server: <http://localhost:8080>

### Option 3: Docker Production

1. **Start production environment**:

   ```bash
   make docker-prod
   ```

2. **Access the application**:
   - React client: <http://localhost>
   - Spring Boot server: <http://localhost:8080>

## Available Commands

Run `make help` to see all available commands:

### Development Commands

- `make install` - Install dependencies for both client and server
- `make start-client` - Start only the React client
- `make start-server` - Start only the Spring Boot server
- `make start-all` - Start both services concurrently
- `make stop-all` - Stop all running services
- `make clean-all` - Clean build artifacts
- `make build-all` - Build both client and server
- `make test-all` - Run all tests

### Docker Commands

- `make docker-dev` - Start development environment with Docker
- `make docker-prod` - Start production environment with Docker
- `make docker-stop` - Stop all Docker containers
- `make docker-clean` - Clean Docker images and containers

## Manual Setup

If you prefer to run services separately:

### Start the Spring Boot Server

```bash
cd server
mvn spring-boot:run
```

### Start the React Client

```bash
cd client
pnpm run dev
```

## API Endpoints

- `GET /api/events/stream` - SSE endpoint that streams event changes in real-time
- `GET /api/events/initial` - Get all current events (for initial load)
- `GET /api/events` - Get all events (REST endpoint)
- `GET /actuator/health` - Health check endpoint

## Development

The Spring Boot server manages a collection of system events in memory and performs random CRUD operations every 10 seconds. The React client connects to the SSE endpoint and receives real-time updates about event changes.

### Server Configuration

- Port: 8080
- CORS enabled for multiple origins (dev, Docker, production)
- Events updated every 10 seconds via scheduled tasks
- UTC timestamps using `Instant` for consistency
- In-memory storage using ConcurrentHashMap
- Lombok for reduced boilerplate
- Jackson for JSON serialization with UTC support
- Docker support with timezone synchronization

### Client Configuration

- Port: `5173` (development), `80` (production)
- TypeScript with React
- Tailwind CSS for styling
- Connects to SSE endpoint automatically
- Displays connection status and event count
- Highlights recently updated events (15 seconds)
- Live timestamps that update every second
- Locale-aware date formatting
- Absolute imports with `@/` alias
- Docker support with Nginx proxy in production

### Event Model

Events contain the following properties:

- `id`: Unique identifier (UUID)
- `name`: Event name
- `description`: Event description
- `severity`: CRITICAL, WARNING, or INFO
- `createdAt`: Creation timestamp (UTC Instant)
- `updatedAt`: Last update timestamp (UTC Instant)
- `active`: Boolean status
- `count`: Numeric counter

### Date Formatting Features

The client includes comprehensive date formatting utilities:

- **Relative Time**: "2 minutes ago", "in 5 hours" (locale-aware)
- **Smart Formatting**: Relative time for recent events, formatted dates for older ones
- **Live Updates**: Timestamps refresh every second for active events
- **Internationalization**: Support for multiple locales (English, Spanish, Japanese, etc.)
- **UTC Handling**: Automatic normalization of timestamps without timezone info

## Troubleshooting

### Local Development

1. **CORS Issues**: Make sure the Spring Boot server is running on port 8080
2. **Connection Issues**: Check that both services are running and accessible
3. **Build Issues**: Run `make clean-all` and then `make install` to reset dependencies
4. **SSE Connection Issues**: Check browser developer tools for SSE connection errors
5. **Java Version**: Ensure Java 17+ is installed and configured
6. **Maven Issues**: Try `mvn clean compile` in the server directory

### Docker Issues

1. **Container Build Failures**: Run `make docker-clean` to remove old images and rebuild
2. **Port Conflicts**: Ensure ports 80, 5173, and 8080 are available
3. **Timezone Issues**: Docker containers use UTC by default (configured in docker-compose)
4. **Volume Mount Issues**: Check that source code is properly mounted in development containers
5. **Network Issues**: Ensure Docker containers can communicate on the app-network

### Date/Time Issues

1. **Wrong Timestamps**: Server now sends UTC timestamps - check browser timezone settings
2. **Relative Time Not Updating**: Live timestamps refresh every second - check browser console for errors
3. **Locale Issues**: Date formatting uses browser's default locale unless specified

## Architecture

### Server-Side (Spring Boot)

- **EventService**: Manages in-memory event storage and CRUD operations
- **SseController**: Handles SSE connections and broadcasts event changes
- **EventSchedulerService**: Triggers random event updates every 10 seconds
- **SystemEvent**: Data model with Lombok annotations
- **SseEvent**: Wrapper for SSE messages containing operation type and event data

### Client-Side (React + TypeScript)

- **useEventSSE**: Custom hook for managing SSE connection and event state
- **EventCard**: Individual event display component with highlighting logic
- **EventList**: Container for event cards with sorting
- **StatusIndicator**: Shows connection status and last update time
- **LiveTimestamp**: Component for real-time updating timestamps
- **Header**: Application header with title
- **EventsSection**: Main events display section
- **dateUtils**: Comprehensive date formatting utilities with internationalization

## License

This project is licensed under the GNU General Public License v3.0 (GPL-3.0). For the full license text, see the [LICENSE](LICENSE) file in this repository.
