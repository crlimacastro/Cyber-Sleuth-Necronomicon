//#region String manipulations
// Turns first letter of every word in string to uppercase
// https://stackoverflow.com/questions/4878756/how-to-capitalize-first-letter-of-each-word-like-a-2-word-city
function toTitleCase(str) {
    return str.replace(/\w\S*/g, txt => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

// Turns first letter of every word in string to uppercase and joins them
// https://stackoverflow.com/questions/2970525/converting-any-string-into-camel-case
function toUpperCamelCase(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
      return word.toUpperCase();
    }).replace(/\s+/g, '');
  }

function removeSpaces(str) {
    return str.replace(/\s/g, '');
}
//#endregion

//#region OBJ's and JSON's
// Returns the first value in an object
function getFirstValue(obj) {
    let firstKey = Object.keys(obj)[0];
    let firstValue = obj[firstKey];
    return firstValue;
}

// Returns the json object fetched from a URL
async function getJson(url) {
    // Get as text
    let json = fetch(url)
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


export { toTitleCase, toUpperCamelCase, removeSpaces, getFirstValue, getJson };