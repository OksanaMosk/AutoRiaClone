import {authService} from "@/lib/services/authService";
import {w3cwebsocket as W3cwebsocket} from "websocket";

const baseURL = "wss://autoriaclone.duckdns.org:8443/api";

const socketService = async () => {
    const {data: {token}} = await authService.getSocketToken()
    return {
        chat: (room: string) => {
            const url = `${baseURL}/chat/${room}/?token=${token}`
            return new W3cwebsocket(url)
        },
    }
}

export {
    socketService
}
