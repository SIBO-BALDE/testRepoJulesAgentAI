# Node.js Express API with CORS

This is a simple Node.js Express application with CORS enabled.

## Prerequisites

* Node.js (which includes npm) installed on your machine.

## Installation

1. Clone the repository (if you haven't already):
   ```bash
   git clone <repository_url>
   cd <repository_directory>
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

## Running the Application

To start the server, run the following command:
```bash
npm start
```

The application will start on port 3000 by default (or the port specified by the `PORT` environment variable). You can access the `/` endpoint (e.g., `http://localhost:3000/`) to see the JSON response:
```json
{
  "message": "Hello World with CORS!"
}
```
