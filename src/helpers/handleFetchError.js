import {message} from 'antd';

import {NOT_AUTHORIZED_HTTP_RESPONSE_CODE} from '../constants/httpResponseCodes';
import axiosInstance from '../services/axios';
import {removeUserSession} from './authentication';
import {Paths} from '../constants/routes';

const handleFetchError = ({setAuthState, navigate, error, errorMessage}) => {
    if (error?.response?.status === NOT_AUTHORIZED_HTTP_RESPONSE_CODE) {
        axiosInstance
            .get('/logout')
            .then(() => {
                removeUserSession();
                setAuthState({user: null});
                navigate(Paths.LOGIN_PATH);
            })
            .catch(error => {
                message.error('Logout failed!');
                console.error(error);
            });
    } else {
        // show BE validation message or fallback generic error message
        message.error(error.response?.data?.message || errorMessage);
        console.error(error);
    }
};

export default handleFetchError;
