require('dotenv').config();
const app = require('express')();
const express = require('express')
const cors = require('cors')
const io = require('socket.io-client')

const socket = io(`${process.env.BROADCASTER_URL}:${process.env.IO_PORT}/${process.env.IO_SPACE}`)
socket.emit('join-room', 'room-1');

app.use(cors({
    origin: '*'
}))

app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use('/send-data', async (req, res) => {
    try {
        let data;
        if (req.body?.room === undefined) {
            data = JSON.parse(req.body)
        } else
            data = req.body 
        socket.emit('send-message', data)
        return res.status(200).json({
            code: 'OK',
            message: 'Message transmitted!'
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json(error)
    }
})

app.get('/', async (req, res) => {
    return res.status(200).end('TRANSMITTER IS ALIVE!');
})

app.listen(process.env.TRANSMITTER_PORT, () => {
  console.log(`TRANSMITTER  listening on port ${process.env.TRANSMITTER_PORT}`)
})