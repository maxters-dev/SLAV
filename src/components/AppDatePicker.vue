<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
    max-width="290px"
    min-width="auto"
  >
    <template v-slot:activator="{ on, attrs }">
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

<script>
import moment from 'moment';
import { VMenu, VTextField, VDatePicker } from 'vuetify/lib';

export default {

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
            type: null,
            default: null
        }
    },

    data () {
        return {
            menu: false
        };
    },

    computed: {

        innerDateValue: {
            set (value) {
                this.$emit('update:modelValue', value);
            },

            get () {
                const date = moment(this.modelValue);
                return date.isValid() ? date.format('YYYY-MM-DD') : null;
            }
        }
    },

    methods: {

        setDate (value) {
            this.$emit('update:modelValue', value);
            this.menu = false;
        }
    }
};
</script>

<style>

</style>
