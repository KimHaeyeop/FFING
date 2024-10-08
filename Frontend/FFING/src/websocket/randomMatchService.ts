import WebSocketClient from './websocketClient';

const randomMatchService = {
  requestRandomMatch: (userId: string, petTotalStat: number) => {
    const client = WebSocketClient.getInstance().getClient();
    const matchRequest = { fromUserId: userId, petTotalStat };
    client.publish('/pub/match/random/request', matchRequest);
  },

  cancelRandomMatch: (userId: string) => {
    const client = WebSocketClient.getInstance().getClient();
    client.publish('/pub/match/random/cancel', { userId });
  },

  subscribeToMatchReady: (userId: string, callback: (message: any) => void) => {
    const client = WebSocketClient.getInstance().getClient();
    client.subscribe(`/sub/battle/ready/${userId}`, (message) => {
      const data = JSON.parse(message.body);
      callback(data);
    });
  },
};

export default randomMatchService;
