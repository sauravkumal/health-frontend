<template>
  <v-dialog
    v-model="dialog"
    class="!tw-w-full"
  >
    <v-form @submit.prevent="saveModel">
      <v-card>
        <v-card-title class="tw-text-lg grey lighten-2">
          {{ action }} {{ action === 'Edit' ? model.title : 'Product' }} for {{ categoryTitle }}
        </v-card-title>

        <v-card-text class="tw-mt-4">
          <ValidationObserver ref="validator" tag="div" class="tw-flex tw-flex-col tw-gap-y-3">
            <ValidationProvider name="Title" vid="title" rules="required" v-slot="{errors}">
              <v-text-field v-model="model.title" dense label="Title" hide-details="auto"
                            outlined
                            :error-messages="errors"
              ></v-text-field>
            </ValidationProvider>
            <div class="tw-flex tw-flex-col sm:tw-flex-row tw-gap-3">
              <div class="tw-flex tw-flex-col tw-gap-y-3">
                <v-file-input prepend-icon="" prepend-inner-icon="mdi-attachment" dense hide-details outlined
                              v-model="model.image" label="Image"></v-file-input>
                <ImageViewer class="tw-h-28" :image="model.image" :url="model.thumb_image_url"></ImageViewer>
              </div>
              <div class="tw-grow">
                <ValidationProvider name="Pricing Types" vid="pricing_types" rules="required" v-slot="{errors}">
                  <v-select label="Pricing Type" dense outlined hide-details="auto"
                            chips
                            clearable
                            :items="pricingUnits()"
                            item-text="title"
                            item-value="value"
                            multiple
                            deletable-chips
                            small-chips
                            v-model="model.pricing_types" :error-messages="errors"></v-select>
                </ValidationProvider>

                <div class="tw-flex tw-flex-col tw-gap-y-3" v-for="(detail, index) in model.pricing_details">
                  <div>
                    <div class="tw-my-2">Per <span class="tw-font-semibold">{{ pricingUnitsByKey[detail.type] }}</span>
                      Pricing
                    </div>
                    <div class="tw-flex tw-gap-x-3">
                      <ValidationProvider name="Current Price" :vid="'current_price'+index.toString()" rules="required"
                                          v-slot="{errors}">
                        <v-text-field v-model="model.pricing_details[index].price" dense label="Current Price"
                                      hide-details="auto"
                                      outlined
                                      prefix="Rs"
                                      type="number"
                                      :error-messages="errors"
                        ></v-text-field>
                      </ValidationProvider>
                      <v-text-field v-model="model.pricing_details[index].previousPrice" dense label="Previous Price"
                                    hide-details="auto"
                                    outlined
                                    prefix="Rs"
                                    type="number"
                      ></v-text-field>

                      <v-text-field v-model="model.pricing_details[index].credits" dense label="Credits"
                                    hide-details="auto"
                                    outlined
                                    prefix="Rs"
                                    type="number"
                      ></v-text-field>
                    </div>
                  </div>
                </div>
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
import {pricingUnits, pricingUnitsByKey} from "../../utils/constants";
import {difference} from 'lodash'

export default {
  name: "ProductCreateEdit",
  components: {ImageViewer},
  props: ['position', 'categoryId', 'value', 'categoryTitle', 'id', 'product'],
  data() {
    return {
      dialog: this.value,
      model: {
        title: '',
        pricing_types: [],
        pricing_details: [],
        image: undefined
      },
      defaultModel: {
        title: '',
        pricing_types: [],
        pricing_details: [],
        image: undefined
      },
      saving: false
    }
  },
  computed: {
    pricingUnitsByKey() {
      return pricingUnitsByKey
    },
    action() {
      return this.id ? 'Edit' : 'Create'
    }
  },
  watch: {
    'model.pricing_types': {
      handler: function (newVal, oldVal) {
        const addedItems = difference(newVal, oldVal)
        const removedItems = difference(oldVal, newVal)
        const temp = this.model.pricing_details

        if (addedItems.length) {
          addedItems.forEach(item => {
            const existing = temp.find(detail => detail.type === item)
            if (!existing) {
              temp.push({
                type: item,
                price: null,
                previousPrice: null,
                credits: null
              })
            }
          })
        }

        if (removedItems.length) {
          removedItems.forEach(item => {
            const index = temp.indexOf(detail => detail.type === item)
            temp.splice(index, 1)
          })
        }

        this.model.pricing_details = temp
      }
    },
    id: {
      handler: function (newVal) {
        if (newVal) {
          this.model = this.product
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
    pricingUnits() {
      return pricingUnits
    },
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
