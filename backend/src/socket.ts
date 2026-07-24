import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import jwt from 'jsonwebtoken';
import { env } from './config/env';

let io: SocketIOServer | null = null;

interface SocketTokenPayload {
  id: number;
  email: string;
  role?: string;
}

export function initSocketIO(httpServer: HTTPServer): SocketIOServer {
  io = new SocketIOServer(httpServer, {
    cors: { origin: env.clientOrigin, credentials: true },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication required'));
    }
    try {
      const payload = jwt.verify(token, env.jwtSecret) as SocketTokenPayload;
      (socket as any).user = payload;
      next();
    } catch {
      next(new Error('Invalid or expired token'));
    }
  });

  io.on('connection', (socket) => {
    const user = (socket as any).user as SocketTokenPayload;
    const userRoom = `user-${user.id}`;
    socket.join(userRoom);

    if (user.role === 'admin') {
      socket.join('admin');
    } else {
      socket.join('resident');
    }

    socket.on('join-admin', () => {
      if (user.role === 'admin') {
        socket.join('admin');
      }
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