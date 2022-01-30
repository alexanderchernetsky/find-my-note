import React, {useEffect, useState} from 'react';
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import {getUser} from "./helpers/authentication";
import {HomePage} from "./pages/Home";
import {LoginPage} from "./pages/Login";
import {NotFound} from "./pages/NotFound";
import {Paths} from "./constants/routes";

import 'antd/dist/antd.css';

export const AuthContext = React.createContext({});

function App() {
    const [authState, setAuthState] = useState({user: null});

    const {user} = authState;

    useEffect(() => {
        const user = getUser();
        if (user) {
            setAuthState({user: user.user})
        }
    }, []);

    return (
        <AuthContext.Provider value={{authState, setAuthState}}>
            <BrowserRouter>
                <Routes>
                    <Route path="*" element={<NotFound />} />
                    <Route path="/" element={<Navigate replace to={Paths.HOME_PAGE_PATH} />} />
                    {/* Public route: */}
                    <Route path={Paths.LOGIN_PATH} element={!user ? <LoginPage /> : <Navigate replace to={Paths.HOME_PAGE_PATH} />}/>
                    {/* Private route: */}
                    <Route path={Paths.HOME_PAGE_PATH} element={user ? <HomePage /> : <Navigate replace to={Paths.LOGIN_PATH} />}/>
                </Routes>
            </BrowserRouter>
        </AuthContext.Provider>
  );
}

export default App;
