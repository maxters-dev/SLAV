import VueRouter from 'vue-router';
import Vue from 'vue';
import { RouterRegistrar } from '../index';
import customers from './src/resources/customers';
import Layout from './src/Layout.vue';
import Login from './src/Login.vue';

Vue.use(VueRouter);

const adminRoutes = RouterRegistrar.toRoutes([
    customers
]);
const router = new VueRouter({
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

export default router;
