<template>
  <table class="tw-border tw-border-solid tw-w-full tw-m-2 tw-p-2">
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
