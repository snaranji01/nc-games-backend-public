

describe('createRef', () => {
    test('Test 1: returns an empty object, when passed an empty array', () => {
      const input = [];
      const actual = createRef(input);
      const expected = {};
      expect(actual).toEqual(expected);
    });
})