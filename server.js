require('dotenv').config();
const app = require('express')();
const express = require('express')
const ejs = require('ejs');
const cors = require('cors');
const io = require('socket.io')(process.env.IO_PORT, {
    cors: {
        origin: '*'
    }
});

const broadcastSpace = io.of(`/${process.env.IO_SPACE}`)
broadcastSpace.on('connection', (socket) => {

    socket.on('join-room', (room) => { 
        socket.join(`${room}`);
        console.log(`joined room ${room}`);
    })

    socket.on('send-message', async (data) => {      
        console.log('received data', data);  
        broadcastSpace.to(data.room).emit('receive-message', data);
    });
})

app.use(cors({
    origin: '*'
}))

app.get('/', async (req, res) => {
    return res.status(200).end('BROADCASTER IS ALIVE!');
})

app.get('/app', async (req, res) => {
    ejs.renderFile('./client.ejs', {}, {}, function(err, str){
        // str => Rendered HTML string
        return res.send(str);
    });
})

app.use('/public', express.static('public'))

app.listen(process.env.BROADCASTER_PORT, () => {
  console.log(`BROADCASTER  listening on port ${process.env.BROADCASTER_PORT}`)
})