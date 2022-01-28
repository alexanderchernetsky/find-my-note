import {useContext} from "react";
import {Button, Form, Input, message} from "antd";
import { useNavigate } from "react-router-dom";

import {setUserSession} from "../../helpers/authentication";
import {Paths} from "../../constants/routes";
import {AuthContext} from "../../App";
import axiosInstance from "../../services/axios";

import styles from './styles.module.scss';


const { Item } = Form;

export const LoginPage = () => {
    const navigate = useNavigate();
    const {setAuthState} = useContext(AuthContext);

    const onFinish = (values) => {
        const {email, password} = values;

        if (email && password) {
            // todo: add real user instead of a hardcoded one
            axiosInstance.get('/login')
                .then(() => {
                    message.success('Logged in successfully!');
                    setUserSession({user: 'test_user'});
                    setAuthState({user: 'test_user'})
                    navigate(Paths.HOME_PAGE_PATH);
                })
                .catch((error) => {
                    message.error('Login failed!');
                    console.error(error);
                });
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.error("Failed:", errorInfo);
    };

    return (
        <div className={styles.loginPageWrapper}>
            <div className={styles.appTitle}>
                Find My Note
            </div>
            <Form
                name="login-form"
                initialValues={{ remember: false }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                className={styles.loginForm}
            >
                <Item
                    name="email"
                    rules={[{ required: true, message: "Please input your email!" }]}
                    className={styles.loginFormItem}
                >
                    <Input className={styles.loginFormInput} />
                </Item>

                <Item
                    name="password"
                    rules={[{ required: true, message: "Please input your password!" }]}
                    className={styles.loginFormItem}
                >
                    <Input type="password" className={styles.loginFormInput} />
                </Item>

                <Item className={styles.loginFormItem}>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={false} // todo: set loading state
                        className={styles.loginFormButton}
                    >
                        Submit
                    </Button>
                </Item>
            </Form>
        </div>
    )
}
