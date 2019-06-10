import express from 'express';
import cors from 'cors';
import router from './router';
import Slate, { Position } from './loggers/Slate';

// Load the environment variables into the process.env object

// Create the server instance
const server = express();

// Enable CORS
server.use(cors());

// Plug in the router
server.use(router);

// Resolve the mock listening port
const port = process.env.PORT || 3000;

// Start the server
server.listen(port, welcome);

function welcome(): void {
    const content = ['', `Server running @ http://localhost:${port}`];
    Slate.write(content, Position.CENTER);
}
