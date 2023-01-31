<template>
  <table class="tw-w-full tw-h-full tw-border tw-border-solid tw-border-gray-300 tw-border-collapse">
    <thead>
    <tr>
      <td class="tw-bg-gray-200 tw-px-2 tw-text-base tw-py-1">{{ $vnode.key + 1 }}. {{ subCategory.title }}</td>
    </tr>
    </thead>
    <tbody>
    <tr>
      <td class="tw-px-2">
        <Draggable class="tw-flex tw-flex-col tw-space-y-2 tw-my-2" v-model="subCategory.products" @start="drag=true"
                   @end="drag=false"
                   ghost-class="ghost">
          <Product :product="product" v-for="(product, index) in subCategory.products" :key="index"/>
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
      drag: false
    }
  }
}
</script>

<style scoped>
.ghost {
  @apply tw-opacity-50 tw-bg-gray-300;
}
</style>
