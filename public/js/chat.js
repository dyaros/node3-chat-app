//client side
const socket = io()

// Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')
const $locationMessage = document.querySelector('#locationMessage')

// server (emit) => client(receive) --acknowledgement-->server
// client (emit) => server(receive) --acknoledgement-->server

const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

const { username, room } = Qs.parse(location.search, {ignoreQueryPrefix: true})

const autoscroll = () => {
    // New message elemenmt
    const $newMessage = $messages.lastElementChild

    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight
    
    // Visible height
    const visibleHeight = $messages.offsetHeight
    console.log('vish=' + visibleHeight)

    // Height of messages container
    const containerHeight = $messages.scrollHeight
    console.log('conth=' + containerHeight)

    // How far have I scrolled
    const scrollOffset = $messages.scrollTop + visibleHeight
    console.log('scrollO='+scrollOffset)

    if (containerHeight - newMessageHeight >= scrollOffset) {
        console.log('true')
        $messages.scrollTop = $messages.scrollHeight
    }

}
socket.on('message', (message) => {
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('locationMessage', (locationMessage) => {
    const html = Mustache.render(locationTemplate, {
        username: locationMessage.username,
        url: locationMessage.url,
        createdAt: moment(locationMessage.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('roomData', ({ room, users }) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    document.querySelector("#sidebar").innerHTML = html
})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault() // prevent full page refresh

    // disable
    //console.log($messageFormButton)
    $messageFormButton.setAttribute('disabled','disabled')

    const message = e.target.elements['message'].value

    socket.emit('sendMessage',message, (error) => {
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        if (error) {
            return console.log(error)
        }
        console.log("Message delivered!", message)
    })
})

$sendLocationButton.addEventListener('click', (e) => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser')
    }
    $sendLocationButton.setAttribute('disabled','disabled')

    //const locationMessage = e.target.elements['locationMessage'].value

    navigator.geolocation.getCurrentPosition((position) => {
        const coords = {
            longitude: position.coords.longitude,
            latitude: position.coords.latitude          
        }
       socket.emit('sendLocation',coords, () => {
            $sendLocationButton.removeAttribute('disabled')
            console.log('Location shared')
       })
    })
})
// console.log(username)
// console.log(room)
socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error)
        location.href = "/"
    }
})