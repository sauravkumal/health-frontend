<template>
  <div>
    <div ref="gmap" class="tw-w-full tw-h-full">
    </div>
    <slot/>
  </div>
</template>

<script>
export default {
  name: "GMap",
  props: {
    zoom: {
      type: Number,
      default: 13,
    },
    center: {
      type: Object,
      default: () => {
        return {
          lat: 28.221350,
          lng: 83.992994,
        };
      },
    }
  },
  data() {
    return {
      gmap: null,
    }
  },

  async mounted() {
    if (!this.$GMaps.loaded) {
      this.$GMaps.google = await this.$GMaps.loader.load()
      this.$GMaps.loaded = true
    }
    this.gmap = new this.$GMaps.google.maps.Map(this.$refs.gmap, {
        center: this.center,
        zoom: this.zoom,
      }
    )
  },
  watch: {
    zoom: function (newVal) {
      if (this.gmap) {
        this.gmap.setZoom(newVal)
      }
    },
    center: {
      handler: function (newVal) {
        if (this.gmap) {
          this.gmap.setCenter(newVal)
        }
      },
      deep: true
    }
  }
}
</script>

<style scoped>

</style>
