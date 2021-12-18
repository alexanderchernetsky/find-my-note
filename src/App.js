import React, {useEffect, useState} from 'react';
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import {getToken} from "./helpers/authentication";
import {HomePage} from "./pages/Home";
import {LoginPage} from "./pages/Login";
import {NotFound} from "./pages/NotFound";
import {Paths} from "./constants/routes";

export const AuthContext = React.createContext({});

function App() {
    const [authState, setAuthState] = useState({token: null, user: null});

    const {token} = authState;

    useEffect(() => {
        const token = getToken();
        if (token) {
            // TODO: replace with token and user from storage
            setAuthState({token: 'test_token', user: 'test_user'})
        }
    }, []);

    return (
        <AuthContext.Provider value={{authState, setAuthState}}>
            <BrowserRouter>
                <Routes>
                    <Route path="*" element={<NotFound />} />
                    <Route path="/" element={<Navigate replace to={Paths.HOME_PAGE_PATH} />} />
                    {/* Public route: */}
                    <Route path={Paths.LOGIN_PATH} element={!token ? <LoginPage /> : <Navigate replace to={Paths.HOME_PAGE_PATH} />}/>
                    {/* Private route: */}
                    <Route path={Paths.HOME_PAGE_PATH} element={token ? <HomePage /> : <Navigate replace to={Paths.LOGIN_PATH} />}/>
                </Routes>
            </BrowserRouter>
        </AuthContext.Provider>
  );
}

export default App;
