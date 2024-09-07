import { WebSocketServer, WebSocket as WsWebSocket } from 'ws';

type Client = {
  walletId: string;
  ws: WsWebSocket;
};

const clients: Client[] = [];

export const setupWebSocket = () => {
  const wss = new WebSocketServer({ port: 8080 });

  wss.on('connection', (ws) => {
    let walletId: string | undefined;

    ws.on('message', (message) => {
      const data = JSON.parse(message.toString());

      if (data.type === 'invite') {
        if (!data.walletId) {
          console.log('No walletId associated with this connection');
          return;
        }

        const targetClient = data.walletId;

        if (targetClient) {
          ws.send(
            JSON.stringify({
              type: 'invite',
              from: targetClient,
              bet: data.bet,
            }),
          );
          console.log(`Invite sent from ${walletId} to ${data.walletId}`);
        } else {
          console.log(`No client found with walletId ${data.walletId}`);
        }
      }
    });

    ws.on('close', () => {
      if (walletId) {
        console.log(`Client with walletId ${walletId} disconnected`);
        const index = clients.findIndex(
          (client) => client.walletId === walletId,
        );
        if (index !== -1) {
          clients.splice(index, 1);
        }
      }
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });

  console.log('WebSocket server is running on port 8080');
};
