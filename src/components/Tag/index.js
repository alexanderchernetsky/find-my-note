import React from 'react';
import { Tag, Tooltip } from 'antd';
import clsx from 'classnames';

import getUrlSearchParams from "../../helpers/getUrlParams";

import styles from './styles.module.scss';

const TagComponent = ({title, onClick, tooltipTitle, isHomePage = false}) => {
    const urlSearchParams = getUrlSearchParams();

    const isSelected = (`#${urlSearchParams.tag}` === title) && isHomePage;

    return (
        <Tooltip placement="top" title={tooltipTitle}>
            <Tag onClick={() => onClick(title)} className={clsx(styles.tag, isSelected && styles.selectedTag)}>{title}</Tag>
        </Tooltip>
    );
}

export default TagComponent;
