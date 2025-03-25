const express = require('express');
const app = express();
// 1. setup the express server
const cors= require('cors');
app.use(cors());

const http = require('http').createServer(app);
//2. this creates a server that will be used to establish 
//live connection for our socket.io server

// const io = require('socket.io')(http);
const socket = require('socket.io');
// 3. socket import

const io = new socket.Server(http, {
    cors:{
        origin: '*',
        methods: ['GET', 'POST']

    }
});
// 4. we used the http server to create a socket.io server

io.on("connection", (socket)=>{
    console.log(`a user connect with socket id ${socket.id}`);

    socket.on('message', (data)=>{
        console.log(data.message);
        // io.emit('fwd-message', data.message);
        io.to(data.reciever).emit('fwd-message', data.message);
    });


    socket.on('join-room', (room)=>{
        socket.join(room);
        console.log(`User with socket id ${socket.id} joined room ${room}`);
    })

})




//io.on
//socket.emit
//socket.on
//io.emit
//socket.join
//io.to().emit
//socket.leave





app.get('/', (req, res) => {
    res.send('Hello World');
})



http.listen(3000, ()=>{
    console.log('Server is running on port 3000');
})