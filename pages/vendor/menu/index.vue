<template>
  <v-card flat>
    <v-card-title>Menu</v-card-title>
    <v-card-text>

    </v-card-text>
    <v-card-actions></v-card-actions>
  </v-card>

</template>

<script>
export default {
  name: "IndexPage",
  data() {
    return {
      items: [],
    }
  },

  mounted() {
    this.fetch()
  },

  methods: {
    fetch() {
      this.loading = true
      this.$axios.get('/backend/api/categories', {params: {itemsPerPage: -1}})
        .then(resp => {
          this.items = resp.data.data
        })
    },
  }
}
</script>

<style scoped>

</style>
