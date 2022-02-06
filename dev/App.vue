<template>
    <v-app>
        <v-navigation-drawer app>
            <v-list>
                <v-list-item :to="item.to" v-for="item in items" :key="item.title">
                    {{ item.title }}
                </v-list-item>
            </v-list>
        </v-navigation-drawer>
        <v-app-bar app :fixed="false">
            <v-switch v-model="$vuetify.theme.dark"></v-switch>
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
        }
    }

};
</script>
