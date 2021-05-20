<template>
  <div class="ringkasan-outer-container">
    <div class="top-title">
      <h1 class="chronological-title">Update Kronologis</h1>
    </div>

    <!-- Adding update -->
    <div v-if="authorized && !addingUpdate" class="add-update">
      <div class="add-update">
        <button v-on:click="addUpdate" class="main-button add-update">
          + Add update
        </button>
      </div>
    </div>

    <div class="adding-updates" v-if="addingUpdate">
      <EditUpdate :articleRef="parentRef" v-on:closed="addingClosed" />
    </div>

    <div
      v-for="(update, index) in updates"
      :key="index"
      class="update-container"
      :id="update.id"
      v-bind:class="{ active: activeIndex == update.id }"
      v-on:focus="updateFocus(update)"
      v-on:focus.prevent.stop
      tabindex="100"
    >
      <div v-if="update.id != editedIndex">
        <p class="small-italic">
          {{ update.time }}
        </p>
        <strong>{{ update.title }}</strong>
        <br />

        <div
          class="read-more-container add-top-margin"
          v-if="update.id == readMoreIndex"
        >
          <span v-html="update.text" />
        </div>

        <button
          v-if="update.id != readMoreIndex"
          v-on:click="readMore(update)"
          class="button-link"
        >
          <h4>Read More</h4>
        </button>

        <button
          v-on:click="closeReadMore(update)"
          class="button-link"
          v-if="update.id == readMoreIndex"
        >
          <h4>Close</h4>
        </button>

        <div v-if="authorized">
          <button v-on:click="editUpdate(update)" class="control-button">
            edit
          </button>
          <button v-on:click="deleteUpdate(update)" class="control-button">
            delete
          </button>
        </div>

        <p v-if="authorized" class="small-italic add-top-margin">
          Id: {{ update.id }}
        </p>
      </div>

      <!-- Updates editing -->
      <div class="editing-updates" v-if="update.id == editedIndex">
        <EditUpdate :updateRef="update.ref" v-on:closed="editClosed" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["slug"],
  data() {
    return {
      updates: [],
      readMoreIndex: null,
      activeIndex: null,
      editedIndex: null,
      authorized: true,
      addingUpdate: false,
      parentRef: "",
    };
  },
  async mounted() {
    console.log(this.slug);
    this.$ringkasan.getUpdatesRealtime(this.slug, this.updatesUpdated, this);
    this.parentRef = await this.$ringkasan.getArticleRef(this.slug);
    console.log(this.parentRef);
    if (this.$fire.auth.currentUser) {
      this.authorized = true;
    } else {
      this.authorized = false;
    }
    this.$checkAuth.subscribe(this.checkAuth, this);
  },
  methods: {
    checkAuth(au) {
      this.authorized = au;
    },
    updatesUpdated(incomingData) {
      console.log(incomingData);
      console.log("incoming");
      this.updates = incomingData.updates;
      console.log(this.$ringkasan.getObjFromObserver(incomingData));
    },
    readMore(u) {
      this.readMoreIndex = u.id;
      this.updateFocus(u);
    },
    closeReadMore(u) {
      this.readMoreIndex = null;
    },
    updateFocus(u) {
      this.activeIndex = u.id;
      console.log(u);
      this.readMoreIndex=u.id
    },
    editUpdate(u) {
      this.editedIndex = u.id;
    },
    async deleteUpdate(u) {
      if (window.confirm("Are you sure want to delete?")) {
        this.$nuxt.$loading.start();
        try {
          u.ref.delete();
          this.$nuxt.$loading.finish();
        } catch (error) {
          alert(error);
          this.$nuxt.$loading.finish();
        }
      }
    },
    editClosed() {
      console.log("in edit cancel");
      this.editedIndex = null;
    },
    addUpdate() {
      this.addingUpdate = true;
      this.activeIndex = null;
      console.log(this.parentRef);
    },
    addingClosed() {
      this.addingUpdate = false;
    },
  },
};
</script>
<style scoped>
.ringkasan-outer-container {
  box-shadow: 10px 10px 20px rgb(179, 177, 177);
  /* padding: 1em; */
  /* border-radius: 30px; */
  overflow: hidden;
}

.top-title {
  text-align: center;
  /* padding: 0.5em 0em; */
  /* background-color: #f5e9e9; */
  padding: 1em;
}

*:focus {
  outline: none;
}

h1,
h2,
h3,
h4 {
  color: #410a0a;
  font-weight: normal;
}

.update-container {
  padding: 1em;
  margin: 0;
  /* padding: 0.5em 0 1em 0; */
  border-top: dotted 0.5px rgb(253, 219, 219);
  display: block;
  border-top: 0.5px dotted red;
}

.small-italic {
  margin: 0 0 0.7em 0;
  font-size: 0.8em;
  font-style: italic;
}

.button-link {
  background: none !important;
  border: none;
  color: rgb(153, 0, 0);
  text-decoration: underline;
  cursor: pointer;
  padding: 1em 0 0 0;
  font-size: 13px;
}

.control-button {
  margin: 1em 0;
  padding: 0.2em 1em;
  font-size: 13px;
}

.active {
  background-color: rgb(245, 225, 225);
  border: solid rgb(255, 235, 235) 2px;
  box-shadow: 10px 5px 20px lightgrey;
}

.read-more-container /deep/ a {
  color: #410a0a;
  font-weight: bold;
}

.read-more-container /deep/ img {
  width: 100%;
}

.read-more-container /deep/ iframe {
  width: 100%;
  height: 20vh;
}
button.add-update {
  width: 100%;
  padding: 0.5em;
  font-size: 20px;
}

.adding-updates {
  background-color: rgb(255, 248, 248);
  border: solid rgb(255, 235, 235) 2px;
  padding: 1em;
}

.add-top-margin {
  margin-top: 1em;
}
</style>