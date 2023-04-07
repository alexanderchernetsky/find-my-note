import {getTags} from './getTags';

describe('getTags', () => {
    it('should return an empty array when no hashtags in the text', () => {
        const mockText = 'Hello World!';

        expect(getTags(mockText)).toEqual([]);
    });

    it('should return an array with a tag when the text contains one hashtag', () => {
        const mockText = 'Hello World! #test';

        expect(getTags(mockText)).toEqual(['#test']);
    });

    it('should return an array with tags when the text contains multiple hashtags', () => {
        const mockText = 'Hello World! #first #second';

        expect(getTags(mockText)).toEqual(['#first', '#second']);
    });

    it("should recognize a tag when it's in the beginning of the line", () => {
        const mockText = "'#test";

        expect(getTags(mockText)).toEqual(['#test']);
    });
});
