import { Card } from 'antd';
import { EditOutlined, DeleteOutlined, InfoCircleOutlined } from '@ant-design/icons';
import parse from 'html-react-parser';

import './styles.css';
import styles from './styles.module.scss';

const { Meta } = Card;

const Note = ({title, content, created, lastModified}) => {

    const regex = /(^|\s)(#[a-z\d-]+)/g;

    const contentWithHighlight = content.replaceAll(regex, "$1<span class='hash-tag'>$2</span>")

    const parsedContent = parse(contentWithHighlight);

    return (
        <Card
            style={{ width: '100%' }}
            actions={[
                <InfoCircleOutlined key="info" />,
                <EditOutlined key="edit" />,
                <DeleteOutlined key="delete" />,
            ]}
            className={styles.card}
        >
            <Meta
                title={title}
                description={parsedContent}
            />
        </Card>
    )
}

export default Note;
