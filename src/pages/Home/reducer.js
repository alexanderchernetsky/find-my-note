export const initialState = {
    notes: [],
    notesCount: 0,
    totalPages: 1,
    loadingNotes: false,
    isNotesFetchError: false,
    tags: [],
    loadingTags: false,
    isTagsFetchError: false,
    isNewNoteModalOpen: false
};

export const homePageActionTypes = {
    SET_NOTES_LOADING: 'SET_NOTES_LOADING',
    SET_NOTES: 'SET_NOTES',
    SET_NOTES_FETCH_ERROR: 'SET_NOTES_FETCH_ERROR',
    REMOVE_NOTE: 'REMOVE_NOTE',
    UPDATE_EXISTING_NOTE: 'UPDATE_EXISTING_NOTE',
    ADD_NEW_NOTE: 'ADD_NEW_NOTE',
    SET_TAGS_LOADING: 'SET_TAGS_LOADING',
    SET_TAGS: 'SET_TAGS',
    SET_TAGS_FETCH_ERROR: 'SET_TAGS_FETCH_ERROR',
    SET_SORT_ORDER: 'SET_SORT_ORDER',
    SET_NOTE_MODAL_VISIBILITY: 'SET_NOTE_MODAL_VISIBILITY'
};

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

        case homePageActionTypes.SET_NOTES_FETCH_ERROR:
            return {
                ...state,
                notes: [],
                notesCount: 0,
                totalPages: 1,
                loadingNotes: false,
                isNotesFetchError: action.payload
            };

        case homePageActionTypes.SET_TAGS_LOADING:
            return {...state, loadingTags: action.payload};

        case homePageActionTypes.SET_TAGS:
            return {
                ...state,
                tags: action.payload,
                loadingTags: false
            };

        case homePageActionTypes.SET_TAGS_FETCH_ERROR:
            return {
                ...state,
                tags: [],
                isTagsFetchError: action.payload,
                loadingTags: false
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
                notesCount: state.notesCount - 1
            };
        }

        case homePageActionTypes.UPDATE_EXISTING_NOTE: {
            const newNotes = state.notes.map(item => {
                if (item.note_id === action.payload.note_id) {
                    return {
                        ...item,
                        ...action.payload
                    };
                }
                return item;
            });

            return {
                ...state,
                notes: newNotes
            };
        }

        case homePageActionTypes.ADD_NEW_NOTE: {
            return {
                ...state,
                notes: [action.payload, ...state.notes],
                notesCount: state.notesCount + 1,
                totalPages: state.totalPages || 1
            };
        }

        default: {
            console.error('Unexpected action type in homePageReducer!');
            return state;
        }
    }
};
