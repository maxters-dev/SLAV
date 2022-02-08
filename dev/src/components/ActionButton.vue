<template>
    <v-btn
        v-if="hasPermission(name)"
        icon
        :to="{name: 'customersShow', params: { id: 1}}"
    >
        <v-icon>mdi-arrow-right</v-icon>
    </v-btn>
</template>

<script lang="ts">
import { Model } from 'src/types';
import Vue, { PropType } from 'vue';
export default Vue.extend({

    props: {
        name: String,
        model: Object as PropType<Model>,
        hasPermission: { type: Function }
    }
});
</script>
