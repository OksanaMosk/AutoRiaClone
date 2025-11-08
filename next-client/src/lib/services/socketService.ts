import { authService } from "./authService";
import { w3cwebsocket as W3cwebsocket } from "websocket";

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
