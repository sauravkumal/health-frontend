<template>
  <v-card ripple elevation="4" width="150">
    <v-img class="handle" v-if="product.thumb_image_url" :src="product.thumb_image_url" height="70"></v-img>
    <div class="tw-p-2">
      <div class="tw-font-semibold handle">{{ product.title }}</div>
      <div class="handle">
        <div
          class="tw-flex tw-flex-col tw-border last:tw-border-0 tw-border-x-0 tw-border-t-0 tw-border-solid tw-border-gray-300"
          v-for="(detail, index) in product.pricing_details">
          <div class="tw-flex tw-justify-between tw-items-baseline">
            <div class="tw-text-xs">Per {{ pricingUnitsByKey[detail.type] }}</div>
            <div class="tw-text-sm tw-text-orange-500">Rs {{ currency(detail.price) }}</div>
          </div>
          <div v-if="detail.previousPrice"
               class="tw-text-gray-400 tw-text-xs tw-text-end"><span class="tw-line-through">Rs {{
              detail.previousPrice
            }}</span>
            <span class="tw-text-gray-800">{{ discountPercent(detail).toFixed(2) }}%</span>
          </div>

          <div v-if="detail.credits" class="tw-flex tw-justify-between tw-items-baseline">
            <div>Credits:</div>
            <div class="tw-text-orange-500">Rs {{
                detail.credits
              }}
            </div>
          </div>
        </div>

      </div>
      <div class="tw-flex tw-justify-between">
        <v-btn icon small @mouseenter.native @mouseleave.native
               @click="$emit('editProduct',{id:product.id,
                categoryId: category.id,
                position:category.products.length,
                product: product,
                categoryTitle: category.title})"
               color="primary">
          <v-icon small>mdi-pencil</v-icon>
        </v-btn>
        <v-btn icon small @mouseenter.native @mouseleave.native
               color="error" @click="remove">
          <v-icon small>mdi-delete</v-icon>
        </v-btn>
      </div>
    </div>
  </v-card>
</template>

<script>
import draggable from "vuedraggable";
import {pricingUnitsByKey} from "../../utils/constants";
import {currency} from "../../utils/helpers";

export default {
  name: "Product",
  computed: {
    pricingUnitsByKey() {
      return pricingUnitsByKey
    }
  },
  components: {Draggable: draggable},
  props: ['product', 'category'],
  data() {
    return {
      drag: false,
      model: null,
      saving: false
    }
  },
  watch: {
    'product': {
      handler: function (newVal) {
        if (newVal.position !== this.$vnode.key) {
          this.updatePosition()
        }
      }, immediate: true
    }
  },
  methods: {
    currency,
    discountPercent(detail) {
      return -(detail.previousPrice - detail.price) / detail.previousPrice * 100
    },
    updatePosition() {
      this.$axios.put("/backend/api/products/" + this.product.id, {
        position: this.$vnode.key
      }).then(resp => {
      })
        .catch(error => {
          this.$root.$emit("toast", {
            text: "Couldn't update",
            type: "error",
          })
        })
    },

    saveModel() {
      this.$refs.validator.validate().then(valid => {
        if (valid) {
          this.saving = true
          this.$axios.put("/backend/api/products/" + this.model.id, {
            position: this.$vnode.key,
            ...this.model
          }).then(resp => {
            this.saving = false
            this.model = null
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
    },

    remove() {
      if (window.confirm('Are you sure you want to delete? This action cannot be undone.')) {
        this.$axios.delete("/backend/api/products/" + this.product.id)
          .then(resp => {
            this.$emit('edited')
          }).catch(err => {
          this.$root.$emit("toast", {
            text: "Couldn't delete",
            type: "error",
          })
        })
      }
    }

  }
}
</script>

<style scoped>
.ghost {
  @apply tw-opacity-50 tw-bg-gray-300;
}
</style>
