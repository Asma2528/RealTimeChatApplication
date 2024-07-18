const socket = io('http://localhost:8003');

// Getting DOM Elements in respective Js Variables
const form=document.getElementById('send-container');
const messageInput=document.getElementById('textmsg');
const messageContainer=document.querySelector(".container");

// Audio - It will be played on receiving notifications or messages
var audio=new Audio('ting.mp3');

// Prompt to ask the user its name
const uname = prompt("Enter Your Name To Join: ");
// To fire 'new-user-joined' event so that the server knows that a new user has joined the chat
socket.emit('new-user-joined',uname);

// Function that will append all the event information (such as user joining msgs, user sending msgs, user leaving msgs) to the container
const append=(message,position)=>{
    // To inform that a new user has joined
    const messageElement=document.createElement('div'); // creating a new div where we can put the message of a new user joining the chat
    messageElement.innerText=message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position=='left')
    {
        audio.play();
    }
}

// If a new user joins, receive his/her name from the server
socket.on('user-joined',uname=>{
    append(`${uname} joined the chat`,'right');
});

// If server sends a message, receive it
socket.on('receive',data=>{
    append(`${data.uname} : ${data.message}`,'left');
});

// If a user lefts the chat, append that information to the container
socket.on('left-chat',uname=>{
    append(`${uname} left the chat`,'left');
});

// If the form gets submitted, send message to the server
form.addEventListener('submit',(e)=>{
    e.preventDefault(); // To prevent the page from loading after the form is submitted
    const message=messageInput.value; //storing the user's typed messages in message variable
    append(`You: ${message}`, 'right');
    socket.emit('send',message); // To inform the socket.io that I have send a message
    messageInput.value=''; // After sending the message removing the content from our textbox

});
