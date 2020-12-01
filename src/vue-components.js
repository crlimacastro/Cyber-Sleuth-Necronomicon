function initComponents(app) {
    Vue.component('digimon-table', {
        props: ['type', 'attribute', 'skillname', 'skilldescription'],
        template: `<table id="digimon-table" class="table">
                <tr>
                    <td>Type</td>
                    <td>{{type}}</td>
                </tr>
                <tr>
                    <td>Attribute</td>
                    <td>{{attribute}}</td>
                </tr>
                <tr>
                    <td>Skill</td>
                    <td>{{skillname}}: {{skilldescription}}</td>
                </tr>
            </table>`
    });

    Vue.component('digimon-selected-display', {
        props: ['name', 'stage', 'imgsrc', 'type', 'attribute', 'skillname', 'skilldescription', 'abstract', 'wikiurl', 'digivolvesto', 'degeneratesto'],
        template: `<div id="digimon-selected-display">
                <div id="digimon-selected-header">
                    <h2 id="digimon-selected-name">{{name}}</h2>
                    <h3 id="digimon-selected-stage">{{stage}}</h3>
                </div>

                <div id="digimon-selected-image-container">
                    <img id="digimon-selected-image" :src="imgsrc">
                </div>

                <div id="digimon-selected-info">
                    <digimon-table v-bind:type="type" v-bind:attribute="attribute" v-bind:skillname="skillname" v-bind:skilldescription="skilldescription">
                    </digimon-table>
                    <p id="digimon-selected-abtract">{{abstract}}</p>
                    <a id="digimon-selected-wiki-link" :href="wikiurl">Visit Digimon Wiki Page</a>
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
            </div>`
    });

    Vue.component('digimon-card', {
        props: ['name', 'imgsrc'],
        template: `<b-card
                type="submit"
                @click="search(name)"
                :title="name"
                :img-src="imgsrc"
                img-top
                class="mb-2 digimon-card">
            </b-card>`,
        methods: {
            search: function(name) {
                app.search(name);
            }
        }
    });

    Vue.component('digimon-card-container', {
        props: ['digimons'],
        template: `<div id="digimon-card-container">
            <digimon-card v-for="digimon in digimons" v-bind:key="digimon.id" :name="digimon.name" :imgsrc="digimon.image"></digimon-card>
        </div>`
    });
}

export { initComponents };