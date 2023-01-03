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
app.use(require('./routes/routes.js'))


//cuando se connecte un cliente

io.on('connection', socket =>{
    // al iniciar para el usuario
    socket.emit('message', formatMessage('Administrador', 'Bienvenido, Preguntanos lo que sea!'))

    //al iniciar para todos menos el usuario

    socket.broadcast.emit('message', formatMessage('chatBot', 'A user has join the chat'))

    //al desconectar usuario
    socket.on('disconnect', ()=>{
        io.emit('message', formatMessage('chatBot', 'A user has left the chat'))
    })


    //esperando mensaje de usuario

    socket.on('chatMessage', (msg) =>{
        io.emit('message', formatMessage('username', msg))
    })
})


const PORT = 3000 || process.env.PORT

server.listen(PORT, ()=> console.log('server 3000'))  