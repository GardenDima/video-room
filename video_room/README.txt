
Video Room Demo (server + single-file client)
--------------------------------------------

Structure:
  /server
    - server.js          (Node.js + Express + Socket.IO signaling + chat history persistence)
    - package.json
    - /data              (saved room history files created automatically)
  /client_index.html    (single-file HTML/CSS/JS client that connects to the server)

How to run locally:
  1. Start server:
     cd server
     npm install
     npm start
     (server listens on PORT 4000 by default)

  2. Open client (in browser):
     - open client_index.html in the browser (file://) OR serve it via static server (recommended) like:
         npx http-server .
       and open http://localhost:8080/client_index.html
     - The client assumes signalling server at http://localhost:4000 when running on localhost.
     - Create or join a room, allow camera/microphone permissions.

Notes:
  - Chat history is saved per-room into server/data/<roomId>.json.
  - This is a demo: for production use a database (Redis/Postgres) and an authenticated flow.
  - WebRTC uses mesh topology; consider using SFU for >6 participants (mediasoup/jitsi/coturn etc.).
