<template>
  <v-dialog
    v-model="dialog"
    width="800"
  >
    <v-form @submit.prevent="saveModel">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          {{ action }} Staff
        </v-card-title>

        <v-card-text class="tw-mt-4">
          <ValidationObserver ref="validator" tag="div" class="tw-flex tw-flex-col tw-space-y-3">
            <ValidationProvider name="Title" vid="title" rules="required" v-slot="{errors}">
              <v-text-field v-model="model.title" dense label="Title" hide-details="auto"
                            outlined
                            :error-messages="errors"
              ></v-text-field>
            </ValidationProvider>
            <div class="tw-flex tw-space-x-3">
              <div class="tw-flex tw-flex-col tw-space-y-3">
                <v-file-input prepend-icon="" prepend-inner-icon="mdi-attachment" dense hide-details outlined
                              v-model="model.image" label="Image"></v-file-input>
                <ImageViewer :image="model.image" :url="model.thumb_image_url"></ImageViewer>
              </div>
            </div>
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
import {buildFormData} from "../../utils/helpers";
import ImageViewer from "../ImageViewer.vue";

export default {
  name: "StaffCreateEdit",
  components: {ImageViewer},
  props: ['value', 'id'],
  data() {
    return {
      dialog: this.value,
      model: {
        role: '',
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        image: undefined
      },
      defaultModel: {
        role: '',
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        image: undefined
      },
      saving: false
    }
  },
  computed: {
    action() {
      return this.id ? 'Edit' : 'Add'
    }
  },
  watch: {
    id: {
      handler: function (newVal) {
        if (newVal) {
          this.fetchModel()
        }
      },
      immediate: true
    },
    value: function (newVal) {
      if (newVal !== this.dialog) {
        this.dialog = newVal
      }
    },
    dialog: function (newVal) {
      this.$emit('input', newVal)
      if (!newVal) {
        this.model = JSON.parse(JSON.stringify(this.defaultModel))
      }
    }
  },
  methods: {
    fetchModel() {
      this.$axios.get("/backend/api/users/" + this.id)
        .then(resp => {
          this.model = resp.data.data
        })
    },
    saveModel() {
      this.$refs.validator.validate().then(valid => {
        if (valid) {
          this.saving = true
          const params = {...this.model}
          const formData = new FormData()
          buildFormData(formData, params)
          if (this.id) {
            formData.append('_method', 'PUT')
            this.$axios.post("/backend/api/users/" + this.id, formData).then(resp => {
              this.model = JSON.parse(JSON.stringify(this.defaultModel))
              this.$refs.validator.reset()
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
          } else {
            this.$axios.post("/backend/api/users", formData).then(resp => {
              this.model = JSON.parse(JSON.stringify(this.defaultModel))
              this.$refs.validator.reset()
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
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
