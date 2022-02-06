<template>
    <v-card class="mb-5" dense elevation="1">
        <v-card-text>
            <form @submit.prevent="submit">
                <v-row align="center">
                    <template v-for="(input, key) in searchSchema" >
                        <v-col :key="key" v-if="!input.hidden">
                            <model-form-field :model="search" v-model.trim="search[input.name]" :inputSchema="input"></model-form-field>
                        </v-col>
                    </template>
                    <v-col cols="auto">
                        <v-btn icon type="submit" color="primary">
                            <v-icon>mdi-magnify</v-icon>
                        </v-btn>
                    </v-col>
                </v-row>
            </form>
        </v-card-text>
    </v-card>
</template>

<script lang="ts">
import Vue from 'vue';
import { PropType } from 'vue/types/umd';
import { SearchSchema } from '../types/schema';
import ModelFormField from './ModelFormField.vue';
export default Vue.extend({
    components: { ModelFormField },
    name: 'ModelSearch',
    props: {
        searchSchema: Array as PropType<SearchSchema>
    },

    computed: {
        filteredSearch (): {[key: string]: string} {
            const filteredEntries = Object.entries(this.search).filter(([, value]) => !!value);
            return Object.fromEntries(filteredEntries);
        }
    },

    data () {
        return {
            search: {} as {[key: string]: string}
        };
    },

    created () {
        this.searchSchema.forEach((search) => {
            this.search[search.name] = search.defaultValue;
            console.log(search.defaultValue);
        });

        console.log(this.search);
    },

    methods: {
        submit () {
            this.$emit('submit', this.filteredSearch);
        }
    }

});
</script>
