<template>
  <div>
    <Profile/>
    <v-divider/>
    <OpeningHours/>
  </div>

</template>

<script>
import Profile from "../../../components/settings/Profile.vue";
import OpeningHours from "../../../components/settings/OpeningHours.vue";

export default {
  name: "IndexPage",
  components: {OpeningHours, Profile},
  middleware: ['auth'],
}
</script>

<style scoped>

</style>
