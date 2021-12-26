import {useState} from "react";
import { Card, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined, InfoCircleOutlined } from '@ant-design/icons';
import parse from 'html-react-parser';

import ConfirmationModal from "../ConfirmationModal";
import NoteModal from "../NoteModal";

import './styles.css';
import styles from './styles.module.scss';

const { Meta } = Card;

const Note = ({note}) => {
    const {id, title, content, created, lastModified} = note;

    const [isModalVisible, setModalVisibility] = useState(false);
    const [isEditNoteModalVisible, setEditNoteModalVisible] = useState(false);

    const regex = /(^|\s)(#[a-z\d-]+)/g;

    const contentWithHighlight = content.replaceAll(regex, "$1<span class='hash-tag'>$2</span>")

    const parsedContent = parse(contentWithHighlight);

    const onDeleteBtnClick = () => {
        setModalVisibility(true);
    }

    const deleteModal = id => {
        // todo: call API to delete note from DB

        setModalVisibility(false);
    }

    const onEditBtnClick = () => {
        setEditNoteModalVisible(true);
    }

    const infoTooltipContent = `Created: ${created}. Last updated: ${lastModified}.`

    return (
        <>
            <Card
                style={{ width: '100%' }}
                actions={[
                    <Tooltip placement="top" title={infoTooltipContent}><InfoCircleOutlined key="info" /></Tooltip>,
                    <EditOutlined key="edit" onClick={onEditBtnClick} />,
                    <DeleteOutlined key="delete" onClick={onDeleteBtnClick} />,
                ]}
                className={styles.card}
            >
                <Meta
                    title={title}
                    description={parsedContent}
                />
            </Card>

            {isModalVisible && (
                <ConfirmationModal text={`Do you want to delete note "${title}"?`} onCancel={() => setModalVisibility(false)} onOk={() => deleteModal(id)} />
            )}

            {isEditNoteModalVisible && <NoteModal onCloseHandler={() => setEditNoteModalVisible(false)} note={note} />}
        </>

    )
}

export default Note;
