<template>
  <div class="tw-flex tw-space-x-2 tw-w-full" @mouseenter="showActions=true" @mouseleave="showActions=false">
    <div> {{ $vnode.key + 1 }}. {{ product.title }}</div>
    <template v-if="showActions">
      <v-btn icon x-small @mouseenter.native @mouseleave.native
             @click="$emit('editProduct',{id:product.id,
             subCategoryId: subCategory.id,
              position:subCategory.products.length,
              subCategoryTitle: subCategory.title})"
             color="primary">
        <v-icon small>mdi-pencil</v-icon>
      </v-btn>
      <v-btn icon x-small @mouseenter.native @mouseleave.native
             color="error" @click="remove">
        <v-icon small>mdi-delete</v-icon>
      </v-btn>
    </template>
  </div>
</template>

<script>
export default {
  name: "Product",
  props: ['product', 'subCategory'],
  data() {
    return {
      showActions: false
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

</style>
