<template>
  <div class="main-body">
    <div class="header">
      <div class="logo">
        <h3 class="logo">Ringkasan</h3>
      </div>
      <div class="menus">
        <div class="menu">
          <NuxtLink to="/">Home</NuxtLink>
        </div>
        <div v-if="!authorized" class="menu">
          <NuxtLink to="/adminLogin">Login</NuxtLink>
        </div>
        <div v-if="authorized" class="menu">
          <NuxtLink to="/logout">Logout</NuxtLink>
        </div>
        <div class="menu">
          <NuxtLink
            :to="{
              name: 'article-article',
              params: { article: 'kpk-ujian-kebangsaan' },
            }"
            >Article</NuxtLink
          >
        </div>
      </div>
    </div>
    <Nuxt />
  </div>
</template>

<script>
export default {
  data() {
    return {
      authorized: false,
    };
  },
  mounted() {
    if (this.$fire.auth.currentUser) {
      this.authorized = true;
    } else {
      this.authorized = false;
    }

    this.$checkAuth.subscribe(this.checkAuth, this);
  },
  methods: {
    checkAuth(au) {
      if (au) {
        this.authorized = true;
      } else {
        this.authorized = false;
      }
    },
  },
};
</script>
<style>
html {
  font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

.main-body {
  padding: 0 2em;
  margin: auto;
  max-width: 700px;
}

.header {
  display: flex;
  align-items: stretch;
  width: 100%;
  justify-content: space-between;
  padding: 1em 0.5em 0.2em 0.5em;
}

.logo {
  flex: 2;
}
h3.logo {
  font-weight: normal;
  letter-spacing: 4px;
  color: rgb(100, 3, 3);
}
.menus {
  display: flex;
  flex-direction: row;
  /* align-content: flex-end; */
  justify-content: flex-end;
  flex: 1;
}

.menu {
  margin: 0 0 0 1em;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}

a {
  color: rgb(100, 3, 3);
}
</style>
