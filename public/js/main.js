const chatForm = document.getElementById('chat-form')

const socket = io()


// Message from server
socket.on('message', message => {
  console.log(message)
  outputMessage(message)
})


// Event listener on message submit
chatForm.addEventListener('submit', (e) => {
  e.preventDefault()

  // Get message text
  const msg = e.target.elements.msg.value

  // Emit message to server
  socket.emit('chatMessage', msg)

})


//Output message to DOM
function outputMessage(message){

  //create div and add class message
  const div = document.createElement('div')
  div.classList.add('message')

  //add innerHTML
  div.innerHTML = `<p class="meta">Brad <span>9:12pm</span></p>
  <p class="text">
    ${message}
  </p>`

  //append div to chat-messages
  document.querySelector('.chat-messages').appendChild(div)

}

