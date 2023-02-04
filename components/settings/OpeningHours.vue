<template>
  <v-form @submit.prevent="saveModel">
    <v-card flat>
      <v-card-title>Opening Hours</v-card-title>
      <v-card-text>
        <ValidationObserver ref="validator" class="tw-flex tw-flex-col tw-space-y-3">
          <div class="tw-flex tw-space-x-3 tw-items-center" v-for="(item, index) in model.opening_hours" :key="index">
            <div class="tw-font-semibold">{{ item.title }}</div>
            <v-switch class="!tw-mt-0 !tw-pt-0" hide-details v-model="model.opening_hours[index].enabled"></v-switch>
            <label :for="item.title+'from'">From</label>
            <ValidationProvider name="From" :vid="index.toString()+'from'" rules="required" v-slot:="{errors}">
              <v-text-field type="time" dense outlined hide-details="auto" :id="item.title+'from'"
                            :error-messages="errors"
                            :disabled="!item.enabled"
                            v-model="model.opening_hours[index].open"></v-text-field>
            </ValidationProvider>

            <label :for="item.title+'to'">From</label>
            <ValidationProvider name="To" :vid="index.toString()+'to'" rules="required" v-slot:="{errors}">
              <v-text-field type="time" dense outlined hide-details="auto" :id="item.title+'from'"
                            :error-messages="errors"
                            :disabled="!item.enabled"
                            v-model="model.opening_hours[index].close"></v-text-field>
            </ValidationProvider>
          </div>

        </ValidationObserver>
      </v-card-text>
      <v-card-actions>
        <v-spacer/>
        <v-btn type="submit" color="success" depressed :loading="saving">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script>
import {buildFormData} from "../../utils/helpers";

export default {
  name: "OpeningHours",
  data() {
    return {
      saving: false,
      model: JSON.parse(JSON.stringify(this.$auth.user))
    }
  },
  methods: {
    saveModel() {
      this.$refs.validator.validate().then(valid => {
        if (valid) {
          this.saving = true
          const {opening_hours} = this.model
          const params = {opening_hours}
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
