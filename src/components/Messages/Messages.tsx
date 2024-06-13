import { useState } from 'react';
import {
    HttpTransportType,
    HubConnection,
    HubConnectionBuilder,
    LogLevel
} from '@microsoft/signalr';
import { useSession } from 'next-auth/react';
import { ButtonGroup } from '../Button/ButtonGroup';
import { Button } from '../Button/Button';
import { config } from '@/utils/config';

export const Messages = () => {
    const { data: session, status } = useSession();

    const isLoading = status === 'loading';

    const [connection, setConnection] = useState<HubConnection | null>(null);

    const onConnect = () => {
        console.log('onConnect');

        const connect = new HubConnectionBuilder()
            .withUrl(`${config.EXTERNAL_API_URL}/messages`, {
                transport: HttpTransportType.ServerSentEvents,
                accessTokenFactory: () => session?.accessToken || '',
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
    };

    const onDisconnect = () => {
        console.log('onDisconnect');
        if (connection) {
            connection
                .stop()
                .then(() => {
                    console.log('STOPPED');
                })
                .catch(err =>
                    console.error(
                        'Error while disconnecting from SignalR Hub',
                        err
                    )
                );
        }
    };

    return (
        <ButtonGroup>
            <Button type="button" loading={isLoading} onClick={onDisconnect}>
                Disconnect
            </Button>
            <Button type="button" loading={isLoading} onClick={onConnect}>
                Connect
            </Button>
        </ButtonGroup>
    );
};
