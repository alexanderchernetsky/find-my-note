import React from 'react';
import { Tag } from 'antd';

import styles from './styles.module.scss';

const TagComponent = ({title, onClick, isSelected}) => {
    return <Tag color="cyan" onClick={() => onClick(title)} className={isSelected ? styles.selectedTag : styles.tag}>#{title}</Tag>
}

export default TagComponent;
