<template>
  <div class="main-body">
    <div class="shadow-container">
    <RingkasanHeader class="add-bottom-margin" :slug="slug" displayFull="true">
    </RingkasanHeader>
    <RingkasanBody :slug="slug" class="add-top-border"/>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return{
      slug:this.$route.params.slug
    }
  }
}
</script>
<style scoped>
.main-body {
  margin: 1em auto;
  display: flex;
  flex-direction: column;
}

.add-bottom-margin{
  margin-bottom:1em;
}

.shadow-container {
  box-shadow: 10px 10px 20px rgb(179, 177, 177);
  border-radius: 30px;
  overflow:hidden;
  border-top:solid #740d0d 10px;
}

.add-top-border{
    border-top: solid 20px #740d0d ;

}

</style>
