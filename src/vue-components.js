function initComponents() {
    Vue.component('digimon-display', {
        props: ['digimon'],
        template: `<div>
                        <p>{{digimon.name}}</p>
                    </div>`
    });

    Vue.component('small-digimon-display', {
        props: ['digimon'],
        template: `<div>
                        <p>{{digimon.name}}</p>
                    </div>`
    })

    Vue.component('joke-footer', {
        template: `<footer class="muted" style="text-align:center">
            &copy; 2018 Ace Coder
        </footer>`
    });

    Vue.component('joke-footer-2', {
        props: ['year', 'name'],
        template: `<footer class="muted" style="text-align:center">
            &copy; {{ year }} {{ name }}
        </footer>`
    });

    Vue.component('joke-display', {
        props: ['joke'],
        template: `<div>
            <p><b>{{joke.q}}</b></p>
            <p><i>{{joke.a}}</i></p>
        </div>`
    });

    Vue.component('friend-list-row', {
        props: ['name', 'index'],
        template: `<tr>
                        <td>{{ index + 1}}</td>
                        <td v-text="name"></td>
                    </tr>`
    });

    Vue.component('friend-list', {
        props: ['title', 'names'],
        template: `<div>
                        <h2>{{title}}</h2>
                        <table class="pure-table-striped">
                            <thead><th>Guest #</th><th>Guest Name</th></thead>
                            <tr is="friend-list-row" v-for="(name,index) in names" v-bind:name="name" v-bind:index="index"></tr>
                        </table>
                    </div>`
    });
}

export { initComponents };