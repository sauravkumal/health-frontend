<template>
  <v-dialog
    v-model="dialog"
    width="600"
  >
    <v-form @submit.prevent="saveModel">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          {{ action }} Staff
        </v-card-title>

        <v-card-text class="tw-mt-4">
          <ValidationObserver ref="validator" tag="div" class="tw-flex tw-flex-col tw-space-y-3">
            <div class="tw-flex tw-space-x-3">
              <div class="tw-flex tw-flex-col tw-space-y-3">
                <ValidationProvider name="Role" vid="role" rules="required" v-slot="{errors}">
                  <v-select :items="roles()"
                            item-text="title"
                            dense
                            outlined
                            v-model="model.role"
                            label="Role"
                            hide-details="auto"
                            :error-messages="errors"
                            item-value="value"/>

                </ValidationProvider>
                <v-file-input prepend-icon="" prepend-inner-icon="mdi-attachment" dense hide-details outlined
                              v-model="model.image" label="Profile"></v-file-input>
                <ImageViewer :image="model.image" :url="model.thumb_image_url"></ImageViewer>
              </div>
              <div class="tw-flex tw-flex-col tw-space-y-3">
                <ValidationProvider name="Name" vid="name" rules="required" v-slot="{errors}">
                  <v-text-field
                    dense
                    outlined
                    v-model="model.name"
                    label="Name"
                    hide-details="auto"
                    :error-messages="errors"
                    item-value="value"/>
                </ValidationProvider>

                <ValidationProvider name="Email" vid="email" rules="required|email" v-slot="{errors}">
                  <v-text-field
                    dense
                    outlined
                    v-model="model.email"
                    label="Email"
                    hide-details="auto"
                    :error-messages="errors"
                    item-value="value"/>
                </ValidationProvider>

                <ValidationProvider name="Phone No" vid="phone_no" rules="required" v-slot="{errors}">
                  <v-text-field
                    dense
                    outlined
                    v-model="model.phone_no"
                    label="Phone No"
                    hide-details="auto"
                    :error-messages="errors"
                    item-value="value"/>
                </ValidationProvider>

                <ValidationProvider name="Password" vid="password" :rules="this.id?'':'required'" v-slot="{errors}">
                  <v-text-field
                    dense
                    outlined
                    type="password"
                    v-model="model.password"
                    label="Password"
                    hide-details="auto"
                    :error-messages="errors"
                    item-value="value"/>
                </ValidationProvider>

                <v-switch v-model="model.active" label="Active"/>
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
import {roles} from "../../utils/constants";

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
        phone_no: '',
        password: '',
        active: true,
        image: undefined
      },
      defaultModel: {
        role: '',
        name: '',
        email: '',
        phone_no: '',
        password: '',
        active: true,
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
    roles() {
      return roles
    },
    fetchModel() {
      this.$axios.get("/backend/api/users/" + this.id)
        .then(resp => {
          this.model = resp.data
        })
    },
    saveModel() {
      this.$refs.validator.validate().then(valid => {
        if (valid) {
          this.saving = true
          const params = {...this.model, active: this.model.active ? '1' : '0'}
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
