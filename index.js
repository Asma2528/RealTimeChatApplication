// NODE SERVER WHICH WILL HANDLE SOCKET IO CONNECTIONS

// Initializing socket.io which is an instance of http on 8001 port
// socket.io server will listen incomming events
const io = require('socket.io')(8003, {
    cors: {
        origin: 'http://127.0.0.1:5501',
        methods: ['GET', 'POST'],
    }
});

const users={}

// io.on is an instance of socket.io which will listen many socket.io instance (many chat users connecting with this application so io.on will handle those connections)
// socket.on means a particular instance of connection. It will define what will happen when a particular user joins in 
io.on('connection',socket=>
{
// If a new user joins, let other users connected to the server know!
    socket.on('new-user-joined',uname=>
    {
        // console.log("User is ",uname); // for testing is user is properly joined 

        users[socket.id]=uname; // This will append names of the users to the users array
        // socket.id - It is an id which is assigned for each connection
        socket.broadcast.emit('user-joined', uname) // This event will be fired for all the other users (except the user who has joined the chat)
    })

// If someone sends a message broadcast it to other users. 
// It will define what to do when a user sends a chat message
    socket.on('send',message=>{
        socket.broadcast.emit('receive',{message:message,uname:users[socket.id]}) // This event will be fired for the other chat users so that they can receive the message
    })

// When a user disconnect from the chat application
    socket.on('disconnect',message=>{
        socket.broadcast.emit('left-chat',users[socket.id]) // This event will be fired for the other chat users so that they can receive the message
        delete users[socket.id]; //To delete the disconnected user from our users array
    })
})