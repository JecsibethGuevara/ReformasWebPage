const { use } = require("../routes/routes");

const users = []

function userJoin(id, username, room){
    const user =  {id, username, room}

    users.push(user)
   console.log(users)
    return user;
} 

function getCurrentUser(id){
    return users.find(user => user.id === id)
}

function changeRoom(id,room){
    userChange = users.find(user => user.id ===id)
    userChange.room = room;
}

module.exports = {userJoin, getCurrentUser, changeRoom}