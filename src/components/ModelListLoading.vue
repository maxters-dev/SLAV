<template>
    <v-row>
        <v-col
            v-for="i in 8"
            :key="i"
            :lg="3"
            :md="6"
            :cols="12"
        >
            <v-skeleton-loader type="card" />
        </v-col>
    </v-row>
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
    name: 'ModeListLoading'
});
</script>
