import { Server } from "socket.io";
import fs from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "server/data");
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

export function initSocket(httpServer) {
  const io = new Server(httpServer);

  const rooms = {}; // Состояние комнат в памяти

  io.on("connection", (socket) => {
    let currentRoom = null;

    socket.on("join-room", ({ roomId, userName }) => {
      currentRoom = roomId;
      socket.join(roomId);

      if (!rooms[roomId]) rooms[roomId] = { users: [], messages: [] };

      rooms[roomId].users.push({ id: socket.id, name: userName });

      // Загружаем историю с диска
      const filePath = path.join(dataDir, `${roomId}.json`);
      if (fs.existsSync(filePath)) {
        rooms[roomId].messages = JSON.parse(fs.readFileSync(filePath));
      }

      socket.emit("chat-history", rooms[roomId].messages);
      io.to(currentRoom).emit("users-update", rooms[roomId].users);
    });

    socket.on("send-message", (msg) => {
      if (!currentRoom) return;
      const message = { id: Date.now(), text: msg.text, user: msg.user };
      rooms[currentRoom].messages.push(message);

      // Сохраняем на диск
      fs.writeFileSync(
        path.join(dataDir, `${currentRoom}.json`),
        JSON.stringify(rooms[currentRoom].messages)
      );

      io.to(currentRoom).emit("new-message", message);
    });

    socket.on("disconnect", () => {
      if (!currentRoom) return;
      rooms[currentRoom].users = rooms[currentRoom].users.filter(u => u.id !== socket.id);
      io.to(currentRoom).emit("users-update", rooms[currentRoom].users);
    });
  });
}
