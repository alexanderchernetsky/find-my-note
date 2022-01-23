import React, {useState} from 'react';
import {Button, Form, Input} from "antd";

import styles from './styles.module.scss';
import {CloseOutlined} from "@ant-design/icons";
import Tag from "../Tag";

const { Item } = Form;
const {TextArea} = Input;

const NoteModal = ({onCloseHandler, hashtags, note}) => {
    const [isSubmitInProgress, setSubmitProgress] = useState(false);
    const [selectedTags, setSelectedTags] = useState([]);

    const isEditMode = !!note;

    const onFinish = (values) => {
        const {note_header, note_content} = values;

        if (note_header && note_content) {
            console.log(values);
            setSubmitProgress(true);
            // TODO: trigger a request to create OR update a note in DB
            if (isEditMode) {

            } else {

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
