import React, { useContext, useEffect, useState } from 'react';
import { Button, Card, Modal, Form, Input, Select, Space, Typography, Row, Col, message } from 'antd';
import { TaskDTOResponse, UserResponseDTO, UserSummaryDTO, ProjectDTOResponse } from '../utils/types';
import axios from 'axios';
import { StateContext } from '../utils/state';
import { EditOutlined } from '@ant-design/icons';
import { useWebSocket } from '../utils/WebSocketProvider';

const { Text } = Typography;

interface ProjectTasksProps {
    projectId: number;
    project: ProjectDTOResponse;
}

const ProjectTasks: React.FC<ProjectTasksProps> = ({ projectId, project }) => {
    const [tasks, setTasks] = useState<TaskDTOResponse[]>([]);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [isTaskModalVisible, setIsTaskModalVisible] = useState(false);
    const [isInviteModalVisible, setIsInviteModalVisible] = useState(false);
    const [selectedTask, setSelectedTask] = useState<TaskDTOResponse | null>(null);
    const [availableUsers, setAvailableUsers] = useState<UserSummaryDTO[]>([]);
    const [projectUsers, setProjectUsers] = useState<UserSummaryDTO[]>([]);
    const [form] = Form.useForm();
    const [inviteForm] = Form.useForm();
    const { global } = useContext(StateContext);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm] = Form.useForm();
    const { lastTaskUpdate } = useWebSocket();

    const fetchTasks = async () => {
        try {
            const response = await axios.get(`/api/projects/${projectId}/tasks`, {
                headers: {
                    Authorization: `Bearer ${global.user?.token}`
                }
            });
            setTasks(response.data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            message.error('Greška pri dohvaćanju zadataka');
        }
    };

    const fetchProjectUsers = async () => {
        try {
            console.log('Fetching project users...');
            // Dohvati sve korisnike projekta koji su prihvatili poziv
            console.log(project.id);
            console.log(project);
            const projectUsersResponse = await axios.get<UserSummaryDTO[]>(`/api/user-project/project/${project.id}/users`, {
                headers: { Authorization: `Bearer ${global.user?.token}` }
            });
            console.log('Project users response:', projectUsersResponse);

            let allProjectUsers = [...projectUsersResponse.data];
            console.log('Project:', project);
            console.log('Global user:', global.user);
            
            // Ako je trenutni korisnik owner, dodaj ga iz global.user
            if (project.createdBy.id === global.user?.id) {
                console.log('Current user is owner, adding from global.user');
                const currentUserSummary: UserSummaryDTO = {
                    id: global.user.id,
                    name: global.user.name,
                    surname: global.user.surname,
                    email: global.user.email
                };
                allProjectUsers.push(currentUserSummary);
            } else {
                console.log('Current user is not owner, fetching owner');
                // Ako nije owner, dohvati owner-a
                const ownerResponse = await axios.get<UserResponseDTO>(`/api/dohvatiUsera/${project.createdBy.id}`, {
                    headers: { Authorization: `Bearer ${global.user?.token}` }
                });
                console.log('Owner response:', ownerResponse.data);
                
                // Pretvori UserResponseDTO u UserSummaryDTO
                const ownerSummary: UserSummaryDTO = {
                    id: ownerResponse.data.id,
                    name: ownerResponse.data.name,
                    surname: ownerResponse.data.surname,
                    email: ownerResponse.data.email
                };
                
                allProjectUsers.push(ownerSummary);
            }

            console.log('Final allProjectUsers:', allProjectUsers);
            setProjectUsers(allProjectUsers);
        } catch (error) {
            console.error('Error fetching project users:', error);
            message.error('Greška pri dohvaćanju korisnika projekta');
        }
    };

    useEffect(() => {
        fetchTasks();
        fetchProjectUsers();
    }, [projectId]);

    useEffect(() => {
        if (lastTaskUpdate) {
            if (lastTaskUpdate.projectId === projectId) {
                if (lastTaskUpdate.id === null) {
                    // Task je obrisan
                    setTasks(prevTasks => prevTasks.filter(task => task.id !== lastTaskUpdate.id));
                } else {
                    setTasks(prevTasks => {
                        const taskIndex = prevTasks.findIndex(task => task.id === lastTaskUpdate.id);
                        if (taskIndex === -1) {
                            // Novi task
                            return [...prevTasks, lastTaskUpdate];
                        }
                        // Ažurirani task
                        return prevTasks.map(task => task.id === lastTaskUpdate.id ? lastTaskUpdate : task);
                    });
                }
            }
        }
    }, [lastTaskUpdate, projectId]);

    const handleCreateTask = async (values: { name: string; description: string; assignedTo: number }) => {
        try {
            const response = await axios.post('/api/tasks', {
                title: values.name,
                description: values.description,
                status: 'TODO',
                assignedToId: values.assignedTo,
                projectId: projectId
            }, {
                headers: {
                    Authorization: `Bearer ${global.user?.token}`
                }
            });
            setTasks([...tasks, response.data]);
            setIsCreateModalVisible(false);
            form.resetFields();
        } catch (error) {
            console.error('Error creating task:', error);
            message.error('Greška pri kreiranju zadatka');
        }
    };

    const handleInviteClick = async () => {
        try {
            console.log('Fetching all users...');
            const allUsersResponse = await axios.get<UserSummaryDTO[]>('/api/dohvatiSveUsere', {
                headers: { Authorization: `Bearer ${global.user?.token}` }
            });
            console.log('All users response:', allUsersResponse.data);

            // Koristi već dohvaćene projectUsers i project
            const projectUserIds = [
                ...projectUsers.map(user => user.id),
                project.createdBy.id,
                global.user?.id // Dodaj trenutnog korisnika
            ];

            const availableUsers = allUsersResponse.data.filter(
                user => !projectUserIds.includes(user.id)
            );

            setAvailableUsers(availableUsers);
            setIsInviteModalVisible(true);
        } catch (error) {
            console.error('Error fetching users:', error);
            message.error('Greška pri dohvaćanju korisnika');
        }
    };

    const handleInviteUser = async (values: { title: string; description: string; invitedUser: number }) => {
        try {
            await axios.post('/api/invitations/send', {
                title: values.title,
                description: values.description,
                invitedUser: values.invitedUser,
                projectId: projectId
            }, {
                headers: {
                    Authorization: `Bearer ${global.user?.token}`
                }
            });

            message.success('Pozivnica uspješno poslana');
            setIsInviteModalVisible(false);
            inviteForm.resetFields();
        } catch (error) {
            console.error('Error inviting user:', error);
            message.error('Greška pri slanju pozivnice');
        }
    };

    const renderTaskCard = (task: TaskDTOResponse) => (
        <Card
            key={task.id}
            style={{ marginBottom: 8, cursor: 'pointer' }}
            onClick={() => {
                setSelectedTask(task);
                setIsTaskModalVisible(true);
                setIsEditing(false);
                editForm.setFieldsValue({
                    title: task.title,
                    description: task.description,
                    status: task.status,
                    assignedTo: task.assignedTo?.id
                });
            }}
        >
            <Text strong>{task.title}</Text>
            <br />
            <Text type="secondary">{task.description}</Text>
            <br />
            <Text type="secondary">Dodijeljen: {task.assignedTo ? `${task.assignedTo.name} ${task.assignedTo.surname}` : 'Nije dodijeljen'}</Text>
        </Card>
    );

    const renderTaskColumn = (status: 'TODO' | 'IN_PROGRESS' | 'DONE') => (
        <div>
            {tasks.filter(task => task.status === status).length > 0 ? (
                tasks
                    .filter(task => task.status === status)
                    .map(renderTaskCard)
            ) : (
                <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                    Nema zadataka
                </div>
            )}
        </div>
    );

    const columns = [
        {
            title: 'TODO',
            dataIndex: 'TODO',
            key: 'TODO',
            render: () => renderTaskColumn('TODO'),
        },
        {
            title: 'IN PROGRESS',
            dataIndex: 'IN_PROGRESS',
            key: 'IN_PROGRESS',
            render: () => renderTaskColumn('IN_PROGRESS'),
        },
        {
            title: 'DONE',
            dataIndex: 'DONE',
            key: 'DONE',
            render: () => renderTaskColumn('DONE'),
        },
    ];

    const handleUpdateTask = async (values: { title: string; description: string; status: 'TODO' | 'IN_PROGRESS' | 'DONE'; assignedTo: number }) => {
        try {
            const response = await axios.put(`/api/tasks/${selectedTask?.id}`, {
                title: values.title,
                description: values.description,
                status: values.status,
                assignedToId: values.assignedTo,
                projectId: projectId
            }, {
                headers: {
                    Authorization: `Bearer ${global.user?.token}`
                }
            });
            
            // Ažuriraj task u listi
            setTasks(tasks.map(task => task.id === selectedTask?.id ? response.data : task));
            setIsEditing(false);
            setIsTaskModalVisible(false)
            message.success('Task uspješno ažuriran');
        } catch (error) {
            console.error('Error updating task:', error);
            message.error('Greška pri ažuriranju taska');
        }
    };

    return (
        <div>
            <div style={{ marginBottom: 16, textAlign: 'right' }}>
                <Space>
                    <Button type="primary" onClick={() => setIsCreateModalVisible(true)}>
                        Novi Task
                    </Button>
                    <Button onClick={handleInviteClick}>
                        Pozovi korisnika
                    </Button>
                </Space>
            </div>

            <Row gutter={16}>
                {columns.map(column => (
                    <Col span={8} key={column.key}>
                        <Card title={column.title}>
                            {column.render()}
                        </Card>
                    </Col>
                ))}
            </Row>

            <Modal
                title="Novi Task"
                open={isCreateModalVisible}
                onCancel={() => setIsCreateModalVisible(false)}
                footer={null}
            >
                <Form form={form} onFinish={handleCreateTask}>
                    <Form.Item
                        name="name"
                        label="Naziv"
                        rules={[{ required: true, message: 'Molimo unesite naziv zadatka' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="Opis"
                    >
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item
                        name="assignedTo"
                        label="Dodijeli korisniku"
                    >
                        <Select
                            placeholder="Odaberi korisnika"
                            allowClear
                            options={projectUsers.map(user => ({
                                value: user.id,
                                label: `${user.name} ${user.surname}`
                            }))}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Kreiraj
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title={selectedTask?.title}
                open={isTaskModalVisible}
                onCancel={() => {
                    setIsTaskModalVisible(false);
                    setIsEditing(false);
                }}
                footer={null}
                maskClosable={false}
            >
                {selectedTask && (
                    <Form
                        form={editForm}
                        onFinish={handleUpdateTask}
                        initialValues={{
                            title: selectedTask.title,
                            description: selectedTask.description,
                            status: selectedTask.status,
                            assignedTo: selectedTask.assignedTo?.id
                        }}
                    >
                        <div style={{ position: 'relative' }}>
                            <Button 
                                type="text" 
                                icon={<EditOutlined />} 
                                onClick={() => setIsEditing(!isEditing)}
                                style={{ position: 'absolute', top: -40, right: 20 }}
                            />
                            
                            <Form.Item
                                name="title"
                                label="Naziv"
                                rules={[{ required: true, message: 'Molimo unesite naziv zadatka' }]}
                            >
                                <Input disabled={!isEditing} />
                            </Form.Item>
                            
                            <Form.Item
                                name="description"
                                label="Opis"
                            >
                                <Input.TextArea disabled={!isEditing} />
                            </Form.Item>
                            
                            <Form.Item
                                name="status"
                                label="Status"
                                rules={[{ required: true, message: 'Molimo odaberite status' }]}
                            >
                                <Select disabled={!isEditing}>
                                    <Select.Option value="TODO">TODO</Select.Option>
                                    <Select.Option value="IN_PROGRESS">IN PROGRESS</Select.Option>
                                    <Select.Option value="DONE">DONE</Select.Option>
                                </Select>
                            </Form.Item>
                            
                            <Form.Item
                                name="assignedTo"
                                label="Dodijeli korisniku"
                            >
                                <Select
                                    placeholder="Odaberi korisnika"
                                    allowClear
                                    disabled={!isEditing}
                                    options={projectUsers.map(user => ({
                                        value: user.id,
                                        label: `${user.name} ${user.surname}`
                                    }))}
                                />
                            </Form.Item>

                            <p><strong>Kreirao:</strong> {selectedTask.createdBy.name} {selectedTask.createdBy.surname}</p>
                            <p><strong>Datum kreiranja:</strong> {new Date(selectedTask.createdDate).toLocaleDateString('hr-HR')}</p>

                            {isEditing && (
                                <Form.Item>
                                    <Button type="primary" htmlType="submit">
                                        Spremi
                                    </Button>
                                </Form.Item>
                            )}
                        </div>
                    </Form>
                )}
            </Modal>

            <Modal
                title="Pozovi korisnika u projekt"
                open={isInviteModalVisible}
                onCancel={() => {
                    setIsInviteModalVisible(false);
                    inviteForm.resetFields();
                }}
                footer={null}
            >
                <Form form={inviteForm} onFinish={handleInviteUser}>
                    <Form.Item
                        name="title"
                        label="Naslov"
                        rules={[{ required: true, message: 'Molimo unesite naslov pozivnice' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="Opis"
                        rules={[{ required: true, message: 'Molimo unesite opis pozivnice' }]}
                    >
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item
                        name="invitedUser"
                        label="Korisnik"
                        rules={[{ required: true, message: 'Molimo odaberite korisnika' }]}
                    >
                        <Select
                            placeholder="Odaberi korisnika"
                            options={availableUsers.map(user => ({
                                value: user.id,
                                label: `${user.name} ${user.surname}`
                            }))}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Pošalji pozivnicu
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ProjectTasks; 