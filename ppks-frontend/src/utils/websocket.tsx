import React, { createContext, useContext, useEffect, useState } from 'react';
import { StateContext } from './state';
import { Client } from '@stomp/stompjs';
import { ProjectDTOResponse, TaskDTOResponse, UserInvitationDTO } from './types';

interface WebSocketContextType {
    client: Client | null;
    isConnected: boolean;
    lastProjectUpdate: ProjectDTOResponse | null;
    lastTaskUpdate: TaskDTOResponse | null;
    lastInvitationUpdate: UserInvitationDTO | null;
}

const WebSocketContext = createContext<WebSocketContextType>({
    client: null,
    isConnected: false,
    lastProjectUpdate: null,
    lastTaskUpdate: null,
    lastInvitationUpdate: null
});

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [client, setClient] = useState<Client | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [lastProjectUpdate, setLastProjectUpdate] = useState<ProjectDTOResponse | null>(null);
    const [lastTaskUpdate, setLastTaskUpdate] = useState<TaskDTOResponse | null>(null);
    const [lastInvitationUpdate, setLastInvitationUpdate] = useState<UserInvitationDTO | null>(null);
    const { global } = useContext(StateContext);

    useEffect(() => {
        if (!global.user?.token) return;

        const stompClient = new Client({
            webSocketFactory: () => {
                const ws = new WebSocket(`ws://localhost:8080/ws?token=${global.user?.token}`);
                
                ws.onopen = () => {
                    console.log('WebSocket connection established');
                };

                ws.onerror = (error) => {
                    console.error('WebSocket error:', error);
                };

                ws.onclose = (event) => {
                    console.log('WebSocket connection closed:', event);
                };

                return ws;
            },
            connectHeaders: {
                Authorization: `Bearer ${global.user.token}`
            },
            debug: function (str) {
                console.log('STOMP: ' + str);
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            onConnect: () => {
                console.log('Connected to WebSocket');
                setIsConnected(true);

                // Subscribe to project updates
                stompClient.subscribe('/topic/projects', (message) => {
                    const projectUpdate = JSON.parse(message.body);
                    setLastProjectUpdate(projectUpdate);
                });

                // Subscribe to task updates
                stompClient.subscribe('/topic/tasks', (message) => {
                    const taskUpdate = JSON.parse(message.body);
                    setLastTaskUpdate(taskUpdate);
                });

                // Subscribe to user invitation updates
                stompClient.subscribe('/topic/invitations', (message) => {
                    const invitationUpdate = JSON.parse(message.body);
                    setLastInvitationUpdate(invitationUpdate);
                });
            },
            onDisconnect: () => {
                console.log('Disconnected from WebSocket');
                setIsConnected(false);
            },
            onStompError: (frame) => {
                console.error('STOMP error:', frame);
            },
            onWebSocketError: (event) => {
                console.error('WebSocket error:', event);
            },
            onWebSocketClose: (event) => {
                console.log('WebSocket closed:', event);
                setIsConnected(false);
            }
        });

        try {
            stompClient.activate();
            setClient(stompClient);
        } catch (error) {
            console.error('Error activating WebSocket client:', error);
        }

        return () => {
            if (stompClient.connected) {
                stompClient.deactivate();
            }
        };
    }, [global.user?.token]);

    return (
        <WebSocketContext.Provider value={{ 
            client, 
            isConnected,
            lastProjectUpdate,
            lastTaskUpdate,
            lastInvitationUpdate
        }}>
            {children}
        </WebSocketContext.Provider>
    );
}; 