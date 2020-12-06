//#region String manipulations
// Turns first letter of every word in string to uppercase
// https://stackoverflow.com/questions/4878756/how-to-capitalize-first-letter-of-each-word-like-a-2-word-city
function toTitleCase(str) {
    return str.replace(/\w\S*/g, txt => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

// Similar to toTitleCase(str) but
// it doesn't change the rest of the word to lowercase
function capitalizeFirstLetterOfWords(str) {
    return str.replace(/\w\S*/g, txt => {
        return txt.charAt(0).toUpperCase() + txt.substr(1);
    });
}

// Turns first letter of every word in string to uppercase and joins them
// https://stackoverflow.com/questions/2970525/converting-any-string-into-camel-case
function toUpperCamelCase(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
        return word.toUpperCase();
    }).replace(/\s+/g, '');
}

// Removes all spaces in the string
function removeSpaces(str) {
    return str.replace(/\s/g, '');
}

// Capitalizes the letter at index
function capitalizeIndex(str, i) {
    // Str before the index
    let before = str.substring(0, i);
    // Str after the index
    let after = str.substring(i + 1);

    // Uppercase the index
    return before + str[i].toUpperCase() + after;
}
//#endregion

//#region OBJ's and JSON's
// Returns the first value in an object
function getFirstValue(obj) {
    let firstKey = Object.keys(obj)[0];
    let firstValue = obj[firstKey];
    return firstValue;
}

function getJson(url, callback) {
    fetch(url, { redirect: 'follow' })
        // Get as text
        .then(response => {
            if (!response.ok)
                throw Error(response.statusText);
            return response.text();
        })
        // Try to process text to json
        .then(text => {
            try {
                let json = JSON.parse(text);
                return json;
            } catch (e) {
                return null;
            }
        })
        .then(json => {
            callback(json);
        });
}

// Returns the json object fetched from a URL
async function getJsonAsync(url) {
    let json = fetch(url, { redirect: 'follow' })
        // Get as text
        .then(response => {
            if (!response.ok)
                throw Error(response.statusText);
            return response.text();
        })
        // Try to process text to json
        .then(text => {
            try {
                let json = JSON.parse(text);
                return json;
            } catch (e) {
                return null;
            }
        });

    return json;
}
//#endregion


export { toTitleCase, capitalizeFirstLetterOfWords, toUpperCamelCase, removeSpaces, capitalizeIndex, getFirstValue, getJson, getJsonAsync };