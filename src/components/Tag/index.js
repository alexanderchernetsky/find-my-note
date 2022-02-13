import React from 'react';
import { Tag, Tooltip } from 'antd';

import styles from './styles.module.scss';

const TagComponent = ({title, onClick, withTooltip}) => {
    const tag = (
        <Tag color="cyan" onClick={() => onClick(title)} className={styles.tag}>{title}</Tag>
    )

    if (withTooltip) {
        return (
            <Tooltip placement="top" title={'Click to copy'} zIndex={9999}>
                {tag}
            </Tooltip>
        )
    }

    return tag;
}

export default TagComponent;
