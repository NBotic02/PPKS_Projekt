import { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Form, Image, Input, InputNumber, Layout, Radio, Row, Typography, Upload, message } from "antd";
import { Content } from "antd/es/layout/layout";
import { StateContext } from "../utils/state";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { useForm } from "antd/es/form/Form";
import { RcFile } from "antd/es/upload";
import axios from "axios";
import { User } from "../utils/types";


function EditProfile() {
    const [form] = useForm();
    const [image, setImage] = useState<{ originFileObj: RcFile }>();
    const navigate = useNavigate();
    const { global, setGlobal } = useContext(StateContext);
    const location = useLocation();
    const user: User = location.state?.user as User;


    function passwordValidator(_: any, value: any) {
        if (!value || form.getFieldValue("newPassword") === value) {
            return Promise.resolve();
        }
        return Promise.reject("Lozinke se ne podudaraju");
    }

    const onUpload = (file: File) => {
        const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
        if (!isJpgOrPng) {
            message.error("Moguće je jedino uploadati JPG/PNG datoteke!");
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error("Slika mora biti manja od 2MB!");
        }
        return isJpgOrPng && isLt2M;
    };

    async function onSubmit() {
        try {
            const formData = form.getFieldsValue();
            let registerData;
            if (global.user?.role === "ADMIN") {
                registerData = {
                    name: formData.name,
                    surname: formData.surname,
                    email: formData.email,
                    newPassword: formData.newPassword,
                    confirmPassword: formData.confirmPassword,
                    username: formData.username,
                    newUsername: formData.newUsername,
                    gender: formData.gender,
                    age: formData.age
                };
            } else {
                registerData = {
                    name: formData.name,
                    surname: formData.surname,
                    email: formData.email,
                    oldPassword: formData.oldPassword,
                    newPassword: formData.newPassword,
                    confirmPassword: formData.confirmPassword,
                    username: formData.username,
                    gender: formData.gender,
                    age: formData.age
                };
            }
            const data = new FormData();
            Object.entries(registerData).forEach((entry) =>
                data.append(entry[0], typeof entry[1] === "string" ? entry[1] : JSON.stringify(entry[1]))
            );
            if (image) data.append("picture", image.originFileObj, image.originFileObj.name);
            console.log(data.getAll);
            const response = await axios.patch('/api/updateGuest', data, {
                headers: {
                    Authorization: `Bearer ${global.user?.token}`
                }
            });
            if (global.user?.role !== "ADMIN") {
                setGlobal({ ...global, user: { ...response.data } });
                navigate("/profile");
            } else {
                navigate("/allUsers");
            }

        } catch (error) {
            console.error('Greška prilikom registracije:', error);
        }
    }

    const deleteImage = () => {
        setImage(undefined);
    };

    return (
        <Layout>
            <Content style={{ display: "flex", alignItems: "center", flexDirection: "column", flex: "1", width: "100%" }}>
                <Typography.Title level={2}>Promijeni podatke profila</Typography.Title>
                <Form
                    id="register"
                    form={form}
                    onFinish={onSubmit}
                    initialValues={user}
                    labelCol={{ span: 7 }}
                    wrapperCol={{ span: 20 }}
                    style={{ width: "100%", maxWidth: "44em" }}
                >
                    {global.user && global.user.role === "ADMIN" ?
                        (<>
                            <Form.Item label="Trenutno korisničko ime:" name="username" rules={[{ required: true, message: "Molimo unesite svoje korisničko ime" }]}>
                                <Input autoFocus />
                            </Form.Item>
                            <Form.Item label="Novo korisničko ime:" name="newUsername">
                                <Input autoFocus />
                            </Form.Item>
                        </>) :
                        (
                            <Form.Item label="Korisničko ime:" name="username" rules={[{ required: true, message: "Molimo unesite svoje korisničko ime" }]}>
                                <Input autoFocus />
                            </Form.Item>
                        )
                    }
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
                    {global.user && global.user.role === "ADMIN" &&
                        (
                            <>
                                <Form.Item label="Nova lozinka:" name="newPassword" hasFeedback rules={[
                                    { min: 8, message: "Lozinka mora imati barem 8 znakova" }
                                ]}>
                                    <Input.Password placeholder="Optional" />
                                </Form.Item>
                                <Form.Item
                                    label="Ponovite lozinku:" name="confirmPassword" hasFeedback
                                    dependencies={['password']}
                                    rules={[
                                        { validator: passwordValidator, message: "Lozinke se ne poklapaju" }
                                    ]}
                                >
                                    <Input.Password placeholder="Optional" />
                                </Form.Item>
                            </>
                        )
                    }
                    <Form.Item label="Broj godina:" name="age" rules={[{ required: true, message: 'Molimo odaberite broj godina' }]}>
                        <InputNumber style={{ width: "100%", textAlign: "center" }} min={0} max={150} />
                    </Form.Item>
                    <Form.Item name="gender" label="Spol" rules={[{ required: true, message: 'Molimo odaberite spol' }]}>
                        <Radio.Group>
                            <Radio value="M">Muški</Radio>
                            <Radio value="F">Ženski</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item style={{ display: "flex", flexDirection: "column" }} label="Slika profila:" name="slika" valuePropName="slika" getValueFromEvent={v => setImage(v.file)} hasFeedback rules={[{ required: false, message: "Molimo učitajte sliku profila" }]}>
                        <Upload
                            name="slika"
                            listType="picture-circle"
                            showUploadList={false}
                            beforeUpload={onUpload}
                        >
                            <div>
                                <PlusOutlined />
                                <div style={{ marginTop: 8 }}>Učitaj</div>
                            </div>
                        </Upload>
                    </Form.Item>
                    {image &&
                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", gap: "0.3em", margin: "1em" }}>
                            <Image src={URL.createObjectURL(image.originFileObj)} alt="avatar" style={{ width: "5em", borderRadius: "20%" }} />
                            <Button
                                size="small"
                                shape="round"
                                type="primary"
                                style={{
                                    fontSize: "1.5em",
                                    paddingInline: "1em",
                                    height: "fit-content"
                                }}
                                onClick={deleteImage}
                            >
                                <DeleteOutlined />
                            </Button>
                        </div>
                    }
                    <Form.Item wrapperCol={{ offset: 0 }}>
                        <Button type="primary" htmlType="submit">Ažuriraj</Button>
                    </Form.Item>
                </Form>
            </Content>
        </Layout>
    );
}

export default EditProfile;
