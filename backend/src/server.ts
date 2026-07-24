import http from 'http';
import app from './app';
import { env } from './config/env';
import { initSocketIO } from './socket';

const httpServer = http.createServer(app);
initSocketIO(httpServer);

httpServer.listen(env.port, () => {
  console.log(`Server running on http://localhost:${env.port}`);
});