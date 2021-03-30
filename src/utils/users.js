const users = []

// addUser
const addUser = ({ id, username, room}) => {
    // Clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    // Validate the data
    if (!username || !room) {
        return {
            error: 'Username and room are required!'
        }
    }

    // Check for existing user

    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    // Validate username
    if (existingUser) {
        return {
            error: 'Username is in use!'
        }
    }
    // store user
    const user = { id, username, room}
    //console.log(user)
    users.push(user)
    return { user }
}


const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id )

    if (index !== -1) {
        return users.splice(index, 1)[0] // remove one item returns array
    }
}


const getUser = (id) => {
    const user = users.find((user) => user.id === id)
    if (!user) return 'undefined'
    return user
}
//const keepNotes = notes.filter(note => note.title !== title)
// getUsersInRoom
const getUsersInRoom = (room) => {
    const usersInRoom = users.filter(user => user.room === room)
    //console.log(usersInRoom)
    return usersInRoom

}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}