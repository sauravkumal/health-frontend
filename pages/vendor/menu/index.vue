<template>
  <v-card flat>
    <v-card-title>Menu</v-card-title>
    <v-card-text>
      <Category :category="category" v-for="(category, index) in menu" :key="index"/>

    </v-card-text>
    <v-card-actions></v-card-actions>
  </v-card>

</template>

<script>
import Category from "../../../components/menu/Category.vue";

export default {
  name: "IndexPage",
  components: {Category},
  middleware: 'auth',

  data() {
    return {
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
