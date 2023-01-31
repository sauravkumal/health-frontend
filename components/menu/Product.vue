<template>
  <div> {{ $vnode.key + 1 }}. {{ product.title }}</div>
</template>

<script>
export default {
  name: "Product",
  props: ['product'],
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
    }
  }
}
</script>

<style scoped>

</style>
