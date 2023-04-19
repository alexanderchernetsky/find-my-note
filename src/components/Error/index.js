import React from 'react';
import {Alert} from 'antd';

import styles from './styles.module.scss';

const Error = ({isError, children}) => {
    return (
        <React.Fragment>
            {isError ? (
                <div className={styles.errorWrapper}>
                    <Alert message="Error happended when fetching data." type="error" />
                </div>
            ) : (
                children
            )}
        </React.Fragment>
    );
};

export default Error;
