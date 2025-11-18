const baseURL = "ws://localhost/api";

export type ISocketService = {
  chat: (room: string) => WebSocket;
  cars: () => WebSocket;
};

const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() ?? null;
  return null;
};

const socketService = async (): Promise<ISocketService> => {
  const token = getCookie('refreshToken');
  if (!token) {
    throw new Error('Authentication token is missing');
  }
  return {
    chat: (room: string) => new WebSocket(`${baseURL}/chat/${room}/?token=${token}`),
    cars: () => new WebSocket(`${baseURL}/cars/?token=${token}`),
  };
};
export { socketService };

