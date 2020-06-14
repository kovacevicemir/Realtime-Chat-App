const chatForm = document.getElementById('chat-form')
const chatMessages = document.querySelector('.chat-messages')

//get room and username from url
const url_string = window.location.href
const url = new URL(url_string);

const username = url.searchParams.get("username");
const room = url.searchParams.get("room");
console.log('username:', username, 'room:', room);


const socket = io()

//Join chatroom
socket.emit('joinRoom', {username, room})


// Message from server
socket.on('message', message => {
  console.log(message)
  outputMessage(message)

  //Scroll down (scrollTop how much its scrolled from top, = all the way scrollHeight)
  chatMessages.scrollTop = chatMessages.scrollHeight
})


// Event listener on message submit
chatForm.addEventListener('submit', (e) => {
  e.preventDefault()

  // Get message text
  const msg = e.target.elements.msg.value

  // Emit message to server
  socket.emit('chatMessage', msg)

  // Clear use rinput
  e.target.elements.msg.value = ''
  e.target.elements.msg.focus()

})


//Output message to DOM
function outputMessage(message){

  //create div and add class message
  const div = document.createElement('div')
  div.classList.add('message')

  //add innerHTML
  div.innerHTML = `<p class="meta">${message.username} <span> ${message.time}</span></p>
  <p class="text">
    ${message.text}
  </p>`

  //append div to chat-messages
  document.querySelector('.chat-messages').appendChild(div)

}

