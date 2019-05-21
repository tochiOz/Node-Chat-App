const express = require('express')
const chalk = require('chalk')
const http = require('http')
const path = require('path')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generatelocationMessage } = require('./utils/message')
const { addUser, getUser, getUsersInRoom, removeUser } = require('./utils/user')

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

    //listening the join room 
    socket.on( 'join', ({ username, room }, callback ) => {

        //adding the user
        const { error, user } = addUser({ id: socket.id, username, room })

        if (error) {
            return callback(error)
        }

        socket.join(user.room)

        //welcome message
        socket.emit('sendMessage', generateMessage('Admin', 'Welcome!'))
        socket.broadcast.to(user.room).emit('sendMessage', generateMessage('Admin', `${user.username} has joined!!!...`))

        callback()
        //we will be using "to" method to communicate with the room members only

    })
    
    socket.on('message', (chat_messages, callback) => {

        const user = getUser( socket.id)
        
        //incases of bad languages between users in the forum
        const filer = new Filter()

        //checking for profanity
        if ( filer.isProfane(chat_messages)) {
            return callback('Profanity is not allowed')    
        }

        io.to(user.room).emit('sendMessage', generateMessage(user.username, chat_messages) )
        callback()
    })

    //sending location
    socket.on('sendLocation', (coords, callback) => {
        const user = getUser(socket.id)
        io.to(user.room).emit('locationMessage', generatelocationMessage( user.username, `https://google.com/maps?q=${coords.laititude},${coords.longitude}`))

        //acknowledgement callback
        callback()
    })

    //when socket get disconnected
    socket.on('disconnect', () => {

        //remove user
        const user = removeUser(socket.id) 

        if (user) {
            io.to(user.room).emit('sendMessage', generateMessage(`${user.username} has left the chat`))   
        }
    })
})

server.listen( port, () => {
    console.log(chalk.cyan(`Chat App Live at PORT: ${port}`))
})