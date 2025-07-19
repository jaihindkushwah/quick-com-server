import { Server, Socket } from "socket.io";
import { authUtilsService } from "@/service/auth.util";
import { CartSocketHandler } from "./cart.socket";
import { OrderSocketHandler } from "./order.socket";

export function setupCartSocketEvents(io: Server) {
  io.on("connect", (socket: Socket) => {
    const token = socket.handshake.auth.token;
    let decoded:any;

    try {
      decoded = authUtilsService.verifyToken(token);
      if (!decoded) throw new Error("Invalid token");
    } catch (err) {
      socket.emit("unauthorized", { message: "Invalid or expired token" });
      return socket.disconnect(true);
    }

    const userId = decoded.id;
    const role = decoded.role;

    socket.join(userId);
    if (role === "partner") socket.join("partner-room");
    if (role === "admin") socket.join("admin-room");

    new CartSocketHandler(io, socket, userId, role).setupListeners();
    new OrderSocketHandler(io, socket, userId, role).setupListeners();

    socket.on("disconnect", () => {
      socket.leave(userId);
      socket.to("partner-room").emit("partnerDisconnected", userId);
      socket.to("admin-room").emit("adminDisconnected", userId);
    });
  });
}
