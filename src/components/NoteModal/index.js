import React, {useContext, useState, useEffect} from 'react';
import {Button, Form, Input, message} from 'antd';
import {CloseOutlined} from '@ant-design/icons';
import {Editor} from 'react-draft-wysiwyg';
import {EditorState, convertFromRaw} from 'draft-js';

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import Tag from '../Tag';
import axiosInstance from '../../services/axios';
import {AuthContext} from '../../App';
import {getTags} from '../../helpers/getTags';
import {homePageActionTypes} from '../../pages/Home/reducer';
import getCanBeParsedAsJson from '../../helpers/getCanBeParsedAsJson';

import styles from './styles.module.scss';

const {Item} = Form;

const NoteModal = ({onCloseHandler, hashtags, note, dispatch, fetchTags}) => {
    const isEditMode = Boolean(note);
    const noteContent = isEditMode ? note.text : null;
    const isNoteMadeInTextEditor = getCanBeParsedAsJson(noteContent) && typeof JSON.parse(noteContent) === 'object';

    const [isSubmitInProgress, setSubmitProgress] = useState(false);

    let initialEditorState = EditorState.createEmpty();
    if (isEditMode) {
        initialEditorState = isNoteMadeInTextEditor
            ? EditorState.createWithContent(convertFromRaw(JSON.parse(noteContent)))
            : EditorState.createWithText(noteContent);
    }

    const [editorState, setEditorState] = useState(initialEditorState);

    const onEditorStateChange = newState => {
        setEditorState(newState);
    };

    const {
        authState: {user}
    } = useContext(AuthContext);

    const onFinish = values => {
        const {note_header, note_content} = values;

        const notePlainTextContent = editorState.getCurrentContent().getPlainText();
        const tags = getTags(notePlainTextContent);

        if (note_header && note_content && tags.length) {
            setSubmitProgress(true);

            if (isEditMode) {
                // update an existing note
                axiosInstance
                    .patch(`/note/${note.note_id}`, {
                        user_id: user.id,
                        heading: note_header,
                        text: typeof note_content === 'object' ? JSON.stringify(note_content) : note_content,
                        tags
                    })
                    .then(response => {
                        dispatch({
                            type: homePageActionTypes.UPDATE_EXISTING_NOTE,
                            payload: {...response.data.values, note_id: note.note_id}
                        });
                        fetchTags();
                        setSubmitProgress(false);
                        message.success('You successfully updated a note!');
                        onCloseHandler();
                    })
                    .catch(error => {
                        setSubmitProgress(false);
                        message.error('You failed to update a note!');
                        console.error(error);
                    });
            } else {
                // create a new note
                axiosInstance
                    .post('/note', {
                        user_id: user.id,
                        heading: note_header,
                        text: JSON.stringify(note_content),
                        tags
                    })
                    .then(response => {
                        dispatch({
                            type: homePageActionTypes.ADD_NEW_NOTE,
                            payload: response.data
                        });
                        fetchTags();
                        setSubmitProgress(false);
                        message.success('You successfully created a new note!');
                        onCloseHandler();
                    })
                    .catch(error => {
                        setSubmitProgress(false);
                        message.error(`You failed to create a new note! ${error?.response?.data?.message}`);
                    });
            }
        }
    };

    const onFinishFailed = errorInfo => {
        console.error('Failed:', errorInfo);
    };

    const onCloseClick = () => {
        onCloseHandler();
    };

    const onTagClick = tagTitle => {
        // copy to the clipboard
        navigator.clipboard.writeText(tagTitle);
    };

    useEffect(() => {
        // Disable scroll when modal is opened
        const body = document.querySelector('body');
        body.style.overflow = 'hidden';

        return () => {
            body.style.overflow = 'auto';
        };
    }, []);

    return (
        <React.Fragment>
            <div className={styles.pageCover} />

            <div className={styles.modalWrapper}>
                <div className={styles.modalTitle}>
                    {isEditMode ? 'Edit note' : 'Create new note'}
                    <Button type="secondary" size="small" icon={<CloseOutlined />} className={styles.closeButton} onClick={onCloseClick} />
                </div>
                <Form
                    name="note-form"
                    initialValues={{remember: false, note_header: note?.heading, note_content: note?.text}}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    className={styles.noteForm}
                >
                    <Item
                        name="note_header"
                        rules={[{required: true, message: 'Please input heading.'}]}
                        className={styles.noteFormItem}
                        label="Note heading"
                        labelAlign="left"
                    >
                        <Input className={styles.noteHeaderInput} />
                    </Item>

                    <Item
                        name="note_content"
                        rules={[
                            {
                                validator: (_, value) => {
                                    const notePlainTextContent = editorState.getCurrentContent().getPlainText();
                                    if (!notePlainTextContent || !notePlainTextContent.length) {
                                        return Promise.reject(new Error('Please input content.'));
                                    }
                                    const tags = getTags(notePlainTextContent);
                                    return tags.length ? Promise.resolve() : Promise.reject(new Error('Please add at least one hashtag.'));
                                }
                            }
                        ]}
                        className={styles.noteFormItem}
                        label="Note content"
                        labelAlign="left"
                    >
                        <Editor
                            editorState={editorState}
                            editorClassName={styles.editorClassName}
                            onEditorStateChange={onEditorStateChange}
                            hashtag={{
                                separator: '',
                                trigger: '#'
                            }}
                        />
                    </Item>

                    {hashtags && (
                        <div className={styles.tagsWrapper}>
                            {hashtags.slice(0, 15).map((tag, index) => (
                                <Tag key={index} title={tag} onClick={onTagClick} tooltipTitle="Click to copy" />
                            ))}
                        </div>
                    )}

                    <Item className={styles.noteFormItem}>
                        <Button type="primary" htmlType="submit" loading={isSubmitInProgress} className={styles.noteFormSubmitButton} size="large">
                            Submit
                        </Button>
                    </Item>
                </Form>
            </div>
        </React.Fragment>
    );
};

export default NoteModal;
