const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const formatMessage = require('./utils/messages')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

//Set static folder
app.use(express.static(path.join(__dirname, 'public')))

const botName = 'PROchat Bot'

//Run when client connects
io.on('connection', socket => {

    socket.on('joinRoom', ({username, room}) =>{

        //Welcome current user (just this user)
        socket.emit('message', formatMessage(botName, 'Welcome to Pro Chat'))
    
        //Broadcast when a user connects (to everyone except that user)
        socket.broadcast.emit('message', formatMessage(botName,'A user has joined the chat'))

    })

    
    //Listen for chatMessage
    socket.on('chatMessage', (msg) => {
        io.emit('message', formatMessage('USER',msg))
    })
    
    //Runs when client disconnects (to everyone)
    socket.on('disconnect', () => {
        io.emit('message', formatMessage(botName,'A user has left the chat'))
    })

})

const PORT = 3000 || process.env.PORT

server.listen(PORT, () => console.log(`Server running on port: ${PORT}`))