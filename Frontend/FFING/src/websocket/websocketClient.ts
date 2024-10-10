import { Stomp, Client } from '@stomp/stompjs';

const { VITE_WEBSOCKET_ENDPOINT } = import.meta.env;

class WebSocketClient {
  private static instance: WebSocketClient;
  private client: Client;
  private isConnected = false;
  private connectPromise: Promise<void>;

  private constructor() {
    this.connectPromise = new Promise((resolve, reject) => {
      this.client = new Client({
        brokerURL: VITE_WEBSOCKET_ENDPOINT,
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        onConnect: () => {
          console.log("STOMP Client connected");
          this.isConnected = true;
          resolve(); // 연결되면 resolve 호출
        },
        onStompError: (frame) => {
          console.error('Broker error: ' + frame.headers['message']);
          reject(new Error("STOMP Error"));
        },
        onWebSocketClose: (error) => {
          console.error('WebSocket closed: ', error);
        },
        onWebSocketError: (error) => {
          console.error('WebSocket error: ', error);
        },
      });
      this.client.activate();
      console.log("client Activate");
    });
  }

  public static getInstance(): WebSocketClient {
    if (!WebSocketClient.instance || !WebSocketClient.instance.isConnected) {
      console.log("웹 소켓 생성됐어요", this.getInstance);
      WebSocketClient.instance = new WebSocketClient();
    }
    // console.log("인스턴스 반환");
    return WebSocketClient.instance;
  }

  public getClient(): Client {
    // console.log("클라이언트 반환");
    return this.client;
  }

  public isConnectedStatus(): boolean {
    return this.isConnected;
  }

  public waitForConnect(): Promise<void> {
    return this.connectPromise;
  }

  public subscribe(destination: string, callback: (message: any) => void) {
    console.log("subscribe 도전", destination);
    this.client.subscribe(destination, callback);
    console.log("subscribe 성공", callback);
  }

  public publish(destination: string, body: any) {
    console.log("publish 도전", destination);
    this.client.publish({
      destination,
      body: JSON.stringify(body),
    });
    console.log("publish 실행", body);
  }

  public disconnect() {
    this.client.deactivate();
    this.isConnected = false;
    console.log("연결 끊김");
  }
}

export default WebSocketClient;