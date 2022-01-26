import {useState} from "react";
import axios from "axios";
import {Card, message, Tooltip} from 'antd';
import { EditOutlined, DeleteOutlined, InfoCircleOutlined } from '@ant-design/icons';
import parse from 'html-react-parser';

import ConfirmationModal from "../ConfirmationModal";
import NoteModal from "../NoteModal";
import HASHTAG_REGEXP from "../../constants/regexp";

import './styles.css';
import styles from './styles.module.scss';

const { Meta } = Card;

const Note = ({note, hashtags, notes, setNotes}) => {
    const {note_id, heading, text, date_created, last_updated} = note;

    const [isModalVisible, setModalVisibility] = useState(false);
    const [isEditNoteModalVisible, setEditNoteModalVisible] = useState(false);

    // highlight hashtags
    const contentWithHighlight = text.replaceAll(HASHTAG_REGEXP, "$1<span class='hash-tag'>$2</span>");
    const parsedContent = parse(contentWithHighlight);

    const onDeleteBtnClick = () => {
        setModalVisibility(true);
    }

    const deleteModal = note_id => {
        axios.delete(`http://localhost:3001/note/${note_id}`)
            .then((response) => {
                const newNotes = notes.filter(item => item.note_id !== note_id);
                setNotes(newNotes);
                message.success('You successfully deleted a note!');
            })
            .catch((error) => {
                message.error('You failed to delete a note!');
                console.error(error);
            })
            .finally(() => {
                setModalVisibility(false);
            })
    }

    const onEditBtnClick = () => {
        setEditNoteModalVisible(true);
    }

    // todo: transform dates to a readable format
    const infoTooltipContent = `Created: ${date_created}. Last updated: ${last_updated}.`

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
                    title={heading}
                    description={parsedContent}
                />
            </Card>

            {isModalVisible && (
                <ConfirmationModal text={`Do you want to delete note "${heading}"?`} onCancel={() => setModalVisibility(false)} onOk={() => deleteModal(note_id)} />
            )}

            {isEditNoteModalVisible && <NoteModal onCloseHandler={() => setEditNoteModalVisible(false)} note={note} hashtags={hashtags} notes={notes} setNotes={setNotes} />}
        </>

    )
}

export default Note;
