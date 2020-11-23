const baseUrl = "https://people.rit.edu/crl3554/330/project3/src/php/mediawiki-proxy.php";

// Returns image for digimon
async function getImageURL(name) {
    let url = baseUrl + `?action=image&name=${encodeURI(name)}`;

    return fetch(url)
        // Find images in digimon's article
        .then(response => {
            if (!response.ok)
                throw Error(response.statusText);

            return response.text();
        })
        // Process text to json
        .then(text => {
            try {
                let json = JSON.parse(text);
                return json;
            } catch (e) {
                return null;
            }
        })
        // Find the article's main image
        .then(json => {
            if (!json) return null;

            // Get the correct title of the article
            let title = name;
            if (json.query.normalized)
                title = json.query.normalized[0].to;

            // Return the image desired (the main image of the article)
            let firstPage = getFirstPage(json);
            let images = firstPage.images;

            if (images) return images.find(img => img.title == `File:${title} b.jpg`).title;
            else return null;
        })
        .then(imageFileName => {
            if (imageFileName) return getFileURL(imageFileName);
            else return null;
        });
}

// Returns abstract for digimon
async function getAbstract(name) {
    let url = baseUrl + `?action=abstract&name=${encodeURI(name)}`;

    return fetch(url)
        .then(response => {
            if (!response.ok)
                throw Error(response.statusText);


            return response.json();
        });
}

// Private function that returns 
async function getFileURL(fileName) {
    let url = baseUrl + `?action=file&name=${encodeURI(fileName)}`;

    return fetch(url)
        .then(response => {
            if (!response.ok)
                throw Error(response.statusText);

            return response.json();
        })
        .then(json => {
            let firstPage = getFirstPage(json);
            return firstPage.imageinfo[0].thumburl;
        });
}

// Private helper function
// Returns the first page in a query results object
function getFirstPage(json) {
    let pages = json.query.pages;
    let firstElement = Object.keys(pages)[0];
    let firstPage = pages[firstElement];
    return firstPage;
}

export { getImageURL, getAbstract };