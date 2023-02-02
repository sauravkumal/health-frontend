<template>
  <v-dialog
    v-model="dialog"
    width="700"
  >
    <v-form @submit.prevent="saveModel">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          {{ action }} Product for {{ categoryTitle }}
        </v-card-title>

        <v-card-text class="tw-mt-4">
          <ValidationObserver ref="validator">
            <ValidationProvider name="Title" vid="title" rules="required" v-slot="{errors}">
              <v-text-field v-model="model.title" dense single-line label="Title" hide-details="auto"
                            outlined
                            :error-messages="errors"
              ></v-text-field>
            </ValidationProvider>
            <div>
              <v-file-input prepend-icon="" prepend-inner-icon="mdi-attachment" dense hide-details outlined
                            v-model="model.image" label="Image"></v-file-input>
              <ImageViewer :image="model.image" :url="model.image_url"></ImageViewer>
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
import ImageViewer from "./ImageViewer.vue";

export default {
  name: "ProductCreateEdit",
  components: {ImageViewer},
  props: ['position', 'categoryId', 'value', 'categoryTitle', 'id'],
  data() {
    return {
      dialog: this.value,
      model: {
        title: '',
        image: undefined
      },
      defaultModel: {
        title: '',
        image: undefined
      },
      saving: false
    }
  },
  computed: {
    action() {
      return this.id ? 'Edit' : 'Create'
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
    }
  },
  methods: {
    fetchModel() {
      this.$axios.get("/backend/api/products/" + this.id)
        .then(resp => {
          this.model = resp.data.data
        })
    },
    saveModel() {
      this.$refs.validator.validate().then(valid => {
        if (valid) {
          this.saving = true
          const params =
            {
              position: this.position,
              category_id: this.categoryId,
              vendor_id: this.$auth.user.id,
              ...this.model
            }
          const formData = new FormData()
          buildFormData(formData, params)
          if (this.id) {
            formData.append('_method', 'PUT')
            this.$axios.post("/backend/api/products/" + this.id, formData).then(resp => {
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
            this.$axios.post("/backend/api/products", formData).then(resp => {
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
