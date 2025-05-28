import { useContext } from 'react';
import { Button, DatePicker, Form, Input, Layout, Radio, Row, Typography } from "antd";
import axios from 'axios';
import { message } from "antd";
import LoginRegisterHeader from "../components/LoginRegisterHeader";
import { Content } from 'antd/es/layout/layout';
import { useForm } from 'antd/es/form/Form';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { StateContext } from '../utils/state';
import { UserRegister } from '../utils/types';

function RegisterUser() {
    const [form] = useForm();
    const navigate = useNavigate();
    const { global, setGlobal } = useContext(StateContext);
    const dateFormat = 'YYYY/MM/DD';

    function passwordValidator(_: any, value: any) {
        if (!value || form.getFieldValue("password") === value) {
            return Promise.resolve();
        }
        return Promise.reject("Lozinke se ne podudaraju");
    }
    async function onSubmit() {
        try {
            const formData = form.getFieldsValue();
            const registerData : UserRegister = {
                name: formData.name,
                surname: formData.surname,
                email: formData.email,
                password: formData.password,
                username: formData.username,
                gender: formData.gender,
                dateOfBirth: formData.age
            };
            const response = await axios.post('/api/auth/registerUser', registerData);
            localStorage.setItem("token", response.data.token); 
            setGlobal({ ...global, user: { ...response.data.user, token: response.data.token } });
            navigate("/");
        } catch (error) {
            message.error("Registracija nije uspjela. Provjerite podatke i pokušajte ponovno.");
            console.error('Greška prilikom registracije:', error);
        }
    }

    return (
        <>
            <LoginRegisterHeader />
            <Layout style={{ minHeight: "100%" }}>
                <Content style={{ display: "flex", alignItems: "center", flexDirection: "column", flex: "1", width: "100%", padding: "1em" }}>
                    <Typography.Title level={2}>Registracija</Typography.Title>
                    <Form
                        id="register"
                        form={form}
                        onFinish={onSubmit}
                        labelCol={{ span: 7 }}
                        wrapperCol={{ span: 20 }}
                        style={{ width: "100%", maxWidth: "32em" }}
                    >
                        <Form.Item label="Korisničko ime:" name="username" rules={[{ required: true, message: "Molimo unesite svoje korisničko ime" }]}>
                            <Input autoFocus />
                        </Form.Item>
                        <Form.Item required label="Ime i prezime:">
                            <Row style={{ gap: "0.5em" }}>
                                <Form.Item name="name" style={{ flex: 1, marginBottom: 0 }} rules={[{ required: true, message: "Molimo unesite svoje ime" }]}>
                                    <Input placeholder="Ime" />
                                </Form.Item>
                                <Form.Item name="surname" style={{ flex: 1, marginBottom: 0 }} rules={[{ required: true, message: "Molimo unesite svoje prezime" }]}>
                                    <Input placeholder="Prezime" />
                                </Form.Item>
                            </Row>
                        </Form.Item>
                        <Form.Item label="Email:" name="email" rules={[{ required: true, type: "email", message: "Molimo unesite važeći email" }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item label="Lozinka:" name="password" hasFeedback rules={[
                            { required: true, message: "Molimo unesite svoju lozinku" },
                            { min: 8, message: "Lozinka mora imati barem 8 znakova" }
                        ]}>
                            <Input.Password />
                        </Form.Item>
                        <Form.Item
                            label="Ponovite lozinku:" name="confirmPassword" hasFeedback
                            dependencies={['password']}
                            rules={[
                                { required: true, message: "Molimo unesite potvrdu lozinke" },
                                { validator: passwordValidator, message: "Lozinke se ne poklapaju" }
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>
                        <Form.Item label="Broj godina:" name="age" rules={[{ required: true, message: 'Molimo odaberite datum rođenja' }]}>
                            <DatePicker style={{ width: "100%" }} defaultValue={dayjs('2015/01/01', dateFormat)} format={dateFormat} />
                        </Form.Item>
                        <Form.Item name="gender" label="Spol" rules={[{ required: true, message: 'Molimo odaberite spol' }]}>
                            <Radio.Group>
                                <Radio value="M">Muški</Radio>
                                <Radio value="F">Ženski</Radio>
                            </Radio.Group>
                        </Form.Item>
                    
                        <Form.Item wrapperCol={{ offset: 0 }}>
                            <Button type="primary" htmlType="submit">Registriraj se</Button>
                        </Form.Item>
                    </Form>
                </Content>
            </Layout >
        </>
    );
}

export default RegisterUser;
