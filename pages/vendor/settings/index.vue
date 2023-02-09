<template>
  <div class="tw-flex tw-flex-col tw-gap-2">
    <Profile/>
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
