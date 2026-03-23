import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { Server as SocketIOServer } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = parseInt(process.env.PORT ?? "3000", 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url!, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("internal server error");
    }
  });

  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    // Join a counseling session room
    socket.on("join-session", (sessionId: string) => {
      socket.join(`session:${sessionId}`);
      console.log(`Socket ${socket.id} joined session:${sessionId}`);
    });

    // Leave a counseling session room
    socket.on("leave-session", (sessionId: string) => {
      socket.leave(`session:${sessionId}`);
    });

    // Send a new message
    socket.on(
      "send-message",
      (data: { sessionId: string; message: object }) => {
        // Broadcast to all other clients in the session
        socket.to(`session:${data.sessionId}`).emit("new-message", data.message);
      }
    );

    // Typing indicator
    socket.on(
      "typing",
      (data: { sessionId: string; userId: string; name: string }) => {
        socket
          .to(`session:${data.sessionId}`)
          .emit("user-typing", { userId: data.userId, name: data.name });
      }
    );

    socket.on("stop-typing", (data: { sessionId: string; userId: string }) => {
      socket
        .to(`session:${data.sessionId}`)
        .emit("user-stopped-typing", { userId: data.userId });
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
