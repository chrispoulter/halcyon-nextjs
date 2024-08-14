import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useDispatch } from 'react-redux';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { api } from '@/redux/api';
import { config } from '@/utils/config';

enum ChangeType {
    Added,
    Modified,
    Deleted
}

type Message = {
    id?: string;
    entity: string;
    changeType: ChangeType;
};

export const Messages = () => {
    const dispatch = useDispatch();

    const { data: session } = useSession();

    const accessToken = session?.accessToken || '';

    useEffect(() => {
        if (!accessToken) {
            return;
        }

        const onMessageReceived = (message: Message) => {
            console.log('Message received:', message);

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
        };

        const connection = new HubConnectionBuilder()
            .withUrl(`${config.API_URL}/messages`, {
                accessTokenFactory: () => accessToken,
                withCredentials: false
            })
            .withAutomaticReconnect()
            .configureLogging(LogLevel.Information)
            .build();

        connection.start();
        connection.on('ReceiveMessage', onMessageReceived);

        return () => connection.off('ReceiveMessage', onMessageReceived);
    }, [accessToken, dispatch]);

    return null;
};
