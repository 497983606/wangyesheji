<template>
  <div class="header">  
    <p class="logo"><img src="../assets/img/logo.svg"/></p>
    
  </div>
</template>

<script>
export default {

}
</script>

<style>
.header{
  width: 30%;
  position: fixed;
  top: 0;
  height: 95%;
  left: 0;
  padding-top: 5%;
}
.header .logo{
  text-align: center;
  width: 100%;
  margin-top: 10px;
  user-select: none;
  display: block;
  
}
.header .logo img{
  width: 80%;
  max-width: 300px;
}
.header a{
  display: block;
  font-size: 18px;
  font-weight: bold;
  margin: 20px 0;
  text-align: center;
}
</style>