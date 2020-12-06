import * as digiApiInterface from "./interfaces/digiApiInterface.js";
import * as wikiApiInterface from "./interfaces/wikiApiInterface.js";
import * as classes from "./classes.js";

// Classes
const Digimon = classes.Digimon;
const DigimonPreview = classes.DigimonPreview;
const Skill = classes.Skill;

// Local storage
const localStoragePrefix = "crl3554-digimonCyberSleuthSite-";

const appStateKey = localStoragePrefix + "appState";
let storedAppState;

const searchTermKey = localStoragePrefix + "searchTerm";
let storedSearchTerm;

const searchedDigimonKey = localStoragePrefix + "searchedDigimon";
let storedSearchedDigimon;

const listAmountKey = localStoragePrefix + "listAmount";
let storedListAmount;

const stageFilterKey = localStoragePrefix + "stageFilter";
let storedStageFilter;

const typeFilterKey = localStoragePrefix + "typeFilter";
let storedTypeFilter;

const attributeFilterKey = localStoragePrefix + "attributeFilter";
let storedAttributeFilter;

// Vue App
let vueApp;

function init() {
    initLocalStorage();
    initVue();
}

function initLocalStorage() {
    storedAppState = Number(localStorage.getItem(appStateKey));
    storedSearchTerm = localStorage.getItem(searchTermKey);
    storedSearchedDigimon = localStorage.getItem(searchedDigimonKey);
    storedListAmount = Number(localStorage.getItem(listAmountKey));
    storedStageFilter = localStorage.getItem(stageFilterKey);
    storedTypeFilter = localStorage.getItem(typeFilterKey);
    storedAttributeFilter = localStorage.getItem(attributeFilterKey);
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
            placeholderImgURL: "./media/placeholder.png",
            // Searching
            searchTerm: storedSearchTerm ? storedSearchTerm : "",
            searchResult: null,
            // Listing
            listResult: [],
            totalListResults: 0,
            // Listing-Filters
            // List-Amount
            listAmount: storedListAmount ? storedListAmount : 5,
            listAmountOptions: [
                { value: 5, text: "5" },
                { value: 10, text: "10" },
                { value: 25, text: "20" }
            ],
            listOffset: 0,
            // Stage
            stageFilter: storedStageFilter ? storedStageFilter : "",
            stageOptions: [
                { value: "", text: " " },
                { value: "Baby", text: "Baby" },
                { value: "In-Training", text: "In-Training" },
                { value: "Rookie", text: "Rookie" },
                { value: "Champion", text: "Champion" },
                { value: "Ultimate", text: "Ultimate" },
                { value: "Mega", text: "Mega" },
                { value: "Armor", text: "Armor" },
                { value: "Ultra", text: "Ultra" }
            ],
            // Type
            typeFilter: storedTypeFilter ? storedTypeFilter : "",
            typeOptions: [
                { value: "", text: " " },
                { value: "Free", text: "Free" },
                { value: "Data", text: "Data" },
                { value: "Vaccine", text: "Vaccine" },
                { value: "Virus", text: "Virus" }
            ],
            // Attribute
            attributeFilter: storedAttributeFilter ? storedAttributeFilter : "",
            attributeOptions: [
                { value: "", text: " " },
                { value: "Neutral", text: "Neutral" },
                { value: "Fire", text: "Fire" },
                { value: "Plant", text: "Plant" },
                { value: "Water", text: "Water" },
                { value: "Electric", text: "Electric" },
                { value: "Wind", text: "Wind" },
                { value: "Earth", text: "Earth" },
                { value: "Light", text: "Light" },
                { value: "Dark", text: "Dark" }
            ]
        },
        async created() {
            // Make sure JSONs are loaded
            await wikiApiInterface.initInterfaceAsync();

            switch (this.appState) {
                case this.appStates.search:
                    this.search(storedSearchedDigimon);
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
                if (!searchTerm || !searchTerm.trim()) return;

                // Clear list
                this.listResult = [];

                // Clear previous search (if any)
                this.searchResult = null;

                // Start search
                this.appState = this.appStates.searching;

                // Get Digimon Cyber Sleuth API info
                let digiInfo = await digiApiInterface.search(searchTerm).then(json => { return json; });

                // If digimon found
                if (digiInfo) {
                    // Transform skill field from an id to a Skill object
                    if (digiInfo.skill) {
                        let skillObj = await digiApiInterface.getSkill(digiInfo.skill).then(skill => { return skill; });
                        digiInfo.skill = new Skill(skillObj.name, skillObj.description, skillObj._id);
                    }

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
                            digimonPreviews.push(new DigimonPreview(digimonName, image));
                        }
                    }
                    digiInfo.degeneratesTo = digimonPreviews;

                    // Get MediaWiki API info
                    let image = await wikiApiInterface.getImageURL(digiInfo.name).then(url => { return url; });
                    let wikiData = await wikiApiInterface.getWikiData(digiInfo.name).then(json => { return json; });

                    let wikiInfo = {
                        image: image,
                        abstract: wikiData.abstract,
                        url: wikiData.url
                    };

                    let digimon = new Digimon(digiInfo, wikiInfo);

                    this.searchResult = digimon;

                    // Save to local storage
                    localStorage.setItem(searchedDigimonKey, digimon.name);
                }

                // End search
                this.appState = this.appStates.search;

                // Save to local storage
                localStorage.setItem(appStateKey, this.appState);
            },
            saveSearchTerm() {
                localStorage.setItem(searchTermKey, this.searchTerm);
            },
            list() {
                this.getList(this.listAmount, this.listOffset, this.stageFilter, this.typeFilter, this.attributeFilter);
            },
            async getList(amount, offset, stage, type, attribute) {
                // Clear search
                this.searchResult = null;

                // Clear previous list
                this.listResult = [];

                // Start search
                this.appState = this.appStates.searching;

                // Get all list results
                let listObj = await digiApiInterface.list(amount, offset, stage, type, attribute).then(arr => { return arr; });
                let digimons = listObj.arr;
                this.totalListResults = listObj.total;

                // Turn all results into a digimon preview
                let digimonPreviews = [];
                for (const digimon of digimons) {
                    let image = await wikiApiInterface.getImageURL(digimon.name).then(url => { return url; });
                    digimonPreviews.push(new DigimonPreview(digimon.name, image));
                }

                this.listResult = digimonPreviews;

                // End search
                this.appState = this.appStates.list;

                // Save to local storage
                localStorage.setItem(appStateKey, this.appState);
                localStorage.setItem(listAmountKey, this.listAmount);
                localStorage.setItem(stageFilterKey, this.stageFilter);
                localStorage.setItem(typeFilterKey, this.typeFilter);
                localStorage.setItem(attributeFilterKey, this.attributeFilter);
            },
            resetOffset() {
                this.listOffset = 0;
            },
            reduceOffset() {
                if (this.listOffset == 0) return;

                if (this.listOffset - this.listAmount < 0)
                    this.listOffset = 0;
                else
                    this.listOffset -= this.listAmount;

                this.list();
            },
            increaseOffset() {
                if (this.listOffset >= this.totalListResults - this.listAmount) return;

                if (this.listOffset + this.listAmount > this.totalListResults)
                    this.listOffset = Math.max(this.totalListResults - this.listAmount, 0);
                else
                    this.listOffset += this.listAmount;

                this.list();
            },
            clearLocalStorage() {
                localStorage.clear();

                this.searchTerm = "";
                this.listAmount = 5;
                this.stageFilter = "";
                this.typeFilter = "";
                this.attributeFilter = "";
            }
        },
        computed: {
            pagingData: function () {
                return {
                    currentPage: Math.ceil((this.listOffset / this.listAmount)) + 1,
                    totalPages: Math.ceil(this.totalListResults / this.listAmount)
                };
            }
        }
    });
}

export { init, vueApp as app };