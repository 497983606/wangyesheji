<template>
  <Header/>
  <router-view />
</template>
<script>

import Header from "@/components/header.vue";
export default {
  components: {
    Header,
  },
}
</script>
<style>
#app {
  width: 100%;
  max-width: 1400px;
  margin: auto;
}
</style>
