import {useContext} from "react";
import {Button} from "antd";
import {useNavigate} from "react-router-dom";

import {removeUserSession} from "../../helpers/authentication";
import {Paths} from "../../constants/routes";
import {AppContext} from "../../App";

export const HomePage = () => {
    const navigate = useNavigate();
    const {setAppState} = useContext(AppContext);

    const onLogoutBtnClick = () => {
        removeUserSession();
        setAppState({token: null, name: null});
        navigate(Paths.LOGIN_PATH);
    }

    return <div><Button onClick={onLogoutBtnClick}>Log out</Button><div>Home Page</div></div>
}
