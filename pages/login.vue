<template>
  <v-container class="fill-height justify-center">
    <v-card flat outlined class="tw-w-full sm:tw-w-1/2 md:tw-w-1/3">
      <v-card-title class="justify-center tw-my-4">
        <div class="tw-flex tw-items-center tw-flex-col">
          <v-img height="100" width="100" contain src="/healthcare.png" alt="logo"/>
        </div>

      </v-card-title>
      <v-card-text>
        <v-form @submit.prevent="login">
          <ValidationObserver ref="loginValidator" tag="div" class="tw-flex tw-flex-col tw-gap-4">
            <ValidationProvider tag="div" name="Email" vid="email" rules="required|email" v-slot="{errors}">
              <v-text-field label="Email"
                            v-model:trim="email"
                            dense
                            outlined
                            prepend-inner-icon="mdi-email"
                            :error-messages="errors"/>
            </ValidationProvider>
            <ValidationProvider tag="div" vid="password" name="Password" rules="required" v-slot="{errors}">
              <v-text-field v-model="password"
                            label="Password"
                            dense
                            outlined
                            :type="showPassword ? 'text' : 'password'"
                            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                            @click:append="showPassword = !showPassword"
                            :error-messages="errors"
                            prepend-inner-icon="mdi-lock"/>
            </ValidationProvider>

            <v-btn depressed type="submit" class="tw-mt-2" :loading="loggingIn" block color="primary">Login</v-btn>
          </ValidationObserver>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "LoginPage",
  middleware: 'auth',
  auth: 'guest',
  layout: 'plain',
  head: {
    title: 'Login'
  },
  data() {
    return {
      email: '',
      password: '',
      loggingIn: false,
      showPassword: false,
    }
  },

  methods: {
    login() {
      this.$refs.loginValidator.validate()
        .then(valid => {
          if (valid) {
            this.loggingIn = true
            this.$auth.loginWith('laravelSanctum', {
              data: {
                email: this.email,
                password: this.password,
              }
            }).then(resp => {
              this.loggingIn = false
            })
              .catch(error => {
                this.loggingIn = false
                this.$refs.loginValidator.setErrors(error.response.data.errors)
              })
          }
        })
    }
  }
}
</script>

<style scoped>
</style>
