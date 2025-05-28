import React, { useContext, useEffect, useState } from 'react';
import { Table, Button, Space, message } from 'antd';
import { StateContext } from '../utils/state';
import axios from 'axios';
import { UserInvitationResponseDTO, UserInvitationEnum } from '../utils/types';
import { useWebSocket } from '../utils/WebSocketProvider';

const Invitations: React.FC = () => {
    const { global } = useContext(StateContext);
    const [invitations, setInvitations] = useState<UserInvitationResponseDTO[]>([]);
    const { lastInvitationUpdate } = useWebSocket();

    const handleInvitationResponse = async (invitationId: number, status: UserInvitationEnum) => {
        try {
            const endpoint = status === UserInvitationEnum.ACCEPTED ? 'accept' : 'reject';
            await axios.post(`/api/invitations/${invitationId}/${endpoint}`, {}, {
                headers: {
                    Authorization: `Bearer ${global.user?.token}`
                }
            });
            message.success(`Pozivnica ${status === UserInvitationEnum.ACCEPTED ? 'prihvaćena' : 'odbijena'}`);
            
            // Ažuriraj lokalno stanje odmah
            setInvitations(prevInvitations => 
                prevInvitations.map(invitation => 
                    invitation.id === invitationId 
                        ? { ...invitation, status } 
                        : invitation
                )
            );
        } catch (error) {
            console.error('Error updating invitation status:', error);
            message.error('Greška pri ažuriranju statusa pozivnice');
        }
    };

    // Ažuriraj pozivnice kada dobijemo WebSocket ažuriranje
    useEffect(() => {
        if (lastInvitationUpdate) {
            console.log('Received invitation update in component:', lastInvitationUpdate);
            setInvitations(prevInvitations => {
                const invitationIndex = prevInvitations.findIndex(i => i.id === lastInvitationUpdate.id);
                if (invitationIndex === -1) {
                    // Ako je nova pozivnica, dodaj je
                    return [...prevInvitations, lastInvitationUpdate];
                } else {
                    // Ako je postojeća pozivnica, ažuriraj je
                    return prevInvitations.map(invitation => 
                        invitation.id === lastInvitationUpdate.id ? lastInvitationUpdate : invitation
                    );
                }
            });
        }
    }, [lastInvitationUpdate]);

    const fetchInvitations = async () => {
        try {
            const response = await axios.get(`/api/invitations/user/${global.user?.id}`, {
                headers: {
                    Authorization: `Bearer ${global.user?.token}`
                }
            });
            setInvitations(response.data);
        } catch (error) {
            console.error('Error fetching invitations:', error);
            message.error('Greška pri dohvaćanju pozivnica');
        }
    };

    useEffect(() => {
        if (global.user?.id) {
            fetchInvitations();
        }
    }, [global.user?.id]);

    const columns = [
        {
            title: 'Naslov',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Opis',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Projekt',
            dataIndex: ['project', 'name'],
            key: 'projectName',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: UserInvitationEnum) => {
                switch (status) {
                    case UserInvitationEnum.ACCEPTED:
                        return 'Prihvaćeno';
                    case UserInvitationEnum.REJECTED:
                        return 'Odbijeno';
                    case UserInvitationEnum.PENDING:
                        return 'Na čekanju';
                    default:
                        return status;
                }
            }
        },
        {
            title: 'Akcije',
            key: 'actions',
            render: (_: any, record: UserInvitationResponseDTO) => (
                record.status === UserInvitationEnum.PENDING ? (
                    <Space size="middle">
                        <Button 
                            type="primary" 
                            onClick={() => handleInvitationResponse(record.id, UserInvitationEnum.ACCEPTED)}
                        >
                            Prihvati
                        </Button>
                        <Button 
                            danger 
                            onClick={() => handleInvitationResponse(record.id, UserInvitationEnum.REJECTED)}
                        >
                            Odbij
                        </Button>
                    </Space>
                ) : null
            ),
        },
    ];

    return (
        <div style={{ padding: '24px' }}>
            <h2>Pozivnice</h2>
            <Table 
                columns={columns} 
                dataSource={invitations} 
                rowKey="id"
                pagination={{ pageSize: 10 }}
            />
        </div>
    );
};

export default Invitations; 