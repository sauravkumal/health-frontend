<template>
  <v-container class="fill-height justify-center">
    <v-card elevation="4" class="tw-w-full sm:tw-w-1/2 md:tw-w-2/5">
      <v-card-title class="justify-center">
        <v-avatar size="100">
          <v-icon>mdi-account</v-icon>
        </v-avatar>
      </v-card-title>
      <v-card-text>
        <v-form @submit.prevent="login">
          <ValidationObserver ref="loginValidator">
            <ValidationProvider name="Email" vid="email" rules="required|email" v-slot="{errors}">
              <v-text-field label="Email"
                            v-model:trim="email"
                            prepend-inner-icon="mdi-email"
                            :error-messages="errors"/>
            </ValidationProvider>
            <ValidationProvider vid="password" name="Password" rules="required" v-slot="{errors}">

              <v-text-field v-model="password"
                            label="Password"
                            :type="showPassword ? 'text' : 'password'"
                            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                            @click:append="showPassword = !showPassword"
                            :error-messages="errors"
                            prepend-inner-icon="mdi-lock"/>
            </ValidationProvider>
          </ValidationObserver>

          <v-btn type="submit" :loading="loggingIn" block color="primary">Login</v-btn>

        </v-form>
        <div class="tw-flex tw-justify-center tw-mt-2">
          <NuxtLink to="/forgotpassword">
            Forgot Password
          </NuxtLink>
        </div>

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
