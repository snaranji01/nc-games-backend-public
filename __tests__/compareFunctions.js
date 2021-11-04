// compare functions for use with jest-sorted
exports.descendingCompareFunc = (a, b) => {
    return b - a
}
exports.ascendingCompareFunc = (a, b) => {
    return a - b
}