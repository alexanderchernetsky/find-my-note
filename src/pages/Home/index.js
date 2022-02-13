import {useContext, useEffect, useState} from "react";
import {Button, Input, message, Avatar, Menu, Dropdown, Spin, Space, Empty} from "antd";
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

const useFetchNotes = (id) => {
    const [notes, setNotes] = useState([]);
    const [loadingNotes, setLoadingNotes] = useState(false);
    const [notesCount, setNotesCount] = useState(0);
    const navigate = useNavigate();
    const {setAuthState} = useContext(AuthContext);

    useEffect(() => {
        setLoadingNotes(true);
        axiosInstance.get(`/notes?user_id=${id}`)
            .then((response) => {
                setNotes(response.data.notes);
                setNotesCount(response.data.count);
            })
            .catch((error) => {
                message.error('Error. Failed to fetch notes!');
                console.error(error);
                handle401Error({error, setAuthState, navigate});
            })
            .finally(() => {
                setLoadingNotes(false);
            });
    }, [navigate, setAuthState, id]);

    return [notes, setNotes, loadingNotes, notesCount, setNotesCount];
}

const useFetchTags = (id) => {
    const [tags, setTags] = useState([]);

    useEffect(() => {
        axiosInstance.get(`/tags?user_id=${id}`)
            .then((response) => {
                setTags(response.data);
            })
            .catch((error) => {
                message.error('Error. Failed to fetch tags!');
                console.error(error);
            });
    }, [id]);

    return tags;
}

export const HomePage = () => {
    const navigate = useNavigate();
    const {authState, setAuthState} = useContext(AuthContext);

    const user = authState.user;

    const [isNewNoteModalOpen, setIsNewNoteModalVisibility] = useState(false);

    const [sortOrder, setSortOrder] = useState('latest')

    const [notes, setNotes, loadingNotes, notesCount, setNotesCount] = useFetchNotes(user.id);

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
        axiosInstance.get(`/notes?user_id=${user.id}&search=${text}`)
            .then((response) => {
                setNotes(response.data.notes);
                setNotesCount(response.data.count);
            })
            .catch((error) => {
                message.error('Failed to search!');
                console.error(error);
            });
    }

    const onTagClick = (title) => {
        const titleWithoutHashtagSymbol = title.replace("#", "");
        // todo: sync search with the url
        axiosInstance.get(`/notes?user_id=${user.id}&tag=${titleWithoutHashtagSymbol}`)
            .then((response) => {
                setNotes(response.data.notes);
                setNotesCount(response.data.count);
            })
            .catch((error) => {
                message.error('Failed to search!');
                console.error(error);
            });
    }

    const onSortingClick = (event) => {
        setSortOrder(event.key);
        const sortOrder = event.key === 'latest' ? 'desc' : 'asc';
        axiosInstance.get(`/notes?user_id=${user.id}&sortBy=date&sortOrder=${sortOrder}`)
            .then((response) => {
                setNotes(response.data.notes);
                setNotesCount(response.data.count);
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
            <Menu.Item key='Logout' className={styles.logOut} onClick={onLogoutBtnClick}>
                <span>Log out</span>
            </Menu.Item>
        </Menu>
    );

    const sortingMenu = (
        <Menu>
            <Menu.Item key='latest' className={styles.sortingMenuItem} onClick={onSortingClick}>
                <span>latest</span>
            </Menu.Item>
            <Menu.Item key='oldest' className={styles.sortingMenuItem} onClick={onSortingClick}>
                <span>oldest</span>
            </Menu.Item>
        </Menu>
    )


    return (
        <div className={styles.mainPageWrapper}>
            <div className={styles.userAvatarWrapper}>
                <Avatar shape="square" size={32} icon={<UserOutlined />} />
                <Dropdown overlay={menu}>
                    <span className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                        <span className={styles.userName}>{user?.user_name}</span>
                        <DownOutlined />
                    </span>
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
                            {notesCount === 0 ? (
                                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                            ) : (
                                <div className={styles.resultsCount}>
                                    Found {notesCount} notes. Sort by last updated date:
                                    <Dropdown overlay={sortingMenu} className={styles.sorting}>
                                        <span className="ant-dropdown-link">
                                            <span className={styles.userName}>{sortOrder}</span>
                                            <DownOutlined />
                                        </span>
                                    </Dropdown>
                                </div>
                            )}

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
