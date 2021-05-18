<template>
  <div class="main-body">
    <div
      v-if="!ringkasanEdit"
      class="image-container"
      v-bind:style="{ 'background-image': 'url(' + article.image + ')' }"
    >
      <div
        class="judul-container"
        v-bind:style="{
          'background-color': 'rgba(0,0,0,' + article.transparency + ')',
        }"
      >
        <h1 class="judul">{{ article.title }}</h1>
      </div>

      <div
        class="ringkasan-container"
        v-bind:style="{
          'background-color': 'rgba(0,0,0,' + article.transparency + ')',
        }"
      >
        <h3 style="border-bottom: solid 0.5px white" class="ringkasan">
          Ringkasan
        </h3>

        <div v-if="!ringkasanEdit">
          <span v-html="article.ringkasan" class="ringkasan-item" />
          <br />
          <button
            v-if="authorized"
            v-on:click="editRingkasan"
            class="main-button"
          >
            edit
          </button>
        </div>
      </div>
    </div>

    <!-- Ringkasan edit elements -->

    <div v-if="ringkasanEdit" class="ringkasan-edit">
      <div class="boxed">
        <h4>Background Image</h4>
        <upload-image
          v-on:uploaded="imageUploaded"
          v-on:transparencyChanged="transparencyChanged"
          ref="imageUploader"
          :initialImage="this.article.image"
          :title="titleBuffer"
          :ringkasan="textBuffer"
          :transparency="article.transparency"
        />
      </div>

      <div class="boxed">
        <h4>Title</h4>
        <input class="update-title" v-model="titleBuffer" />
      </div>

      <div class="boxed">
        <editor
          v-bind:textProp="article.ringkasan"
          v-on:editor-change="editorChange"
        />
      </div>
      <button v-on:click="saveRingkasan" class="main-button">
        <h4 class="main-button">Save</h4>
      </button>
      <button v-on:click="cancelRingkasan" class="main-button">
        <h4 class="main-button">Cancel</h4>
      </button>
    </div>

    <!-- Adding update child element -->
    <div v-if="authorized" class="add-update">
      <div class="add-update">
        <button v-on:click="addUpdate" class="main-button add-update">
          + Add update
        </button>
      </div>

      <!-- Adding elements -->
      <div v-if="addingUpdate">
        <div class="editing-updates">
          <h4 class="red-font">Adding updates</h4>
          <h4>Date</h4>
          <!-- time picker -->
          <VueCtkDateTimePicker
            v-model="dateBuffer"
            format="YYYY-MM-DD, hh:mm a"
          />
          <!-- title input -->
          <h4>Title</h4>
          <textarea v-model="titleBuffer" />
          <h4>Text</h4>
          <!-- text editor -->
          <editor
            v-bind:textProp="textBuffer"
            v-on:editor-change="editorChange"
          />
          <!-- buttons to save and cancel -->
          <button v-on:click="saveAddingUpdate" class="main-button">
            <h4 class="main-button">Save</h4>
          </button>
          <button v-on:click="cancelAdding" class="main-button">
            <h4 class="main-button">Cancel</h4>
          </button>
        </div>
      </div>
    </div>
    <div class="outer-box" >
    <div style="margin: 2em 0 1em 0; text-align: center;">

      <h2>Update Kronologis</h2>
    </div>
      <!-- Container elements -->
      <div class="article-container">
        <div
          class="updates-container"
          v-for="(update, index) in article.updates"
          :key="index"
        >
          <div
            v-bind:id="update.id"
            v-if="index != editedIndex"
            class="update-container"
            v-on:focus="updateFocus(index)"
            tabindex="100"
            v-bind:class="{ active: activeIndex == index }"
          >
            <p class="update-time">
              {{ update.time }}
            </p>
            <h4>{{ update.title }}</h4>
            <div v-if="authorized"></div>

            <button
              v-if="index != readMoreIndex"
              v-on:click="readMore(update, index)"
              class="button-link"
            >
              <h5>Read More</h5>
            </button>

            <!-- Read more elements -->
            <div v-if="index == readMoreIndex">
              <div v-html="readMoreText" class="read-more-container"></div>
              <button v-on:click="closeReadMore(index)" class="button-link">
                <h5>Close</h5>
              </button>
            </div>
            <div v-if="authorized">
              <button v-on:click="edit(index, update)" class="main-button">
                edit
              </button>
              <button
                v-on:click="deleteUpdate(index, update)"
                class="main-button"
              >
                delete
              </button>
            </div>
            <div v-if="authorized">
              <p style="font-style: italic; font-size: 80%">
                article id:
                {{ update.id }}
              </p>
            </div>
          </div>

          <!-- Editing update elements -->
          <div class="editing-updates" v-if="index == editedIndex">
            <h4 class="red-font">Editing updates</h4>
            <h4>Date</h4>

            <VueCtkDateTimePicker
              v-model="dateBuffer"
              format="YYYY-MM-DD, hh:mm a"
            />
            <h4>Title</h4>

            <textarea v-model="titleBuffer" />
            <!-- <editor v-bind:textProp="titleBuffer" /> -->

            <editor
              v-bind:textProp="textBuffer"
              v-on:editor-change="editorChange"
            />

            <button v-on:click="saveUpdate(index, update)" class="main-button">
              <h4 class="main-button">Save</h4>
            </button>
            <button v-on:click="cancelUpdate(update)" class="main-button">
              <h4 class="main-button">Cancel</h4>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import uploadImage from "../uploadImage.vue";
export default {
  components: { uploadImage },
  data() {
    return {
      article: {
        title: "",
        ringkasan: "",
        updates: [],
        id: {},
        image: "",
        transparency: 0.4,
      },
      editedIndex: null,
      readMoreText: "",
      readMoreIndex: null,
      textBuffer: null,
      titleBuffer: null,
      dateBuffer: null,
      imageBuffer: null,
      transparencyBuffer: null,
      editorOption: { theme: "snow" },
      authorized: false,
      addingUpdate: false,
      ringkasanEdit: false,
      activeIndex: null,
      imagePreview: null,
      coba: "https://cdn-2.tstatic.net/tribunnews/foto/bank/images/kpk-45.jpg",
    };
  },
  async fetch() {
    // const articles_ref = this.$fire.firestore.collection("articles");
    // const query = await articles_ref
    //   .where("slug", "==", this.$route.params.article)
    //   .limit(1);
    // const query_snapshot = await query.get();
    // let doc_ref = {};
    // if (!query_snapshot.empty) {
    //   query_snapshot.forEach((query_doc) => {
    //     if (query_doc.exists) {
    //       doc_ref = query_doc.ref;
    //       let data = query_doc.data();
    //       this.article.ringkasan = data.ringkasan;
    //       this.article.judul = data.judul;
    //     }
    //   });
    // }
    // let updates = [];
    // let col_ref = doc_ref.collection("updates");
    // let doc_snapshots = await col_ref.get();
    // if (!doc_snapshots.empty) {
    //   doc_snapshots.forEach((doc) => {
    //     if (doc.exists) {
    //       updates.push(doc.data());
    //       console.log(updates);
    //     }
    //   });
    //   this.article.updates = updates;
    // }
  },

  async mounted() {
    // this.observeFirebaseAuth()
    this.activeIndex = 0;

    this.$nextTick(() => {
      console.log(this.$nuxt.$loading);

      this.$nuxt.$loading.start();
    });

    console.log(this.$route.params.article);
    if (this.$fire.auth.currentUser) {
      this.authorized = true;
    } else {
      this.authorized = false;
    }
    this.$checkAuth.subscribe(this.checkAuth, this);

    try {
      const articles_ref = this.$fire.firestore.collection("articles");
      const query = articles_ref
        .where("slug", "==", this.$route.params.article)
        .limit(1);
      let doc_ref = {};

      const observer = query.onSnapshot((docSnapshots) => {
        this.$nuxt.$loading.start();
        if (!docSnapshots.empty) {
          docSnapshots.forEach((doc) => {
            if (doc.exists) {
              doc_ref = doc.ref;
              this.article.id = doc_ref.id;
              let data = doc.data();
              this.article.ringkasan = data.ringkasan;
              this.article.title = data.title;
              this.article.image = data.image;
              this.article.transparency = data.transparency;
            }
          });
          let col_ref = doc_ref.collection("updates").orderBy("time", "desc");
          const observer = col_ref.onSnapshot((querySnapshot) => {
            if (!querySnapshot.empty) {
              this.article.updates = [];
              console.log("size of snapshot" + querySnapshot.size);
              querySnapshot.forEach((doc) => {
                let d = {};
                d = doc.data();
                d.id = doc.ref.id;
                d.ref = doc.ref;
                d.nama = "evan";
                this.article.updates.push(d);
                this.$nuxt.$loading.finish();
              });
            } else {
              alert("not found");
              this.$nuxt.$loading.finish();
            }
          });
        }
      });
    } catch (error) {
      alert(error);
      this.$nuxt.$loading.finish();
    }
  },
  methods: {
    checkAuth(au) {
      console.log("checking auth in article");
      this.authorized = au;
    },
    test() {
      console.log(this.$fire.auth);
    },
    fromObserver(o) {
      return JSON.parse(JSON.stringify(o));
    },
    edit(i, u) {
      const update = this.fromObserver(u);
      this.editedIndex = i;
      this.textBuffer = update.text;
      this.titleBuffer = update.title;
      this.dateBuffer = update.time;
    },
    editorChange(text) {
      this.textBuffer = text;
      console.log(text);
    },
    async cancelUpdate(u) {
      this.editedIndex = null;
    },

    getUpdateRef(id) {
      const d = this.$fire.firestore
        .collection("articles")
        .doc(this.article.id)
        .collection("updates")
        .doc(id);
      return d;
    },

    async readMore(u, i) {
      this.$nuxt.$loading.start();

      const update = this.fromObserver(u);

      this.readMoreText = "";
      this.readMoreIndex = i;

      const doc_ref = this.getUpdateRef(update.id);

      try {
        const doc_snapshot = await doc_ref.get();
        this.readMoreText = doc_snapshot.data().text;
        this.activeIndex = i;
        this.$nuxt.$loading.finish();
      } catch (error) {
        console.log(error);
        this.$nuxt.$loading.finish();
        alert(error);
      }
    },
    closeReadMore(u) {
      this.readMoreIndex = null;
    },

    async saveUpdate(i, u) {
      if (window.confirm("Are you sure you want to save?")) {
        try {
          this.$nuxt.$loading.start();

          const update = this.fromObserver(u);

          const doc_ref = this.getUpdateRef(update.id);

          const doc_snapshot = await doc_ref.set(
            {
              title: this.titleBuffer,
              text: this.textBuffer,
              time: this.dateBuffer,
            },
            { merge: true }
          );
          this.editedIndex = null;

          this.$nuxt.$loading.finish();
        } catch (error) {
          alert(error);
          console.log(error);
          this.editedIndex = null;
          this.$nuxt.$loading.finish();
        }
      } else {
      }
    },

    async deleteUpdate(i, u) {
      if (window.confirm("Are you sure you want to delete?")) {
        try {
          this.$nuxt.$loading.start();
          console.log("deleting update");
          const update = this.fromObserver(u);
          const doc_ref = this.getUpdateRef(update.id);
          const res = await doc_ref.delete();
          this.$nuxt.$loading.finish();
        } catch (error) {
          alert(error);
          this.$nuxt.$loading.finish();
        }
      }
    },
    addUpdate() {
      this.addingUpdate = true;
      this.textBuffer = "";
      this.titleBuffer = "";
      this.dateBuffer = "";
    },
    async saveAddingUpdate() {
      console.log(this.textBuffer);
      console.log(this.titleBuffer);
      console.log(this.dateBuffer);
      if (this.textBuffer && this.titleBuffer && this.dateBuffer) {
        if (window.confirm("Are you sure you want to add update?")) {
          const update_collection = this.$fire.firestore
            .collection("articles")
            .doc(this.article.id)
            .collection("updates");
          try {
            console.log("activating loading");
            this.$nuxt.$loading.start();
            const res = await update_collection.add({
              title: this.titleBuffer,
              text: this.textBuffer,
              time: this.dateBuffer,
            });

            this.addingUpdate = false;
            this.textBuffer = "";
            this.titleBuffer = "";
            this.dateBuffer = "";
            this.readMoreIndex = null;
            this.$nuxt.$loading.finish();
          } catch (error) {
            alert(error);
            this.$nuxt.$loading.finish();
          }
        }
      } else {
        alert("fileds are not valid");
        return;
        this.$nuxt.$loading.finish();
      }
    },
    cancelAdding() {
      this.addingUpdate = false;
      console.log("closing ringkasan edit");
    },
    editRingkasan() {
      this.ringkasanEdit = true;
      this.titleBuffer = this.article.title;
      this.textBuffer = this.article.ringkasan;
      this.imageBuffer = this.article.image;
    },
        cancelRingkasan() {
      this.ringkasanEdit = false;
      this.titleBuffer = "";
      this.textBuffer = "";
      this.imageBuffer = "";
    },

    async saveRingkasan() {
      if (window.confirm("Are you sure you want to modify ringkasan?")) {
        const doc_ref = this.$fire.firestore
          .collection("articles")
          .doc(this.article.id);
        try {
          this.$nuxt.$loading.start();

          // triggering image upload from child component to cloudinary
          let image = await this.$refs.imageUploader.uploadCloudinary();
          console.log(image);
          if (!image) {
            image = this.article.image;
          }
          console.log(image);

          // saving to firebase
          const res = await doc_ref.set(
            {
              ringkasan: this.textBuffer,
              title: this.titleBuffer,
              image: image,
              transparency: this.transparencyBuffer,
            },
            { merge: true }
          );
          this.ringkasanEdit = false;

          this.$nuxt.$loading.finish();
        } catch (error) {
          alert(error);
        }
      }
    },
    updateFocus(i) {
      console.log("focused: " + i);
      this.activeIndex = i;
    },

    cancelFocus(event) {
      console.log("mouse down");
      this.activeIndex = null;
    },
    imageUploaded(imageUrl) {
      console.log(imageUrl);
      console.log("event emited");
    },
    transparencyChanged(tr) {
      this.transparencyBuffer = tr;
    },
  },
};
</script>

<style scoped>
html {
  box-sizing: border-box;
}

* {
  margin: 0.5em 0 0 0;
  padding: 0;
  font-size: 100%;
}

p {
  font-size: 100%;
}

*:focus {
  outline: none;
}

.main-body {
  /* padding: 0 2em;
  margin: auto;
  max-width: 1000px; */
}

h4 {
  color: rgb(32, 12, 0);
}

h2 {
  margin: 0;
  padding: 0;
  font-size: 150%;
}

h3.ringkasan {
  padding: 0.1em 0 0.6em 0;
  border: none;
  font-size: 150%;
  font-weight: normal;
}

h5 {
  font-size: 80%;
  font-weight: normal;
}

.red-font {
  color: rgb(100, 3, 3);
}

.ringkasan-edit {
  color: black;
}

.ringkasan-item /deep/ li {
  margin: 0.7em 0;
  font-weight: normal;
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

.article-container {
}

.editor {
  background-color: white;
}

.updates-container {
  padding: 1em;
  margin:0;
  /* padding: 0.5em 0 1em 0; */
  border-top: dotted 0.5px rgb(253, 219, 219);
  display: block;

}

.update-container {
  display: block;
  padding: 0.5em;
  margin:0;
}

.update-time {
  margin: 0 0 0.7em 0;
  font-size: 0.8em;
  font-style: italic;
}

.editing-updates {
  background-color: rgba(248, 170, 170, 0.226);
  padding: 1em;
}
input.update-title {
  font-size: 1em;
  margin: 0.5em 0 0.5em 0;
  padding: 0.5em;
  width: 100%;
}

.button-link {
  background: none !important;
  border: none;
  /* padding: 0!important; */
  /*optional*/
  /*input has OS specific font-family*/
  color: rgb(153, 0, 0);
  text-decoration: underline;
  cursor: pointer;
}

.main-button {
  margin: 0.5em 0;
  padding: 0.2em 1em;
}

h4.main-button {
  padding: 0;
}

button.add-update {
  width: 100%;
  padding: 0.5em;
}

.image-container {
  /* background-image: url("https://cdn-2.tstatic.net/tribunnews/foto/bank/images/kpk-45.jpg"); */
  background-size: cover;
  background-color: rgb(29, 1, 1);
  position: relative;
  background-position: 50% 50%;
  width: 100%;
  height: 100%;
  box-shadow: 10px 10px 20px rgb(179, 177, 177);
  border: solid rgb(32, 12, 0) 1px;
}

.judul-container {
  color: rgb(255, 255, 255);
  /* rgb(153, 0, 0); */
  padding: 2em 1em 0em 1em;
  margin: 0;
  /* border-top: double black 10px; */
  /* text-align: center; */
  /* background-color: rgba(0, 0, 0, 0.4); */
}

h1.judul {
  font-weight: normal;
  font-size: 250%;
}
.ringkasan-container {
  padding: 1em 1em 2em 1em;
  margin: 0;
  background-color: rgba(0, 0, 0, 0.4);
  height: 100%;
  width: 100%;
  color: rgb(255, 255, 255);
}

h3.ringkasan {
  /* font-weight: bold; */
  color: rgb(255, 255, 255);
}

.read-more-container {
  align-items: center;
  border-top: 2px rgb(248, 210, 210) solid;
  margin: 1em 0em;
  padding: 1em 0;
}
.read-more-container /deep/ img {
  width: 90%;
  margin: 1em;
  align-items: center;
  display: block;
  margin: 2em auto;
  border: solid rgb(250, 167, 167) 1px;
}

.read-more-container /deep/ iframe {
 width:100%;
 display:block;

}

.active {
  background-color: rgb(255, 248, 248);
  border: solid rgb(255, 235, 235) 2px;
  box-shadow: 10px 5px 20px lightgrey;
}

.boxed {
  border: solid rgb(255, 235, 235) 2px;
  padding: 0.5em;
}

textarea {
  width: 100%;
  height: 8em;
  border: 1px lightgrey solid;
  padding: 0.5em;
  font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", Arial, sans-serif;
}

.outer-box{
  margin:1.5em 0;
  padding: 0.05em 0 0 0;
  /* border: solid rgb(248, 213, 213) 0.1px;  */
  box-shadow: 10px 5px 20px lightgrey
}
</style>

