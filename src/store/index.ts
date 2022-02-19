import { SidebarItemConfig } from '../types/router';
import Vue from 'vue';

const store = Vue.observable({
    indexRoutes: [] as SidebarItemConfig[]
});

export default store;
