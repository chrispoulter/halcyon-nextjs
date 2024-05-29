import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

import { useEffect, useState } from 'react';
import {
    HubConnection,
    HubConnectionBuilder,
    LogLevel
} from '@microsoft/signalr';
import { config } from '@/utils/config';

type Message = {
    sender: string;
    content: string;
    sentTime: Date;
};

const HomePage = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [connection, setConnection] = useState<HubConnection | null>(null);

    useEffect(() => {
        const connect = new HubConnectionBuilder()
            .withUrl(`${config.EXTERNAL_API_URL}/hub`)
            .withAutomaticReconnect()
            .configureLogging(LogLevel.Information)
            .build();

        setConnection(connect);

        connect
            .start()
            .then(() => {
                connect.on('ReceiveMessage', (sender, content, sentTime) => {
                    setMessages(prev => [
                        ...prev,
                        { sender, content, sentTime }
                    ]);
                });

                connect.invoke('RetrieveMessageHistory');
            })
            .catch(err =>
                console.error('Error while connecting to SignalR Hub:', err)
            );

        return () => {
            if (connection) {
                connection.off('ReceiveMessage');
            }
        };
    }, []);

    const sendMessage = async () => {
        if (connection && newMessage.trim()) {
            await connection.send('PostMessage', newMessage);
            setNewMessage('');
        }
    };

    const isMyMessage = (username: string) => {
        return connection && username === connection.connectionId;
    };

    return (
        <div className="p-4">
            <div className="mb-4">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`p-2 my-2 rounded ${
                            isMyMessage(msg.sender)
                                ? 'bg-blue-200'
                                : 'bg-gray-200'
                        }`}
                    >
                        <p>{msg.content}</p>
                        <p className="text-xs">
                            {new Date(msg.sentTime).toLocaleString()}
                        </p>
                    </div>
                ))}
            </div>
            <div className="d-flex justify-row">
                <input
                    type="text"
                    className="border p-2 mr-2 rounded w-[300px]"
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                />
                <button
                    onClick={sendMessage}
                    className="bg-blue-500 text-white p-2 rounded"
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => ({
    props: {
        session: await getServerSession(req, res, authOptions)
    }
});

export default HomePage;
