//connecting to the io server
const socket = io()
const increment = document.getElementById('increment')
const display = document.getElementById('display')
const send = document.getElementById('send')
const getLocation = document.getElementById('location')

socket.on('sendMessage', (inputValue) => {
    console.log(inputValue)
})

getLocation.addEventListener('click', () => {
    if ( !navigator.geolocation ) {
        return alert('Geolocation is not Supported by your Browser')
    }

    navigator.geolocation.getCurrentPosition((position) => {
    //   console.log(position)
      socket.emit('sendLocation', {
          laititude: position.coords.latitude,
          longitude: position.coords.longitude
      })
    })
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