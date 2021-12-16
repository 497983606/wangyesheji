import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
<<<<<<< Updated upstream
import './assets/cover.css'
import './assets/font/iconfont.css'
createApp(App).use(router).mount("#app");
=======
import store from "./store";

createApp(App).use(store).use(router).mount("#app");
>>>>>>> Stashed changes
