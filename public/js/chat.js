//connecting to the io server
const socket = io()
const increment = document.getElementById('increment')
const display = document.getElementById('display')
const send = document.getElementById('send')

socket.on('sendMessage', (inputValue) => {
    console.log(inputValue)
})

//this is for sending messages 
send.addEventListener('submit', (e) => {
    e.preventDefault()
    // console.log('Submitted')
    
    const inputValue = e.target.elements.messageInput.value
    socket.emit( 'message', inputValue )
})



//so socket.emit() creates the transfer and emits an event
//and for every emit there is always an event listener using socket.on()