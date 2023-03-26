import React, {useContext, useState, useEffect} from 'react';
import {Button, Form, Input, message} from 'antd';
import {CloseOutlined} from '@ant-design/icons';

import Tag from '../Tag';
import axiosInstance from '../../services/axios';
import {AuthContext} from '../../App';
import {getTags} from '../../helpers/getTags';
import {homePageActionTypes} from '../../pages/Home/reducer';

import styles from './styles.module.scss';

const {Item} = Form;
const {TextArea} = Input;

const NoteModal = ({onCloseHandler, hashtags, note, dispatch, fetchTags}) => {
    const [isSubmitInProgress, setSubmitProgress] = useState(false);

    const {
        authState: {user}
    } = useContext(AuthContext);

    const isEditMode = !!note;

    const onFinish = values => {
        const {note_header, note_content} = values;

        const tags = getTags(note_content);

        if (note_header && note_content && tags.length) {
            setSubmitProgress(true);

            if (isEditMode) {
                // update an existing note
                axiosInstance
                    .patch(`/note/${note.note_id}`, {
                        user_id: user.id,
                        heading: note_header,
                        text: note_content,
                        tags
                    })
                    .then(response => {
                        dispatch({
                            type: homePageActionTypes.UPDATE_EXISTING_NOTE,
                            payload: {...response.data.values, note_id: note.note_id}
                        });
                        fetchTags();
                        message.success('You successfully updated a note!');
                        onCloseHandler();
                    })
                    .catch(error => {
                        message.error('You failed to update a note!');
                        console.error(error);
                    })
                    .finally(() => {
                        setSubmitProgress(false);
                    });
            } else {
                // create a new note
                axiosInstance
                    .post('/note', {
                        user_id: user.id,
                        heading: note_header,
                        text: note_content,
                        tags
                    })
                    .then(response => {
                        dispatch({
                            type: homePageActionTypes.ADD_NEW_NOTE,
                            payload: response.data
                        });
                        fetchTags();
                        message.success('You successfully created a new note!');
                        onCloseHandler();
                    })
                    .catch(error => {
                        message.error(`You failed to create a new note! ${error?.response?.data?.message}`);
                    })
                    .finally(() => {
                        setSubmitProgress(false);
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
                        rules={[{required: true, message: 'Please input heading!'}]}
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
                                    if (!value) {
                                        return Promise.reject(new Error('Please input content!'));
                                    }
                                    const tags = getTags(value);
                                    return tags.length ? Promise.resolve() : Promise.reject(new Error('Please add at least one hashtag!'));
                                }
                            }
                        ]}
                        className={styles.noteFormItem}
                        label="Note content"
                        labelAlign="left"
                    >
                        <TextArea type="text" size="large" placeholder="Input your note and add tags" />
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
