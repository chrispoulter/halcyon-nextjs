import {
    HttpTransportType,
    HubConnection,
    HubConnectionBuilder,
    LogLevel
} from '@microsoft/signalr';
import { config } from '@/utils/config';

export class ConnectionManager {
    private connection: HubConnection | null = null;
    private accessToken: string | null = null;

    startConnection(accessToken: string) {
        if (accessToken === this.accessToken) {
            return;
        }

        console.log('Starting connection');
        
        this.accessToken = accessToken;

        this.connection = new HubConnectionBuilder()
            .withUrl(`${config.EXTERNAL_API_URL}/messages`, {
                transport: HttpTransportType.ServerSentEvents,
                accessTokenFactory: () => accessToken,
                withCredentials: false
            })
            .withAutomaticReconnect()
            .configureLogging(LogLevel.Warning)
            .build();

        this.connection
            .start()
            .then(() =>
                console.log('Connection started', this.connection!.connectionId)
            )
            .catch(err => console.error('Error connecting', err));
    }

    addListener(method: string, callback: (...args: any[]) => void) {
        if (!this.connection) {
            return;
        }

        console.log('Adding listener', method);

        this.connection.on(method, callback);
    }

    removeListener(method: string, callback: (...args: any[]) => void) {
        if (!this.connection) {
            return;
        }

        console.log('Removing listener', method);

        this.connection.off(method, callback);
    }
}
