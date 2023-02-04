<template>
  <div>
    <slot/>
  </div>
</template>

<script>
export default {
  name: "GMapMarker",
  props: {
    center: {
      type: Object,
      required: true,
    },
    label: {
      type: String,
      default: () => null
    },
    labelColor: {
      type: String,
      default: () => '#000000'
    },
    icon: {
      type: Object,
      default: () => null
    },
    draggable: {
      type: Boolean,
      default: () => false
    }
  },

  data() {
    return {
      timer: null,
      marker: null,
    }
  },

  watch: {
    center: {
      handler: function (newVal) {
        if (this.marker) {
          this.marker.setPosition(newVal)
        }
      },
      deep: true
    }
  },

  mounted() {
    if (!this.mapLoaded()) {
      this.timer = setInterval(function () {
        if (this.mapLoaded()) {
          this.loadMarker()
          clearInterval(this.timer)
        }
      }.bind(this), 500)
    } else {
      this.loadMarker()
    }
  },

  beforeDestroy() {
    if (this.marker) {
      this.marker.setMap(null)
    }
  },

  methods: {
    mapLoaded() {
      return !!this.$parent.gmap
    },

    loadMarker() {
      const options = {
        position: this.center,
        map: this.$parent.gmap,
        draggable: this.draggable
      }
      if (this.label) {
        options.label = {
          text: this.label,
          color: this.labelColor,
          fontSize: '16px',
          fontWeight: 'bold'
        }
      }
      if (this.icon) {
        options.icon = this.icon
        if (this.icon.labelOrigin) {
          options.icon.labelOrigin = new this.$GMaps.google.maps.Point(this.icon.labelOrigin.x, this.icon.labelOrigin.y)
        }
      }

      this.marker = new this.$GMaps.google.maps.Marker(options)
      this.marker.addListener('dragend', (event) => {
        this.$emit('dragend', {lat: event.latLng.lat(), lng: event.latLng.lng()})
      });
    }
  }
}
</script>

<style scoped>

</style>
