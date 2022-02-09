const getElementById = (id) => document.getElementById(id) || null;
const socket = io('/chat');
const helloStrangerElement = getElementById('hello_stranger');
const chattingBoxElement = getElementById('chatting_box');
const formElement = getElementById('chat_form');

socket.on('user_connected', (username) => {
  drawNewChat(`${username} 님이 입장하였습니다.`);
});

socket.on('boardcast_submit_chat', (data) => {
  const { chat, username } = data;
  drawNewChat(`${username}: ${chat}`);
});

function handleSubmit(event) {
  event.preventDefault();
  const value = event.target.elements[0].value;

  if (value !== '') {
    socket.emit('submit_chat', value);
    drawNewChat(`me : ${value}`);
    event.target.elements[0].value = '';
  }
}

function helloUser() {
  const username = prompt('what is your name?');
  socket.emit('new_user', username, (data) => {
    drawHelloStranger(data);
  });
  socket.on('hello_user', (data) => {
    console.log(data);
  });
}

function drawHelloStranger(username) {
  helloStrangerElement.innerText = `Hello ${username}`;
}

function drawNewChat(message) {
  const wrapperChatBox = document.createElement('div');
  const chatBox = `
  <div>
  ${message}
  </div>
  `;

  wrapperChatBox.innerHTML = chatBox;
  chattingBoxElement.append(wrapperChatBox);
}

function init() {
  helloUser();

  formElement.addEventListener('submit', handleSubmit);
}

init();
