import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "http";
import { Server } from "socket.io";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

// Отдаём клиент
app.use(express.static(__dirname));

// Подключаем сервер WebRTC (из папки server)
import("./server/server.js");

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
