import { authService } from "./authService";

import { WebSocket as W3cwebsocket } from 'ws';

const baseURL = "ws://localhost/api";


export type ISocketService = {
  chat: (room: string) => W3cwebsocket;
  cars: () => W3cwebsocket;
};

const socketService = async (): Promise<ISocketService> => {
  const { token } = await authService.getSocketToken();

  return {
    chat: (room: string) => new W3cwebsocket(`${baseURL}/chat/${room}/?token=${token}`),
    cars: () => new W3cwebsocket(`${baseURL}/cars/?token=${token}`),
  };
};

export { socketService };
