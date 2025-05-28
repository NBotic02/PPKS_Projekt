import { useContext, useEffect } from "react";
import { Layout, Button, Typography, Form, Input, message } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { Content } from "antd/es/layout/layout";
import { useForm } from "antd/es/form/Form";
import { Link, useNavigate } from "react-router-dom";
import LoginRegisterHeader from "../components/LoginRegisterHeader";
import { UserLogin } from "../utils/types";
import axios from "axios";
import { StateContext } from "../utils/state";

function Login() {
    const [form] = useForm();
    const navigate = useNavigate();
    const { global, setGlobal } = useContext(StateContext);
    
    useEffect(() => {

    });

    async function onSubmit() {
        try {
            const formData = form.getFieldsValue();
            const registerData: UserLogin = {
                username: formData.username,
                password: formData.password
            };
            console.log(registerData);
            const response = await axios.post('/api/auth/authenticate', registerData);
            localStorage.setItem("token", response.data.token); 
            setGlobal({ ...global, user: { ...response.data.user, token: response.data.token } });
            navigate("/");
        } catch (error) {
            message.error("Krivi username ili password");
            console.error('Greška prilikom Logina:', error);
        }
    }

    return (
        <>
            <LoginRegisterHeader />
            <Layout style={{ height: "100%" }}>
                <Content style={{ display: "flex", alignItems: "center", flexDirection: "column", flex: "1", padding:"1em" }}>
                    <Typography.Title level={2}>Prijava</Typography.Title>
                    <Form
                        id="login"
                        form={form}
                        onFinish={onSubmit}
                        style={{ width: "100%", maxWidth: "20em" }}
                    >
                        <Form.Item
                            name="username"
                            rules={[{ required: true, message: "Molimo unesite važeće korisničko ime" }]}
                        >
                            <Input prefix={<MailOutlined style={{ color: "rgba(0, 0, 0, 0.25)" }} />} placeholder="Korisničko ime" autoFocus />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[
                                { required: true, message: "Molimo unesite svoju lozinku" },
                                { min: 8, message: "Lozinka mora imati barem 8 znakova" }
                            ]}
                        >
                            <Input.Password placeholder="Lozinka" prefix={<LockOutlined style={{ color: "rgba(0, 0, 0, 0.25)" }} />} />
                        </Form.Item>
                        <Form.Item key="submit">
                            <Button type="primary" htmlType="submit" style={{ width: "100%" }}>Prijava</Button>
                            <p>Nemaš račun? </p>
                            <p><Link to="/registerUser">Registriraj se!</Link></p>
                        </Form.Item>
                    </Form>
                </Content>
            </Layout>
        </>
    );
}

export default Login;