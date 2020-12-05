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


export { getFirstValue, getJson };