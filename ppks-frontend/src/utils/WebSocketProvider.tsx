import React, { createContext, useContext, useEffect, useState } from 'react';
import { WebSocketContextType, ProjectDTOResponse, TaskDTOResponse, UserInvitationResponseDTO } from './types';
import { StateContext } from './state';
import { Client } from '@stomp/stompjs';

const WebSocketContext = createContext<WebSocketContextType>({
    isConnected: false,
    lastProjectUpdate: null,
    lastTaskUpdate: null,
    lastInvitationUpdate: null
});

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isConnected, setIsConnected] = useState(false);
    const [lastProjectUpdate, setLastProjectUpdate] = useState<ProjectDTOResponse | null>(null);
    const [lastTaskUpdate, setLastTaskUpdate] = useState<TaskDTOResponse | null>(null);
    const [lastInvitationUpdate, setLastInvitationUpdate] = useState<UserInvitationResponseDTO | null>(null);
    const { global } = useContext(StateContext);

    useEffect(() => {
        if (!global.user?.token) return;

        const ws = new WebSocket(`ws://localhost:8080/api/ws?token=${global.user.token}`);
        const stompClient = new Client({
            webSocketFactory: () => ws,
            connectHeaders: { 
                Authorization: `Bearer ${global.user.token}` 
            },
            debug: (str) => console.log('STOMP: ' + str),
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
                stompClient.subscribe(`/topic/invitations/${global.user?.id}`, (message) => {
                    console.log('Received invitation update:', message.body);
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
            isConnected,
            lastProjectUpdate,
            lastTaskUpdate,
            lastInvitationUpdate
        }}>
            {children}
        </WebSocketContext.Provider>
    );
}; 