//connecting to the io server
const socket = io()
const increment = document.getElementById('increment')
const display = document.getElementById('display')
const messageForm = document.getElementById('messageForm')
const getLocation = document.getElementById('location')
const messageInput = document.getElementById('messageInput')
const messageButton = document.getElementById('messageButton')
 
socket.on('sendMessage', (inputValue) => {
    console.log(inputValue)
})

getLocation.addEventListener('click', () => {

    //disable location button
    getLocation.setAttribute( 'disabled', 'disabled')

    if ( !navigator.geolocation ) {
        return alert('Geolocation is not Supported by your Browser')
    }

    navigator.geolocation.getCurrentPosition((position) => {
    //   console.log(position)
      socket.emit('sendLocation', {
          laititude: position.coords.latitude,
          longitude: position.coords.longitude
      }, () => {

        //enable the location button
        getLocation.removeAttribute('disabled')
        //acknowledgement function
        console.log('Location Shared')
      })
    })
})

//this is for sending messages 
messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
    // console.log('Submitted')
    
    //disable the message button to make sure the message is sent before another message is sent
    messageButton.setAttribute('disabled', 'disabled')

    const inputValue = e.target.elements.messageInput.value
    socket.emit( 'message', inputValue, (error) => {
        //this is an acknowledgement event

        //enabling the button after inputValue is sent
        messageButton.removeAttribute('disabled')
        messageInput.value = ''
        messageInput.focus()

        if (error) {
            return console.log(error)
        }

        console.log('Message was Delivered')
    })
})


//so socket.emit() creates the transfer and emits an event
//and for every emit there is always an event listener using socket.on()