<template>
    <v-app>
        <router-view />
    </v-app>
</template>
<script>
import { VApp } from 'vuetify/lib'
export default {
  components: { VApp },
  created () {
    console.log(this.$route)
  }
}
</script>
