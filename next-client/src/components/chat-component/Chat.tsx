

import React, { useEffect, useRef, useState } from 'react';
import { socketService } from "../../services/socketService";
import styles from "./Chat.module.css";

const Chat = () => {
    const [room, setRoom] = useState(null);
    const [socketClient, setSocketClient] = useState(null);
    const [messages, setMessages] = useState([]);
    const [targetUser, setTargetUser] = useState(null);
    const roomInput = useRef();

    useEffect(() => {
        if (room) {
            socketInit(room).then(client => setSocketClient(client));
        }
    }, [room]);

    const socketInit = async (room) => {
        const { chat } = await socketService();
        const client = await chat(room);

        client.onopen = () => {
            console.log('chat socket connected');
        };

        client.onmessage = ({ data }) => {
            const { message, user } = JSON.parse(data.toString());
            if (user && user.includes('_')) {
                const [userId, username] = user.split('_');
                setMessages(prev => [...prev, { userId, username, message }]);
            } else {
                setMessages(prev => [...prev, { user, message }]);
            }
        };

        return client;
    };

    const roomHandler = () => {
        setRoom(roomInput.current.value);
    };

    const handleEnterKey = (event) => {
        if (event.key === 'Enter' && socketClient) {
            socketClient.send(JSON.stringify({
                data: targetUser
                    ? { text: `Private ${event.target.value}`, userId: targetUser }
                    : { text: event.target.value },
                action: targetUser ? 'send_private_message' : 'send_message',
                request_id: new Date().getTime(),
            }));
            event.target.value = '';
        }
    };

    return (
        <div className={styles.container}>
            {!room ? (
                <div className={styles.roomSelect}>
                    <input
                        type="text"
                        ref={roomInput}
                        placeholder="Enter room name..."
                        className={styles.roomInput}
                    />
                    <button
                        onClick={roomHandler}
                        className={styles.roomButton}
                    >
                        Go to Room
                    </button>
                </div>
            ) : (
                <div className={styles.chatBox}>
                    <div className={styles.messages}>
                        {messages.map((msg, index) => (
                            <div key={index} className={styles.messageItem}>
                                <span
                                    onClick={() =>
                                        setTargetUser(targetUser === msg.userId ? null : msg.userId)
                                    }
                                    className={`${styles.username} ${
                                        targetUser === msg.userId ? styles.activeUser : ''
                                    }`}
                                >
                                    {msg.username || msg.userId || msg.user}:
                                </span>
                                <span className={styles.messageText}>
                                    {msg.message}
                                </span>
                            </div>
                        ))}
                    </div>
                    <input
                        type="text"
                        onKeyDown={handleEnterKey}
                        placeholder="Type a message..."
                        className={styles.messageInput}
                    />
                </div>
            )}
        </div>
    );
};

export default Chat;
