function initComponents(vueApp) {
    Vue.component('digimon-table', {
        props: ['type', 'attribute', 'skillname', 'skilldescription'],
        template: `<table id="digimon-table" class="table">
                <tr>
                    <td>Type</td>
                    <td><img :src=typeImgURL(type) alt="" id="digimon-selected-type-icon" v-if="typeImgURL(type)"> {{type}}</td>
                </tr>
                <tr>
                    <td>Attribute</td>
                    <td><img :src=attributteImgURL(attribute) alt="" id="digimon-selected-attribute-icon" v-if="attributteImgURL(attribute)"> {{attribute}}</td>
                </tr>
                <tr>
                    <td>Skill</td>
                    <td>{{skillname}}: {{skilldescription}}</td>
                </tr>
            </table>`,
        methods: {
            typeImgURL: function (typeString) {
                let baseUrl = "./media/types/";

                switch (typeString) {
                    case "Data":
                        return baseUrl + "data.png";
                    case "Free":
                        return baseUrl + "free.png";
                    case "Vaccine":
                        return baseUrl + "vaccine.png";
                    case "Virus":
                        return baseUrl + "virus.png";
                    default:
                        return undefined;
                }
            },
            attributteImgURL: function (attributeString) {
                let baseUrl = "./media/attributes/";

                switch (attributeString) {
                    case "Dark":
                        return baseUrl + "dark.png";
                    case "Earth":
                        return baseUrl + "earth.png";
                    case "Electric":
                        return baseUrl + "electric.png";
                    case "Fire":
                        return baseUrl + "fire.png";
                    case "Fire":
                        return baseUrl + "fire.png";
                    case "Light":
                        return baseUrl + "light.png";
                    case "Neutral":
                        return baseUrl + "neutral.png";
                    case "Plant":
                        return baseUrl + "plant.png";
                    case "Water":
                        return baseUrl + "water.png";
                    case "Wind":
                        return baseUrl + "wind.png";
                    default:
                        return undefined;
                }
            }
        }
    });

    Vue.component('digimon-selected-display', {
        data: function() {
            return {
                placeholderImgURL: vueApp.placeholderImgURL
            };
        },
        props: ['name', 'stage', 'imgsrc', 'type', 'attribute', 'skillname', 'skilldescription', 'abstract', 'wikiurl', 'digivolvesto', 'degeneratesto'],
        template: `<div id="digimon-selected-display">
                <div id="digimon-selected-header">
                    <h2 id="digimon-selected-name">{{toTitleCase(name)}}</h2>
                    <h3 id="digimon-selected-stage">{{stage}}</h3>
                </div>

                <div id="digimon-selected-image-container">
                    <img id="digimon-selected-image" :src="imgsrc ? imgsrc : placeholderImgURL">
                </div>

                <div id="digimon-selected-info">
                    <digimon-table :type="type" :attribute="attribute" :skillname="toTitleCase(skillname)" :skilldescription="skilldescription">
                    </digimon-table>
                    <p id="digimon-selected-abtract" v-if="abstract">{{abstract}}</p>
                    <a id="digimon-selected-wiki-link" :href="wikiurl" v-if="wikiurl">Visit Digimon Wiki Page</a>
                </div>

                <div id="digimon-selected-arrays">
                    <div id="digimon-selected-degenerations" v-if="degeneratesto.length > 0">
                        <h3>Degenerates To</h3>
                        <digimon-card-container :digimons="degeneratesto"></digimon-card-container>
                    </div>
                    <div id="digimon-selected-digivolutions" v-if="digivolvesto.length > 0">
                        <h3>Digivolves To</h3>
                        <digimon-card-container :digimons="digivolvesto"></digimon-card-container>
                    </div>
                </div>
            </div>`,
        methods: {
            // Helper function. Turns first letter of every word in string to uppercase
            // https://stackoverflow.com/questions/4878756/how-to-capitalize-first-letter-of-each-word-like-a-2-word-city
            toTitleCase: function (str) {
                return str.replace(/\w\S*/g, txt => {
                    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                });
            }
        }
    });

    Vue.component('digimon-card', {
        data: function() {
            return {
                placeholderImgURL: vueApp.placeholderImgURL
            };
        },
        props: ['name', 'imgsrc'],
        template: `<b-card
                type="submit"
                @click="search(name)"
                :title="name"
                :img-src="imgsrc ? imgsrc : placeholderImgURL"
                img-top
                class="mb-2 digimon-card">
            </b-card>`,
        methods: {
            search: function (name) {
                vueApp.search(name);
            }
        }
    });

    Vue.component('digimon-card-container', {
        props: ['digimons'],
        template: `<div id="digimon-card-container">
            <digimon-card v-for="digimon in digimons" :key="digimon.id" :name="digimon.name" :imgsrc="digimon.image"></digimon-card>
        </div>`
    });
}

export { initComponents };