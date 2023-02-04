<template>
  <div>
    <Profile/>
    <v-divider/>
    <v-card flat>
      <v-card-title>Open Hours</v-card-title>
    </v-card>
  </div>

</template>

<script>
import Profile from "../../../components/settings/Profile.vue";

export default {
  name: "IndexPage",
  components: {Profile},
  middleware: ['auth'],
}
</script>

<style scoped>

</style>
