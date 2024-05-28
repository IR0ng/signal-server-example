import 'dotenv/config'
import express, { Request, Response } from 'express'
import http from 'http'
import { Server } from 'socket.io'
import { ClientToServerEvents, ServerToClientEvents } from './types'
const app = express()
const server = http.createServer(app)
const port = process.env.PORT || 3000

const io = new Server<
ClientToServerEvents,
ServerToClientEvents
>(server)
app.get('/', (req:Request, res:Response) => {
  res.send('Hello World!')
})

io.on('connection', (socket) => {
  console.log('connecting')
  socket.on('joinRoom', (req) => {
    const { roomID, userName } = req
    socket.join(roomID)
    io.to(roomID).emit('joinRoom', { userName, roomID })
  })
  socket.on('onReady', (req) => {
    const { roomID, userName } = req
    io.to(roomID).emit('onReady', { roomID, userName })
  })
  socket.on('broadcast', (req) => {
    const { roomID } = req
    io.to(roomID).emit('broadcast', req)
  })
  socket.on('start', (req) => {
    const { roomID } = req
    io.to(roomID).emit('start', { message: 'starting' })
  })
  socket.on('mora', (req) => {
    const { roomID, mora, userName } = req
    io.to(roomID).emit('mora', { roomID, mora, userName })
  })
})

server.listen(port, () => {
  console.log(`listening on *:${port}`)
})
