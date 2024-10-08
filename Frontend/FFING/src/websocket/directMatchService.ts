import WebSocketClient from './websocketClient';

const directMatchService = {
  requestDirectMatch: (fromUserId: string, toUserId: string) => {
    const client = WebSocketClient.getInstance().getClient();
    const matchRequest = { fromUserId, toUserId };
    client.publish('/pub/match/direct/request', matchRequest);
  },

  acceptDirectMatch: (userId: string, opponentId: string) => {
    const client = WebSocketClient.getInstance().getClient();
    client.publish('/pub/match/direct/accept', { userId, opponentId });
  },

  rejectDirectMatch: (userId: string) => {
    const client = WebSocketClient.getInstance().getClient();
    client.publish('/pub/match/direct/reject', { userId });
  },

  subscribeToDirectMatchRequest: (userId: string, callback: (message: any) => void) => {
    const client = WebSocketClient.getInstance().getClient();
    client.subscribe(`/sub/match/battle-request/${userId}`, (message) => {
      const data = JSON.parse(message.body);
      callback(data);
    });
  },
};

export default directMatchService;
