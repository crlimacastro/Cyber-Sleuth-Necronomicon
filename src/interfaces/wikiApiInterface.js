import * as utils from "../utils.js";

const baseUrl = "https://people.rit.edu/crl3554/330/project3/src/php/mediawiki-proxy.php";

// Returns image for digimon
async function getImageURL(name) {
    let url = baseUrl + `?action=image&name=${encodeURI(name)}`;

    // 1st search
    //Try get the image with the original name
    let imageURL = await getImageURLCallChain(url);

    // 2nd search
    // Try the search again with name lowercased
    if (!imageURL) {
        url = baseUrl + `?action=image&name=${encodeURI(name.toLowerCase())}`;
        imageURL = await getImageURLCallChain(url);
    }

    return imageURL;
}

// Returns abstract and url for digimon
async function getWikiData(name) {
    let dataURL = baseUrl + `?action=abstract&name=${encodeURI(name)}`;

    let abstractJson = await utils.getJson(dataURL);
    let firstItem = utils.getFirstValue(abstractJson.items);
    let abstract = "";
    let url = "";
    if (firstItem) {
        abstract = cleanAbstract(firstItem.abstract);
        url = abstractJson.basepath + firstItem.url;
    }

    return {
        abstract: abstract,
        url: url
    };
}

//#region Private Helper Functions
// Returns the url of a file named
async function getFileURL(fileName) {
    if (!fileName) return null;

    let url = baseUrl + `?action=file&name=${encodeURI(fileName)}`;

    let fileURL = utils.getJson(url)
        .then(json => {
            return getFirstPage(json);
        }).then(firstPage => {
            return firstPage.imageinfo[0].url;
        });

    return fileURL;
}

// Returns article information from a query results object
async function getArticleData(json) {
    if (!json) return null;

    // Get the first page found from search results
    let data = getFirstPage(json).then(firstPage => {
        // Get the correct title of the article
        let title = firstPage.title;
        // If title was normalized by API, get that one
        if (json.query.normalized)
            title = json.query.normalized[0].to;

        // Get the images from the page
        let images = firstPage.images;

        // Get the pageid from the page
        let pageid = firstPage.pageid;

        return {
            title: title,
            images: images,
            pageid: pageid
        };
    });

    return data;
}

// Returns main image's filename from article if found
async function getMainImageFilename(articleData) {
    if (articleData && articleData.images) {
        let mainImage = articleData.images.find(img => img.title == `File:${articleData.title} b.jpg`);
        if (mainImage) return mainImage.title;
    }

    // Return null if nothing found
    return null;
}

// Returns the first page in a query results object
async function getFirstPage(json) {
    if (!json) return null;

    let pages = json.query.pages;
    let firstPage = utils.getFirstValue(pages);
    return firstPage;
}

// Performs async function chain to get image url and returns it
async function getImageURLCallChain(url) {
    let imageURL = await utils.getJson(url)
        // Get important data from the search results
        .then(json => {
            return getArticleData(json);
        })
        // Find the article's main image
        .then(data => {
            return getMainImageFilename(data);
        })
        // Get the url to where it is stored
        .then(imageFileName => {
            return getFileURL(imageFileName);
        });

    // URL found
    if (imageURL) {
        // Clean the url so it can be displayed in img element
        return cleanImageURL(imageURL);
    }
    // URL not found
    else {
        return null;
    }
}

// Cleans image url to one that
// img element can display
function cleanImageURL(url) {
    return url.substring(0, url.indexOf(".jpg") + 4);
}

function cleanAbstract(abstractStr) {
    // Remove "Gallery" from the beginning
    abstractStr = abstractStr.replace("Gallery", "") + "...";
    // Remove superscript numbers
    // TODO
}
//#endregion


export { getImageURL, getWikiData };