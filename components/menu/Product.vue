<template>
  <table class="tw-h-full tw-border tw-border-solid tw-border-gray-300 tw-border-collapse"
         @mouseenter="showActions=true" @mouseleave="showActions=false"
  >
    <thead>
    <tr>
      <td class="tw-flex tw-flex-wrap tw-space-x-2 tw-bg-gray-200 tw-px-2 tw-text-base tw-py-1 tw-items-center">
        <div>{{ $vnode.key + 1 }}.</div>
        <div class="tw-ml-2">{{ product.title }}</div>
        <template v-if="showActions">
          <v-btn icon x-small @mouseenter.native @mouseleave.native
                 @click="$emit('editProduct',{id:product.id,
                categoryId: category.id,
                position:category.products.length,
                categoryTitle: category.title})"
                 color="primary">
            <v-icon small>mdi-pencil</v-icon>
          </v-btn>

          <v-btn icon x-small @mouseenter.native @mouseleave.native
                 color="error" @click="remove">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </td>
    </tr>
    </thead>
    <tbody>
    <tr>
      <td class="tw-p-1">
        <div class="tw-flex tw-space-x-2">
          <v-img class="tw-border tw-border-solid tw-border-gray-300" :src="product.thumb_image_url"
                 width="100"></v-img>
          <div>
            <div class="tw-font-semibold">Pricing Details</div>
            <div class="tw-flex tw-flex-col" v-for="(detail, index) in product.pricing_details">
              <div><span class="tw-font-semibold">Per {{ pricingUnitsByKey[detail.type] }} pricing:</span>
                <span v-if="detail.previousPrice"
                      class="tw-line-through tw-text-gray-400">Rs {{ detail.previousPrice }}</span>
                <span>Rs {{ detail.price }}</span></div>

              <div v-if="detail.credits"><span class="tw-font-semibold">Credits:</span> <span>Rs {{
                  detail.credits
                }}</span></div>
            </div>
          </div>
          <div>
          </div>
        </div>
      </td>
    </tr>
    </tbody>
  </table>
</template>

<script>
import draggable from "vuedraggable";
import {pricingUnitsByKey} from "../../utils/constants";

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
      showActions: false,
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
