<template>
  <div>
    <div class="tw-text-lg">{{ category.title }}</div>
    <div class="tw-flex tw-space-x-4">
      <SubCategory :sub-category="subCategory" :key="index"
                   v-for="(subCategory, index) in category.subCategories"></SubCategory>
    </div>
  </div>
</template>

<script>
import SubCategory from "./SubCategory.vue";

export default {
  name: "Category",
  components: {SubCategory},
  props: ['category']
}
</script>

<style scoped>

</style>
