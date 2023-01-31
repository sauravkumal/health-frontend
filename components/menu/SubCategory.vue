<template>
  <table class="tw-w-full tw-h-full">
    <thead>
    <tr>{{ subCategory.title }}</tr>
    </thead>
    <tbody>
    <tr v-for="(product, index) in subCategory.products" :key="index">
      <td>
        <Product :product="product"/>
      </td>
    </tr>
    </tbody>
  </table>
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
