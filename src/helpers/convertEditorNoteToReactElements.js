import draftToHtml from 'draftjs-to-html';
import parse from 'html-react-parser';

function convertEditorNoteToReactElements(raw) {
    // 1. parse raw JSON;
    // 2. use draftToHtml to get HTML string
    // 3. use html-react-parser to convert html string to react elements
    return parse(
        draftToHtml(JSON.parse(raw), {
            trigger: '#',
            separator: ' '
        })
    );
}

export default convertEditorNoteToReactElements;
