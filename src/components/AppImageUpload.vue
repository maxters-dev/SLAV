<template>
  <div class="mb-5">
    <div
      v-if="internalSrc"
      class="relative"
    >
      <div class="d-flex justify-end">
        <v-btn
          icon
          @click="cleanup"
        >
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </div>
      <v-img
        :src="internalSrc"
        :max-height="300"
        class="white--text"
      >
        <v-layout
          fill-height
          align-center
          justify-center
        >
          {{ label }}
        </v-layout>
      </v-img>
    </div>
    <v-file-input
      v-else
      accept="image/*"
      :label="label"
      :multiple="false"
      :value="null"
      append-icon="mdi-file"
      :prepend-icon="false"
      @change="onSelect"
    />
  </div>
</template>

<script>
export default {

    inheritAttrs: false,
    props: {
        name: {
            type: String,
            required: true
        },
        src: {
            type: [String],
            default: null
        },
        label: {
            type: String,
            required: true
        }
    },

    data () {
        return {
            internalSrc: null
        };
    },

    watch: {
        src: {
            immediate: true,
            handler (src) {
                this.internalSrc = src;
            }
        }
    },

    methods: {

        cleanup () {
            this.internalSrc = null;
            this.$emit('cleanup');
        },

        onSelect (value) {
            const src = URL.createObjectURL(value);

            this.internalSrc = src;

            this.$emit('imageSelected', value);
            this.$emit('selected', value);
        }
    }
};
</script>
