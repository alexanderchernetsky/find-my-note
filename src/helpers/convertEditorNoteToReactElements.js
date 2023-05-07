import draftToHtml from 'draftjs-to-html';
import parse from 'html-react-parser';

function convertEditorNoteToReactElements(raw) {
    // 1. parse raw JSON - JSON.parse(raw)
    const parsedJson = JSON.parse(raw);
    // 2. use draftToHtml library to get HTML string
    const html = draftToHtml(parsedJson, {
        trigger: '#',
        separator: ' '
    });
    // 3. use parse from html-react-parser library to convert html string to react elements
    return parse(html);
}

export default convertEditorNoteToReactElements;
