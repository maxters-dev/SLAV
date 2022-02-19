<template>
    <v-card
        height="100%"
        class="d-flex flex-column"
    >
        <v-img
            v-if="image"
            :src="image"
            :aspect-ratio="4 / 3"
            position="top"
            class="flex-grow-0"
        />
        <v-card-title class="pb-0">
            <router-link
                v-if="hasPermission('show', showRoute)"
                class="text-no-wrap text-truncate cursor-pointer"
                :title="title"
                :to="showRoute"
                tag="div"
            >
                {{ title }}
            </router-link>
        </v-card-title>

        <div class="flex-grow-1 px-5">
            <model-description-list
                :fields="fields"
                :model="model"
            />
        </div>

        <v-card-actions>
            <v-spacer />
            <template v-for="(actionComponent, name) in customActions">
                <slot
                    v-if="hasPermission(name)"
                    :name="name"
                >
                    <component
                        :is="actionComponent"
                        :key="name"
                        v-bind="{ model, hasPermission, name }"
                    />
                </slot>
            </template>
            <slot
                v-if="hasPermission('show', showRoute)"
                name="showAction"
            >
                <v-btn
                    small
                    icon
                    title="Visualizar"
                    :to="showRoute"
                >
                    <v-icon>mdi-alert-circle</v-icon>
                </v-btn>
            </slot>
            <slot
                v-if="hasPermission('edit', editRoute)"
                name="editAction"
            >
                <v-btn
                    icon
                    :to="editRoute"
                >
                    <v-icon>mdi-pencil</v-icon>
                </v-btn>
            </slot>
            <slot
                v-if="hasPermission('remove') && currentRouteMeta.enableRemove"
                name="removeAction"
            >
                <v-btn
                    icon
                    @click="remove"
                >
                    <v-icon>mdi-delete</v-icon>
                </v-btn>
            </slot>
        </v-card-actions>
    </v-card>
</template>

<script lang="ts">
import Vue, { Component, PropType } from 'vue';
import moment from 'moment';
import ModelDescriptionList from './ModelDescriptionList.vue';
import { RouteMeta } from 'vue-router';
import { Authorizations } from '../types/router';

export default Vue.extend({
    components: { ModelDescriptionList },
    props: {
        editRoute: {
            type: Object,
            required: true
        },

        showRoute: {
            type: Object,
            required: true
        },

        fields: {
            type: Array,
            default: () => [{ name: 'name', title: 'Name' }]
        },

        model: {
            type: Object,
            required: true
        },

        title: {
            type: String,
            default: null
        },

        image: {
            type: String,
            default: null
        },

        date: {
            type: [Date, String],
            default: null
        },

        removeEnabled: Boolean,

        actionsAuthorization: {
            type: Object as PropType<Authorizations>,
            default: () => ({})
        },

        customActions: {
            type: Object as PropType<{[key: string]: Component}>,
            default: () => ({})
        }
    },

    computed: {
        currentRouteMeta (): RouteMeta {
            return this.$route.meta ?? {};
        }
    },

    methods: {
        moment,
        routeExists (name: string) {
            return this.$router.match({ name }).matched.length > 0;
        },
        getRouteMeta (name: string): RouteMeta {
            const result = this.$router.match({ name }).meta || {};
            return result;
        },

        hasPermission (actionKey: string, route?: any): boolean {
            const callback = this.actionsAuthorization[actionKey];

            if (typeof callback === 'function') {
                return callback(this.model);
            }

            if (!route) return true;

            return this.getRouteMeta(route.name).enabled;
        },

        remove () {
            this.$emit('removed');
        }
    }
});
</script>
