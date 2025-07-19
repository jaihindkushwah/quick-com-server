import { Socket, Server } from "socket.io";

export abstract class BaseSocketHandler {
  protected io: Server;
  protected socket: Socket;
  protected userId: string;
  protected role: string;

  constructor(io: Server, socket: Socket, userId: string, role: string) {
    this.io = io;
    this.socket = socket;
    this.userId = userId;
    this.role = role;
  }

  abstract setupListeners(): void;
}
