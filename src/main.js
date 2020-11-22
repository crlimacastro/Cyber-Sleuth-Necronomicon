import * as digiApiInterface from "./digiApiInterface.js";
import * as wikiApiInterface from "./wikiApiInterface.js";
import * as classes from "./classes.js";

let Digimon = classes.Digimon;
let Skill = classes.Skill;

let resultsContainer;

function init() {
    initElements();
    initVue();
}

function initElements() {
    resultsContainer = document.querySelector("#resultsContainer");
}

function initVue() {
    const app = new Vue({
        el: '#app',
        data: {
            title: "Cyber Sleuth's Necronomicon",
            searchTerm: "",
            result: "",
            searchResult: null,
            listResult: []
        },
        created() {
            // this.list();
        },
        methods: {
            async search() {
                // Exit early if nothing was typed
                if (!this.searchTerm.trim()) return;

                // Clean the search term
                let cleanSearchTerm = this.searchTerm.toLowerCase();

                // Clear list
                this.listResult = null;

                // Get Digimon Cyber Sleuth API info
                let digiInfo = await digiApiInterface.search(cleanSearchTerm).then(json => { return json; });

                // Transform skill field from an id to a Skill object
                let skillObj = await digiApiInterface.getSkill(digiInfo.skill).then(skill => { return skill; });
                digiInfo.skill = new Skill(skillObj.name, skillObj.description, skillObj._id);

                // Get MediaWiki API info
                let image = await wikiApiInterface.getImageURL(cleanSearchTerm).then(json => { return json; });
                let abstractObj = await wikiApiInterface.getAbstract(cleanSearchTerm).then(json => { return json; });

                let firstItem = getFirstItem(abstractObj);
                let abstract = firstItem.abstract;
                let url = abstractObj.basepath + firstItem.url;

                let wikiInfo = {
                    image: image,
                    abstract: abstract,
                    url: url
                };

                let digimon = new Digimon(digiInfo, wikiInfo);

                console.log(digimon);
            },
            async list() {
                // Clear search
                this.searchResult = null;

                digiApiInterface.list().then(arr => {
                    console.log(arr);
                });
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

export { init };