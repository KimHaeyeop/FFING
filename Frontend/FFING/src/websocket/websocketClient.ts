import { Client } from '@stomp/stompjs';

const { VITE_WEBSOCKET_ENDPOINT } = import.meta.env;

class WebSocketClient {
  private static instance: WebSocketClient;
  private client: Client;

  private constructor() {
    this.client = new Client({
      brokerURL: VITE_WEBSOCKET_ENDPOINT,
      reconnectDelay: 5000,
      heartbeatIncoming: 100000,
      heartbeatOutgoing: 100000,
    });
    this.client.activate();
  }

  public static getInstance(): WebSocketClient {
    if (!WebSocketClient.instance) {
      WebSocketClient.instance = new WebSocketClient();
    }
    return WebSocketClient.instance;
  }

  public getClient(): Client {
    return this.client;
  }

  public subscribe(destination: string, callback: (message: any) => void) {
    this.client.subscribe(destination, callback);
  }

  public publish(destination: string, body: any) {
    this.client.publish({
      destination,
      body: JSON.stringify(body),
    });
  }

  public disconnect() {
    this.client.deactivate();
  }
}

export default WebSocketClient;
