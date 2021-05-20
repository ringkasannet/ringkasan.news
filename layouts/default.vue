<template>
  <div class="default-layout-body">
    <div class="default-layout-header">
      <div class="default-layout-logo">
        <NuxtLink to="/">
        <h2 class="default-layout-logo">Ringkasan</h2>
        </NuxtLink>
      </div>
      <div class="default-layout-menus">
        <div v-if="!authorized" class="default-layout-menu">
          <NuxtLink to="/adminLogin">Login</NuxtLink>
        </div>
        <div v-if="authorized" class="default-layout-menu">
          <NuxtLink to="/logout">Logout</NuxtLink>
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
</style>


<style scoped>

a{
  text-decoration: none;
}
.default-layout-body {
  padding: 0 2em;
  margin: auto;
  max-width: 700px;
}

.default-layout-header {
  display: flex;
  align-items: stretch;
  width: 100%;
  justify-content: space-between;
  padding: 1em 0.5em 0.5em 0.5em;
}

.default-layout-logo {
  flex: 2;
  text-decoration: none;
}

.default-layout-menus {
  display: flex;
  flex-direction: columns;
  /* align-content: flex-end; */
  justify-content: flex-end;
  flex: 1;
}

h2.default-layout-logo {
  font-weight: normal;
  letter-spacing: 4px;
  color: rgb(100, 3, 3);
}

.default-layout-menu {
  margin: 0 0 0 1em;
}

a {
  color: rgb(100, 3, 3);
}

</style>
