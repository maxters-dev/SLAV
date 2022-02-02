import VueRouter from 'vue-router';
import Vue from 'vue';
import { generateFromRouteDictionaries } from '../index';
import customers from './src/resources/customers';
import Layout from './src/Layout.vue';
import Login from './src/Login.vue';

Vue.use(VueRouter);

const adminRoutes = generateFromRouteDictionaries([
    customers
]);

export default new VueRouter({
    mode: 'history',
    routes: [
        {
            path: '/',
            component: Login
        },
        {
            name: 'admin',
            path: '/admin',
            component: Layout,
            children: adminRoutes
        }
    ]
});
