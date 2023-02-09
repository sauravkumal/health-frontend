<template>
  <v-form @submit.prevent="saveModel">
    <v-card elevation="4">
      <v-card-title>Opening Hours</v-card-title>
      <v-card-text>
        <ValidationObserver ref="validator" tag="div" class="tw-flex tw-flex-col tw-space-y-2">
          <div class="tw-grid tw-grid-cols-12 tw-gap-x-2 tw-items-center"
               v-for="(item, index) in model.opening_hours"
               :key="index">
            <div class="tw-font-semibold tw-col-span-2">{{ item.title }}</div>
            <v-switch class="!tw-mt-0 !tw-pt-0 tw-col-span-1" hide-details
                      v-model="model.opening_hours[index].enabled"></v-switch>
            <label :for="item.title+'open'" class="tw-text-end">Open</label>
            <ValidationProvider class="tw-col-span-3" name="Open" :vid="index.toString()+'open'" rules="required"
                                v-slot="{errors}">
              <v-text-field type="time" dense outlined hide-details="auto" :id="item.title+'open'"
                            :error-messages="errors"
                            :disabled="!item.enabled"
                            v-model="model.opening_hours[index].open"></v-text-field>
            </ValidationProvider>

            <label :for="item.title+'close'" class="tw-text-end">Close</label>
            <ValidationProvider class="tw-col-span-3" name="To" :vid="index.toString()+'close'" rules="required"
                                v-slot="{errors}">
              <v-text-field type="time" dense outlined hide-details="auto" :id="item.title+'close'"
                            :error-messages="errors"
                            :disabled="!item.enabled"
                            v-model="model.opening_hours[index].close"></v-text-field>
            </ValidationProvider>
          </div>
        </ValidationObserver>
      </v-card-text>
      <v-card-actions>
        <v-btn small type="submit" color="success" depressed :loading="saving">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script>

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
          this.$axios.put("/backend/api/users/" + this.model.id, params).then(resp => {
            this.$refs.validator.reset()
            this.saving = false
            this.$root.$emit("toast", {
              text: "Saved",
              type: "success",
            })
            this.$auth.fetchUser()
          })
            .catch(error => {
              this.model.opening_hours = JSON.parse(JSON.stringify(this.$auth.user.opening_hours))
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
