import {useContext, useState} from "react";
import {Button, Input} from "antd";
import {useNavigate} from "react-router-dom";
import { PlusOutlined } from '@ant-design/icons';

import {removeUserSession} from "../../helpers/authentication";
import {Paths} from "../../constants/routes";
import {AuthContext} from "../../App";
import Tag from "../../components/Tag";
import NoteModal from "../../components/NoteModal";
import Note from "../../components/Note";

import styles from './styles.module.scss';

const { Search } = Input;

export const HomePage = () => {
    const navigate = useNavigate();
    const {setAuthState} = useContext(AuthContext);

    const [isNewNoteModalOpen, setIsNewNoteModalVisibility] = useState(false);

    const onLogoutBtnClick = () => {
        removeUserSession();
        setAuthState({token: null, name: null});
        navigate(Paths.LOGIN_PATH);
    }

    const onSearch = text => {
        console.log("text", text);
        // todo: trigger API request
    }

    const tags = [
        {id: 1, title: 'totepool'},
        {id: 2, title: 'racing-post'},
        {id: 3, title: 'cmdb'},
    ];

    const onTagClick = () => {
        // todo: trigger API call to search by clicked tag
    }

    const onAddNewNoteBtnClick = () => {
        setIsNewNoteModalVisibility(true);
    }

    const notes = [
        {
            id: 1,
            title: 'Test heading',
            content: 'Hello! This is a test note #test',
            created: '25.12.2021',
            lastModified: '26.12.2021',
        },
        {
            id: 2,
            title: 'Another note heading',
            content: 'This is another test note #test #test2',
            created: '25.12.2021',
            lastModified: '26.12.2021',
        },
        {
            id: 3,
            title: 'Test heading 3',
            content: 'Hello! This is a test note #test4',
            created: '25.12.2021',
            lastModified: '26.12.2021',
        },
        {
            id: 4,
            title: 'Test heading 4',
            content: 'Hello! This is a test note #test4',
            created: '25.12.2021',
            lastModified: '26.12.2021',
        },
        {
            id: 5,
            title: 'Test heading 5',
            content: 'Hello! This is a test note #test5',
            created: '25.12.2021',
            lastModified: '26.12.2021',
        }
    ];

    return (
        <div className={styles.mainPageWrapper}>
            <Button onClick={onLogoutBtnClick} className={styles.logOutButton}>
                Log out
            </Button>
            <div className={styles.appTitle}>
                Find My Note
            </div>
            <div className={styles.contentWrapper}>
                <div className={styles.searchWrapper}>
                    <Search
                        placeholder="input search text"
                        allowClear
                        enterButton="Search"
                        size="large"
                        onSearch={onSearch}
                    />
                    <Button type="primary" size="large" icon={<PlusOutlined />} className={styles.addNewNoteButton} onClick={onAddNewNoteBtnClick}>
                        Add new note
                    </Button>
                </div>

                <div className={styles.tagsWrapper}>
                    {tags && (
                        tags.map(tag => <Tag key={tag.id} title={tag.title} onClick={onTagClick}/> )
                    )}
                </div>

                <div className={styles.notesWrapper}>
                    {notes && (
                        notes.map(note => <Note key={note.id} note={note} />)
                    )}
                </div>
            </div>

            {isNewNoteModalOpen && <NoteModal onCloseHandler={() => setIsNewNoteModalVisibility(false)} hashtags={tags} />}
        </div>
    )
}
