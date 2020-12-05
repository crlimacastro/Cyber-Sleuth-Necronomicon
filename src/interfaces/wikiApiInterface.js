import * as utils from "../utils.js";

const baseUrl = "https://people.rit.edu/crl3554/330/project3/src/php/mediawiki-proxy.php";

// Returns image for digimon
async function getImageURL(name) {
    let url = baseUrl + `?action=image&name=${encodeURI(name)}`;

    let imageURL = getJson(url)
        // Find the article's main image
        .then(json => {
            if (!json) return null;

            // Get the correct title of the article
            let title = name;

            if (json.query.normalized)
                title = json.query.normalized[0].to;

            // Get the images from the first page found
            let firstPage = getFirstPage(json);
            let images = firstPage.images;

            // Return the image desired (the main image of the article)
            if (images) {
                let mainImage = images.find(img => img.title == `File:${title} b.jpg`);
                if (mainImage) return mainImage.title;
            }

            // Return null if nothing found
            return null;
        })
        .then(imageFileName => {
            if (imageFileName) return getFileURL(imageFileName);
            else return null;
        })
        .then(imageURL => {
            if (imageURL) return cleanImgURL(imageURL);
            else return null;
        });

    return imageURL;
}

// Returns abstract for digimon
async function getAbstract(name) {
    let url = baseUrl + `?action=abstract&name=${encodeURI(name)}`;

    // let abstract = getJson(url);
    // return abstract;
    return fetch(url)
        .then(response => {
            if (!response.ok)
                throw Error(response.statusText);


            return response.json();
        });
}

// Private helper function to get the json object
// returned from a URL
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

// Private helper function that returns
// the url of a file named
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
    let firstPage = utils.getFirstValue(pages);
    return firstPage;
}

// Private helper function that cleans image url to
// one that img element can display
function cleanImgURL(url) {
    return url.substring(0, url.indexOf(".jpg") + 4);
}

export { getImageURL, getAbstract };