import React, {useState} from 'react';
import {Button, Form, Input} from "antd";

import styles from './styles.module.scss';
import {CloseOutlined} from "@ant-design/icons";
import Tag from "../Tag";

const { Item } = Form;
const {TextArea} = Input;

const NoteModal = ({onCloseHandler, hashtags}) => {
    const [isSubmitInProgress, setSubmitProgress] = useState(false);
    const [selectedTags, setSelectedTags] = useState([]);

    const onFinish = (values) => {
        const {note_header, note_content} = values;

        const regex = /(^|\s)(#[a-z\d-]+)/g;
        const hashtags = [...note_content.matchAll(regex)].map(item => item[2]);

        console.log("hashtags", hashtags);

        if (note_header && note_content) {
            console.log(values);
            setSubmitProgress(true);
            // TODO: trigger a request to /note POST api route
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

    console.log("selectedTags", selectedTags);

    return (
        <React.Fragment>
            <div className={styles.pageCover} />

            <div className={styles.modalWrapper}>
                <div className={styles.modalTitle}>
                    Create new note
                    <Button type="secondary" size="small" icon={<CloseOutlined />} className={styles.closeButton} onClick={onCloseClick} />
                </div>
                <Form
                    name="note-form"
                    initialValues={{ remember: false }}
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
                        rules={[{ required: true, message: "Please input your note!" }]}
                        className={styles.noteFormItem}
                        label="Note content"
                        labelAlign="left"
                    >
                        <TextArea type="text" size="large" placeholder="Input your note and add tags" />
                    </Item>

                    {/* todo: add new tag functionality */}
                    <div className={styles.tagsWrapper}>
                        {hashtags && (
                            hashtags.map(tag => <Tag key={tag.id} title={tag.title} onClick={onTagClick} isSelected={selectedTags.includes(tag.title)} /> )
                        )}
                    </div>

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
