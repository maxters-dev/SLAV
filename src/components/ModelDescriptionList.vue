<template>
    <v-item-group
        class="pa-0"
        dense
    >
        <v-item
            v-for="(field, key) in computedFields"
            :key="key"
        >
            <div class="py-1">
                <div
                    class="text-subtitle-1 font-weight-semibold"
                >
                    {{ field.title }}
                </div>
                <div v-if="field.type === 'image'">
                    <v-img
                        :src="field.value"
                        :lazy-src="field.value"
                        :height="450"
                        position="top"
                    />
                </div>
                <div v-else-if="field.type === 'progress'">
                    <v-progress-linear
                        color="primary"
                        rounded
                        :height="25"
                        class="mt-2"
                        :value="field.value"
                    >
                        <template #default="{ value }">
                            <strong>{{ Math.ceil(value) }}%</strong>
                        </template>
                    </v-progress-linear>
                </div>
                <div v-else-if="field.type === 'rate'">
                    <v-rating
                        readonly
                        dense
                        color="primary"
                        rounded
                        :height="8"
                        class="mt-2"
                        :value="field.value"
                    />
                </div>
                <div
                    v-else-if="Array.isArray(field.value)"
                    class="mt-2"
                >
                    <v-chip
                        v-for="value in field.value"
                        :key="value"
                        small
                        class="mr-2"
                    >
                        {{ value }}
                    </v-chip>
                </div>
                <div
                    v-else
                    class="body-2 font-weight-light text-color-grey overflow-hidden"
                >
                    <span
                        v-if="field.type === 'html'"
                        v-html="field.value"
                    />
                    <span v-else> {{ field.value }}</span>
                </div>
            </div>
        </v-item>
    </v-item-group>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { FieldViewSchema } from '../types/schema';
import { Model } from '../types/laravel';
import { getModelPropValue } from '../helpers';

type FieldResult = {
    type: FieldViewSchema['type'];
    title: FieldViewSchema['name'];
    value: number | string | string[] | Model;
}

export default Vue.extend({
    name: 'ModelDescriptionList',
    props: {
        fields: {
            type: Array as PropType<FieldViewSchema[]>,
            required: true
        },

        model: {
            type: Object as PropType<Model>,
            required: true
        }
    },

    computed: {
        computedFields (): FieldResult[] {
            return this.fields.map((field): FieldResult => {
                return {
                    title: field.title,
                    type: field.type,
                    value: this.processFieldValue(field, this.model)
                };
            });
        }
    },

    methods: {
        processFieldValue (field: FieldViewSchema, model: Model) {
            const result = getModelPropValue(model, field.name);

            if (typeof field.format === 'function') {
                return field.format(result, model);
            }

            return result;
        }
    }
});
</script>
