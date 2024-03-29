import {useContext, useState} from 'react';
import {Button, Form, Input, message} from 'antd';
import {useNavigate} from 'react-router-dom';

import {setUserSession} from '../../../helpers/authentication';
import {Paths} from '../../../constants/routes';
import {AuthContext} from '../../../App';
import axiosInstance, {setUpAuthHeader} from '../../../services/axios';

import styles from '../styles.module.scss';

const {Item} = Form;

export const LoginPage = () => {
    const navigate = useNavigate();
    const {setAuthState} = useContext(AuthContext);

    const [loading, setLoading] = useState(false);

    const onFinish = values => {
        const {email, password} = values;

        if (email && password) {
            setLoading(true);
            axiosInstance
                .post('/login', {email, password})
                .then(res => {
                    setLoading(false);
                    message.success('Logged in successfully!');
                    setUserSession({user: res.data.user}, res.data.token);
                    setUpAuthHeader({tokenType: 'Bearer', accessToken: res.data.token});
                    setAuthState({user: res.data.user});
                    navigate(Paths.HOME_PAGE_PATH);
                })
                .catch(error => {
                    setLoading(false);
                    const msg = error.response?.data?.message;
                    message.error(`Login failed. ${msg ? msg : ''}`);
                    console.error(error);
                });
        }
    };

    const onFinishFailed = errorInfo => {
        console.error('Failed:', errorInfo);
    };

    const onSignUpClick = () => {
        navigate(Paths.REGISTER_PAGE_PATH);
    };

    return (
        <div className={styles.loginPageWrapper}>
            <div className={styles.appTitle}>Find My Note</div>
            <Form name="login-form" initialValues={{remember: false}} onFinish={onFinish} onFinishFailed={onFinishFailed} className={styles.loginForm}>
                <Item name="email" rules={[{required: true, message: 'Please input your email!'}]} className={styles.loginFormItem}>
                    <Input className={styles.loginFormInput} placeholder="Email" />
                </Item>

                <Item name="password" rules={[{required: true, message: 'Please input your password!'}]} className={styles.loginFormItem}>
                    <Input type="password" className={styles.loginFormInput} placeholder="Password" />
                </Item>

                <Item className={styles.loginFormItem}>
                    <Button type="primary" htmlType="submit" loading={loading} className={styles.loginFormButton}>
                        Submit
                    </Button>
                </Item>

                <div className={styles.signUpWrapper}>
                    <div>Don&apos;t have an account yet?</div>
                    <div className={styles.signUpLink} onClick={onSignUpClick}>
                        Sign up!
                    </div>
                </div>
            </Form>
        </div>
    );
};
