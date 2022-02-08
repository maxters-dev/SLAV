<template>
    <v-app>
        <v-navigation-drawer app>
            <v-list>
                <v-list-item
                    v-for="item in items"
                    :key="item.title"
                    :to="item.to"
                >
                    {{ item.title }}
                </v-list-item>
            </v-list>
        </v-navigation-drawer>
        <v-app-bar
            app
            :fixed="false"
        >
            <v-switch v-model="theme" />
        </v-app-bar>
        <v-main>
            <div class="pa-8">
                <router-view />
            </div>
        </v-main>
    </v-app>
</template>
<script>
import { VApp } from 'vuetify/lib';
import store from '../src/store';
export default {
    components: { VApp },

    computed: {
        items () {
            return store.sidebarItems;
        },

        theme: {
            set (value) {
                this.$vuetify.theme.dark = value;
                localStorage.setItem('theme.dark', JSON.stringify(value));
            },
            get () {
                return this.$vuetify.theme.dark;
            }
        }
    },

    beforeCreate () {
        this.$vuetify.theme.dark = JSON.parse(localStorage.getItem('theme.dark'));
    }

};
</script>
