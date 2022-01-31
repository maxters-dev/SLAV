<template>
  <v-app>
    <router-view />
    <app-toast ref="globalToast" />
  </v-app>
</template>
<script>
import AppToast from './components/AppToast.vue'
import { EventBus } from '@/services/event-bus'
export default {
    components: { AppToast },


    created() {
        EventBus.$on('$toast', this.openToast);
    },

    methods: {
        openToast (text) {
            this.$refs.globalToast.open(text)
        }
    }
}
</script>
