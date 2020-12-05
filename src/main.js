import * as digiApiInterface from "./interfaces/digiApiInterface.js";
import * as wikiApiInterface from "./interfaces/wikiApiInterface.js";
import * as classes from "./classes.js";
import * as utils from "./utils.js";

// Classes
const Digimon = classes.Digimon;
const DigimonPreview = classes.DigimonPreview;
const Skill = classes.Skill;

// Local storage
const localStoragePrefix = "crl3554-digimonCyberSleuthSite-";

const searchTermKey = localStoragePrefix + "searchTerm";
let storedSearchTerm;

const appStateKey = localStoragePrefix + "appState";
let storedAppState;

// Vue App
let vueApp;

function init() {
    initLocalStorage();
    initVue();
}

function initVue() {
    vueApp = new Vue({
        el: '#app',
        data: {
            // App State
            appStates: {
                searching: 0,
                search: 1,
                list: 2,
            },
            appState: storedAppState ? storedAppState : 0,
            // Searching
            searchTerm: storedSearchTerm ? storedSearchTerm : "",
            searchResult: null,
            // Listing
            listResult: [],
            totalListResults: 0,
            listAmount: 5,
            listAmountOptions: [
                { value: 5, text: "5" },
                { value: 10, text: "10" },
                { value: 25, text: "20" }
            ],
            listOffset: 0
        },
        created() {
            switch (this.appState) {
                case this.appStates.search:
                    this.search(this.searchTerm);
                    break;
                case this.appStates.list:
                    this.list();
                    break;
                default:
                    this.list();
                    break;
            }
        },
        methods: {
            async search(searchTerm) {
                // Exit early if nothing was typed
                if (!searchTerm.trim()) return;

                // Clean the search term
                let cleanSearchTerm = searchTerm.toLowerCase();

                // Save search term to local storage
                localStorage.setItem(searchTermKey, cleanSearchTerm);

                // Clear list
                this.listResult = [];

                // Clear previous search (if any)
                this.searchResult = null;

                // Start search
                this.appState = this.appStates.searching;

                // Get Digimon Cyber Sleuth API info
                let digiInfo = await digiApiInterface.search(cleanSearchTerm).then(json => { return json; });

                // If digimon found
                if (digiInfo) {
                    // Transform skill field from an id to a Skill object
                    let skillObj = await digiApiInterface.getSkill(digiInfo.skill).then(skill => { return skill; });
                    digiInfo.skill = new Skill(skillObj.name, skillObj.description, skillObj._id);

                    // Transform digivolution/degeneration arrays into arrays of digimon
                    let digimonPreviews = [];
                    if (digiInfo.digivolvesTo) {
                        for (const digimonName of digiInfo.digivolvesTo) {
                            let image = await wikiApiInterface.getImageURL(digimonName).then(url => { return url; });
                            digimonPreviews.push(new DigimonPreview(digimonName, image));
                        }
                    }

                    digiInfo.digivolvesTo = digimonPreviews;

                    digimonPreviews = [];
                    if (digiInfo.degeneratesTo) {
                        for (const digimonName of digiInfo.degeneratesTo) {
                            let image = await wikiApiInterface.getImageURL(digimonName).then(url => { return url; });
                            if (image) {
                                image = image;
                                digimonPreviews.push(new DigimonPreview(digimonName, image));
                            }
                        }
                    }
                    digiInfo.degeneratesTo = digimonPreviews;

                    // Get MediaWiki API info
                    let image = await wikiApiInterface.getImageURL(digiInfo.name).then(url => { return url; });
                    let abstractObj = await wikiApiInterface.getAbstract(digiInfo.name).then(json => { return json; });
                    let firstItem = getFirstItem(abstractObj);

                    let abstract = firstItem.abstract;
                    let cleanAbstract = abstract.replace("Gallery", "") + "...";
                    let url = abstractObj.basepath + firstItem.url;

                    let wikiInfo = {
                        image: image,
                        abstract: cleanAbstract,
                        url: url
                    };

                    let digimon = new Digimon(digiInfo, wikiInfo);

                    this.searchResult = digimon;
                }

                // End search
                this.appState = this.appStates.search;

                // Save app state to local storage
                localStorage.setItem(appStateKey, this.appState);
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
                        image = image;
                        digimonPreviews.push(new DigimonPreview(digimon.name, image));
                    }
                }

                this.listResult = digimonPreviews;

                // End search
                this.appState = this.appStates.list;

                // Save app state to local storage
                localStorage.setItem(appStateKey, this.appState);
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
            listPaging: function () {
                return {
                    currentPage: parseInt((this.listOffset / this.listAmount)) + 1,
                    totalPages: parseInt(this.totalListResults / this.listAmount)
                };
            }
        }
    });
}

function initLocalStorage() {
    storedSearchTerm = localStorage.getItem(searchTermKey);
    storedAppState = Number(localStorage.getItem(appStateKey));
}

// Private helper function
// Returns the first item in an abstract object
function getFirstItem(json) {
    let items = json.items;
    let firstItem = utils.getFirstValue(items);
    return firstItem;
}

export { init, vueApp as app };