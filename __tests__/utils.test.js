const { createRef } = require("../db/seeds/utils.js");


describe('createRef', () => {
    test('Test 1: returns an empty object, when passed an empty array', () => {
      const input = [];
      const actual = createRef(input);
      const expected = {};
      expect(actual).toEqual(expected);
    });
    test('Test 2: When passed an array with a single object element, returns a reference object with key-value pairs specified by refObjKey and refObjValue inputs', () => {
        const inputArray = [{name: "Steven", age: 32, height: 180, }]
        const [key1Input, key2Input] = ["name", "age"];
        const expectedOutput = {"Steven": 32};
        expect(createRef(inputArray, key1Input, key2Input)).toEqual(expectedOutput)
      });
})