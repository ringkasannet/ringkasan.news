<template>
  <div class="container">
    <div v-for="(slug, index) in slugs" :key="index">
      <div class="shadow-container">
        <NuxtLink :to="'/article2/' + slug" class="nuxt-link">
          <RingkasanHeader :slug="slug"/>
        </NuxtLink>
      </div>
    </div>
 
    <div v-if="authorized && !addingArticle" class="add-article">
      <div class="add-article">
        <button v-on:click="addArticle" class="main-button add-article">
          + Add Article
        </button>
      </div>
    </div>

    <div class="adding-articles-container" v-if="addingArticle">
      <EditRingkasan v-on:closed="editingClosed" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      authorized: false,
      addingArticle: false,
      slugs: [],
    };
  },
  async mounted() {
    if (this.$fire.auth.currentUser) {
      this.authorized = true;
    } else {
      this.authorized = false;
    }

    this.slugs = await this.$ringkasan.getSlugs();

    this.$checkAuth.subscribe(this.checkAuth, this);
  },
  methods: {
    checkAuth(au) {
      this.authorized = au;
    },
    addArticle() {
      this.addingArticle = true;
    },
    editingClosed() {
      this.addingArticle = false;
    },
  },
};
</script>

<style>
.container {
  margin: 1em auto;
  min-height: 100vh;
  /* display: flex; */
}

.nuxt-link /deep/ strong {
  color: #410a0a;
}

a.nuxt-link {
  text-decoration: none;
  color: black;
}

.add-top-margin {
  margin-top: 2em;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}

.shadow-container {
  box-shadow: 10px 10px 20px rgb(179, 177, 177);
  border-radius: 30px;
  overflow: hidden;
  margin-bottom: 2em;;
}

button.add-article {
  width: 100%;
  padding: 0.5em;
  font-size: 20px;
  margin-top: 2em;
}

.adding-articles-container {
  background-color: rgb(255, 248, 248);
  border: solid rgb(255, 235, 235) 2px;
  padding: 1em;
  margin: 2em 0;
}
</style>
