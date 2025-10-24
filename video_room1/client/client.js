const socket = io();

const joinBtn = document.getElementById("join-btn");
const usernameInput = document.getElementById("username");
const roomInput = document.getElementById("roomid");
const chatSection = document.getElementById("chat-section");
const messagesDiv = document.getElementById("messages");
const msgInput = document.getElementById("msg-input");
const sendBtn = document.getElementById("send-msg");
const usersDiv = document.getElementById("users");

let roomId, userName;

joinBtn.onclick = () => {
  userName = usernameInput.value.trim();
  roomId = roomInput.value.trim();
  if(!userName || !roomId) return alert("Введите имя и ID комнаты");

  chatSection.style.display = "block";
  socket.emit("join-room", { roomId, userName });
};

socket.on("chat-history", (messages) => {
  messagesDiv.innerHTML = "";
  messages.forEach(m => addMessage(m));
});

socket.on("new-message", addMessage);

sendBtn.onclick = () => {
  const text = msgInput.value.trim();
  if(!text) return;
  socket.emit("send-message", { text, user: userName });
  msgInput.value = "";
};

socket.on("users-update", (users) => {
  usersDiv.innerHTML = users.map(u=>u.name).join(", ");
});

function addMessage(msg) {
  const div = document.createElement("div");
  div.textContent = msg.user + ": " + msg.text;
  messagesDiv.appendChild(div);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}
