<template>
  <v-card elevation="4">
    <v-card-title class="tw-justify-between">
      <div class="tw-flex tw-gap-x-6 tw-items-center">
        <div>Menu</div>
        <v-switch color="success" label="Published" v-model="menu.published"></v-switch>
      </div>
      <div class="tw-flex tw-gap-2 tw-items-end tw-flex-wrap">
        <CategoryCreate @created="fetch" :position="menu.categories.length"></CategoryCreate>
        <ProductCreateEdit @created="fetch" v-model="productModel.dialog" :category-id="productModel.categoryId"
                           :category-title="productModel.categoryTitle"
                           :id="productModel.id"
                           :position="productModel.position"/>

        <v-select single-line outlined label="Search.."
                  dense hide-details
                  :items="menu.categories"
                  item-text="title"
                  item-value="id"
                  v-model="search"
                  clearable
                  prepend-inner-icon="mdi-magnify"></v-select>
      </div>
    </v-card-title>
    <v-card-text>
      <div>
        <Draggable class="tw-flex tw-flex-col tw-gap-y-4" v-model="menu.categories" @start="drag=true"
                   @end="drag=false"
                   ghost-class="ghost">
          <Category @edited="fetch"
                    @createProduct="createProduct"
                    @editProduct="editProduct"
                    ref="categories"
                    :category="category"
                    v-for="(category, index) in menu.categories" :key="index"/>
        </Draggable>
      </div>
    </v-card-text>
    <v-card-actions></v-card-actions>
  </v-card>

</template>

<script>
import Category from "../../../components/menu/Category.vue";
import draggable from "vuedraggable";
import CategoryCreate from "../../../components/menu/CategoryCreate.vue";
import ProductCreateEdit from "../../../components/menu/ProductCreateEdit.vue";


export default {
  name: "IndexPage",
  components: {ProductCreateEdit, CategoryCreate, Category, Draggable: draggable},
  middleware: 'auth',

  data() {
    return {
      drag: false,
      menu: {
        published: false,
        categories: []
      },
      search: null,
      productModel: {
        categoryId: null,
        position: null,
        dialog: false,
        categoryTitle: null,
      },
      animationTimeout: null,
    }
  },

  watch: {
    search: function (newVal) {
      const ref = this.$refs.categories.find(cat => cat.category.id === newVal)
      if (ref) {
        this.$vuetify.goTo(ref)
        ref.$el.classList.add('!tw-bg-gray-400')
        this.animationTimeout = setTimeout(() => {
          ref.$el.classList.remove('!tw-bg-gray-400')
        }, 1000)
      }
    },
    'productModel.dialog': function (newVal) {
      if (!newVal) {
        this.productModel = {
          categoryId: null,
          position: null,
          dialog: false,
          categoryTitle: null
        }
      }
    },
    'menu.published': function (newVal) {
      this.updatePublishMenu()
    }
  },

  mounted() {
    this.fetch()
  },

  methods: {
    fetch() {
      this.loading = true
      this.$axios.get('/backend/api/menus/' + this.$auth.user.menu_id, {
        params: {
          with: ['categories.products']
        }
      })
        .then(resp => {
          this.menu = resp.data.data
        })
    },

    updatePublishMenu() {
      this.$axios.put('/backend/api/menus/' + this.menu.id, {published: this.menu.published})
        .then(resp => {
        }).catch(error => {
        this.menu.published = !this.menu.published
        this.$root.$emit("toast", {
          text: "Couldn't save",
          type: "error",
        })
      })

    },

    createProduct(event) {
      this.productModel = {
        ...event, dialog: true
      }
    },
    editProduct(event) {
      this.productModel = {
        ...event, dialog: true
      }
    },
  }
}
</script>

<style scoped>
.ghost {
  @apply tw-opacity-50 tw-bg-gray-300;
}
</style>
