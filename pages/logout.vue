<template></template>

<script>
export default {
  mounted() {
    this.$fire.auth.signOut();
    this.$router.push("/");
  },
};
</script>