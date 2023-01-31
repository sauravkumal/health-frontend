<template>
  <v-card flat>
    <v-card-title>Menu</v-card-title>
    <v-card-text>
      <Draggable class="tw-flex tw-flex-col tw-space-y-4" v-model="menu" @start="drag=true" @end="drag=false"
                 ghost-class="ghost">
        <Category :category="category" v-for="(category, index) in menu" :key="index"/>
      </Draggable>
    </v-card-text>
    <v-card-actions></v-card-actions>
  </v-card>

</template>

<script>
import Category from "../../../components/menu/Category.vue";
import draggable from "vuedraggable";


export default {
  name: "IndexPage",
  components: {Category, Draggable: draggable},
  middleware: 'auth',

  data() {
    return {
      drag: false,
      menu: [],
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
  }
}
</script>

<style scoped>
.ghost {
  @apply tw-opacity-50 tw-bg-gray-300;
}
</style>
