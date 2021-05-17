<template>
  <div>
    <div class="preview-container" v-if="uploadData">
      <div
        v-bind:style="{ 'background-image': 'url(' + uploadData + ')' }"
        class="if-from-initial"
      >
        <div
          class="black-div"
          v-bind:style="{
            'background-color': 'rgba(0,0,0,' + transparent + ')',
          }"
        >
          <h1 class="judul">{{ title }}</h1>
          <span v-html="ringkasan" class="ringkasan-item" />
        </div>
      </div>
    </div>
    <br />
    <h4>Transparency:</h4>
    <br/>
    <input
      type="range"
      min="0"
      max="1"
      step="0.1"
      v-model="transparent"
      v-on:change="transparencyChanged"
      id="files"
    />
    <br />
    <br />

    <div>
      <input
        type="file"
        accept=".jpeg,.jpg,.png,image/jpeg,image/png"
        aria-label="upload image button"
        @change="selectFile"
      />
    </div>
  </div>
</template>


<script>
export default {
  props: ["initialImage", "transparency", "title", "ringkasan"],
  data() {
    return {
      uploadData: this.initialImage,
      uploadedURL: null,
      transparent: this.transparency,
    };
  },
  mounted() {
    console.log(this.initialImage);
    console.log(this.uploadData);
  },
  methods: {
    async selectFile(e) {
      const file = e.target.files[0];

      /* Make sure file exists */
      if (!file) return;

      /* create a reader */
      const readData = (f) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(f);
        });

      /* Read data */
      this.$nuxt.$loading.start();

      this.uploadData = await readData(file);

      this.$nuxt.$loading.finish();
    },
    async uploadCloudinary() {
      console.log("in upload cloudinary");
      if (this.uploadData) {
        try {
          const instance = await this.$cloudinary.upload(this.uploadData, {
            folder: "upload-examples",
            uploadPreset: "evkh2s45",
          });
          this.uploadedURL = instance.url;
          console.log(this.uploadedURL);
          this.$emit("uploaded", this.uploadedURL);
          return this.uploadedURL;
        } catch (error) {
          alert(error);
        }
      }
    },
    transparencyChanged() {
      this.$emit("transparencyChanged", this.transparent);
    },
  },
};
</script>

<style scoped>
* {
  font-size: 100%;
}

.image-preview {
  width: 100%;
}

.if-from-initial {
  background-size: cover;
  position: relative;
  background-position: 50% 50%;
  width: 100%;
  height: 100%;
}

.black-div {
  background-color: black;
  padding: 2em 1em 2em 1em;
}

h1.judul {
  font-weight: normal;
  font-size: 250%;
  color: white;
}

.ringkasan-item /deep/ li {
  margin: 0.7em 0;
  font-weight: normal;
  color: white;
}

.ringkasan-item /deep/ ul {
  padding: 0 2em;
}

.ringkasan-item /deep/ img {
  width: 100%;
}

.ringkasan-item /deep/ a {
  color: white;
  /* font-weight: bold; */
}

.ringkasan-item /deep/ p {
  font-weight: bold;
}
</style>