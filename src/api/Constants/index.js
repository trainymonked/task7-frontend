let serverUri = 'wss://task-7-backend-ws.onrender.com'
if (process.env.NODE_ENV === 'development') {
    serverUri = 'ws://localhost:8000'
}

export { serverUri }
