const express = require('express')
const app = express()
const http = require('http')
const cors = require('cors')
const { Server } = require('socket.io')

// run middleware
app.use(cors())

// create http server
const server = http.createServer(app)

// SOCKET SETUP
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", // client URL (or "*" for all received URL)
        methods: "*" // method request from client for all
    }
})


// without specific namespace
// # default is "/"
io.on('connection', (socket) => {

    // SOCKET LISTENER

})


server.listen(8080, () => console.log('Server is running at port 8080') )

