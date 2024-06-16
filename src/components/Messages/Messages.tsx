import { useState } from 'react';
import {
    HttpTransportType,
    HubConnection,
    HubConnectionBuilder,
    LogLevel
} from '@microsoft/signalr';
import { useSession } from 'next-auth/react';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { api } from '@/redux/api';
import { ButtonGroup } from '../Button/ButtonGroup';
import { Button } from '../Button/Button';
import { config } from '@/utils/config';

export const Messages = () => {
    const { data: session, status } = useSession();

    const isLoading = status === 'loading';

    const dispatch = useDispatch();

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
                toast.success('Connected');

                connect.on('ReceiveMessage', message => {
                    toast.success(`Message: ${JSON.stringify(message)}`);

                    switch (message.entity) {
                        case 'User':
                            dispatch(
                                api.util.invalidateTags([
                                    { type: 'User', id: message.id },
                                    { type: 'User', id: 'PARTIAL-LIST' }
                                ])
                            );
                            break;
                    }
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
