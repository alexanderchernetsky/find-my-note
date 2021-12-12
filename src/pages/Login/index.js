import {useContext} from "react";
import {Button} from "antd";
import { useNavigate } from "react-router-dom";

import {setUserSession} from "../../helpers/authentication";
import {Paths} from "../../constants/routes";
import {AppContext} from "../../App";


export const LoginPage = () => {
    const navigate = useNavigate();
    const {setAppState} = useContext(AppContext);

    const onLoginBtnClick = () => {
        setUserSession('test_token', {name: 'test_user'});
        setAppState({token: 'test_token', name: 'test_user'})
        navigate(Paths.HOME_PAGE_PATH);
    }

    return <div><Button onClick={onLoginBtnClick}>Login</Button><div>Login Page</div></div>
}
