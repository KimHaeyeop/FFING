import WebSocketClient from './websocketClient';

const randomMatchService = {
  requestRandomMatch: (userId: number | null, petTotalStat: number) => {
    const client = WebSocketClient.getInstance();
    const matchRequest = { fromUserId: userId, petTotalStat: petTotalStat };

    if (client.isConnectedStatus()) {
      client.publish('/pub/match/random/request', matchRequest);
      console.log("매칭 요청 발송 완료");
    } else {
      console.log("웹 소켓이 연결되지 않았습니다.")
    }
  },

  cancelRandomMatch: (userId: number | null) => {
    const client = WebSocketClient.getInstance();
    if (client.isConnectedStatus()) {
      client.publish('/pub/match/random/cancel', { userId });
      console.log("cancle 요청 보냈어요");
    } else {
      console.log("웹 소켓이 연결되지 않았습니다.")
    }
  },

  subscribeToMatchReady: (userId: number | null, callback: (message: any) => void) => {
    const client = WebSocketClient.getInstance();

    if (client.isConnectedStatus()) {
      client.subscribe(`/sub/battle/ready/${userId}`, callback);
      console.log("구독 요청 완료");
    } else {
      console.log("웹 소켓이 연결되지 않았습니다.")
    }
  },
};

export default randomMatchService;