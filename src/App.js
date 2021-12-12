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

export const AppContext = React.createContext({});

function App() {
    const [appState, setAppState] = useState({token: null, user: null});

    const {token} = appState;

    useEffect(() => {
        const token = getToken();
        if (token) {
            setAppState({token: 'test_token', user: 'test_user'})
        }
    }, []);

    return (
        <AppContext.Provider value={{appState, setAppState}}>
            <BrowserRouter>
                <Routes>
                    <Route path="*" element={<NotFound />} />
                    <Route path="/" element={<Navigate replace to={Paths.HOME_PAGE_PATH} />} />
                    <Route path={Paths.HOME_PAGE_PATH} element={token ? <HomePage /> : <Navigate replace to={Paths.LOGIN_PATH} />}/>
                    <Route path={Paths.LOGIN_PATH} element={!token ? <LoginPage /> : <Navigate replace to={Paths.HOME_PAGE_PATH} />}/>
                </Routes>
            </BrowserRouter>
        </AppContext.Provider>
  );
}

export default App;
