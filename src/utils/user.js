const users = []

//generating users in the following
//adduser, removeUser, getUser, getUsersInRoom

const addUser = ({ id, username, room }) => {

    //clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //validate the data
    if ( !username || !room ) {
        return {
            error: 'Username and Room details are required'
        }
    }

    //check for existing user
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    //validate user info
    if ( existingUser ) {
        return {
            erorr: 'Username already exist. Please use another username'
        }
    }
    
    const user = { id, username, room }
    users.push(user)
    return { user }
}


const removeUser = ( id ) => {

    //finding the index of the user object with corresponding id
    const indexId = users.findIndex((user) => user.id === id )

    //removing the user
    if (indexId !== -1 ) {
        return users.splice( indexId, 1 )[0]
    }
}


const getUser = ( id ) => {

    //finding the user
    const userId = users.find((user) => {
        return user.id === id
    })

    //validate user info
    if (!userId) {
        return {
            error: 'User undefined'
        }
    }

    return userId
}

const getUsersInRoom = ( room ) => {
    
    room = room.toLowerCase().trim()
    const roomUsers = users.filter((user) => user.room === room )

    if (!roomUsers) {
        return {
            error: 'Please type a valid room name'
        }
    }

    return roomUsers
}

module.exports = {
    addUser,
    getUser,
    removeUser,
    getUsersInRoom
}