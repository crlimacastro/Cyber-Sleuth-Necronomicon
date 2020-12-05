// Returns the first value in an object
function getFirstValue(obj) {
    let firstKey = Object.keys(obj)[0];
    let firstValue = obj[firstKey];
    return firstValue;
}

export { getFirstValue };