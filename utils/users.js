const users = []

//Join user to chat
function userJoin(id, username, room){
    const user = {id, username, room}
    users.push(user)

    return user
}

//Get current user
function getCurrentUser(id){
    return users.find(user => user.id === id)
}

//user leave chat
function userLeave(id){
    const index = users.findIndex(user => user.id === id)

    if(index !== -1){
        console.log('USER LEAVE IS OK')
       return users.splice(index, 1)[0]
    }

    console.log('USER LEAVE IS NOT-OK')

}

// Get room users
function getRoomUsers(room){
    return users.filter(user => user.room === room)
}

module.exports = {
    userJoin,
    getCurrentUser,
    getRoomUsers,
    userLeave
}