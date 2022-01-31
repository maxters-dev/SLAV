import { SidebarItemConfig } from '@/types/router'
import Vue from 'vue'

const store = Vue.observable({
  sidebarItems: [] as SidebarItemConfig[]
})

export default store
