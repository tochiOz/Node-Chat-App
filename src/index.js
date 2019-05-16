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
    socket.emit('sendMessage', 'Welcome!')
    
    socket.broadcast.emit('sendMessage', 'A new user has joined')
    
    socket.on('message', (inputValue) => {
        io.emit('sendMessage', inputValue )
    })

    socket.on('sendLocation', (coords) => {
        io.emit('sendMessage', `https://google.com/maps?q=${coords.laititude},${coords.longitude}`)
    })

    //when socket get disconnected
    socket.on('disconnect', () => {
        io.emit('sendMessage', 'A user has left the chat')
    })
})

server.listen( port, () => {
    console.log(chalk.cyan(`Chat App Live at PORT: ${port}`))
})