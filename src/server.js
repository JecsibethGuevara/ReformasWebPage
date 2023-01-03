const express = require('express')
const morgan = require('morgan')
const http =  require('http')
const socketio = require('socket.io')
const formatMessage = require('./utils/messages')
const path =  require ('path') 
const app =  express();
const server = http.createServer(app)
const io = socketio(server)
const {engine} = require('express-handlebars')
const {userJoin, getCurrentUser, changeRoom} = require('./utils/users')

//static folders 

app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))
app.engine('handlebars', engine({
    defaultLayout: 'main',
    layoutDir: path.join(app.get('views'), 'layouts'),
    extname: '.hbs'
}))
app.set('view engine', 'handlebars')

//middlewares 
app.use(morgan('dev')); //to log the http request on the server console

//rutas
const rooms =  []
const allRooms = []
app.use(require('./routes/routes.js'))

app.get('/panel', (req, res) =>{
   
    console.log(rooms, 'all rooms')
     res.render('portals/Panel', {rooms});
 })
//cuando se connecte un cliente

io.on('connection', socket =>{

    socket.on('joinRoom', ({username, room})=>{
        const user = userJoin(socket.id, username, room)
        
        const newRoom = {room: user.room}
        if(allRooms.includes(room)){
            console.log('ok room exists')
        } else{
            allRooms.push(room)
            rooms.push(newRoom)
        }
        
        socket.join(user.room);
  
         // al iniciar para el usuario 
        socket.emit('message', formatMessage('Administrador', 'Bienvenido, Preguntanos lo que sea!'))

        //al iniciar para todos menos el usuario

        socket.broadcast.to(user.room).emit('message', formatMessage('chatBot', `User ${user.username} has join the chat`))

         //al desconectar usuario
        socket.on('disconnect', ()=>{
            io.emit('message', formatMessage('chatBot', 'A user has left the chat'))
        })

   
   
    socket.on('switchRoom', ({room})=>{
        const user = getCurrentUser(socket.id)
        
        changeRoom(user.id, room)
        
        socket.broadcast.to(user.room).emit('message', formatMessage('chatBot', `User ${user.username} has join the chat`))
    })
 })
    //esperando mensaje de usuario

    socket.on('chatMessage', (msg) =>{
        const user = getCurrentUser(socket.id)
        io.to(user.room).emit('message', formatMessage(user.username, msg))
    })
   
    
})


const PORT = 3000 || process.env.PORT

server.listen(PORT, ()=> console.log('server 3000'))  