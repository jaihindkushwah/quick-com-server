import { envConfig } from "./config";
import { Application } from "express";
import { createServer, Server as HTTPServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { setupOrderSocketEvents } from "./sockets/orderSocket";
import { routes } from "./routes";
import cors from "cors";
import bodyParser from "body-parser";
import { optionalAuthWithValidation } from "./middleware";
import { setupCartSocketEvents } from "./sockets/cartSocket";

export function start(app: Application) {
  securityMiddleware(app);
  routesMiddleware(app);
  errorHandlerMiddleware(app);
  startServer(app);
}

function startServer(app: Application): void {
  const port = envConfig.API_PORT;
  const httpServer: HTTPServer = createServer(app);
  const io = createSocketServer(httpServer);

  setupCartSocketEvents(io);
  setupOrderSocketEvents(io);
  httpServer.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
    console.log(`WebSocket listening at ws://localhost:${port}`);
  });
}
function securityMiddleware(app: Application) {
  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(optionalAuthWithValidation); // if token then docode and attach to req
}
function routesMiddleware(app: Application) {
  routes.init(app);
}
function errorHandlerMiddleware(app: Application) {
  app.use((err, req, res, next) => {
    if (err instanceof Error) res.status(400).json({ error: err.message });
    else res.status(400).json({ error: "Something went wrong" });
    next();
  });
}

function createSocketServer(httpServer: HTTPServer): SocketIOServer {
  return new SocketIOServer(httpServer, {
    path: "/ws",
    cors: {
      origin: "*", // 🔐 In production, use your frontend domain here
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    },
  });
}
