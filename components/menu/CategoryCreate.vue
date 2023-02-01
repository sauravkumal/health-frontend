<template>
  <v-dialog
    v-model="dialog"
    width="500"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="primary" outlined v-bind="attrs" v-on="on">
        Add Category
      </v-btn>
    </template>

    <v-card>
      <v-card-title class="text-h5 grey lighten-2">
        Create Category
      </v-card-title>

      <v-card-text>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
        consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
        laborum.
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-btn depressed color="success">Save</v-btn>
        <v-btn depressed color="error">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "CategoryCreate",
  props: ['position'],
  data() {
    return {
      dialog: false,
      model: {
        title: ''
      }
    }
  },
  methods: {
    saveModel() {
      this.$axios.post("/backend/api/categories", {
        position: this.position,
        vendor_id: this.$auth.user.id,
        ...this.model
      }).then(resp => {
        this.saving = false
        this.edit = false
      })
        .catch(error => {
          this.saving = false
          this.$root.$emit("toast", {
            text: "Couldn't save",
            type: "error",
          })
        })
    }
  }
}
</script>

<style scoped>

</style>
