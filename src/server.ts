import express from 'express'
import router from './router'
import Slate, { Position } from './loggers/Slate';

// Load the environment variables into the process.env object
const dotenv = require('dotenv')
dotenv.load()

// Create the server instance
const server = express()

// Plug in the router
server.use(router)

// Resolve the mock listening port
const port = process.env.SERVER_PORT || 3000

// Start the server
server.listen(port, welcome)

function welcome(): void {
    const content = [
        '',
        `Server running @ http://localhost:${port}`,
    ]
    Slate.write(content, Position.CENTER)
}