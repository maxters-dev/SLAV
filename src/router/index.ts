import Vue from 'vue';
import VueRouter from 'vue-router';
import login from './login'
import admin from './admin'

import LayoutGuest from '../layouts/Guest.vue';
import LayoutAdmin from '../layouts/Admin.vue'
import auth from '../services/auth';
// import auth from '../services/auth';

Vue.use(VueRouter);

const routes = [
    {
        path: '/guest',
        component: LayoutGuest,
        children: login
    },
    {
        path: '/admin',
        component: LayoutAdmin,
        children: admin
    },

    {
        path: '*',
        redirect: '/login'
    }
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
});

router.beforeEach(async (to, from, next) => {

    if (to.meta?.guest === true) return next();

    if (auth.getToken()) {
        return next();
    }

    return next({ name: 'UserLogin' })
})

export default router;
