<template>
  <div>
    <div class="tw-text-base">{{ subCategory.title }}</div>
    <div>
      <Product :product="product" :key="index"
               v-for="(product, index) in subCategory.products"></Product>
    </div>
  </div>
</template>

<script>
import Product from "./Product.vue";

export default {
  name: "SubCategory",
  components: {Product},
  props: ['subCategory']
}
</script>

<style scoped>

</style>
