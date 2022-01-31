import VueRouter from 'vue-router'
import Vue from 'vue'
import { generateFromRouteDictionaries } from '../index'
import categories from './src/resources/categories'
import Layout from './src/Layout.vue'

Vue.use(VueRouter)

const adminRoutes = generateFromRouteDictionaries([
  categories
])

export default new VueRouter({
  mode: 'history',
  routes: [
    {
      name: 'admin',
      path: '/admin',
      component: Layout,
      children: adminRoutes
    }
  ]
})
