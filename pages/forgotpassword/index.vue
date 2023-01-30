<template>
  <v-container class="fill-height justify-center">
    <v-card elevation="4" class="tw-w-full sm:tw-w-1/2 md:tw-w-2/5">
      <v-card-title class="justify-center">
        <v-avatar size="100">
          <v-icon>mdi-account</v-icon>
        </v-avatar>
      </v-card-title>
      <v-card-title class="justify-center">
        Enter your Email
      </v-card-title>
      <v-card-text>
        <v-form @submit.prevent="submit">
          <ValidationObserver ref="validator">
            <ValidationProvider name="Email" vid="email" rules="required|email" v-slot="{errors}">
              <v-text-field label="Email" v-model="model.email"
                            prepend-inner-icon="mdi-email"
                            :error-messages="errors"/>
            </ValidationProvider>
          </ValidationObserver>
          <v-btn :loading="loading" type="submit" block color="primary">Submit</v-btn>
        </v-form>
        <div class="tw-flex tw-justify-center tw-mt-2">
          <NuxtLink to="/login">
            Back to Login
          </NuxtLink>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>
<script>
export default {
  name: "ForgotPasswordPage",
  middleware: 'auth',
  auth: 'guest',
  layout: 'plain',
  head: {
    title: 'Forgot Password'
  },

  data: () => ({
    model: {
      email: ''
    },
    loading: false
  }),

  methods: {
    submit() {
      this.$refs.validator.validate()
        .then(valid => {
          if (valid) {
            this.loading = true
            this.$axios.$post('/backend/forgot-password', {email: this.model.email})
              .then(resp => {
                this.model.email = '';
                this.$refs.validator.reset()
                this.$root.$emit('toast', {text: resp.data.message, type: 'success'})
                this.loading = false
              }).catch(error => {
              this.loading = false
              if (error.response.status === 422) {
                this.$refs.validator.setErrors(error.response.data.errors)
              } else {
                this.$root.$emit('toast', {text: error.response.statusText, type: 'error'})
              }
            })
          }
        })
    }
  }
}

</script>


<style scoped>

</style>
