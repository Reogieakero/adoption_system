import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { env } from './config/env';

let io: SocketIOServer | null = null;

export function initSocketIO(httpServer: HTTPServer): SocketIOServer {
  io = new SocketIOServer(httpServer, {
    cors: { origin: env.clientOrigin, credentials: true },
  });

  io.on('connection', (socket) => {
    socket.on('join-admin', () => {
      socket.join('admin');
    });
  });

  return io;
}

export function getIO(): SocketIOServer {
  if (!io) throw new Error('Socket.IO not initialized');
  return io;
}

export function emitDataChanged(): void {
  if (io) {
    io.to('admin').emit('data-changed');
  }
}