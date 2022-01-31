<template>
  <form
    @submit.prevent="login"
  >
    <v-card
      :loading="busy"

      width="100%"
    >
      <v-card-text>
        <v-text-field
          v-model="credentials.email"
          type="email"
          placeholder="Login"
          required
        />
        <v-text-field
          v-model="credentials.password"
          placeholder="Senha"
          type="password"
          required
        />
        <div class="d-flex justify-end">
          <v-btn
            :loading="busy"
            color="primary"
            type="submit"
          >
            Login
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </form>
</template>

<script lang="ts">
import Vue from 'vue'
import auth from '@/services/auth';
import { EventBus } from '@/services/event-bus'

export default Vue.extend({
    name: 'UserLogin',
    data() {
        const busy: boolean = false;
        const credentials: {email: string, password: string} = { email: '', password: '' };

        return {
            busy,
            credentials,
        };
    },
    methods: {

        async login() {

            this.busy = true;

            await auth.login(
                this.credentials.email,
                this.credentials.password
            ).finally(() => {
                this.busy = false;
            })

            this.$router.push({ name: 'postsIndex' })

            EventBus.$emit('$toast', 'Login efetuado com sucesso')
        },
    },
});
</script>
