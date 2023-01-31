<template>
  <table class="tw-w-full">
    <thead>
    <tr class="tw-w-full">
      <td class="tw-text-lg">
        <v-avatar size="25" color="primary" class="tw-text-white">{{ $vnode.key + 1 }}</v-avatar>
        <span class="tw-ml-4">{{ category.title }}</span>
        <template v-if="showActions">
          <v-btn text x-small color="primary">Edit Title</v-btn>
          <v-btn text x-small color="primary">Add New Sub category</v-btn>
        </template>
      </td>
    </tr>
    </thead>
    <tbody>
    <tr>
      <td class="tw-border tw-border-solid tw-border-gray-500" v-for="(subCategory, index) in category.subCategories"
          :key="index">
        <SubCategory :sub-category="subCategory"/>
      </td>
    </tr>
    </tbody>
  </table>
</template>

<script>
import SubCategory from "./SubCategory.vue";

export default {
  name: "Category",
  components: {SubCategory},
  props: ['category'],
  data() {
    return {
      showActions: false
    }
  }
}
</script>

<style scoped>

</style>
