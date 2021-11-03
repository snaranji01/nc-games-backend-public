const { createRef } = require("../db/utils.js");


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

    test('Test 3: When passed an array of multiple object elements, returns a reference object with key-value pairs specified by refObjKey and refObjValue inputs', () => {
        const inputArray = [{name: "Steven", age: 32, height: 180}, {name: "Nina", age: 34, height: 160}, {name: "Callum", age: 22, height: 190}, {name: "Karen", age: 47, height: 170}]
        const [key1Input, key2Input] = ["name", "height"];
        const expectedOutput = {"Steven": 180, "Nina": 160, "Callum": 190, "Karen": 170};
        expect(createRef(inputArray, key1Input, key2Input)).toEqual(expectedOutput)
      });
})