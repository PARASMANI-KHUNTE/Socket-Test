const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const port = process.env.PORT || 5000;
const cors = require('cors');
app.use(cors());
app.use(express.json());

const db = require('./Database/dbConfig')
db()


const { Server } = require("socket.io");
const { createServer } = require('node:http');
const server = createServer(Server)
const io = new Server(server,{
    cors : {
        origin:"http://localhost:5173",
        methods:['GET',"POST"],
        credentials:true
    }
})

io.on("connection",(socket)=>{
    console.log("User is connected")
    console.log("id",socket.id)
    // socket.broadcast.emit("welcome",`Welcome by the server side${socket.id}`)
    socket.on("disconnect",()=>{
        console.log(`user disconnected ${socket.id}`)
    })
})


app.get('/',(req,res)=>{
    res.json({
        message : "Server is up "
    })
})


server.listen(port,()=>{
    console.log(`Server is up on http://localhost:${port}`)
})

