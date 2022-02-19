import HASHTAG_REGEXP from "../constants/regexp";

export const getTags = (text) => {
    return [...text.matchAll(HASHTAG_REGEXP)].map(item => item[2]);
}
