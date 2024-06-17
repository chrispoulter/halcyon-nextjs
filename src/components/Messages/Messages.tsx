import { useEffect } from 'react';
import {
    HttpTransportType,
    HubConnectionBuilder,
    LogLevel
} from '@microsoft/signalr';
import { useSession } from 'next-auth/react';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { api } from '@/redux/api';
import { config } from '@/utils/config';

export const Messages = () => {
    const { data: session } = useSession();

    const dispatch = useDispatch();

    const accessToken = session?.accessToken || '';

    useEffect(() => {
        toast.success(`useEffect ${!!accessToken}`);

        const connect = new HubConnectionBuilder()
            .withUrl(`${config.EXTERNAL_API_URL}/messages`, {
                transport: HttpTransportType.ServerSentEvents,
                accessTokenFactory: () => accessToken,
                withCredentials: false
            })
            .withAutomaticReconnect()
            .configureLogging(LogLevel.Information)
            .build();

        connect.on('ReceiveMessage', message => {
            toast.success(`ReceiveMessage: ${JSON.stringify(message)}`);

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

        connect
            .start()
            .then(() => {
                toast.success('Started');
            })
            .catch(error => toast.error(`Start Error: ${error.message}`));

        return () => {
            connect.off('ReceiveMessage');
            toast.success('Stopped');

            // connect
            //     .stop()
            //     .then(() => {
            //         toast.success('Stopped');
            //     })
            //     .catch(error => toast.error(`Stop Error: ${error.message}`));
        };
    }, []);

    return null;
};
