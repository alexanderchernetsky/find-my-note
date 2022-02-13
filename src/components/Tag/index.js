import React from 'react';
import { Tag, Tooltip } from 'antd';

import styles from './styles.module.scss';

const TagComponent = ({title, onClick, tooltipTitle}) => {
    return (
        <Tooltip placement="top" title={tooltipTitle}>
            <Tag color="cyan" onClick={() => onClick(title)} className={styles.tag}>{title}</Tag>
        </Tooltip>
    );
}

export default TagComponent;
