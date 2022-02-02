<template>
  <form
    @submit.prevent="login"
  >
    <v-card
      :loading="busy"
      width="100%"
    >
      <v-card-title>
        Entre com seu e-mail e senha
      </v-card-title>
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
          :type="showPassword ? 'text': 'password'"
          required
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append="() => showPassword = !showPassword"
        />
        <div class="d-flex justify-end">
          <v-btn
            :loading="busy"
            color="primary"
            large
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
import Vue from 'vue';
import auth from '../../src/services/auth';
import { EventBus } from '../../src/services/event-bus';

export default Vue.extend({
    name: 'UserLogin',
    data () {
        const busy = false;
        const credentials: {email: string, password: string} = { email: '', password: '' };
        const showPassword = false;

        return {
            busy,
            credentials,
            showPassword
        };
    },
    methods: {

        async login () {
            this.busy = true;

            await auth.login(
                this.credentials.email,
                this.credentials.password
            ).finally(() => {
                this.busy = false;
            });

            this.$router.push({ name: 'customersIndex' });

            EventBus.$emit('$toast', 'Login efetuado com sucesso');
        }
    }
});
</script>
