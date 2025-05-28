import { useContext } from "react";
import { Button, Card, Typography, Image } from "antd";
import { Content } from "antd/es/layout/layout";
import { EditOutlined } from "@ant-design/icons";
import { StateContext } from "../utils/state";
import { useNavigate } from "react-router";

function Profile() {
    const { global: { user } } = useContext(StateContext);
    const navigate = useNavigate();
    const background = "linear-gradient(30deg, rgb(115, 140, 199) 0%, rgb(215, 222, 232) 35%, rgb(248, 248, 249) 100%)";

    if (!user) {
        return null;
    }

    return (
        <Content style={{ display: "flex", height: "100vh", alignItems: "center", flexDirection: "column", background }}>
            <Card style={{ display: "flex", flexDirection: "column", flex: 0, height: "60em", margin: "3em" }}>
                <div style={{ display: "flex", flexDirection: "column", margin: "2em", gap: "2em" }}>
                    <div style={{ flexDirection: "column" }}>
                        <Typography.Title level={1} style={{ marginTop: 0 }}>{user.name} {user.surname}</Typography.Title>
                        <Typography.Title level={3} style={{ margin: 0 }}>{user.email}</Typography.Title>
                        <div style={{ display:"flex", flexDirection:"column", gap:"0.5em" }}>
                            {user.role !== "ADMIN" && <Button onClick={() => navigate("editProfileGuest", { state: { user: user } })} style={{ marginTop: "2em" }} icon={<EditOutlined />}>Izmijeni profil</Button>}
                            {user.role !== "ADMIN" && <Button onClick={() => navigate("/newPassword")} icon={<EditOutlined />}>Promijeni lozinku</Button>}
                        </div>
                    </div>
                </div>
            </Card>
        </Content>
    );
}


export default Profile;