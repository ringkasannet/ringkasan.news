<template>
  <div class="container">
    <div class="main-title">
        <h1>Login page</h1>
    </div>
    <h3>User name</h3>
    <input v-model="email" class="login-input"/>
    <h3>User name</h3>
    <input v-model="pass" class="login-input"/>
    <button v-on:click="signin" class="signin-button"> <h3> Sign in </h3> </button>
  </div>
</template>

<script>
// import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
// const auth = getAuth();
// signInWithEmailAndPassword(auth, email, password)
//   .then((userCredential) => {
//     // Signed in
//     const user = userCredential.user;
//     // ...
//   })
//   .catch((error) => {
//     const errorCode = error.code;
//     const errorMessage = error.message;
//   });
export default {
  data() {
    return {
      email: "",
      pass: "",
    };
  },
  async mounted() {
    const au = await this.$fire.auth.signInWithEmailAndPassword(
      "ringkasan.net@gmail.com",
      "Screamer1"
    );
    console.log(au);
  },
  methods:{
    async signin(){
      console.log('loging in')
      try{
      const sign = await this.$fire.auth
        .signInWithEmailAndPassword(this.email,this.pass)
      this.$router.push('/')
      } catch(error) {
        alert(error)
      }

    }
  }
};
</script>

<style scoped>
* {
    margin:0.5em;
    font-weight:initial;
    display:block;
}

.main-title{
    margin:auto;
    text-align: center;
}

.login-input{
    width:100%;
}

.container{
    max-width: 700px;
    padding:5em;
    margin:auto;
}

.signin-button{
  margin-top:2em;
}
</style>



