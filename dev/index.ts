import App from './App.vue';
import Vue from 'vue';
import Vuetify from 'vuetify';
import router from './routes';
import 'vuetify/dist/vuetify.min.css';
import '@mdi/font/css/materialdesignicons.css';

Vue.use(Vuetify);

Vue.config.productionTip = false;

const vuetify = new Vuetify({
    theme: {
        dark: true,
        themes: {
            dark: {
                primary: '#555dda'
            },
            light: {
                primary: '#add555'
            }
        }
    },
    icons: {
        iconfont: 'mdi'
    }
});

new Vue({
    data: () => ({ isLoaded: document.readyState === 'complete' }),
    vuetify,
    router,
    render (h) {
        return h(App);
    }
}).$mount('#app');

window.Vue = Vue;
