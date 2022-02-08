<template>
    <v-menu
        v-model="menu"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        max-width="290px"
        min-width="auto"
    >
        <template #activator="{ on, attrs }">
            <v-text-field
                v-model="innerDateValue"
                :label="label"
                persistent-hint
                append-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
            />
        </template>
        <v-date-picker
            v-bind="$attrs"
            @input="setDate"
        />
    </v-menu>
</template>

<script lang="ts">
import moment from 'moment';
import Vue from 'vue';
import { VMenu, VTextField, VDatePicker } from 'vuetify/lib';

export default Vue.extend({

    name: 'AppDatePicker',

    components: { VMenu, VTextField, VDatePicker },

    model: {
        prop: 'modelValue',
        event: 'update:modelValue'
    },

    props: {
        label: {
            type: String,
            default: null
        },
        modelValue: {
            type: null as any,
            default: null
        }
    },

    data () {
        return {
            menu: false as boolean
        };
    },

    computed: {
        innerDateValue: {
            set (value: string) {
                this.$emit('update:modelValue', value);
            },

            get (): string|null {
                const date = moment(this.modelValue);
                return date.isValid() ? date.format('YYYY-MM-DD') : null;
            }
        }
    },

    methods: {
        setDate (value: string) {
            this.$emit('update:modelValue', value);
            this.menu = false;
        }
    }
});
</script>
