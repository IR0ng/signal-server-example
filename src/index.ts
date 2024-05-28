import 'dotenv/config'
import express, { Request, Response } from 'express'
import http from 'http'
import { Server } from 'socket.io'
import { ClientToServerEvents, ServerToClientEvents } from './types'

const app = express()
const server = http.createServer(app)
const port = process.env.PORT || 80

const io = new Server<
ClientToServerEvents,
ServerToClientEvents
>(server)

io.engine.on("headers", (headers, req) => {
  headers["Access-Control-Allow-Origin"] = "http://localhost:3000"; // url to all
});

app.get('/', (req:Request, res:Response) => {
  res.send('Hello World!')
})

io.on('connection', (client) => {
  console.log('connecting', client.id)
  client.on('joinRoom', (req) => {
    const { room } = req
    client.join(room)
    io.to(room).emit('broadcast', `${client.id} 加入了聊天室` )
  })

  client.on('connectSignaling', ({ room, candidate, sdp }) => {
    console.log('接收資料：', candidate, sdp );
    client.to(room).emit('connectSignaling', { room, candidate: candidate, sdp: sdp } )
  });

  client.on('disconnect', () => {
    console.log(`socket 用戶離開 ${client.id}`);
  });
})

server.listen(port, () => {
  console.log(`listening on *:${port}`)
})
