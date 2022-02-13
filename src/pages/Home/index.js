import {useContext, useEffect, useState} from "react";
import {Button, Input, message, Avatar, Menu, Dropdown, Spin, Space} from "antd";
import {useNavigate} from "react-router-dom";
import { PlusOutlined, UserOutlined, DownOutlined } from '@ant-design/icons';

import {removeUserSession} from "../../helpers/authentication";
import {Paths} from "../../constants/routes";
import {AuthContext} from "../../App";
import Tag from "../../components/Tag";
import NoteModal from "../../components/NoteModal";
import Note from "../../components/Note";
import axiosInstance from "../../services/axios";

import styles from './styles.module.scss';

const { Search } = Input;

const handle401Error = ({error, setAuthState, navigate}) => {
    if (error?.response?.status === 401) {
        axiosInstance.get('/logout')
            .then(() => {
                message.success('Logged out successfully!');
                removeUserSession();
                setAuthState({user: null});
                navigate(Paths.LOGIN_PATH);
            })
            .catch((error) => {
                message.error('Logout failed!');
                console.error(error);
            });
    }
}

const useFetchNotes = () => {
    const [notes, setNotes] = useState([]);
    const [loadingNotes, setLoadingNotes] = useState(false);
    const navigate = useNavigate();
    const {setAuthState} = useContext(AuthContext);

    // todo: add user id
    useEffect(() => {
        setLoadingNotes(true);
        axiosInstance.get('/notes')
            .then((response) => {
                setNotes(response.data.notes);
            })
            .catch((error) => {
                message.error('Error. Failed to fetch notes!');
                console.error(error);
                handle401Error({error, setAuthState, navigate});
            })
            .finally(() => {
                setLoadingNotes(false);
            });
    }, [navigate, setAuthState]);

    return [notes, setNotes, loadingNotes];
}

const useFetchTags = () => {
    const [tags, setTags] = useState([]);

    // todo: add user id
    useEffect(() => {
        axiosInstance.get('/tags')
            .then((response) => {
                setTags(response.data);
            })
            .catch((error) => {
                message.error('Error. Failed to fetch tags!');
                console.error(error);
            });
    }, []);

    return tags;
}

export const HomePage = () => {
    const navigate = useNavigate();
    const {authState, setAuthState} = useContext(AuthContext);

    const user = authState.user;

    const [isNewNoteModalOpen, setIsNewNoteModalVisibility] = useState(false);

    const [notes, setNotes, loadingNotes] = useFetchNotes(user.id);

    const tags = useFetchTags(user.id);

    const onLogoutBtnClick = () => {
        axiosInstance.get('/logout')
            .then((response) => {
                message.success('Logged out successfully!');
                removeUserSession();
                setAuthState({user: null});
                navigate(Paths.LOGIN_PATH);
            })
            .catch((error) => {
                message.error('Logout failed!');
                console.error(error);
            });
    }

    const onSearch = text => {
        // todo: sync search with the url
        axiosInstance.get(`/notes?search=${text}`)
            .then((response) => {
                setNotes(response.data);
            })
            .catch((error) => {
                message.error('Failed to search!');
                console.error(error);
            });
    }

    const onTagClick = (title) => {
        const titleWithoutHashtagSymbol = title.replace("#", "");
        // todo: sync search with the url
        axiosInstance.get(`/notes?tag=${titleWithoutHashtagSymbol}`)
            .then((response) => {
                setNotes(response.data);
            })
            .catch((error) => {
                message.error('Failed to search!');
                console.error(error);
            });
    }

    const onAddNewNoteBtnClick = () => {
        setIsNewNoteModalVisibility(true);
    }

    const menu = (
        <Menu>
            <Menu.Item className={styles.logOut}>
                <span onClick={onLogoutBtnClick}>Log out</span>
            </Menu.Item>
        </Menu>
    );


    return (
        <div className={styles.mainPageWrapper}>
            <div className={styles.userAvatarWrapper}>
                <Avatar shape="square" size={32} icon={<UserOutlined />} />
                <Dropdown overlay={menu}>
                    <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                        <span className={styles.userName}>{user?.user_name}</span>
                        <DownOutlined />
                    </a>
                </Dropdown>
            </div>
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
                        tags.map((tag, index) => <Tag key={index} title={tag} onClick={onTagClick}/> )
                    )}
                </div>

                <div className={styles.notesWrapper}>
                    {loadingNotes ? (
                        <Space size="large" align={'center'}>
                            <Spin size="large" />
                        </Space>
                    ) : (
                        <>
                            {notes && (
                                notes.map(note => <Note key={note.note_id} note={note} hashtags={tags} notes={notes} setNotes={setNotes} />)
                            )}
                        </>
                    )}
                </div>
            </div>

            {isNewNoteModalOpen && <NoteModal onCloseHandler={() => setIsNewNoteModalVisibility(false)} hashtags={tags} notes={notes} setNotes={setNotes} />}
        </div>
    )
}
