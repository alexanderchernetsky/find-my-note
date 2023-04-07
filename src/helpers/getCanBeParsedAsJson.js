function getCanBeParsedAsJson(text) {
    let canBeParsed;

    try {
        // if it's a correct JSON, then we assume it's made in wysiwyg editor
        JSON.parse(text);
        canBeParsed = true;
    } catch (error) {
        // if it's a plain text string (legacy format), then it won't be parsed as a JSON and will throw an error
        canBeParsed = false;
    }

    return canBeParsed;
}

export default getCanBeParsedAsJson;
