import { Server } from "socket.io";

export function setupOrderSocketEvents(io: Server) {
  io.on("connect", (socket) => {
    console.log("a user connected");
    socket.on("disconnect", () => {
      console.log("user disconnected");
    })
  });
}
