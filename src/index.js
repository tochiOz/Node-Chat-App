const express = require('express')
const chalk = require('chalk')
const http = require('http')
const path = require('path')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server)


const port = process.env.PORT || 9000
const publicPath = path.join(__dirname, '../public')

app.use(express.static(publicPath))

let count = 0
//creating a socketio connection response and connection
io.on('connection', (socket) => {
    console.log(chalk.red('New WebSocket Connection'))

    socket.on('message', (inputValue) => {
        io.emit('sendMessage', inputValue )
    })
})

server.listen( port, () => {
    console.log(chalk.cyan(`Chat App Live at PORT: ${port}`))
})