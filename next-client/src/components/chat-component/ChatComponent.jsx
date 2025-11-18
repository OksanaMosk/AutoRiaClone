
import React, { useEffect, useRef, useState } from 'react';
import styles from "./ChatComponent.module.css";
import {socketService} from "@/lib/services/socketService";

const ChatComponent = () => {
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

export default ChatComponent;
//
//
// import React, { useEffect, useRef, useState } from "react";
// import { socketService } from "@/lib/services/socketService";
// import styles from "./ChatComponent.module.css";
//
// // Створення інтерфейсу для типу повідомлень
// interface Message {
//   userId: string;
//   username: string;
//   message: string;
// }
//
// type WebSocketClient = WebSocket | import('ws').WebSocket; // Умовний тип для WebSocket
//
// const ChatComponent = () => {
//   const [room, setRoom] = useState<string | null>(null); // Тип для room (string або null)
//   const [socketClient, setSocketClient] = useState<WebSocketClient | null>(null); // Тип для socketClient (WebSocket або null)
//   const [messages, setMessages] = useState<Message[]>([]); // Тип для messages (масив Message)
//   const [targetUser, setTargetUser] = useState<string | null>(null); // Тип для targetUser (string або null)
//
//   const roomInput = useRef<HTMLInputElement | null>(null); // Тип для roomInput (Ref на HTMLInputElement)
//   const messageInput = useRef<HTMLInputElement | null>(null); // Поле вводу для повідомлення
//
//   // Список менеджерів (можна отримати з сервера)
//   const managers = ["manager1", "manager2", "manager3"];
//
//   // Ініціалізація сокету при змінах room
//   useEffect(() => {
//     if (room) {
//       socketInit(room).then(client => setSocketClient(client));
//     }
//   }, [room]);
//
//   // Ініціалізація WebSocket
//   const socketInit = async (room: string): Promise<WebSocketClient> => {
//     const { chat } = await socketService(); // Отримуємо функцію chat з сервісу
//     const client = await chat(room); // Створюємо WebSocket клієнт для кімнати chat
//
//     // Перевірка типу WebSocket
//     if (!(client instanceof WebSocket || client instanceof (await import('ws')).WebSocket)) {
//       throw new Error("Expected WebSocket client");
//     }
//
//     client.onopen = () => {
//       console.log("chat socket connected");
//     };
//
//     // Обробка повідомлень для WebSocket
//     client.onmessage = (event: MessageEvent | import('ws').MessageEvent) => { // Умовний тип для подій
//       try {
//         const { message, user } = JSON.parse(event.data);
//
//         if (user && user.includes("_")) {
//           const [userId, username] = user.split("_");
//           setMessages(prev => [...prev, { userId, username, message }]);
//         } else {
//           setMessages(prev => [
//             ...prev,
//             { userId: "", username: user || "Unknown", message },
//           ]);
//         }
//       } catch (error) {
//         console.error("Error processing message:", error);
//       }
//     };
//
//     return client;
//   };
//
//   // Обробка вибору менеджера та створення кімнати для чату
//   const handleManagerSelect = (manager: string) => {
//     setRoom(manager); // Встановлюємо кімнату як ім'я менеджера
//     setTargetUser(manager); // Задаємо менеджера як отримувача повідомлення
//   };
//
//   // Обробка натискання клавіші Enter для відправки повідомлення
//   const handleEnterKey = (event: React.KeyboardEvent<HTMLInputElement>) => {
//     if (event.key === "Enter" && socketClient && messageInput.current) {
//       socketClient.send(
//         JSON.stringify({
//           data: { text: messageInput.current.value, userId: targetUser },
//           action: "send_private_message", // Повідомлення для конкретного користувача
//           request_id: new Date().getTime(),
//         })
//       );
//       messageInput.current.value = ""; // Очищаємо поле вводу після надсилання повідомлення
//     }
//   };
//
//   return (
//     <div className={styles.container}>
//       {/* Якщо кімната не вибрана, відображаємо список менеджерів */}
//       {!room ? (
//         <div className={styles.roomSelect}>
//           <h3>Select Manager to Start Chat</h3>
//           {managers.map((manager) => (
//             <button
//               key={manager}
//               onClick={() => handleManagerSelect(manager)}
//               className={styles.managerButton}
//             >
//               {manager}
//             </button>
//           ))}
//         </div>
//       ) : (
//         // Якщо кімната вибрана (тобто, чат з менеджером), відображаємо інтерфейс чату
//         <div className={styles.chatBox}>
//           <div className={styles.messages}>
//             {messages.map((msg, index) => (
//               <div key={index} className={styles.messageItem}>
//                 <span className={styles.username}>
//                   {msg.username || msg.userId || "Unknown"}:
//                 </span>
//                 <span className={styles.messageText}>{msg.message}</span>
//               </div>
//             ))}
//           </div>
//
//           <div>
//             <input
//               type="text"
//               ref={messageInput}
//               onKeyDown={handleEnterKey}
//               placeholder={`Type a message to ${targetUser}...`}
//               className={styles.messageInput}
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };
//
// export default ChatComponent;