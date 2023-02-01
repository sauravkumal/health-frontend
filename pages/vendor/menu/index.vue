<template>
  <v-card flat>
    <v-card-title class="tw-justify-between">
      <div>Menu</div>
      <div class="tw-flex tw-space-x-2 tw-items-end">
        <CategoryCreate :position="menu.length"></CategoryCreate>
        <SubCategoryCreate v-model="subCategoryModel.dialog" :category-id="subCategoryModel.categoryId"
                           :category-title="subCategoryModel.categoryTitle"
                           :position="subCategoryModel.position"/>
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
        <Category @edited="fetch" @createSubCategory="createSubCategory" ref="categories" :id="index"
                  :category="category"
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


export default {
  name: "IndexPage",
  components: {SubCategoryCreate, CategoryCreate, Category, Draggable: draggable},
  middleware: 'auth',

  data() {
    return {
      drag: false,
      menu: [],
      search: null,
      subCategoryModel: {
        categoryId: null,
        position: null,
        dialog: false,
        categoryTitle: null
      }
    }
  },

  watch: {
    search: function (newVal) {
      const ref = this.$refs.categories.find(cat => cat.category.id === newVal)
      if (ref) {
        this.$vuetify.goTo(ref)
      }
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

    createSubCategory(event) {
      this.subCategoryModel = {
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
