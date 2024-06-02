import { useEffect, useState } from 'react';
import {
    HubConnection,
    HubConnectionBuilder,
    LogLevel
} from '@microsoft/signalr';
import { useSession } from 'next-auth/react';
import { config } from '@/utils/config';

export const Messages = () => {
    const { data: session, status } = useSession();

    const isLoading = status === 'loading';

    const [connection, setConnection] = useState<HubConnection | null>(null);

    useEffect(() => {
        console.log('LOADED');

        if (isLoading || !session) {
            return;
        }

        const connect = new HubConnectionBuilder()
            .withUrl(`${config.EXTERNAL_API_URL}/hub`, {
                accessTokenFactory: () => session?.accessToken,
                withCredentials: false
            })
            .withAutomaticReconnect()
            .configureLogging(LogLevel.Information)
            .build();

        setConnection(connect);

        connect
            .start()
            .then(() => {
                console.log('STARTED');

                connect.on('ReceiveMessage', message => {
                    console.log('RECEIVED', message);
                });
            })
            .catch(err =>
                console.error('Error while connecting to SignalR Hub', err)
            );

        return () => {
            console.log('CLOSED');
            if (connection) {
                connection.off('ReceiveMessage');
            }
        };
    }, [isLoading, session]);

    return null;
};
