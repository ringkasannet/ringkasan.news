<template>
  <div>
    <h2 class="add-bottom-margin">{{ componentTitle }}</h2>

    <h3 class="add-top-margin">Title</h3>

    <textarea
      v-model="titleBuffer"
      class="add-bottom-margin"
      @input="titleChanged"
    />

    <div v-if="isNew">
      <h3 class="add-top-margin">Slug</h3>
      {{ slugBuffer }}
    </div>

    <!-- <h1>  text buffer</h1>  {{textBuffer}} 
    <h1>  title buffer</h1>  {{titleBuffer}} 
    <h1>  upload data  </h1> {{uploadData}} -->
    <h3 class="add-top-margin">Image</h3>
    <div class="image-input">
      <div>
        <input
          type="file"
          accept=".jpeg,.jpg,.png,image/jpeg,image/png"
          aria-label="upload image button"
          @change="selectFile"
        />
      </div>
      <div v-if="uploadData">
        <img class="image-preview" :src="uploadData" />
      </div>
    </div>

    <h3 class="add-top-margin">Ringkasan</h3>

    <div
      :content="textBuffer"
      @change="onEditorChange($event)"
      v-quill:myQuillEditor="editorOption"
      class="editor"
    ></div>

    <button v-on:click="saveRingkasan" class="control-button">
      <h4 class="main-button">Save</h4>
    </button>
    <button v-on:click="closeRingkasan" class="control-button">
      <h4 class="main-button">Cancel</h4>
    </button>
  </div>
</template>

<script>
export default {
  props: ["articleRef"],
  data() {
    return {
      editorOption: { theme: "snow" },
      titleBuffer: "",
      textBuffer: "",
      slugBuffer: "",
      isNew: false,
      uploadData: null,
      initialImageUrl: "",
      componentTitle: "Editing Article",
    };
  },
  async mounted() {
    let data;
    if (this.articleRef) {
      this.isNew = false;
      const docSnapshot = await this.articleRef.get();
      if (docSnapshot.exists) {
        data = docSnapshot.data();
        console.log(data);
        this.titleBuffer = data.title;
        this.textBuffer = data.ringkasan;
        this.uploadData = data.image;
        this.initialImageUrl = data.image;
      }
    } else {
      this.isNew = true;
      this.componentTitle = "Adding New Article";
    }
    console.log(this.textBuffer);
  },
  methods: {
    titleChanged(e) {
      let title = e.target.value;
      let slug = title.replace(/\s+/g, "-").toLowerCase();
      this.slugBuffer = slug;
    },

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

    onEditorChange(e) {
      this.textBuffer = e.html;
    },
    closeUpdate() {
      this.$emit("closed");
    },
    closeRingkasan() {
      this.$emit("closed");
    },
    async saveRingkasan() {
      if (this.textBuffer && this.titleBuffer  &&this.uploadData) {
        if (window.confirm("Are you sure want to save?")) {
          try {
            this.$nuxt.$loading.start();
            let imageUrl = await this.uploadCloudinary();
            if (!imageUrl) {
              imageUrl = this.initialImageUrl;
            }

            if (!this.isNew) {
              const result = await this.articleRef.set(
                {
                  title: this.titleBuffer,
                  ringkasan: this.textBuffer,
                  image: imageUrl,
                },
                { merge: true }
              );
              this.$nuxt.$loading.finish();
              this.closeRingkasan();
            } else {
              const collectionRef = this.$fire.firestore.collection("articles");
              const result = await collectionRef.add({
                title: this.titleBuffer,
                ringkasan: this.textBuffer,
                image: imageUrl,
                slug: this.slugBuffer,
              });
              this.$nuxt.$loading.finish();
              this.closeRingkasan();
            }
          } catch (error) {
            alert(error);
            this.$nuxt.$loading.finish();
            this.closeRingkasan();
          }
        }
      } else {
          alert ("fields are not valid")
          return
      }
    },
    async uploadCloudinary() {
      console.log("in upload cloudinary");
      if (!this.uploadData) return "";
      const valid = this.uploadData.indexOf("data:image");
      if (valid == -1) {
        return null;
      } else {
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
  },
};
</script>

<style scoped>
.add-bottom-margin {
  margin-bottom: 1em;
}

.add-top-margin {
  margin-top: 1em;
}

.control-button {
  margin: 1em 0;
  padding: 0.2em 1em;
  font-size: 13px;
}

textarea {
  width: 100%;
  height: 2em;
  border: 1px lightgrey solid;
  padding: 0.5em;
  font-size: inherit;
  font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", Arial, sans-serif;
}

.editor {
  background-color: white;
  font-size: 100%;
}

.image-preview {
  width: 100%;
}
</style>