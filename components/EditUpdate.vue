<template>
  <div>
    <h2 class="add-bottom-margin">{{ componentTitle }}</h2>
    <h3>Date</h3>

    <VueCtkDateTimePicker v-model="timeBuffer" format="YYYY-MM-DD a hh:mm" />
    <h3 class="add-top-margin">Title</h3>

    <textarea v-model="titleBuffer" class="add-bottom-margin" />

    <div
      :content="textBuffer"
      @change="onEditorChange($event)"
      v-quill:myQuillEditor="editorOption"
      class="editor"
    ></div>

    <button v-on:click="saveUpdate" class="control-button">
      <h4 class="main-button">Save</h4>
    </button>
    <button v-on:click="closeUpdate" class="control-button">
      <h4 class="main-button">Cancel</h4>
    </button>
  </div>
</template>

<script>
export default {
  props: ["updateRef", "articleRef"],
  data() {
    return {
      editorOption: { theme: "snow" },
      componentTitle: "coba",
      titleBuffer: "",
      timeBuffer: "",
      textBuffer: "",
      isNew: false,
    };
  },
  async mounted() {
    let data;
    if (this.updateRef) {
      this.isNew = false;
      this.componentTitle = "Editing Update";
      const docSnapshot = await this.updateRef.get();
      if (docSnapshot.exists) {
        data = docSnapshot.data();
        console.log(data);
        this.titleBuffer = data.title;
        this.textBuffer = data.text;
        this.timeBuffer = data.time;
      }
    } else if (this.articleRef) {
      this.isNew = true;
      this.componentTitle = "Adding Update";
    }
    console.log(this.textBuffer);
  },
  methods: {
    onEditorChange(e) {
      this.textBuffer = e.html;
    },
    closeUpdate() {
      this.$emit("closed");
    },
    async saveUpdate() {
      console.log(this.textBuffer)
      console.log(this.titleBuffer)
      console.log(this.timeBuffer)
      console.log(this.isNew)
      if (this.textBuffer && this.titleBuffer && this.timeBuffer) {
        if (window.confirm("Are you sure want to save?")) {
          try {
            this.$nuxt.$loading.start();
            if (!this.isNew) {
              const result = await this.updateRef.set(
                {
                  title: this.titleBuffer,
                  text: this.textBuffer,
                  time: this.timeBuffer,
                },
                { merge: true }
              );
              this.$nuxt.$loading.finish();
              this.closeUpdate();
            } else if (this.isNew) {
              const collectionRef = this.articleRef.collection("updates");
              console.log(this.textBuffer);
              const result = await collectionRef.add({
                title: this.titleBuffer,
                text: this.textBuffer,
                time: this.timeBuffer,
              });
              this.$nuxt.$loading.finish();
              this.closeUpdate();
            }
          } catch (error) {
            alert(error);
            this.$nuxt.$loading.finish();
            this.closeUpdate();
          }
        }
      } else {
        alert("Fields are not valid")
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
  height: 8em;
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
</style>