<template>
  <v-dialog
    v-model="dialog"
    width="700"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="primary" outlined v-bind="attrs" v-on="on">
        Add Category
      </v-btn>
    </template>

    <v-form @submit.prevent="saveModel">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          Create Category
        </v-card-title>

        <v-card-text class="tw-mt-4">
          <ValidationObserver ref="validator">
            <ValidationProvider name="Title" vid="title" rules="required" v-slot="{errors}">
              <v-text-field v-model="model.title" dense single-line label="Title" hide-details="auto"
                            outlined
                            :error-messages="errors"
              ></v-text-field>
            </ValidationProvider>
          </ValidationObserver>
        </v-card-text>
        <v-card-actions>
          <v-btn depressed type="submit" color="success" :loading="saving">Save</v-btn>
          <v-btn depressed color="error" @click="dialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
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
      },
      saving: false
    }
  },
  methods: {
    saveModel() {
      this.$refs.validator.validate().then(valid => {
        if (valid) {
          this.saving = true
          this.$axios.post("/backend/api/categories", {
            position: this.position,
            vendor_id: this.$auth.user.id,
            ...this.model
          }).then(resp => {
            this.saving = false
            this.dialog = false
            this.$emit('created')
          })
            .catch(error => {
              this.saving = false
              this.$root.$emit("toast", {
                text: "Couldn't save",
                type: "error",
              })
            })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
