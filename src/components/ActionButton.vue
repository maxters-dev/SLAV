<template>
    <v-btn
        v-if="hasPermission(name)"
        small
        icon
        :to="{name: routeName, params: { parentId: model.id}}"
    >
        <v-icon>{{ icon }}</v-icon>
    </v-btn>
</template>

<script lang="ts">
import { Model } from '../../src/types';
import Vue, { PropType } from 'vue';

export default Vue.extend({
    props: {
        icon: {
            type: String,
            required: true
        },
        routeName: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        model: {
            type: Object as PropType<Model>,
            required: true
        },
        hasPermission: {
            type: Function,
            required: true
        }
    }
});
</script>
