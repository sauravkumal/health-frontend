<template>
  <v-img contain :src="imageUrl"/>
</template>

<script>
export default {
  name: "ImageViewer",
  props: ['image', 'url'],

  computed: {
    imageUrl() {
      if (this.image) {
        return URL.createObjectURL(this.image)
      } else if (this.url) {
        return this.url
      } else {
        return 'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png'
      }
    }
  }
}
</script>

<style scoped>

</style>
