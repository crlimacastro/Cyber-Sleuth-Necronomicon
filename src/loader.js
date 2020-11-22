import * as vueComponents from "./vue-components.js";
import * as main from "./main.js";


window.onload = () => {
    // Do preload here - load fonts, images, additional sounds, etc...

    vueComponents.initComponents();
    main.init();
}