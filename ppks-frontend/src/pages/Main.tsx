import { Layout, Menu, Button } from "antd";
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    HomeOutlined,
    ProjectOutlined,
    TeamOutlined,
    MailOutlined
} from "@ant-design/icons";
import Logo from "../components/Logo";
import WelcomePage from "./WelcomePage";
import { MenuPropsWithComponent, ProjectDTOResponse } from "../utils/types";
import { useContext, useMemo, useState } from "react";
import { StateContext } from "../utils/state";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import UserIcon from "../components/UserIcon";
import Profile from "./Profile";
import EditProfile from "./EditProfile";
import ChangePassword from "./ChangePassword";
import ProjectList from "../components/ProjectList";
import ProjectDetails from "./ProjectDetails";
import Invitations from "../components/Invitations";

const { Header, Sider, Content } = Layout;

const items: MenuPropsWithComponent = [
    {
        item: {
            key: "",
            icon: <HomeOutlined />,
            label: "Početna",
        },
        component: WelcomePage,
    },
    {
        item: {
            key: "my-projects",
            icon: <ProjectOutlined />,
            label: "Moji Projekti",
        },
        component: () => {
            const { global, setGlobal } = useContext(StateContext);
            
            const handleProjectCreated = (newProject: ProjectDTOResponse) => {
                setGlobal(prev => ({
                    ...prev,
                    user: prev.user ? {
                        ...prev.user,
                        createdProjects: [...(prev.user.createdProjects || []), newProject]
                    } : undefined
                }));
            };

            return (
                <div style={{ padding: '24px' }}>
                    <ProjectList 
                        projects={global.user?.createdProjects || []} 
                        title="Projekti koje sam kreirao"
                        onProjectCreated={handleProjectCreated}
                        showCreateButton={true}
                    />
                </div>
            );
        },
    },
    {
        item: {
            key: "assigned-projects",
            icon: <TeamOutlined />,
            label: "Projekti na kojima radim",
        },
        component: () => {
            const { global } = useContext(StateContext);
            return (
                <div style={{ padding: '24px' }}>
                    <ProjectList 
                        projects={global.user?.joinedProjects || []} 
                        title="Projekti na kojima radim"
                        showCreateButton={false}
                    />
                </div>
            );
        },
    },
    {
        item: {
            key: "invitations",
            icon: <MailOutlined />,
            label: "Pozivnice",
        },
        component: Invitations,
    },
];

function Main() {
    const { global } = useContext(StateContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(true);

    const currentPath = location.pathname.split('/')[1] || '';

    const menuItems = useMemo(() => {
        if (global.user?.role === "ADMIN") {
            return items.filter(i => i.item.key === "" || i.admin).map(i => i.item);
        }
        return items.filter(i => !i.admin).map(i => i.item);
    }, [global.user?.role]);

    const handleMenuClick = (key: string) => {
        navigate(`/${key}`, { replace: true });
    };

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Header
                style={{
                    background: "rgba(8,1,66,1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0 1rem",
                    color: "white",
                    position: "fixed",
                    width: "100%",
                    zIndex: 1001,
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{ color: "white" }}
                    />
                    <Logo />
                </div>
                <UserIcon />
            </Header>

            <Sider
                collapsible
                collapsed={collapsed}
                collapsedWidth={0}
                onCollapse={() => setCollapsed(prev => !prev)}
                style={{ 
                    background: "rgba(8,1,66,1)", 
                    marginTop: 64, 
                    position: "fixed", 
                    height: "calc(100vh - 64px)", 
                    zIndex: 1000,
                    transition: 'all 0.2s'
                }}
                theme="dark"
                trigger={null}
            >
                <Menu
                    theme="dark"
                    mode="inline"
                    onClick={({ key }) => handleMenuClick(key)}
                    selectedKeys={[currentPath]}
                    items={menuItems}
                />
            </Sider>

            <Layout style={{ 
                marginLeft: collapsed ? 0 : 200,
                transition: 'all 0.2s'
            }}>
                <Content style={{ 
                    padding: "1rem",
                    marginTop: 64,
                    transition: 'all 0.2s'
                }}>
                    <Routes>
                        {items.map(item => (
                            <Route 
                                key={item.item.key} 
                                path={item.item.key ? `/${item.item.key}` : '/'} 
                                element={<item.component />} 
                            />
                        ))}
                        <Route path="profile/*" element={
                            <Routes>
                                <Route path="" element={<Profile />} />
                                <Route path="editProfile" element={<EditProfile />} />
                            </Routes>
                        } />
                        <Route path="/newPassword" element={<ChangePassword />} />
                        <Route path="/project/:id" element={<ProjectDetails />} />
                    </Routes>
                </Content>
            </Layout>
        </Layout>
    );
}

export default Main;
