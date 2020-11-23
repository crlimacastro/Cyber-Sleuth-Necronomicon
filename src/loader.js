import * as main from "./main.js";
import * as vueComponents from "./vue-components.js";

window.onload = () => {
    // Do preload here - load fonts, images, additional sounds, etc...

    main.init();
    vueComponents.initComponents(main.app);
}