import UserLogin from '@/views/UserLogin.vue'

export default [
    {
        path: '/login',
        component: UserLogin,
        name: 'UserLogin',
        meta: {
            guest: true,
        }
    },
];
