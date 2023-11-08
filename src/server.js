import express from "express";
import dotenv from "dotenv";
import color from "colors";
import morgan from "morgan";
import cors from "cors"
import connectDB from "./Config/db.js";
import route from "./Routes/Routes.js";
import { Server } from "socket.io";
import {createServer} from "node:http"
import { listenSocket } from "./Socket/index.js";

const PORT = process.env.PORT || 5000
dotenv.config()

connectDB()

const app = express()
const server = createServer(app);
const io = new Server(server,{
    cors: {
      origin: "*"
    }
  });
app.use(express.json())
app.use(cors())
app.use("/api",route)

io.on('connection', (socket) => {
  console.log('a user connected',socket.id);
  let users =[]
  // listenSocket(io, socket);
  socket.on('connected', (id) => {
    console.log(id,"gg")
    users.push(socket.id)
  });
  socket.on('message', (data) => {
    console.log(data);
    io.emit(data.body);
  });
  socket.on('private_message', (data) => {
    // let body = JSON.parse(data.body)
    console.log(data.id,"dd")
    socket.to(data.id).emit('prmessage', data.message);
    // console.log(data.id)
  });
});

if (process.env.ENV === 'development') {
    app.use(morgan("dev"))
  }
app.get("/",(req,res)=>{
    res.send(`${process.env.APP_NAME} api is working on ${process.env.ENV}.....`)
})

server.listen(PORT,()=>{
    console.log(`Server has started on http://localhost:${PORT}`.white.bgYellow.bold)
})