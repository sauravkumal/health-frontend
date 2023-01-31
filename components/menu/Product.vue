<template>
  <div> {{ $vnode.key + 1 }}. {{ product.title }}</div>
</template>

<script>
export default {
  name: "Product",
  props: ['product']
}
</script>

<style scoped>

</style>
