<template>
  <table class="tw-w-full" @mouseenter="showActions=true" @mouseleave="showActions=false">
    <thead>
    <tr class="tw-w-full">
      <td class="tw-flex tw-space-x-4 tw-text-lg tw-pb-2 tw-items-center">
        <v-avatar size="25" color="primary" class="tw-text-white">{{ $vnode.key + 1 }}</v-avatar>
        <template v-if="edit">
          <v-form @submit.prevent="saveModel" class="tw-flex tw-space-x-2">
            <ValidationObserver ref="validator">
              <ValidationProvider name="Title" vid="title" rules="required" v-slot="{errors}">
                <v-text-field v-model="model.title" dense single-line label="Title" hide-details="auto"
                              outlined
                              :error-messages="errors"
                ></v-text-field>
              </ValidationProvider>
            </ValidationObserver>
            <v-btn small type="submit" color="success" icon :loading="saving">
              <v-icon>mdi-check</v-icon>
            </v-btn>
            <v-btn small color="error" icon @click="edit=false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-form>
        </template>
        <span v-else class="tw-ml-4">{{ category.title }}</span>
        <template v-if="showActions && !edit">
          <v-btn text x-small @mouseenter.native @mouseleave.native
                 color="primary" @click="showEdit">Edit
          </v-btn>
          <v-btn text x-small @mouseenter.native @mouseleave.native
                 color="primary"
                 @click="$emit('createSubCategory',{categoryId: category.id, position:category.subCategories.length, categoryTitle: category.title})">
            Add New Sub category
          </v-btn>
          <v-btn text x-small @mouseenter.native @mouseleave.native
                 color="error" @click="remove">Delete
          </v-btn>
        </template>
      </td>
    </tr>
    </thead>
    <tbody>
    <tr>
      <td class="tw-border tw-border-solid tw-border-gray-200 tw-p-4 tw-bg-gray-50">
        <Draggable class="tw-flex tw-flex-wrap tw-gap-x-2 tw-gap-y-2" v-model="category.subCategories"
                   @start="drag=true"
                   @end="drag=false"
                   ghost-class="ghost">
          <SubCategory :key="index" :sub-category="subCategory"
                       v-on="$listeners"
                       v-for="(subCategory, index) in category.subCategories"/>
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
      model: null,
      saving: false
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
    },

    saveModel() {
      this.$refs.validator.validate().then(valid => {
        if (valid) {
          this.saving = true
          this.$axios.put("/backend/api/categories/" + this.model.id, {
            position: this.$vnode.key,
            ...this.model
          }).then(resp => {
            this.saving = false
            this.edit = false
            this.model = null
            this.$emit('edited')
          })
            .catch(error => {
              this.saving = false
              this.$root.$emit("toast", {
                text: "Couldn't save",
                type: "error",
              })
            })
        }
      })
    },
    remove() {
      if (window.confirm('Are you sure you want to delete? This action cannot be undone.')) {
        this.$axios.delete("/backend/api/categories/" + this.category.id)
          .then(resp => {
            this.$emit('edited')
          }).catch(err => {
          this.$root.$emit("toast", {
            text: "Couldn't delete",
            type: "error",
          })
        })
      }
    }
  }
}
</script>

<style scoped>
.ghost {
  @apply tw-opacity-50 tw-bg-gray-300;
}
</style>
