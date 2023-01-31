<template>
  <table class="tw-w-full" @mouseenter="showActions=true" @mouseleave="showActions=false">
    <thead>
    <tr class="tw-w-full">
      <td class="tw-text-lg tw-pb-2">
        <v-avatar size="25" color="primary" class="tw-text-white">{{ $vnode.key + 1 }}</v-avatar>
        <span class="tw-ml-4">{{ category.title }}</span>
        <template v-if="showActions">
          <v-btn text x-small @mouseenter.native @mouseleave.native
                 color="primary">Edit Title
          </v-btn>
          <v-btn text x-small @mouseenter.native @mouseleave.native
                 color="primary">Add New Sub category
          </v-btn>
        </template>
      </td>
    </tr>
    </thead>
    <tbody>
    <tr>
      <td class="tw-border tw-border-solid tw-border-gray-200 tw-p-4 tw-bg-gray-50">
        <Draggable class="tw-flex tw-space-x-2" v-model="category.subCategories" @start="drag=true"
                   @end="drag=false"
                   ghost-class="ghost">
          <SubCategory :key="index" :sub-category="subCategory" v-for="(subCategory, index) in category.subCategories"/>
        </Draggable>
      </td>
    </tr>
    </tbody>
  </table>
</template>

<script>
import SubCategory from "./SubCategory.vue";
import draggable from "vuedraggable";

export default {
  name: "Category",
  components: {SubCategory, Draggable: draggable},
  props: ['category'],
  data() {
    return {
      showActions: false,
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
