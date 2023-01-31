<template>
  <table class="tw-w-full" @mouseenter="showActions=true" @mouseleave="showActions=false">
    <thead>
    <tr class="tw-w-full">
      <td class="tw-flex tw-space-x-4 tw-text-lg tw-pb-2 tw-items-center">
        <v-avatar size="25" color="primary" class="tw-text-white">{{ $vnode.key + 1 }}</v-avatar>
        <template v-if="edit">
          <ValidationObserver ref="validator">
            <ValidationProvider name="Title" vid="title" rules="required" v-slot="{errors}">
              <v-text-field v-model="model.title" dense single-line label="Title" hide-details="auto"
                            outlined
                            :error-messages="errors"
              ></v-text-field>
            </ValidationProvider>
          </ValidationObserver>
        </template>
        <span v-else class="tw-ml-4">{{ category.title }}</span>
        <template v-if="showActions && !edit">
          <v-btn text x-small @mouseenter.native @mouseleave.native
                 color="primary" @click="showEdit">Edit
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
      drag: false,
      edit: false,
      model: null
    }
  },
  watch: {
    'category': {
      handler: function (newVal) {
        if (newVal.position !== this.$vnode.key) {
          this.updatePosition()
        }
      }, immediate: true
    }
  },
  methods: {
    showEdit() {
      this.model = JSON.parse(JSON.stringify(this.category))
      this.edit = true
    },
    updatePosition() {
      this.$axios.put("/backend/api/categories/" + this.category.id, {
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
.ghost {
  @apply tw-opacity-50 tw-bg-gray-300;
}
</style>
