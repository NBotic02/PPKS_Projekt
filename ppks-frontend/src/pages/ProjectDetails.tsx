import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { StateContext } from '../utils/state';
import ProjectTasks from '../components/ProjectTasks';
import { ProjectDTOResponse } from '../utils/types';
import axios from 'axios';
import { useWebSocket } from '../utils/WebSocketProvider';

const ProjectDetails: React.FC = () => {
    const { id } = useParams();
    const { global } = useContext(StateContext);
    const [project, setProject] = useState<ProjectDTOResponse | null>(null);
    const { lastProjectUpdate } = useWebSocket();
    
    useEffect(() => {
        const fetchProject = async () => {
            try {
                // First try to find in global state
                const projectFromState = global.user?.createdProjects?.find(p => p.id === Number(id)) || 
                                      global.user?.joinedProjects?.find(p => p.id === Number(id));
                
                if (projectFromState) {
                    setProject(projectFromState);
                } else {
                    // If not found in state, fetch from API
                    const response = await axios.get<ProjectDTOResponse>(`/api/projects/${id}`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    });
                    console.log(response.data);
                    setProject(response.data);
                }
            } catch (error) {
                console.error('Error fetching project:', error);
            }
        };

        if (id) {
            fetchProject();
        }
    }, [id, global.user]);

    // Ažuriraj projekt kada dobijemo WebSocket ažuriranje
    useEffect(() => {
        if (lastProjectUpdate && project && lastProjectUpdate.id === project.id) {
            setProject(lastProjectUpdate);
        }
    }, [lastProjectUpdate, project]);

    if (!project) {
        return <div>Project not found</div>;
    }

    return (
        <div style={{ padding: '24px' }}>
            <div style={{ marginBottom: '24px' }}>
                <h2>{project.name}</h2>
            </div>
            <ProjectTasks projectId={project.id} project={project} />
        </div>
    );
};

export default ProjectDetails; 