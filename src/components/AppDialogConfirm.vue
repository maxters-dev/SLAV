<template>
    <v-dialog
        v-model="active"
        :max-width="400"
    >
        <v-card>
            <v-card-title>Confirmação</v-card-title>
            <v-card-text>
                {{ text }}
            </v-card-text>
            <v-card-actions class="d-flex justify-end">
                <v-btn @click="choice(false)">
                    Não
                </v-btn>
                <v-btn
                    color="primary"
                    @click="choice(true)"
                >
                    Sim
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';
import { VCard } from 'vuetify/lib';

export default Vue.extend({
    name: 'AppDialogConfirm',
    components: { VCard },

    data () {
        return {
            text: '' as string,
            active: false as boolean
        };
    },

    methods: {
        choice (value: boolean) {
            this.$emit('choice', value);
            this.active = false;
        },

        open ({ text }: { text: string }): Promise<boolean> {
            this.text = text;

            this.active = true;

            return new Promise((resolve) => {
                this.$on('choice', resolve);
            });
        }
    }
});
</script>
