
import { envConfig } from "./config";
import { Application } from "express";
import { createServer, Server as HTTPServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { setupOrderSocketEvents } from "./sockets/orderSocket";
import { routes } from "./routes";


export function startServer(app: Application): void {
  const port = envConfig.API_PORT;

  app.use(routes.init());
  const httpServer: HTTPServer = createServer(app);
  const io = createSocketServer(httpServer);
  setupOrderSocketEvents(io);
  httpServer.listen(port, () => {
    console.log(`🚀 Server started at http://localhost:${port}`);
    console.log(`📡 WebSocket listening at ws://localhost:${port}`);
  });
}

function createSocketServer(httpServer: HTTPServer): SocketIOServer {
  return new SocketIOServer(httpServer, {
    cors: {
      origin: "*", // 🔐 In production, use your frontend domain here
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    },
  });
}
