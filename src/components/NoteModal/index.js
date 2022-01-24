import React, {useState} from 'react';
import {Button, Form, Input, message} from "antd";
import axios from "axios";

import styles from './styles.module.scss';
import {CloseOutlined} from "@ant-design/icons";
import Tag from "../Tag";
import HASHTAG_REGEXP from "../../constants/regexp";

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
                // TODO: trigger a request to update a note in DB
            } else {
                // create a new note
                // todo: remove hardcoded user_id
                axios.post('http://localhost:3001/note', {
                    user_id: 1,
                    heading: note_header,
                    text: note_content,
                    tags
                })
                    .then((response) => {
                        onCloseHandler();
                        setNotes([response.data.note, ...notes]);
                        message.success('You successfully created a new note!');
                    })
                    .catch((error) => {
                        message.error('You failed to create a new note!');
                        console.error(error);
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
                            {hashtags.map(tag => <Tag key={tag.id} title={tag.title} onClick={onTagClick} isSelected={selectedTags.includes(tag.title)} /> )}
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
