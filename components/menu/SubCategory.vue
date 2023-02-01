<template>
  <table class="tw-h-full tw-border tw-border-solid tw-border-gray-300 tw-border-collapse"
         @mouseenter="showActions=true" @mouseleave="showActions=false"
  >
    <thead>
    <tr>
      <td class="tw-flex tw-flex-wrap tw-space-x-2 tw-bg-gray-200 tw-px-2 tw-text-base tw-py-1">
        <div>{{ $vnode.key + 1 }}. {{ subCategory.title }}</div>
        <template v-if="showActions && !edit">
          <v-btn text x-small @mouseenter.native @mouseleave.native
                 color="primary" @click="showEdit">Edit
          </v-btn>
          <v-btn text x-small @mouseenter.native @mouseleave.native
                 color="primary"
                 @click="$emit('createProduct',{subCategoryId: subCategory.id,
                  position:subCategory.products.length,
                   subCategoryTitle: subCategory.title
                 })">
            Add New Product
          </v-btn>
          <v-btn text x-small @mouseenter.native @mouseleave.native
                 color="error" @click="remove">Delete
          </v-btn>
        </template>
      </td>
    </tr>
    </thead>
    <tbody>
    <tr>
      <td class="tw-px-2">
        <Draggable class="tw-flex tw-flex-col tw-space-y-2 tw-my-2" v-model="subCategory.products" @start="drag=true"
                   @end="drag=false"
                   ghost-class="ghost">
          <Product @edited="$emit('edited')" :product="product" v-for="(product, index) in subCategory.products"
                   :key="index"/>
        </Draggable>
      </td>
    </tr>
    </tbody>
  </table>
</template>

<script>
import Product from "./Product.vue";
import draggable from "vuedraggable";

export default {
  name: "SubCategory",
  components: {Product, Draggable: draggable},
  props: ['subCategory'],
  data() {
    return {
      drag: false,
      showActions: false,
      edit: false,
      model: null,
    }
  },
  watch: {
    'subCategory': {
      handler: function (newVal) {
        if (newVal.position !== this.$vnode.key) {
          this.updatePosition()
        }
      }, immediate: true
    }
  },
  methods: {
    showEdit() {
      this.model = JSON.parse(JSON.stringify(this.subCategory))
      this.edit = true
    },
    updatePosition() {
      this.$axios.put("/backend/api/subCategories/" + this.subCategory.id, {
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

    remove() {
      if (window.confirm('Are you sure you want to delete? This action cannot be undone.')) {
        this.$axios.delete("/backend/api/subCategories/" + this.subCategory.id)
          .then(resp => {
            this.$emit('edited')
            this.$root.$emit("toast", {
              text: "Deleted successfully",
              type: "success",
            })
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
