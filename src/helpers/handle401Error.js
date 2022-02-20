import {message} from "antd";

import axiosInstance from "../services/axios";
import {removeUserSession} from "./authentication";
import {Paths} from "../constants/routes";

const handle401Error = ({error, setAuthState, navigate}) => {
    if (error?.response?.status === 401) {
        axiosInstance.get('/logout')
            .then(() => {
                message.success('Logged out successfully!');
                removeUserSession();
                setAuthState({user: null});
                navigate(Paths.LOGIN_PATH);
            })
            .catch((error) => {
                message.error('Logout failed!');
                console.error(error);
            });
    }
}

export default handle401Error;
