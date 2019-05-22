//connecting to the io server
const socket = io()

//Get Elements
const increment = document.getElementById('increment')
const display = document.getElementById('display')
const messageForm = document.getElementById('messageForm')
const getLocation = document.getElementById('location')
const messageInput = document.getElementById('messageInput')
const messageButton = document.getElementById('messageButton')

//Templates
const messageTemplate = document.getElementById('message-template').innerHTML
const url_template = document.getElementById('url-template').innerHTML
const sidebar = document.getElementById('sidebar').innerHTML


//options
//using the qs template - query string
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true }) //this helps to remove the "?" from the query string

 
socket.on('sendMessage', ( chat_messages ) => {
    
    console.log(chat_messages)

    //rending messages
    const html = Mustache.render(messageTemplate, {
        username: chat_messages.username,
        chat_message: chat_messages.text,
        time: moment(chat_messages.createdAt).format('h:mm a')
    })

    display.insertAdjacentHTML( 'beforeend', html )

})

//Recieving location url
socket.on('locationMessage', (url) => {
    console.log(url)

    const urlHtml = Mustache.render(url_template, {
        username: url.username,
        url : url,
        time: moment(url.createdAt).format('h:mm a')
    })

    display.insertAdjacentHTML( 'beforeend', urlHtml )
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

    const chat_messages = e.target.elements.messageInput.value
    socket.emit( 'message', chat_messages, (error) => {
        //this is an acknowledgement event

        //enabling the button after chat_messages is sent
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

//emit the connected user and room access
socket.emit( 'join', { username, room }, (error) => {
   if (error) {
       alert(error)
       location.href = '/'
   }
})

//This is used to rendering user list
socket.on( 'roomData', ({ room, users }) => {

    const sidebarDisplay = Mustache.render( sidebar, {
        room,
        users
    })

    setTimeout(() => {
        document.getElementById('group_rooms').innerHTML = sidebarDisplay
    }, 1000)
})