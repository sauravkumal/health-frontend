<template>
  <v-form @submit.prevent="saveModel">
    <v-card elevation="4">
      <v-card-title class="!tw-p-1">Profile</v-card-title>
      <v-card-text class="!tw-px-1">
        <ValidationObserver ref="validator">
          <ValidationProvider ref="validator" tag="div" class="tw-flex tw-gap-x-6">
            <div class="tw-flex tw-grow tw-flex-col tw-gap-y-3 tw-self-start">
              <ValidationProvider name="Name" vid="name" rules="required" v-slot="{errors}"
                                  class="tw-flex tw-gap-x-4 tw-items-center">
                <label for="name">Name:</label>
                <v-text-field
                  dense
                  id="name"
                  outlined
                  v-model="model.name"
                  hide-details="auto"
                  :error-messages="errors"
                  item-value="value"/>
              </ValidationProvider>

              <ValidationProvider name="Email" vid="email" rules="required|email" v-slot="{errors}"
                                  class="tw-flex tw-gap-x-4 tw-items-center">
                <label for="email">Email:</label>
                <v-text-field
                  dense
                  id="email"
                  outlined
                  v-model="model.email"
                  hide-details="auto"
                  :error-messages="errors"
                  item-value="value"/>
              </ValidationProvider>

              <ValidationProvider name="Phone No" vid="phone_no" rules="required" v-slot="{errors}"
                                  class="tw-flex tw-gap-x-4 tw-items-center">
                <label for="phone_no">Phone No:</label>
                <v-text-field
                  dense
                  id="phone_no"
                  outlined
                  v-model="model.phone_no"
                  hide-details="auto"
                  :error-messages="errors"
                  item-value="value"/>
              </ValidationProvider>

              <ValidationProvider name="Address" vid="address" rules="required" v-slot="{errors}"
                                  class="tw-flex tw-gap-x-4 tw-items-center">
                <label for="address">Address:</label>
                <v-text-field
                  dense
                  id="address"
                  outlined
                  v-model="model.address"
                  hide-details="auto"
                  :error-messages="errors"
                  item-value="value"/>
              </ValidationProvider>
            </div>
            <div class="tw-flex tw-flex-col tw-gap-y-3 tw-self-start">
              <v-file-input prepend-icon="" prepend-inner-icon="mdi-attachment" dense hide-details outlined
                            v-model="model.image" label="Logo"></v-file-input>
              <ImageViewer class="tw-w-32" :image="model.image" :url="model.thumb_image_url"></ImageViewer>
            </div>
            <div class="tw-flex tw-flex-col tw-gap-y-3 tw-self-start">
              <label>Select your location</label>
              <GMap class="tw-h-56 tw-w-96">
                <GMapMarker :draggable="true" @dragend="setLatLng" v-if="model.lat && model.lng"
                            :center="{lat:parseFloat(model.lat), lng:parseFloat(model.lng)}"></GMapMarker>
              </GMap>
            </div>
          </ValidationProvider>
        </ValidationObserver>
      </v-card-text>
      <v-card-actions>
        <v-btn small type="submit" color="success" depressed :loading="saving">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script>
import ImageViewer from "../ImageViewer.vue";
import {buildFormData} from "../../utils/helpers";
import GMap from "../GMap.vue";
import GMapMarker from "../GMapMarker.vue";
import {defaultCenter} from "../../utils/constants";

export default {
  name: "Profile",
  components: {GMapMarker, GMap, ImageViewer},
  data() {
    return {
      saving: false,
      model: JSON.parse(JSON.stringify(this.$auth.user))
    }
  },

  mounted() {
    if (!this.model.lat && !this.model.lng) {
      this.model.lat = defaultCenter.lat
      this.model.lng = defaultCenter.lng
    }
  },

  methods: {
    setLatLng(event) {
      this.model.lat = event.lat
      this.model.lng = event.lng
    },
    saveModel() {
      this.$refs.validator.validate().then(valid => {
        if (valid) {
          this.saving = true
          const {name, email, phone_no, image, lat, lng, address} = this.model
          const params = {name, email, phone_no, image, lat, lng, address}
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
