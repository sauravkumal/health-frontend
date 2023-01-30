<template>
  <v-container class="fill-height justify-center">
    <v-card elevation="4" class="tw-w-full sm:tw-w-1/2 md:tw-w-2/5">

      <v-card-title class="justify-center">
        <v-avatar size="100">
          <v-icon>mdi-account</v-icon>
        </v-avatar>
      </v-card-title>
      <v-card-title class="justify-center">
        Enter your new password
      </v-card-title>
      <v-card-text>
        <v-form @submit.prevent="submit">
          <ValidationObserver ref="validator">
            <ValidationProvider
              name="Email"
              vid="email"
              rules="required|email"
              v-slot="{ errors }"
            >
              <v-text-field
                label="Email"
                v-model="form.email"
                prepend-inner-icon="mdi-email"
                :error-messages="errors"
                disabled
              />
            </ValidationProvider>
            <ValidationProvider
              vid="password"
              name="password"
              rules="required"
              v-slot="{ errors }"
            >
              <v-text-field
                v-model="form.password"
                label="New Password"
                :type="showPassword ? 'text' : 'password'"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showPassword = !showPassword"
                :error-messages="errors"
                prepend-inner-icon="mdi-lock"
              />
            </ValidationProvider>
            <ValidationProvider
              vid="password_confirmation"
              name="password_confirmation"
              rules="required"
              v-slot="{ errors }"
            >
              <v-text-field
                v-model="form.password_confirmation"
                label="Confirm New Password"
                :type="showPassword ? 'text' : 'password'"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showPassword = !showPassword"
                :error-messages="errors"
                prepend-inner-icon="mdi-lock"
              />
            </ValidationProvider>
          </ValidationObserver>

          <v-btn type="submit" block color="primary">Submit</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "ResetPassword",
  middleware: "auth",
  auth: "guest",
  layout: "plain",
  head: {
    title: 'Reset Password'
  },
  data: () => ({
    showPassword: false,

    form: {
      email: "",
      token: "",
      password: "",
      password_confirmation: "",
    },
    loading: false
  }),
  mounted() {
    this.form.email = this.$route.query.email
    this.form.token = this.$route.params.token
  },
  methods: {
    submit() {
      this.$refs.validator.validate().then(valid => {
        if (valid) {
          this.loading = true
          this.$axios
            .$post("/backend/reset-password", this.form)
            .then((resp) => {
              this.loading = false
              this.$root.$emit('toast', {text: 'Your password has been reset successfully', type: 'success'})
              this.$router.push('/login')
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
    },
  },
};
</script>
