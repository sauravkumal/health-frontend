<template>
  <table class="tw-h-full tw-border tw-border-solid tw-border-gray-300 tw-border-collapse"
         @mouseenter="showActions=true" @mouseleave="showActions=false"
  >
    <thead>
    <tr>
      <td class="tw-flex tw-flex-wrap tw-space-x-2 tw-bg-gray-200 tw-px-2 tw-text-base tw-py-1">
        <div>{{ $vnode.key + 1 }}.</div>
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
            <v-btn type="submit" color="success" icon :loading="saving">
              <v-icon>mdi-check</v-icon>
            </v-btn>
            <v-btn color="error" icon @click="edit=false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-form>
        </template>
        <div v-else class="tw-ml-2">{{ subCategory.title }}</div>
        <template v-if="showActions && !edit">
          <v-btn icon x-small @mouseenter.native @mouseleave.native
                 color="primary" @click="showEdit">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon x-small @mouseenter.native @mouseleave.native
                 color="primary"
                 @click="$emit('createProduct',{subCategoryId: subCategory.id,
                  position:subCategory.products.length,
                   subCategoryTitle: subCategory.title
                 })">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
          <v-btn icon x-small @mouseenter.native @mouseleave.native
                 color="error" @click="remove">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </td>
    </tr>
    </thead>
    <tbody>
    <tr>
      <td class="tw-px-2">
        <Draggable class="tw-flex tw-flex-col tw-space-y-2 tw-my-2" v-model="subCategory.products" @start="drag=true"
                   @end="drag=false"
                   ghost-class="ghost">
          <Product @edited="$emit('edited')" :product="product" v-for="(product, index) in subCategory.products"
                   :key="index"/>
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
      drag: false,
      showActions: false,
      edit: false,
      model: null,
      saving: false
    }
  },
  watch: {
    'subCategory': {
      handler: function (newVal) {
        if (newVal.position !== this.$vnode.key) {
          this.updatePosition()
        }
      }, immediate: true
    }
  },
  methods: {
    showEdit() {
      this.model = JSON.parse(JSON.stringify(this.subCategory))
      this.edit = true
    },
    updatePosition() {
      this.$axios.put("/backend/api/subCategories/" + this.subCategory.id, {
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
          this.$axios.put("/backend/api/subCategories/" + this.model.id, {
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
        this.$axios.delete("/backend/api/subCategories/" + this.subCategory.id)
          .then(resp => {
            this.$emit('edited')
            this.$root.$emit("toast", {
              text: "Deleted successfully",
              type: "success",
            })
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
