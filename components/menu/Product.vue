<template>
  <table class="tw-h-full tw-border tw-border-solid tw-border-gray-300 tw-border-collapse"
         @mouseenter="showActions=true" @mouseleave="showActions=false"
  >
    <thead>
    <tr>
      <td class="tw-flex tw-flex-wrap tw-space-x-4 tw-bg-gray-200 tw-px-2 tw-text-base tw-py-1 tw-items-center">
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
            <v-btn small type="submit" color="success" icon :loading="saving">
              <v-icon>mdi-check</v-icon>
            </v-btn>
            <v-btn small color="error" icon @click="edit=false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-form>
        </template>
        <div v-else class="tw-ml-2">{{ product.title }}</div>
        <template v-if="showActions && !edit">
          <v-btn icon x-small @mouseenter.native @mouseleave.native
                 color="primary" @click="showEdit">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon x-small @mouseenter.native @mouseleave.native
                 color="primary"
                 @click="$emit('createProduct',{productId: product.id,
                  position:category.products.length,
                   categoryTitle: category.title
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
      <td>details</td>
    </tr>
    </tbody>
  </table>
</template>

<script>
import draggable from "vuedraggable";

export default {
  name: "Product",
  components: {Draggable: draggable},
  props: ['product', 'category'],
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
    'product': {
      handler: function (newVal) {
        if (newVal.position !== this.$vnode.key) {
          this.updatePosition()
        }
      }, immediate: true
    }
  },
  methods: {
    showEdit() {
      this.model = JSON.parse(JSON.stringify(this.product))
      this.edit = true
    },
    updatePosition() {
      this.$axios.put("/backend/api/products/" + this.product.id, {
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
          this.$axios.put("/backend/api/products/" + this.model.id, {
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
        this.$axios.delete("/backend/api/products/" + this.product.id)
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
