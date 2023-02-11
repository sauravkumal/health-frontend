<template>
  <v-card class="!tw-bg-gray-100 tw-p-2 !animation" flat>
    <table class="tw-w-full">
      <thead>
      <tr class="tw-w-full handle">
        <td class="tw-flex tw-gap-2 tw-text-lg tw-pb-1 tw-items-center">
          <v-avatar size="20" color="primary" class="tw-text-white">{{ $vnode.key + 1 }}</v-avatar>
          <template v-if="edit">
            <v-form @submit.prevent="saveModel" class="tw-flex tw-gap-x-2 tw-items-center">
              <ValidationObserver ref="validator">
                <ValidationProvider name="Title" vid="title" rules="required" v-slot="{errors}">
                  <v-text-field v-model="model.title" dense single-line label="Title" hide-details="auto"
                                outlined
                                :error-messages="errors"
                  ></v-text-field>
                </ValidationProvider>
              </ValidationObserver>
              <v-btn type="submit" color="success" icon :loading="saving">
                <v-icon small>mdi-check</v-icon>
              </v-btn>
              <v-btn color="error" icon @click="edit=false">
                <v-icon small>mdi-close</v-icon>
              </v-btn>
            </v-form>
          </template>
          <span v-else class="tw-tw-grow tw-text-base">{{ category.title }}</span>
          <div v-if="!edit" class="tw-flex tw-gap-2">
            <v-btn text @mouseenter.native @mouseleave.native icon
                   color="primary" @click="showEdit">
              <v-icon small>mdi-pencil</v-icon>
            </v-btn>
            <v-btn text @mouseenter.native @mouseleave.native
                   color="success" icon
                   @click="$emit('createProduct',{categoryId: category.id, position:category.products.length, categoryTitle: category.title})">
              <v-icon small>mdi-plus-box-outline</v-icon>
            </v-btn>
            <v-btn text @mouseenter.native @mouseleave.native icon
                   color="error" @click="remove">
              <v-icon small>mdi-delete</v-icon>
            </v-btn>
          </div>
        </td>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td>
          <Draggable class="tw-flex tw-flex-wrap tw-gap-2" v-model="category.products"
                     @start="drag=true"
                     @end="drag=false"
                     ghost-class="ghost">
            <Product :key="index"
                     v-on="$listeners"
                     :product="product"
                     :category="category"
                     v-for="(product, index) in category.products"/>
          </Draggable>
        </td>
      </tr>
      </tbody>
    </table>
  </v-card>
</template>

<script>
import Product from "./Product.vue";
import draggable from "vuedraggable";

export default {
  name: "Category",
  components: {Product, Draggable: draggable},
  props: ['category'],
  data() {
    return {
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

.animation {
  transition: background-color 1s;
}
</style>
