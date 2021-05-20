<template>
  <div class="main-body">
    <div
      class="image-container"
      v-bind:style="{ 'background-image': 'url(' + ringkasan.data.image + ')' }"
    >
      <div
        class="overlay-container"
        v-bind:style="{ 'background-color': getBGColor, 'color':getFontColor}"
      >
        <h1 class="title">{{ ringkasan.data.title }}</h1>
      </div>
    </div>
    <div class="ringkasan-container">
      <span v-html="ringkasan.data.ringkasan" class="ringkasan-item"></span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ringkasan: {
        ref: {},
        data: {
          title: "",
          transparency: {},
          ringkasan: "",
          image: "",
          color: "",
        },
      },
    };
  },
  computed: {
    getBGColor() {
      switch (this.ringkasan.data.color) {
        case "dark":
          return ("rgba(0,0,0," + this.ringkasan.data.transparency + ")" );
          break;
        case "light":
          return ("rgba(255,255,255," + this.ringkasan.data.transparency + ")");
          break;
      }
    },
    getFontColor() {
      switch (this.ringkasan.data.color) {
        case "dark":
          return "white"
          break;
        case "light":
          return "rgb(100, 3, 3)"
          break;
      }
    },
  },
  methods: {
    ringkasanUpdated(ringkasan) {
      this.ringkasan = ringkasan;
    },
    test() {
      console.log(this.getObjectfromObserver(this.ringkasan));
    },
    getObjectfromObserver(o) {
      return JSON.parse(JSON.stringify(o));
    },
  },
  async mounted() {
    this.ringkasan = await this.$ringkasan.getRingkasanOnce(
      this.$route.params.slug
    );
    this.$ringkasan.getRingkasanRealtime(
      this.$route.params.slug,
      this.ringkasanUpdated,
      this
    );
    // this.ringkasan.then(i=>{console.log(i)})
  },
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
}
.main-body {
}

.image-container {
  background-size: cover;
  /* background-color: rgba(0, 0, 0, 0.1); */
  position: relative;
  background-position: 50% 50%;
  width: 100%;
  height: 100%;
}
.overlay-container {
  padding: 2em;
}
.ringkasan-container {
  /* color: rgb(255, 255, 255); */
  line-height: 1.5;
}

h3.default-layout-logo {
  font-weight: normal;
  letter-spacing: 4px;
  color: green;
}

.ringkasan-item /deep/ li {
  margin: 0.7em 0;
  font-weight: normal;
  line-height: 1.5;
}

.ringkasan-item /deep/ ul {
  padding: 0 1em;
}

.ringkasan-item /deep/ a {
  /* font-weight: bold; */
}

h1{
  font-size:300%
}
</style>