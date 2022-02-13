import {useState} from "react";
import {Button, Form, Input, message} from "antd";
import { useNavigate } from "react-router-dom";

import {Paths} from "../../../constants/routes";
import axiosInstance from "../../../services/axios";

import styles from '../styles.module.scss';


const { Item } = Form;

export const RegisterPage = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const onFinish = (values) => {
        const {email, password, user_name} = values;

        if (email && password && user_name) {
            setLoading(true);
            axiosInstance.post('/register', {email, password, user_name})
                .then(() => {
                    message.success('Registered successfully!');
                    navigate(Paths.LOGIN_PATH);
                })
                .catch((error) => {
                    const msg = error.response?.data?.message;
                    message.error(`Registration failed. ${msg ? msg : ''}`);
                    console.error(error);
                })
                .finally(() => {
                    setLoading(false);
                })
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.error("Failed:", errorInfo);
    };

    const onBackToLoginClick = () => {
        navigate(Paths.LOGIN_PATH);
    }

    return (
        <div className={styles.loginPageWrapper}>
            <div className={styles.appTitle}>
                Register your free account
            </div>
            <Form
                name="registration-form"
                initialValues={{ remember: false }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                className={styles.loginForm}
            >
                <Item
                    name="email"
                    rules={[{ required: true, message: "Please input your email!", type: 'email' }]}
                    className={styles.loginFormItem}
                >
                    <Input className={styles.loginFormInput} placeholder="Email" />
                </Item>

                <Item
                    name="user_name"
                    rules={[{ required: true, message: "Please input your user name!" }]}
                    className={styles.loginFormItem}
                >
                    <Input className={styles.loginFormInput} placeholder="User name" />
                </Item>

                <Item
                    name="password"
                    rules={[{ required: true, message: "Please input your password!" }]}
                    className={styles.loginFormItem}
                >
                    <Input type="password" className={styles.loginFormInput} placeholder="Password" />
                </Item>

                <Item className={styles.loginFormItem}>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        className={styles.loginFormButton}
                    >
                        Submit
                    </Button>
                </Item>

                <div className={styles.signUpWrapper}>
                    <div>Already have an account?</div>
                    <div className={styles.signUpLink} onClick={onBackToLoginClick}>Back to the Login page</div>
                </div>
            </Form>
        </div>
    )
}
