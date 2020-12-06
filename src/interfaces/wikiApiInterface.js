import * as utils from "../utils.js";

const baseUrl = "https://people.rit.edu/crl3554/330/project3/src/php/mediawiki-proxy.php";

let apiData;

// Alternative names a digimon might have
let alternativeNames;
// Possible abbreviations in digimon name
let abbreviations;
// Possible parentheses for digimon names
// And what to evaluate them to
let nameParentheses;
// Possible prefixes for digimon names
let namePrefixes;

async function initInterfaceAsync() {
    let apiData = await utils.getJsonAsync("./src/json/wikiApiData.json");
    alternativeNames = apiData.alternativeNames;
    abbreviations = apiData.abbreviations;
    nameParentheses = apiData.nameParentheses;
    namePrefixes = apiData.namePrefixes
}

// Returns image for digimon
async function getImageURL(name) {
    if (!name) return;

    let cleanedName = cleanName(name);

    let url = baseUrl + `?action=image&name=${encodeURI(cleanedName)}`;

    // Perform searches as necessary
    // 1st search
    // Fast search trying to get the file directly
    // To improve search speed
    let imageURL = await getImageURLShortCallChain(cleanedName);
    // Not found?
    if (!imageURL) {
        // 2st search
        //Try get the image with the real name of the article
        imageURL = await getImageURLCallChain(url);
    }
    // Not found?
    if (!imageURL) {
        // 3nd search
        // Try the search again with name lowercased
        url = baseUrl + `?action=image&name=${encodeURI(cleanedName.toLowerCase())}`;
        imageURL = await getImageURLCallChain(url);
    }

    return imageURL;
}

// Returns abstract and url for digimon
async function getWikiData(name) {
    if (!name) return;

    let cleanedName = cleanName(name);
    let formattedName = getNameFormattedForWikidata(cleanedName);

    let url = baseUrl + `?action=abstract&name=${encodeURI(formattedName)}`;

    let wikiApiData = await getWikiDataCallChain(url);

    return wikiApiData;
}

//#region Private Helper Functions
// Returns the url of a file named
async function getFileURL(fileName) {
    if (!fileName) return null;

    let url = baseUrl + `?action=file&name=${encodeURI(fileName)}`;

    let fileURL = utils.getJsonAsync(url)
        .then(json => {
            return getFirstPage(json);
        }).then(firstPage => {
            if (firstPage && firstPage.imageinfo) {
                return firstPage.imageinfo[0].url;
            }
            else return null;
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
        let mainImage = articleData.images.find(img => img.title.includes(" b.jpg"));
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
    let imageURL = await utils.getJsonAsync(url)
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

// Performs shorter async function chain to try
// to image url without having to find the article
async function getImageURLShortCallChain(name) {
    let formattedFilename = `File:${name} b.jpg`;

    let imageURL = await getFileURL(formattedFilename);

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

// Performs async function chain to get wiki data and returns it
async function getWikiDataCallChain(url) {
    let abstract = "";
    let digimonArticleURL = "";

    let abstractJson = await utils.getJsonAsync(url);
    if (abstractJson) {
        let firstItem = utils.getFirstValue(abstractJson.items);

        if (firstItem) {
            abstract = cleanAbstract(firstItem.abstract);
            digimonArticleURL = abstractJson.basepath + firstItem.url;
        }
    }

    return {
        abstract: abstract,
        url: digimonArticleURL
    };
}

// Cleans name to search to correct format
function cleanName(name) {
    let cleanName = name.toLowerCase();

    // Check if Digimon has alternative name
    if (alternativeNames) {
        for (let key in alternativeNames) {
            let value = alternativeNames[key];

            // Name has alternative
            if (cleanName == key) {
                cleanName = value;

                // Return early
                return cleanName;
            }
        }
    }


    // Check if Digimon name has abbreviations
    // Expand out abbreviations
    if (abbreviations) {
        for (let key in abbreviations) {
            let value = ` ${abbreviations[key]}`;
            key = ` ${key}`;

            if (cleanName.includes(key)) {
                cleanName = cleanName.replace(key, value);
                cleanName = utils.toTitleCase(cleanName);
            }
        }
    }

    // Check if Digimon name contains parentheses
    if (nameParentheses) {
        for (let key in nameParentheses) {
            let value = nameParentheses[key];

            // Name contains parenthesis
            if (cleanName.includes(key)) {
                // Put parenthesis value at the beginning and remove it from the end
                cleanName = `${value}${cleanName.replace(key, '')}`;
            }
        }
    }

    // Check if Digimon name contains prefixes
    if (namePrefixes) {
        // Index of prefix
        let i = 0;
        // Index of next possible prefix
        let nextPossibleI;
        // Index of the following prefix/word
        let nextI;

        for (let prefix of namePrefixes) {
            let lowercased = cleanName.toLowerCase();

            // Name contains prefix
            if (lowercased.includes(prefix)) {
                i = lowercased.indexOf(prefix);
                nextI = i + prefix.length;

                // Capitalize all prefixes found
                if (i == 0 || i == nextPossibleI) {
                    nextPossibleI = i + prefix.length;

                    // Capitalize the prefix
                    cleanName = utils.capitalizeIndex(cleanName, i);

                    // Make sure not to go outside of string bounds
                    if (nextI < cleanName.length) {
                        // Capitalize the following prefix/word
                        cleanName = utils.capitalizeIndex(cleanName, nextI);
                    }
                }
            }
        }
    }

    cleanName = utils.capitalizeFirstLetterOfWords(cleanName);

    return cleanName;
}

function getNameFormattedForWikidata(name) {
    return name.replace(/ /gm, '_');
}

// Cleans image url to one that
// img element can display
function cleanImageURL(url) {
    return url.substring(0, url.indexOf(".jpg") + 4);
}

function cleanAbstract(abstractStr) {
    let cleanAbstract = abstractStr;

    // Remove "Gallery" from the beginning
    cleanAbstract = cleanAbstract.replace("Gallery", "") + "...";
    // Remove superscript numbers
    cleanAbstract = cleanAbstract.replace(/(?![a-zA-Z]|\.)(\d+|\?)/gm, "");

    return cleanAbstract
}
//#endregion

export { initInterfaceAsync, getImageURL, getWikiData };