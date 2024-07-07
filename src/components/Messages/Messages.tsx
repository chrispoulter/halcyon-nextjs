import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useDispatch } from 'react-redux';
import { api } from '@/redux/api';
import { ConnectionManager } from './connectionMananger';

enum ChangeType {
    Added,
    Modified,
    Deleted
}

type Message = {
    id?: number;
    entity: string;
    changeType: ChangeType;
};

const connection = new ConnectionManager();

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

        connection.startConnection(accessToken);
        connection.addListener('ReceiveMessage', onMessageReceived);

        return () =>
            connection.removeListener('ReceiveMessage', onMessageReceived);
    }, [accessToken, dispatch]);

    return null;
};
