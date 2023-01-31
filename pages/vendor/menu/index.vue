<template>
  <v-card flat>
    <v-card-title>Menu</v-card-title>
    <v-card-text class="tw-space-y-4">
      <Draggable v-model="menu" @start="drag=true" @end="drag=false">
        <transition-group>
          <Category :category="category" v-for="(category, index) in menu" :key="index"/>
        </transition-group>
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

</style>
