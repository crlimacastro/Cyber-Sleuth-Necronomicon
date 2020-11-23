import * as digiApiInterface from "./digiApiInterface.js";
import * as wikiApiInterface from "./wikiApiInterface.js";
import * as classes from "./classes.js";

let Digimon = classes.Digimon;
let DigimonPreview = classes.DigimonPreview;
let Skill = classes.Skill;

let app;

function init() {
    initVue();
}

function initVue() {
    app = new Vue({
        el: '#app',
        data: {
            appStates: {
                searching: 0,
                search: 1,
                list: 2,
            },
            appState: 0,
            searchTerm: "",
            searchResult: null,
            listResult: [],
            currentPage: 1,
            totalListResults: 0,
            listAmount: 5,
            listAmountOptions: [
                { value: 5, text: "5" },
                { value: 10, text: "10" },
                { value: 25, text: "20" }
            ],
            listOffset: 0,
            searching: false
        },
        created() {
            this.list();
        },
        methods: {
            async search(name) {
                // Exit early if nothing was typed
                if (!name.trim()) return;

                // Clean the search term
                let cleanName = name.toLowerCase();

                // Clear list
                this.listResult = [];

                // Clear previous search (if any)
                this.searchResult = null;

                // Start search
                this.appState = this.appStates.searching;

                // Get Digimon Cyber Sleuth API info
                let digiInfo = await digiApiInterface.search(cleanName).then(json => { return json; });

                // If digimon found
                if (digiInfo) {
                    digiInfo.name = toTitleCase(digiInfo.name);

                    // Transform skill field from an id to a Skill object
                    let skillObj = await digiApiInterface.getSkill(digiInfo.skill).then(skill => { return skill; });
                    digiInfo.skill = new Skill(skillObj.name, skillObj.description, skillObj._id);
                    digiInfo.skill.name = toTitleCase(digiInfo.skill.name);

                    // Transform digivolution/degeneration arrays into arrays of digimon
                    let digimonPreviews = [];
                    if (digiInfo.digivolvesTo) {
                        for (const digimonName of digiInfo.digivolvesTo) {
                            let image = await wikiApiInterface.getImageURL(digimonName).then(url => { return url; });
                            if (image) {
                                image = getHttpsToHttp(image);
                                digimonPreviews.push(new DigimonPreview(digimonName, image));
                            }
                        }
                    }

                    digiInfo.digivolvesTo = digimonPreviews;

                    digimonPreviews = [];
                    if (digiInfo.degeneratesTo) {
                        for (const digimonName of digiInfo.degeneratesTo) {
                            let image = await wikiApiInterface.getImageURL(digimonName).then(url => { return url; });
                            if (image) {
                                image = getHttpsToHttp(image);
                                digimonPreviews.push(new DigimonPreview(digimonName, image));
                            }
                        }
                    }
                    digiInfo.degeneratesTo = digimonPreviews;

                    // Get MediaWiki API info
                    let image = await wikiApiInterface.getImageURL(cleanName).then(url => { return url; });
                    let abstractObj = await wikiApiInterface.getAbstract(cleanName).then(json => { return json; });
                    let firstItem = getFirstItem(abstractObj);

                    let abstract = firstItem.abstract;
                    let cleanAbstract = abstract.replace("Gallery", "") + "...";
                    let url = abstractObj.basepath + firstItem.url;

                    let wikiInfo = {
                        image: getHttpsToHttp(image),
                        abstract: cleanAbstract,
                        url: url
                    };

                    let digimon = new Digimon(digiInfo, wikiInfo);

                    this.searchResult = digimon;
                }

                // End search
                this.appState = this.appStates.search;
            },
            list() {
                this.listOffset = 0;
                this.getList(this.listAmount, this.listOffset);
            },
            async getList(amount, offset) {
                // Clear search
                this.searchResult = null;

                // Clear previous list
                this.listResult = [];

                // Start search
                this.appState = this.appStates.searching;

                // Get all list results
                let listObj = await digiApiInterface.list(amount, offset).then(arr => { return arr; });
                let digimons = listObj.arr;
                this.totalListResults = listObj.total;

                // Turn all results into a digimon preview
                let digimonPreviews = [];
                for (const digimon of digimons) {
                    let image = await wikiApiInterface.getImageURL(digimon.name).then(url => { return url; });
                    if (image) {
                        image = getHttpsToHttp(image);
                        digimonPreviews.push(new DigimonPreview(digimon.name, image));
                    }
                }

                this.listResult = digimonPreviews;

                // End search
                this.appState = this.appStates.list;
            },
            reduceOffset() {
                if (this.listOffset == 0) return;

                if (this.listOffset - this.listAmount < 0)
                    this.listOffset = 0;
                else
                    this.listOffset -= this.listAmount;

                this.getList(this.listAmount, this.listOffset);
            },
            increaseOffset() {
                if (this.listOffset == this.totalListResults - this.listAmount) return;

                if (this.listOffset + this.listAmount > this.totalListResults)
                    this.listOffset = this.totalListResults - this.listAmount;
                else
                    this.listOffset += this.listAmount;

                this.getList(this.listAmount, this.listOffset);
            }
        },
        computed: {
            listPaging: function() {
                return {
                    currentPage: parseInt((this.listOffset / this.listAmount)) + 1,
                    totalPages: parseInt(this.totalListResults / this.listAmount)
                };
            }
        }
    });
}

// Private helper function
// Returns the first item in an abstract object
function getFirstItem(json) {
    let items = json.items;
    let firstElement = Object.keys(items)[0];
    let firstItem = items[firstElement];
    return firstItem;
}

// Helper function. Turns first letter of every word in string to uppercase
// https://stackoverflow.com/questions/4878756/how-to-capitalize-first-letter-of-each-word-like-a-2-word-city
function toTitleCase(str) {
    return str.replace(/\w\S*/g, txt => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

// Temporary helper method to turn safe urls to unsafe ones
// Ask prof. how to deal with safe images not loading
function getHttpsToHttp(url) {
    return url.replace("https", "http");
}

export { init, app };