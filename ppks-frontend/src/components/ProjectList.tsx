import React, { useContext, useEffect, useState } from 'react';
import { Button, Modal, Form, Input, Table, Space, message } from 'antd';
import { ProjectDTOResponse } from '../utils/types';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { StateContext } from '../utils/state';
import { EditOutlined } from '@ant-design/icons';
import { useWebSocket } from '../utils/WebSocketProvider';

interface ProjectListProps {
  projects: ProjectDTOResponse[];
  title: string;
  onProjectCreated?: (project: ProjectDTOResponse) => void;
  showCreateButton?: boolean;
}

const ProjectList: React.FC<ProjectListProps> = ({ 
  projects: initialProjects, 
  title, 
  onProjectCreated,
  showCreateButton = false 
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectDTOResponse | null>(null);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const navigate = useNavigate();
  const { global, setGlobal } = useContext(StateContext);
  const { lastProjectUpdate } = useWebSocket();

  // Ažuriraj projekte kada dobijemo WebSocket ažuriranje
  useEffect(() => {
    if (lastProjectUpdate) {
      if (title === "Projekti koje sam kreirao") {
        setGlobal(prev => ({
          ...prev,
          user: prev.user ? {
            ...prev.user,
            createdProjects: prev.user.createdProjects?.map(project => 
              project.id === lastProjectUpdate.id ? lastProjectUpdate : project
            ) || []
          } : undefined
        }));
      } else if (title === "Projekti na kojima radim") {
        setGlobal(prev => ({
          ...prev,
          user: prev.user ? {
            ...prev.user,
            joinedProjects: prev.user.joinedProjects?.some(p => p.id === lastProjectUpdate.id)
              ? prev.user.joinedProjects?.map(project => 
                  project.id === lastProjectUpdate.id ? lastProjectUpdate : project
                ) || []
              : [...(prev.user.joinedProjects || []), lastProjectUpdate]
          } : undefined
        }));
      }
    }
  }, [lastProjectUpdate, title]);

  const handleCreateProject = async (values: { name: string; description: string }) => {
    try {
      const response = await axios.post('/api/projects', values,
        {
          headers: {
            Authorization: `Bearer ${global.user?.token}`
          }
        }
      );
      if (onProjectCreated) {
        onProjectCreated(response.data);
      }
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const handleEditProject = async (values: { name: string; description: string }) => {
    if (!editingProject) return;
    
    try {
      const response = await axios.put(`/api/projects/${editingProject.id}`, values, {
        headers: {
          Authorization: `Bearer ${global.user?.token}`
        }
      });
      
      // Ažuriraj createdProjects u globalnom stanju
      setGlobal(prev => ({
        ...prev,
        user: prev.user ? {
          ...prev.user,
          createdProjects: prev.user.createdProjects?.map(project => 
            project.id === editingProject.id ? response.data : project
          ) || []
        } : undefined
      }));

      message.success('Projekt uspješno ažuriran');
      setIsEditModalVisible(false);
      editForm.resetFields();
    } catch (error) {
      console.error('Error updating project:', error);
      message.error('Greška pri ažuriranju projekta');
    }
  };

  const showEditModal = (project: ProjectDTOResponse) => {
    setEditingProject(project);
    editForm.setFieldsValue({
      name: project.name,
      description: project.description
    });
    setIsEditModalVisible(true);
  };

  const columns = [
    {
      title: 'Naziv',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Opis',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Datum kreiranja',
      dataIndex: 'createdDate',
      key: 'createdDate',
      render: (date: string) => new Date(date).toLocaleDateString('hr-HR')
    },
    {
      title: 'Akcije',
      key: 'actions',
      render: (_: any, record: ProjectDTOResponse) => (
        <Space size="middle">
          <Button 
            type="primary" 
            onClick={() => navigate(`/project/${record.id}`)}
          >
            Detalji
          </Button>
          {record.createdBy.id === global.user?.id && (
            <Button 
              type="default"
              icon={<EditOutlined />}
              onClick={() => showEditModal(record)}
            >
              Uredi
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2>{title}</h2>
      {showCreateButton && (
        <div style={{ marginBottom: 16, textAlign: 'right' }}>
          <Button type="primary" onClick={() => setIsModalVisible(true)}>
            Novi Projekt
          </Button>
        </div>
      )}

      <Table 
        columns={columns} 
        dataSource={
          title === "Projekti koje sam kreirao" 
            ? global.user?.createdProjects || [] 
            : title === "Projekti na kojima radim"
              ? (global.user?.joinedProjects || []).filter(project => project.createdBy.id !== global.user?.id)
              : []
        } 
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title="Novi Projekt"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleCreateProject}>
          <Form.Item
            name="name"
            label="Naziv"
            rules={[{ required: true, message: 'Molimo unesite naziv projekta' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Opis"
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Kreiraj
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Uredi Projekt"
        open={isEditModalVisible}
        onCancel={() => {
          setIsEditModalVisible(false);
          editForm.resetFields();
        }}
        footer={null}
      >
        <Form form={editForm} onFinish={handleEditProject}>
          <Form.Item
            name="name"
            label="Naziv"
            rules={[{ required: true, message: 'Molimo unesite naziv projekta' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Opis"
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Spremi
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProjectList; 