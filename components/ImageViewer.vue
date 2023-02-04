<template>
  <v-img :width="width||300" max-width="300"
         contain :src="imageUrl"/>
</template>

<script>
export default {
  name: "ImageViewer",
  props: ['image', 'url', 'width'],

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
