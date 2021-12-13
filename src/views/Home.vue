<template>
  <div class="home">
    <Header/>
  </div>
</template>

<script>
import Header from "@/components/header.vue";

export default {
  name: "Home",
  components: {
    Header,
  },
};
</script>

<style>
  .home{
    background-color: #000;
    height: 100%;
    width: 100%;
  }
</style>