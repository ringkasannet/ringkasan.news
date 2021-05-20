<template>
  <div class="ringkasan-outer-container">
    <div v-if="!editingRingkasan">
      <div class="header-container">
        <div
          class="image-container"
          v-bind:style="{
            'background-image': 'url(' + ringkasan.data.image + ')',
          }"
        ></div>
        <div class="ringkasan-container">
          <PulsingCircle/>
          <h2 class="title add-small-top-margin"> <strong> {{ ringkasan.data.title }} </strong></h2>
          <div v-if="!displayFull">
            <h3 class="title"> Latest Update: </h3>
            <div>
              <ul class="ringkasan-latest-update">
                <li>
                    {{ latestUpdate.title }} 
                    <p class="time"> {{ latestUpdate.time }} </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="ringkasan-detail" v-if="displayFull == 'true'">
        <h2>Ringkasan</h2>
        <span v-html="ringkasan.data.ringkasan" class="ringkasan-item" />
      </div>
      <div class="add-left-padding">
        <button
          v-if="authorized && displayFull"
          v-on:click="editRingkasan"
          class="control-button"
        >
          edit
        </button>
      </div>
    </div>

    <EditRingkasan
      class="editing-ringkasan"
      v-if="editingRingkasan"
      v-on:closed="editingClosed"
      :articleRef="ringkasan.ref"
    />
  </div>
</template>

<script>
export default {
  props: ["slug", "displayFull"],
  data() {
    return {
      editingRingkasan: false,
      authorized: false,
      latestUpdate: "",
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
  methods: {
    checkAuth(au) {
      this.authorized = au;
    },
    ringkasanUpdated(ringkasan) {
      this.ringkasan = ringkasan;
      this.$nuxt.$loading.finish();
    },
    latestUpdateUpdated(u) {
      this.latestUpdate = u;
      this.$nuxt.$loading.finish();
    },
    test() {
      console.log(this.getObjectfromObserver(this.ringkasan));
    },
    getObjectfromObserver(o) {
      return JSON.parse(JSON.stringify(o));
    },
    editRingkasan() {
      this.editingRingkasan = true;
    },
    editingClosed() {
      this.editingRingkasan = false;
    },
  },
  async mounted() {
    this.$nextTick(() => {
      this.$nuxt.$loading.start();
    });

    if (this.$fire.auth.currentUser) {
      this.authorized = true;
    } else {
      this.authorized = false;
    }
    this.$checkAuth.subscribe(this.checkAuth, this);

    this.$ringkasan.getRingkasanRealtime(
      this.slug,
      this.ringkasanUpdated,
      this
    );

    this.$ringkasan.getLatestUpdateRealtime(
      this.slug,
      this.latestUpdateUpdated,
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
  line-height: 1.5;
}

h1 {
  margin-bottom: 0.2em;
  font-size: 2em;
}

h2 {
  font-size: 1.5em;
}

h1,
h2,
h3 {
  color: #410a0a;
  font-weight: normal;
}
.ringkasan-item /deep/ strong {
  color: #410a0a;
}

.ringkasan-detail /deep/ a {
  color: #410a0a;
  text-decoration: underline;
}

.ringkasan-item /deep/ ul {
  padding-left: 1em;
}

ul.ringkasan-latest-update {
  padding: 0 2em;
}

/* ringkasan-container /deep/ a{
  text-decoration: underline;
  color: #410a0a
} */
.ringkasan-outer-container {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.header-container {
  display: flex;
  flex-direction: row;
  /* text-decoration: none; */
}

.image-container {
  flex: 30%;
  background-size: cover;
  background-position: 50% 50%;
  /* position: relative;
  background-position: 50% 50%;
  width: 100%;
  height: 100%; */
}

.ringkasan-container {
  flex: 70%;
  padding: 0.5em 1em 1em 1em;
}

.ringkasan-detail {
  margin-top: 0.1em;
  padding: 0.5em 1em 1em 1em;
  border-top: dotted 1px #410a0a;
  text-decoration: none;
}

.control-button {
  margin: 1em 0;
  padding: 0.2em 1em;
  font-size: 15px;
}

.add-left-padding {
  padding-left: 1em;
}

.editing-ringkasan {
  background-color: rgb(255, 248, 248);
  border: solid rgb(255, 235, 235) 2px;
  padding: 1em;
}

.add-top-margin {
  margin-top: 1em;
}


.add-small-top-margin{
  margin-top: 0.5em;
}
.time {
  margin: 0.5em 0 0.7em 0;
  font-style: italic;
  font-size: 13px;;
  font-weight: bold;
}

.bold{
  font-weight: bold;
}
</style>


