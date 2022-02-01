<template>
  <v-card
    height="100%"
    class="d-flex flex-column"
  >
    <v-img
      v-if="image"
      :src="image"
      :aspect-ratio="4/3"
      position="top"
      class="flex-grow-0"
    />
    <v-card-title class="pb-0">
      <div
        class="text-no-wrap text-truncate"
        :title="title"
      >
        {{ title }}
      </div>
    </v-card-title>

    <div class="flex-grow-1 px-5">
      <model-description-list
        :fields="fields"
        :model="model"
      />
    </div>

    <v-card-actions class="d-flex justify-space-between">
      <span>
        <v-chip
          v-if="date"
          small
        >
          {{ moment(date).format('DD/MM/YYYY') }}
        </v-chip>
      </span>
      <div>
        <v-btn
          v-if="routeExists(showRoute.name)"
          small
          icon
          title="Adicionar novo registro"
          :to="showRoute"
        >
          <v-icon>mdi-alert-circle</v-icon>
        </v-btn>
        <v-btn

          v-if="routeExists(editRoute.name)"
          icon
          :to="editRoute"
        >
          <v-icon>
            mdi-pencil
          </v-icon>
        </v-btn>
        <v-btn
          icon
          @click="remove"
        >
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </div>
    </v-card-actions>
  </v-card>
</template>

<script>
import moment from 'moment';
import ModelDescriptionList from './ModelDescriptionList.vue';

export default {
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
            default: () => ([
                { name: 'name', title: 'Name' }
            ])
        },

        model: {
            type: Object,
            required: true
        },

        title: {
            type: String,
            required: true
        },

        image: {
            type: String,
            default: null
        },

        date: {
            type: [Date, String],
            default: null
        }
    },

    methods: {
        routeExists (name) {
            return this.$router.match({ name }).matched.length > 0;
        },
        remove () {
            this.$emit('removed');
        },

        moment

    }
};
</script>
