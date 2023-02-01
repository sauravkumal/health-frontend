<template>
  <v-card flat>
    <v-card-title class="tw-justify-between">
      <div class="tw-flex tw-space-x-6 tw-items-center">
        <div>Menu</div>
        <v-switch color="success" label="Published" v-model="publishMenu"></v-switch>
      </div>
      <div class="tw-flex tw-space-x-2 tw-items-end">
        <CategoryCreate @created="fetch" :position="menu.length"></CategoryCreate>
        <SubCategoryCreate @created="fetch" v-model="subCategoryModel.dialog" :category-id="subCategoryModel.categoryId"
                           :category-title="subCategoryModel.categoryTitle"
                           :position="subCategoryModel.position"/>

        <ProductCreate @created="fetch" v-model="productModel.dialog" :sub-category-id="productModel.subCategoryId"
                       :sub-category-title="productModel.subCategoryTitle"
                       :position="productModel.position"/>

        <v-select single-line outlined label="Search.."
                  dense hide-details
                  :items="menu"
                  item-text="title"
                  item-value="id"
                  v-model="search"
                  clearable
                  prepend-inner-icon="mdi-magnify"></v-select>
      </div>
    </v-card-title>
    <v-card-text>
      <Draggable class="tw-flex tw-flex-col tw-space-y-4" v-model="menu" @start="drag=true" @end="drag=false"
                 ghost-class="ghost">
        <Category @edited="fetch"
                  @createSubCategory="createSubCategory"
                  ref="categories"
                  :category="category"
                  @createProduct="createProduct"
                  v-for="(category, index) in menu" :key="index"/>
      </Draggable>
    </v-card-text>
    <v-card-actions></v-card-actions>
  </v-card>

</template>

<script>
import Category from "../../../components/menu/Category.vue";
import draggable from "vuedraggable";
import CategoryCreate from "../../../components/menu/CategoryCreate.vue";
import SubCategoryCreate from "../../../components/menu/SubCategoryCreate.vue";
import ProductCreate from "../../../components/menu/ProductCreate.vue";


export default {
  name: "IndexPage",
  components: {ProductCreate, SubCategoryCreate, CategoryCreate, Category, Draggable: draggable},
  middleware: 'auth',

  data() {
    return {
      drag: false,
      publishMenu: this.$auth.user.publish_menu,
      menu: [],
      search: null,
      subCategoryModel: {
        categoryId: null,
        position: null,
        dialog: false,
        categoryTitle: null
      },
      productModel: {
        subCategoryId: null,
        position: null,
        dialog: false,
        subCategoryTitle: null
      }
    }
  },

  watch: {
    search: function (newVal) {
      const ref = this.$refs.categories.find(cat => cat.category.id === newVal)
      if (ref) {
        this.$vuetify.goTo(ref)
      }
    },
    publishMenu: function (newVal) {
      this.updatePublishMenu()
    }
  },

  mounted() {
    this.fetch()
  },

  methods: {
    fetch() {
      this.loading = true
      this.$axios.get('/backend/api/vendor/menu')
        .then(resp => {
          this.menu = resp.data.data
        })
    },

    updatePublishMenu() {
      this.$axios.post('/backend/api/vendor/menu/publish', {publish: this.publishMenu})
        .then(resp => {
        }).catch(error => {
        this.$root.$emit("toast", {
          text: "Couldn't save",
          type: "error",
        })
      })

    },

    createSubCategory(event) {
      this.subCategoryModel = {
        ...event, dialog: true
      }
    },
    createProduct(event) {
      this.productModel = {
        ...event, dialog: true
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
