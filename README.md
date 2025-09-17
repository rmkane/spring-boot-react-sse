# Spring Boot + React SSE Demo

This project demonstrates Server-Sent Events (SSE) communication between a Spring Boot backend and a React TypeScript frontend.

## Project Structure

```none
├── client/          # React TypeScript client (Vite)
├── server/          # Spring Boot server
├── Makefile         # Commands to run both services
└── README.md        # This file
```

## Features

- **Spring Boot Server**: Provides SSE endpoint at `/api/events`
- **React Client**: Consumes SSE messages and displays them in real-time
- **Cross-Origin Support**: Configured for local development
- **Real-time Updates**: Messages sent every 2 seconds from server to client

## Prerequisites

- Node.js (v16 or higher)
- pnpm (v8 or higher)
- Java 17 or higher
- Maven 3.6 or higher

## Quick Start

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
   - Health check: <http://localhost:8080/api/health>

## Available Commands

Run `make help` to see all available commands:

- `make install` - Install dependencies for both client and server
- `make start-client` - Start only the React client
- `make start-server` - Start only the Spring Boot server
- `make start-all` - Start both services concurrently
- `make stop-all` - Stop all running services
- `make clean` - Clean build artifacts
- `make build-all` - Build both client and server
- `make test-all` - Run all tests

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

- `GET /api/events` - SSE endpoint that streams messages every 2 seconds
- `GET /api/health` - Health check endpoint

## Development

The Spring Boot server sends JSON messages with timestamp and message content. The React client automatically connects to the SSE endpoint and displays incoming messages in real-time.

### Server Configuration

- Port: 8080
- CORS enabled for `http://localhost:5173`
- SSE messages sent every 2 seconds

### Client Configuration

- Port: `5173` (Vite default)
- Connects to SSE endpoint automatically
- Displays connection status
- Shows last 10 messages

## Troubleshooting

1. **CORS Issues**: Make sure the Spring Boot server is running on port 8080
2. **Connection Issues**: Check that both services are running and accessible
3. **Build Issues**: Run `make clean` and then `make install` to reset dependencies
