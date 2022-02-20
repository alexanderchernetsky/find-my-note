import {useCallback, useContext, useEffect, useReducer} from "react";
import {Button, Input, message, Avatar, Menu, Dropdown, Spin, Space, Empty, Pagination} from "antd";
import {useNavigate, useSearchParams} from "react-router-dom"; // no history in react-router-dom v6
import {PlusOutlined, DownOutlined, UndoOutlined} from '@ant-design/icons';

import {removeUserSession} from "../../helpers/authentication";
import {Paths} from "../../constants/routes";
import {AuthContext} from "../../App";
import Tag from "../../components/Tag";
import NoteModal from "../../components/NoteModal";
import Note from "../../components/Note";
import axiosInstance from "../../services/axios";
import getUrlSearchParams from "../../helpers/getUrlParams";
import createSearchString from "../../helpers/createSearchString";
import handle401Error from "../../helpers/handle401Error";

import styles from './styles.module.scss';

const { Search } = Input;

const NOTES_PER_PAGE = 5;

export const initialState = {
    notes: [],
    notesCount: 0,
    totalPages: 1,
    loadingNotes: false,
    tags: [],
    isNewNoteModalOpen: false
}

export const homePageActionTypes = {
    SET_NOTES_LOADING: 'SET_NOTES_LOADING',
    SET_NOTES: 'SET_NOTES',
    REMOVE_NOTE: 'REMOVE_NOTE',
    UPDATE_EXISTING_NOTE: 'UPDATE_EXISTING_NOTE',
    ADD_NEW_NOTE: 'ADD_NEW_NOTE',
    SET_TAGS: 'SET_TAGS',
    SET_SORT_ORDER: 'SET_SORT_ORDER',
    SET_NOTE_MODAL_VISIBILITY: 'SET_NOTE_MODAL_VISIBILITY'
}

export const homePageReducer = (state, action) => {
    switch (action.type) {
        case homePageActionTypes.SET_NOTES_LOADING:
            return {...state, loadingNotes: action.payload};
        case homePageActionTypes.SET_NOTES:
            return {
                ...state,
                notes: action.payload.notes,
                notesCount: action.payload.totalNotes,
                totalPages: action.payload.totalPages
            };
        case homePageActionTypes.SET_TAGS:
            return {
                ...state,
                tags: action.payload
            };
        case homePageActionTypes.SET_SORT_ORDER:
            return {
                ...state,
                tags: action.payload
            };
        case homePageActionTypes.SET_NOTE_MODAL_VISIBILITY:
            return {
                ...state,
                isNewNoteModalOpen: action.payload
            };

        case homePageActionTypes.REMOVE_NOTE: {
            const newNotes = state.notes.filter(item => item.note_id !== action.payload);
            return {
                ...state,
                notes: newNotes,
                notesCount: state.notesCount - 1,
            };
        }

        case homePageActionTypes.UPDATE_EXISTING_NOTE: {
            const newNotes = state.notes.map(item => {
                if (item.note_id === action.payload.note_id) {
                    return {
                        ...item,
                        ...action.payload
                    }
                }
                return item;
            });

            return {
                ...state,
                notes: newNotes
            }
        }

        case homePageActionTypes.ADD_NEW_NOTE: {
            return {
                ...state,
                notes: [action.payload, ...state.notes],
                notesCount: state.notesCount + 1,
            }
        }


        default: {
            console.error("Unexpected action type in homePageReducer!")
            return state;
        }
    }
}

export const HomePage = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const {authState, setAuthState} = useContext(AuthContext);
    const user = authState.user;

    const [state, dispatch] = useReducer(homePageReducer, initialState);

    const {notes, notesCount, totalPages, loadingNotes, tags, isNewNoteModalOpen} = state;

    useEffect(() => {
        axiosInstance.get(`/tags?user_id=${user?.id}`)
            .then((response) => {
                dispatch({
                    type: homePageActionTypes.SET_TAGS,
                    payload: response.data
                });
            })
            .catch((error) => {
                message.error('Error. Failed to fetch tags!');
                console.error(error);
            });
    }, [user?.id]);

    useEffect(() => {
        const urlParams = getUrlSearchParams();

        const searchString = createSearchString({
            user_id: user?.id,
            ...urlParams,
            limit: NOTES_PER_PAGE
        });

        dispatch({
            type: homePageActionTypes.SET_NOTES_LOADING,
            payload: true
        });

        axiosInstance.get(`/notes${searchString}`)
            .then((response) => {
                dispatch({
                    type: homePageActionTypes.SET_NOTES,
                    payload: {
                        notes: response.data.notes,
                        totalNotes: response.data.totalNotes,
                        totalPages: response.data.totalPages
                    }
                });
            })
            .catch((error) => {
                message.error('Error. Failed to fetch notes!');
                console.error(error);
                handle401Error({error, setAuthState, navigate});
            })
            .finally(() => {
                dispatch({
                    type: homePageActionTypes.SET_NOTES_LOADING,
                    payload: false
                });
            });
    }, [navigate, setAuthState, user?.id, searchParams]);

    const onLogoutBtnClick = () => {
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

    const onSearch = text => {
        const oldUrlParams = getUrlSearchParams();
        if (oldUrlParams.tag) {
            delete oldUrlParams.tag;
        }
        if (text.length) {
            setSearchParams({...oldUrlParams, search: text, page: 1});
        } else {
            delete oldUrlParams.search;
            setSearchParams({...oldUrlParams, page: 1});
        }
    }

    const onTagClick = (title) => {
        const titleWithoutHashtagSymbol = title.replace("#", "");
        const oldUrlParams = getUrlSearchParams();
        if (oldUrlParams.search) {
            delete oldUrlParams.search;
        }
        setSearchParams({...oldUrlParams, tag: titleWithoutHashtagSymbol, page: 1});
    }

    const onSortingClick = (event) => {
        const oldUrlParams = getUrlSearchParams();
        const sortOrder = event.key === 'latest' ? 'desc' : 'asc';
        setSearchParams({...oldUrlParams, sortBy: 'date', sortOrder: sortOrder, page: 1});
    }

    const onAddNewNoteBtnClick = () => {
        dispatch({
            type: homePageActionTypes.SET_NOTE_MODAL_VISIBILITY,
            payload: true
        })
    }

    const onPaginationChange = (page) => {
        const oldUrlParams = getUrlSearchParams();
        setSearchParams({...oldUrlParams, page});
    }

    const noteModalOnCloseHandler = useCallback(() => {
        dispatch({
            type: homePageActionTypes.SET_NOTE_MODAL_VISIBILITY,
            payload: false
        })
    }, [dispatch]);

    const onResetBtnClick = () => {
        setSearchParams({});
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
    );

    const urlSearchParams = getUrlSearchParams();
    const currentPage = parseInt(urlSearchParams.page) || 1;
    const sortOrder = (!urlSearchParams.sortOrder || urlSearchParams.sortOrder === 'desc') ? 'latest' : 'oldest';

    const isResetBtnHidden = Object.keys(urlSearchParams).length === 0 || (Object.keys(urlSearchParams).length === 1 && parseInt(urlSearchParams.page) === 1);

    return (
        <div className={styles.mainPageWrapper}>
            <header className={styles.header}>
                <div className={styles.headerMenu}>
                    <div className={styles.appTitle}>
                        #FindMyNote
                    </div>

                    <div>
                        <span className={styles.userName}>{user?.user_name}</span>
                        <Dropdown overlay={menu}>
                            <Avatar
                                className={styles.avatar}
                                size={40}
                                style={{
                                    backgroundImage: 'linear-gradient(332.32deg,#ff5b8c .01%,#edbc0d 83.78%)',
                                    verticalAlign: 'middle',
                                }}
                            >
                                {user.user_name?.charAt(0)}
                            </Avatar>
                        </Dropdown>
                    </div>
                </div>
            </header>

            <div className={styles.contentWrapper}>
                <div className={styles.searchWrapper}>
                    <Search
                        placeholder="input search text"
                        allowClear
                        enterButton="Search"
                        size="large"
                        onSearch={onSearch}
                        defaultValue={urlSearchParams.search || ''}
                    />
                    <Button type="primary" size="large" icon={<PlusOutlined />} className={styles.addNewNoteButton} onClick={onAddNewNoteBtnClick}>
                        New note
                    </Button>
                    {!isResetBtnHidden && (
                            <Button type="primary" size="large" icon={<UndoOutlined />} className={styles.addNewNoteButton} onClick={onResetBtnClick}>
                                Reset
                            </Button>
                        )
                    }
                </div>

                <div className={styles.tagsWrapper}>
                    {tags && (
                        tags.map((tag, index) => <Tag key={index} title={tag} onClick={onTagClick} tooltipTitle='Click to search' isHomePage /> )
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
                                    Found: {notesCount} notes. Page {currentPage} from {totalPages}. Sort by:
                                    <Dropdown overlay={sortingMenu} className={styles.sorting}>
                                        <span className="ant-dropdown-link">
                                            <span className={styles.sortOrderName}>{sortOrder}</span>
                                            <DownOutlined />
                                        </span>
                                    </Dropdown>
                                </div>
                            )}

                            {notes && (
                                notes.map(note => <Note key={note.note_id} note={note} hashtags={tags} dispatch={dispatch} />)
                            )}

                            {notesCount !== 0 && totalPages > 1 && (
                                <Pagination defaultCurrent={1} current={currentPage} total={notesCount} pageSize={NOTES_PER_PAGE} onChange={onPaginationChange} />
                            )}
                        </>
                    )}
                </div>
            </div>

            {isNewNoteModalOpen && <NoteModal onCloseHandler={noteModalOnCloseHandler} hashtags={tags} dispatch={dispatch} />}
        </div>
    )
}
