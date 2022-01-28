import React, {useState} from 'react';
import {Button, Form, Input, message} from "antd";
import {CloseOutlined} from "@ant-design/icons";

import Tag from "../Tag";
import HASHTAG_REGEXP from "../../constants/regexp";
import axiosInstance from "../../services/axios";

import styles from './styles.module.scss';


const { Item } = Form;
const {TextArea} = Input;

const NoteModal = ({onCloseHandler, hashtags, note, notes, setNotes}) => {
    const [isSubmitInProgress, setSubmitProgress] = useState(false);
    const [selectedTags, setSelectedTags] = useState([]);

    const isEditMode = !!note;

    const onFinish = (values) => {
        const {note_header, note_content} = values;

        if (note_header && note_content) {
            const tags = [...note_content.matchAll(HASHTAG_REGEXP)].map(item => item[2]);

            setSubmitProgress(true);

            if (isEditMode) {
                // todo: remove hardcoded user_id
                // update an existing note
                axiosInstance.patch(`/note/${note.note_id}`, {
                    user_id: 1,
                    heading: note_header,
                    text: note_content,
                    tags
                })
                    .then((response) => {
                        const newNotes = notes.map(item => {
                            if (item.note_id === note.note_id) {
                                return {
                                    ...item,
                                    ...response.data.values
                                }
                            }
                            return item;
                        })
                        setNotes(newNotes);
                        message.success('You successfully updated a note!');
                    })
                    .catch((error) => {
                        message.error('You failed to update a note!');
                        console.error(error);
                    })
                    .finally(() => {
                        setSubmitProgress(false);
                        onCloseHandler();
                    })
            } else {
                // create a new note
                // todo: remove hardcoded user_id
                axiosInstance.post('/note', {
                    user_id: 1,
                    heading: note_header,
                    text: note_content,
                    tags
                })
                    .then((response) => {
                        setNotes([response.data.note, ...notes]);
                        message.success('You successfully created a new note!');
                    })
                    .catch((error) => {
                        message.error('You failed to create a new note!');
                        console.error(error);
                    })
                    .finally(() => {
                        setSubmitProgress(false);
                        onCloseHandler();
                    })
            }
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.error("Failed:", errorInfo);
    };

    const onCloseClick = () => {
        onCloseHandler();
    }

    const onTagClick = (tagTitle) => {
        let newSelectedTags;
        if (selectedTags.includes(tagTitle)) {
            newSelectedTags = selectedTags.filter(item => item !== tagTitle);
            setSelectedTags(newSelectedTags);
        } else {
            newSelectedTags = [...selectedTags, tagTitle];
            setSelectedTags(newSelectedTags);
        }
    }

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
                    initialValues={{ remember: false, note_header: note?.heading, note_content: note?.text }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    className={styles.noteForm}
                >
                    <Item
                        name="note_header"
                        rules={[{ required: true, message: "Please input header!" }]}
                        className={styles.noteFormItem}
                        label="Note heading"
                        labelAlign="left"
                    >
                        <Input className={styles.noteHeaderInput} />
                    </Item>

                    <Item
                        name="note_content"
                        rules={[{ required: true, message: "Please input content!" }]}
                        className={styles.noteFormItem}
                        label="Note content"
                        labelAlign="left"
                    >
                        <TextArea type="text" size="large" placeholder="Input your note and add tags" />
                    </Item>


                    {hashtags && (
                        <div className={styles.tagsWrapper}>
                            {hashtags.map((tag, index) => <Tag key={index} title={tag} onClick={onTagClick} isSelected={selectedTags.includes(tag)} /> )}
                        </div>
                    )}


                    <Item className={styles.noteFormItem}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={isSubmitInProgress}
                            className={styles.noteFormSubmitButton}
                            size="large"
                        >
                            Submit
                        </Button>
                    </Item>
                </Form>
            </div>
        </React.Fragment>

    )
}

export default NoteModal;
