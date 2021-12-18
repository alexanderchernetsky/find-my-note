import React from 'react';
import { Tag } from 'antd';

const TagComponent = ({title, onClick}) => {
    return <Tag color="cyan" onClick={onClick}>#{title}</Tag>
}

export default TagComponent;
