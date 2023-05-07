import {useState} from 'react';
import {Card, message, Tooltip} from 'antd';
import {EditOutlined, DeleteOutlined, InfoCircleOutlined} from '@ant-design/icons';
import parse from 'html-react-parser';
import moment from 'moment';

import ConfirmationModal from '../ConfirmationModal';
import NoteModal from '../NoteModal';
import HASHTAG_REGEXP from '../../constants/regexp';
import axiosInstance from '../../services/axios';
import {homePageActionTypes} from '../../pages/Home/reducer';
import getCanBeParsedAsJson from '../../helpers/getCanBeParsedAsJson';
import convertEditorNoteToReactElements from '../../helpers/convertEditorNoteToReactElements';

import './styles.css';
import styles from './styles.module.scss';

const {Meta} = Card;

const Note = ({note, hashtags, dispatch, fetchTags}) => {
    const {note_id, heading, text, date_created, last_updated, user_id} = note;

    const [isDeleteModalVisible, setDeleteModalVisibility] = useState(false);
    const [isEditNoteModalVisible, setEditNoteModalVisible] = useState(false);

    const isMadeInTextEditor = getCanBeParsedAsJson(text);

    // highlight hashtags
    const contentWithHighlight = text.replaceAll(HASHTAG_REGEXP, "$1<span class='hash-tag'>$2</span>"); // replaceAll doesn't mutate the text
    // The parser converts an HTML string to one or more React elements.
    const reactElements = parse(contentWithHighlight);

    let parsedEditorContent = null;
    if (isMadeInTextEditor) {
        parsedEditorContent = convertEditorNoteToReactElements(text);
    }

    const onDeleteBtnClick = () => {
        setDeleteModalVisibility(true);
    };

    const deleteModal = note_id => {
        axiosInstance
            .delete(`/note/${note_id}?user_id=${user_id}`)
            .then(() => {
                dispatch({
                    type: homePageActionTypes.REMOVE_NOTE,
                    payload: note_id
                });

                fetchTags(); // some tags may not be used anymore, so we need to refresh tags

                message.success('You successfully deleted a note!');
            })
            .catch(error => {
                message.error('You failed to delete a note!');
                console.error(error);
            });
    };

    const onEditBtnClick = () => {
        setEditNoteModalVisible(true);
    };

    const infoTooltipContent = () => (
        <div>
            <div>Created: {moment(date_created).format('MMMM Do YYYY')}</div>
            <div>Last updated: {moment(last_updated).format('MMMM Do YYYY')}</div>
        </div>
    );

    return (
        <>
            <Card
                style={{width: '100%'}}
                actions={[
                    <Tooltip placement="top" title={infoTooltipContent}>
                        <InfoCircleOutlined key="info" />
                    </Tooltip>,
                    <EditOutlined key="edit" onClick={onEditBtnClick} />,
                    <DeleteOutlined key="delete" onClick={onDeleteBtnClick} />
                ]}
                className={styles.card}
            >
                <Meta title={heading} description={isMadeInTextEditor ? parsedEditorContent : reactElements} />
            </Card>

            {isDeleteModalVisible && (
                <ConfirmationModal
                    text={`Do you want to delete note "${heading}"?`}
                    onCancel={() => setDeleteModalVisibility(false)}
                    onOk={() => deleteModal(note_id)}
                />
            )}

            {isEditNoteModalVisible && (
                <NoteModal onCloseHandler={() => setEditNoteModalVisible(false)} note={note} hashtags={hashtags} dispatch={dispatch} fetchTags={fetchTags} />
            )}
        </>
    );
};

export default Note;
