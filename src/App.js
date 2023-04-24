import React, {useState} from 'react';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';

import {getToken, getUser, removeUserSession} from './helpers/authentication';
import {HomePage} from './pages/Home';
import {LoginPage} from './pages/Auth/Login';
import {RegisterPage} from './pages/Auth/Regsiter';
import {NotFound} from './pages/NotFound';
import {Paths} from './constants/routes';
import {setUpAuthHeader} from './services/axios';

import 'antd/dist/antd.css';

export const AuthContext = React.createContext({});

function App() {
    const [authState, setAuthState] = useState({user: getUser()?.user});

    const {user} = authState;
    const token = getToken();
    if (token) {
        setUpAuthHeader({tokenType: 'Bearer', accessToken: token});
    }

    return (
        <AuthContext.Provider value={{authState, setAuthState}}>
            <BrowserRouter>
                <Routes>
                    <Route path="*" element={<NotFound />} />
                    <Route path="/" element={<Navigate replace to={Paths.HOME_PAGE_PATH} />} />
                    {/* Private route: */}
                    <Route path={Paths.HOME_PAGE_PATH} element={user ? <HomePage /> : <Navigate replace to={Paths.LOGIN_PATH} />} />
                    {/* Public routes: */}
                    <Route path={Paths.LOGIN_PATH} element={!user ? <LoginPage /> : <Navigate replace to={Paths.HOME_PAGE_PATH} />} />
                    <Route path={Paths.REGISTER_PAGE_PATH} element={!user ? <RegisterPage /> : <Navigate replace to={Paths.HOME_PAGE_PATH} />} />
                </Routes>
            </BrowserRouter>
        </AuthContext.Provider>
    );
}

export default App;
