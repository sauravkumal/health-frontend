<template>
  <v-form @submit.prevent="saveModel">
    <v-card flat>
      <v-card-title>Profile</v-card-title>
      <v-card-text>
        <ValidationProvider ref="validator" tag="div" class="tw-flex tw-space-x-6">
          <div class="tw-flex tw-flex-col tw-space-y-3">
            <v-file-input prepend-icon="" prepend-inner-icon="mdi-attachment" dense hide-details
                          v-model="model.image" label="Logo"></v-file-input>
            <ImageViewer width="200" :image="model.image" :url="model.thumb_image_url"></ImageViewer>
          </div>
          <div class="tw-flex tw-flex-col tw-space-y-3">
            <ValidationProvider name="Name" vid="name" rules="required" v-slot="{errors}"
                                class="tw-flex tw-space-x-4 tw-items-end">
              <label for="name">Name:</label>
              <v-text-field
                dense
                id="name"
                v-model="model.name"
                hide-details="auto"
                :error-messages="errors"
                item-value="value"/>
            </ValidationProvider>
          </div>
        </ValidationProvider>
      </v-card-text>
      <v-card-actions>
        <v-spacer/>
        <v-btn type="submit" color="success" depressed :loading="saving">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script>
import ImageViewer from "../ImageViewer.vue";
import {buildFormData} from "../../utils/helpers";

export default {
  name: "Profile",
  components: {ImageViewer},
  data() {
    return {
      saving: false,
      model: JSON.parse(JSON.stringify(this.$auth.user))
    }
  },

  methods: {
    saveModel() {
      console.log('sdfsd');
      this.$refs.validator.validate().then(valid => {
        if (valid) {
          this.saving = true
          const {name, email, description, phone_no, image, lat, lng, address} = this.model
          const params = {name, email, description, phone_no, image, lat, lng, address}
          const formData = new FormData()
          buildFormData(formData, params)
          formData.append('_method', 'PUT')
          this.$axios.post("/backend/api/users/" + this.model.id, formData).then(resp => {
            this.$refs.validator.reset()
            this.saving = false
            this.$root.$emit("toast", {
              text: "Saved",
              type: "success",
            })
            this.$auth.fetchUser()
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
