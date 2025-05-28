import { WebSocketContextType, ProjectDTOResponse, TaskDTOResponse, UserInvitationDTO } from './types';

class WebSocketService {
    private ws: WebSocket | null = null;
    private token: string | null = null;
    private onMessageCallback: ((data: any) => void) | null = null;

    connect(token: string) {
        if (this.ws?.readyState === WebSocket.OPEN) {
            return;
        }

        this.token = token;
        this.ws = new WebSocket(`ws://localhost:8080/ws?token=${token}`);

        this.ws.onopen = () => {
            console.log('WebSocket Connected');
        };

        this.ws.onclose = () => {
            console.log('WebSocket Disconnected');
        };

        this.ws.onerror = (error) => {
            console.error('WebSocket Error:', error);
        };

        this.ws.onmessage = (event) => {
            if (this.onMessageCallback) {
                const data = JSON.parse(event.data);
                this.onMessageCallback(data);
            }
        };
    }

    disconnect() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }

    setOnMessageCallback(callback: (data: any) => void) {
        this.onMessageCallback = callback;
    }

    isConnected(): boolean {
        return this.ws?.readyState === WebSocket.OPEN;
    }
}

export const webSocketService = new WebSocketService(); 