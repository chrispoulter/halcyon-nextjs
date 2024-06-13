import { useState } from 'react';
import {
    HttpTransportType,
    HubConnection,
    HubConnectionBuilder,
    LogLevel
} from '@microsoft/signalr';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { ButtonGroup } from '../Button/ButtonGroup';
import { Button } from '../Button/Button';
import { config } from '@/utils/config';

export const Messages = () => {
    const { data: session, status } = useSession();

    const isLoading = status === 'loading';

    const [connection, setConnection] = useState<HubConnection | null>(null);

    const onConnect = () => {
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
                toast('Connected');

                connect.on('ReceiveMessage', message => {
                    toast.success(`Message: ${JSON.stringify(message)}`);
                });
            })
            .catch(() => toast.error('Error'));
    };

    const onDisconnect = () => {
        if (connection) {
            connection
                .stop()
                .then(() => toast.success('Disconnected'))
                .catch(() => toast.error('Error'));
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
