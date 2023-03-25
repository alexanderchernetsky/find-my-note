export default function createSearchString(queryParams) {
    let searchString = '?';

    const params = Object.keys(queryParams).map(key => {
        return `${key}=${queryParams[key]}`;
    });

    searchString += params.join('&');

    return searchString;
}
