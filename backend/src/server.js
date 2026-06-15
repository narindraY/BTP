const app = require("./app");
const http = require("http");
const { Server } = require("socket.io");
const { mysql, options } = require("./config/db");
const { sendMessageService } = require("./services/chat.service");

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

const pool = mysql.createPool(options);

io.on("connection", (socket) => {
  console.log("Connecté :", socket.id);

  socket.on("join_discussion", (discussionId) => {
    socket.join(`discussion_${discussionId}`);
    console.log(`Socket ${socket.id} -> Discussion ${discussionId}`);
  });

  socket.on("send_message", async (data) => {
    const { discussion_id, emetteur_id, contenu } = data;
    pool.getConnection(async (err, connection) => {
      if (err) return;
      try {
        const result = await sendMessageService(connection, {
          utilisateur_id: emetteur_id,
          contenu: contenu,
          discussion_id: discussion_id,
          role: 'user'
        });
        const savedMessage = { ...data, id_message: result.insertId, lu: 0 };
        io.to(`discussion_${discussion_id}`).emit("receive_message", savedMessage);
      } catch (error) {
        console.error("Save error:", error);
      } finally {
        connection.release();
      }
    });
  });

  socket.on("typing", (data) => {
    socket.to(`discussion_${data.discussion_id}`).emit("user_typing", data);
  });

  socket.on("stop_typing", (data) => {
    socket.to(`discussion_${data.discussion_id}`).emit("user_stop_typing", data);
  });

  socket.on("mark_as_read", (data) => {
    const { discussion_id } = data;
    pool.query("UPDATE message SET lu = 1 WHERE discussion_id = ?", [discussion_id], (err) => {
      if (!err) {
        io.to(`discussion_${discussion_id}`).emit("messages_read", { discussion_id });
      }
    });
  });

  socket.on("edit_message", (data) => {
    io.to(`discussion_${data.discussion_id}`).emit("message_edited", data);
  });

  socket.on("delete_message", (data) => {
    io.to(`discussion_${data.discussion_id}`).emit("message_deleted", data);
  });

  socket.on("disconnect", () => console.log("Déconnecté"));
});

server.listen(3000, () => console.log("Port 3000"));