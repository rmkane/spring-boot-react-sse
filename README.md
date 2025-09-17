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

- **Spring Boot Server**: Provides SSE endpoint at `/api/events/stream`
- **React TypeScript Client**: Consumes SSE messages and displays them in real-time
- **Cross-Origin Support**: Configured for local development
- **Real-time Updates**: Events created/updated/deleted every 10 seconds
- **Dynamic Event Management**: Server generates random CRUD operations on events
- **Event Highlighting**: Recently updated events are highlighted for 30 seconds
- **In-memory Storage**: Events stored in ConcurrentHashMap for fast access
- **Lombok Integration**: Reduces boilerplate code in Java
- **Tailwind CSS**: Modern, responsive UI styling

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

- `GET /api/events/stream` - SSE endpoint that streams event changes in real-time
- `GET /api/events/initial` - Get all current events (for initial load)
- `GET /api/events` - Get all events (REST endpoint)
- `GET /api/health` - Health check endpoint

## Development

The Spring Boot server manages a collection of system events in memory and performs random CRUD operations every 10 seconds. The React client connects to the SSE endpoint and receives real-time updates about event changes.

### Server Configuration

- Port: 8080
- CORS enabled for `http://localhost:5173`
- Events updated every 10 seconds via scheduled tasks
- In-memory storage using ConcurrentHashMap
- Lombok for reduced boilerplate
- Jackson for JSON serialization

### Client Configuration

- Port: `5173` (Vite default)
- TypeScript with React
- Tailwind CSS for styling
- Connects to SSE endpoint automatically
- Displays connection status and event count
- Highlights recently updated events (30 seconds)
- Absolute imports with `@/` alias

### Event Model

Events contain the following properties:

- `id`: Unique identifier (UUID)
- `name`: Event name
- `description`: Event description
- `severity`: CRITICAL, WARNING, or INFO
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp
- `active`: Boolean status
- `count`: Numeric counter

## Troubleshooting

1. **CORS Issues**: Make sure the Spring Boot server is running on port 8080
2. **Connection Issues**: Check that both services are running and accessible
3. **Build Issues**: Run `make clean` and then `make install` to reset dependencies
4. **SSE Connection Issues**: Check browser developer tools for SSE connection errors
5. **Java Version**: Ensure Java 17+ is installed and configured
6. **Maven Issues**: Try `mvn clean compile` in the server directory

## Architecture

### Server-Side (Spring Boot)

- **EventService**: Manages in-memory event storage and CRUD operations
- **SseController**: Handles SSE connections and broadcasts event changes
- **EventSchedulerService**: Triggers random event updates every 10 seconds
- **SystemEvent**: Data model with Lombok annotations
- **SseEvent**: Wrapper for SSE messages containing operation type and event data

### Client-Side (React + TypeScript)

- **useSSE**: Custom hook for managing SSE connection and event state
- **EventCard**: Individual event display component with highlighting logic
- **EventList**: Container for event cards with sorting
- **StatusIndicator**: Shows connection status and last update time
- **Header**: Application header with title
- **EventsSection**: Main events display section

## License

This project is licensed under the GNU General Public License v3.0 (GPL-3.0). For the full license text, see the [LICENSE](LICENSE) file in this repository.
