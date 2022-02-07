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

const isEmpty = (value: string): boolean => {
    if (typeof value === 'string' && value === '') return true;

    return value === null || value === undefined;
};

export default Vue.extend({
    components: { ModelFormField },
    name: 'ModelSearch',
    model: {
        prop: 'modelValue',
        event: 'update:modelValue'
    },
    props: {
        modelValue: {
            type: Object as PropType<{[key: string]: string}>,
            required: true
        },
        searchSchema: {
            type: Array as PropType<SearchSchema>,
            required: true
        }
    },

    computed: {
        filteredSearch (): {[key: string]: string} {
            const filteredEntries = Object.entries(this.search).filter(([, value]) => !isEmpty(value));
            return Object.fromEntries(filteredEntries);
        }
    },
    created () {
        this.submit();
    },

    data () {
        const search = Object.fromEntries(this.searchSchema.map((search) => {
            return [search.name, search.defaultValue];
        }));

        return {
            search: search as {[key: string]: string}
        };
    },

    methods: {
        submit (): void {
            this.$emit('submit', this.filteredSearch);
        }
    },

    watch: {
        filteredSearch: {
            immediate: true,
            handler (search) {
                this.$emit('update:modelValue', search);
            }
        }
    }

});
</script>
