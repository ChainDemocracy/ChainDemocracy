import { rollDice } from 'utils/rollDice';
import { Server, Socket } from 'socket.io';
import * as http from 'http';

export const setupWebSocket = (httpServer: http.Server) => {
  const clients: Map<string, Socket> = new Map();

  const io = new Server(httpServer, {
    cors: {
      origin: '*',
    },
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    let walletId: string | undefined;

    socket.on('login', (data) => {
      walletId = data.walletId;
      if (walletId) {
        clients.set(walletId, socket);
        console.log(`Client with walletId ${walletId} connected`);
      }
    });

    socket.on('invite', (data) => {
      const { to, from, bet } = data;
      const recipientSocket = clients.get(to);

      if (!recipientSocket) {
        console.log('No recipientSocket associated with this connection');
        return;
      }

      recipientSocket.emit('invite_sent', { from, to, bet });
      console.log(`Invite sent from ${from} to ${to}`);
    });

    socket.on('accepted_invite', (data) => {
      const { user1, user2 } = rollDice();
      const { to, from, bet } = data;
      const fromSocket = clients.get(from);
      const toSocket = clients.get(to);

      const result = {
        diceTo: user1,
        diceFrom: user2,
        from,
        to,
        bet,
      };

      fromSocket.emit('send_result', result);
      toSocket.emit('send_result', result);
    });

    socket.on('reject_invite', (data) => {
      const { to, from, bet } = data;

      const toSocket = clients.get(to);

      const result = {
        from,
        to,
        bet,
      };

      toSocket.emit('send_reject', result);
    });

    socket.on('disconnect', () => {
      if (walletId) {
        console.log(`Client with walletId ${walletId} disconnected`);
        clients.delete(walletId);
      }
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  });
};
