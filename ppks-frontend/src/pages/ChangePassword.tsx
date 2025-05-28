import { Button, Card, Form, Input, message } from "antd";
import { useForm } from "antd/es/form/Form";
import { Content } from "antd/es/layout/layout";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { StateContext } from "../utils/state";
import axios from "axios";

function ChangePassword() {
    const [form] = useForm();
    const navigate = useNavigate();
    const { global, setGlobal } = useContext(StateContext);

    function onSubmit() {
        const formData = form.getFieldsValue();
        const request = {
            oldPassword: formData.oldPassword,
            newPassword: formData.newPassword
        };
        axios.patch("/api/newPassword", request, {
            headers: {
                Authorization: `Bearer ${global.user?.token}`
            }
        }).then((response) => {
            setGlobal({ ...global, user: { ...response.data } });
            message.success("Promijenjena lozinka!");
            navigate("/profile");
        }).catch(() => {
            message.error("Neuspješna promjena lozinke!");
        })
    }

    function passwordValidator(_: any, value: any) {
        if (!value || form.getFieldValue("newPassword") === value) {
            return Promise.resolve();
        }
        return Promise.reject("Lozinke se ne podudaraju");
    }

    return (
        <Content style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Card title="Promijeni lozinku" bordered={false} style={{ width: "36em", marginTop: "5em" }}>
                <Form
                    id="changePassword"
                    form={form}
                    onFinish={onSubmit}
                    labelCol={{ span: 7 }}
                    wrapperCol={{ span: 20 }}
                    style={{ width: "100%", maxWidth: "44em" }}
                >
                    <Form.Item label="Stara lozinka:" name="oldPassword" hasFeedback rules={[
                        { required: true, message: "Molimo unesite svoju lozinku" },
                        { min: 8, message: "Lozinka mora imati barem 8 znakova" }
                    ]}>
                        <Input.Password />
                    </Form.Item>
                    <Form.Item label="Nova lozinka:" name="newPassword" hasFeedback rules={[
                        { required: true, message: "Molimo unesite svoju lozinku" },
                        { min: 8, message: "Lozinka mora imati barem 8 znakova" }
                    ]}>
                        <Input.Password />
                    </Form.Item>
                    <Form.Item
                        label="Ponovite lozinku:" name="confirmPassword" hasFeedback
                        dependencies={['password']}
                        rules={[
                            { required: true, message: "Molimo unesite svoju lozinku" },
                            { validator: passwordValidator, message: "Lozinke se ne poklapaju" }
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 0 }}>
                        <Button type="primary" htmlType="submit">Potvrdi</Button>
                    </Form.Item>
                </Form>
            </Card>
        </Content>
    );
}

export default ChangePassword;