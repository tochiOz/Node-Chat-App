const express = require('express')
const chalk = require('chalk')
const http = require('http')
const path = require('path')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generatelocationMessage } = require('./utils/message')

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
    socket.emit('sendMessage', generateMessage('Welcome!'))
    
    socket.broadcast.emit('sendMessage', generateMessage('A new user has joined'))
    
    socket.on('message', (chat_messages, callback) => {

        //incases of bad languages between users in the forum
        const filer = new Filter()

        //checking for profanity
        if ( filer.isProfane(chat_messages)) {
            return callback('Profanity is not allowed')    
        }


        io.emit('sendMessage', generateMessage(chat_messages) )
        callback()
    })

    socket.on('sendLocation', (coords, callback) => {
        io.emit('locationMessage', generatelocationMessage(`https://google.com/maps?q=${coords.laititude},${coords.longitude}`))

        //acknowledgement callback
        callback()
    })

    //when socket get disconnected
    socket.on('disconnect', () => {
        io.emit('sendMessage', generateMessage('A user has left the chat'))
    })
})

server.listen( port, () => {
    console.log(chalk.cyan(`Chat App Live at PORT: ${port}`))
})