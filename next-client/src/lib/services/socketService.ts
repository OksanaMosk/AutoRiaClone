import { authService } from "@/lib/services/authService";

import {w3cwebsocket as W3cwebsocket} from "websocket";

// const baseURL = "ws://localhost/api";
const baseURL =
  typeof window === "undefined"
    ? "ws://localhost/api"
    : "ws://localhost/api";
// const baseURL = "ws://host.docker.internal:3000/api";

const socketService = async () => {
    const { data: { token } } = await authService.getSocketToken()

    return {
        chat: (room: string) => {

            const url = `${baseURL}/chat/${room}/?token=${token}`
            console.log("WebSocket URL:", url)
            return new W3cwebsocket(url)
        },

    }
}

export {
    socketService
}
