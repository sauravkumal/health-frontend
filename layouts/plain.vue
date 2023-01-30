<template>
  <v-app dark>
    <nuxt/>
    <v-snackbar v-model="snackbar" :color="snackbarColor" app>
      {{ snackbarText }}
      <template v-slot:action="{ attrs }">
        <v-btn
          v-bind="attrs"
          @click="snackbar = false"
          icon
        >
          <v-icon>mdi-window-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>
<script>
export default {
  name: 'PlainLayout',
  layout:'plain',
  data() {
    return {
      snackbar: false,
      snackbarColor: undefined,
      snackbarText: '',
    }
  },
  created() {
    this.$root.$on('toast', (event) => {
      this.handleToast(event)
    })
  },
  methods: {
    handleToast(params) {
      this.snackbarText = params.text
      switch (params.type) {
        case 'success':
          this.snackbarColor = 'success'
          break
        case 'error':
          this.snackbarColor = 'error'
          break
        case 'warning':
          this.snackbarColor = 'warming'
          break
        default:
          this.snackbarColor = undefined
      }
      this.snackbar = true
    },
  }
}
</script>
