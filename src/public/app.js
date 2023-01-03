const socket = io(); 
const btn = document.querySelector('#openChat')
const chatDiv = document.querySelector('#chat')

const chatForm = document.querySelector('.chatForm')


btn.addEventListener('click', () =>  {
    if(chatDiv.classList.contains('closed')){
        chatDiv.classList.remove('closed')
        chatDiv.classList.add('opened')
    }else if(chatDiv.classList.contains('opened')){
        chatDiv.classList.remove('opened')
        chatDiv.classList.add('closed')
    }else{
        chatDiv.classList.add('closed')
    }
})

socket.on('message', message =>{
    console.log(message)
    outputMessage(message)
})

//Message submission

chatForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    // get texto de usuario
    const message = e.target.elements.msg.value;
    //send texto al servidor
    socket.emit('chatMessage', message)

    
    e.target.elements.msg.value = '';
    e.target.elements.msg.value.focus;
})

//Message al DOM

function outputMessage(mensaje){
    const div = document.createElement('div')
    div.classList.add('message')
    div.innerHTML = `
    <h4>${mensaje.username}</h4>
                    <p>${mensaje.text}</p>
                    <p class="time">${mensaje.time} </p>
    `
    document.querySelector('#msgBox').appendChild(div)
}