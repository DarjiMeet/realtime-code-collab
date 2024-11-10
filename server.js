const express = require('express')
const app = express()
const path = require('path')
const http = require('http')
const {Server} = require('socket.io')
const Actions = require('./src/Actions')

const server = http.createServer(app)
const io = new Server(server)

app.use(express.static('build'))
app.use((req,res,next)=>{
    res.sendFile(path.join(__dirname,'build','index.html'))
})

const userSocketMap = {}
function getAllClients(roomId){
   return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId)=>{
        return {
            socketId,
            username:userSocketMap[socketId]
        }
    })
}


io.on('connection',(socket)=>{
    
    socket.on(Actions.JOIN,({roomId,username})=>{
        
        userSocketMap[socket.id] = username
        socket.join(roomId)

        const clients = getAllClients(roomId)
        clients.forEach(({socketId})=>{
            io.to(socketId).emit(Actions.JOINED,{
                clients,
                username,
                socketId:socket.id
            })
        })
    })

    socket.on(Actions.CODE_CHANGE,({roomId,code})=>{
        socket.in(roomId).emit(Actions.CODE_CHANGE,{
            code
        })
    })

    socket.on(Actions.SYNC_CODE,({socketId,code})=>{
        io.to(socketId).emit(Actions.CODE_CHANGE,{
            code
        })
    })

    socket.on('disconnecting',()=>{
        const rooms = [...socket.rooms]
        rooms.forEach((roomId)=>{
            socket.in(roomId).emit(Actions.DISCONNECTED,{
                socketId:socket.id,
                username : userSocketMap[socket.id]
            })
        })
        delete userSocketMap[socket.id]
        socket.leave()
    })
})


const Port = process.env.PORT || 5000
server.listen(Port,()=>console.log(`listening on ${Port}`))