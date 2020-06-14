const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const formatMessage = require('./utils/messages')
const {getCurrentUser, userJoin, userLeave, getRoomUsers} = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

//Set static folder
app.use(express.static(path.join(__dirname, 'public')))

const botName = 'PROchat Bot'

//Run when client connects
io.on('connection', socket => {

    //Listen for joinRoom
    socket.on('joinRoom', ({username, room}) =>{

        const user = userJoin(socket.id, username, room)
        socket.join(user.room)
        //explanation for socket.join
        //this current socket (current user) will be joined to javaScript room
        //for example.. and next user will also be joined to javaScript room...
        //so joining sockets (connections or users) to same room or space...

        //Welcome current user (just this user)
        socket.emit('message', formatMessage(botName, 'Welcome to Pro Chat'))
    
        //Broadcast when a user connects (to everyone except that user)
        socket.broadcast.to(user.room).emit('message', formatMessage(botName,`${user.username} has joined the chat`))

        //Send users and room info (sidebar)
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        })

    })

    
    //Listen for chatMessage
    socket.on('chatMessage', (msg) => {
        const user = getCurrentUser(socket.id)

        io.to(user.room).emit('message', formatMessage(user.username ,msg))
    })
    
    //Runs when client disconnects (to everyone)
    socket.on('disconnect', () => {
        const user = userLeave(socket.id)

        if(user){
            io.to(user.room).emit('message', formatMessage(botName,`${user.username} has left the chat`))
        }

        //send users and room info (side-bar)
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        })

    })

})

const PORT = 3000 || process.env.PORT

server.listen(PORT, () => console.log(`Server running on port: ${PORT}`))