import Socket from 'socket.io';
import { getClient } from './database/redis';

let io;

export function setupWebSocket(server) {
  io = Socket(server);

  io.on('connection', async (socket) => {
    const { developer_id } = socket.handshake.query;

    const client = await getClient();
    client.set(developer_id.toString(), socket.id);
  });
}

export async function findConnection(id) {
  const client = await getClient();

  const socketId = await client.get(id.toString());
  if (typeof socketId === 'string') {
    return socketId;
  }
  return null;
}

export function emit(to, event, message) {
  io.to(to).emit(event, message);
}
