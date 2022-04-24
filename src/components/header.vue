<template>
  <div class="header">  
    <p class="logo"><img src="../assets/img/logo.svg"/></p>
    <p class="about-icon">
      <i class="iconfont icon-shouye" @click="$router.push('/')"></i>
      <i class="iconfont icon-icon-test8"></i>
      <i class="iconfont icon-icon-test9" @click="$router.push('About')"></i>
    </p>
    <a class="link" :href="'/#/detail?path='+ pre.title" v-if="pre"><i class="iconfont icon-icon-test16"></i>
      {{ pre.title }}
    </a>
    <a class="link" :href="'/#/detail?path='+ next.title" v-if="next"><i class="iconfont icon-icon-test17"></i>
      {{ next.title }}
    </a>
  </div>
</template>

<script>
import Axios from 'axios'
export default {
  data(){
    return {
      list: [],
      pre: null,
      next: null
    }
  },
  watch: {
    $route: {
      handler(obj){
        let title = obj.query.path
        this.pre = null; this.next = null; 
        if(!title || this.list.lengt == 1) return
        for(let i in this.list){
          if(this.list[i].title.replace(' ', '') == title){
            if(i < this.list.length - 1) this.next = this.list[Number(i)+1]
            if(i > 0) this.pre = this.list[Number(i)-1]
          }
        }

      },
      deep: true,
      immediate: true
    }
  },
  async mounted(){
    let res = await Axios.get('./post/db.json')
      if(res.status == 200){
        this.list = res.data.sort((x,y) => y.time - x.time)
      }
      
  }
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
.about-icon{
  padding: 20px 0;
  text-align: center;
}
.not-alow{
  opacity: .5;
  cursor: not-allowed;
}
.about-icon i{
  font-size: 30px;
  padding: 5px;
  border: 1px solid rgba(255, 255, 255, 0.287);
  margin-left: 20px;
  cursor: pointer;
  background-color: rgba(255, 255, 255, 0.068);
  border-radius: 10px;
}
.about-icon i:nth-child(1){
  margin-left: 0;
}
.header .logo{
  text-align: center;
  width: 100%;
  margin-top: 10px;
  user-select: none;
  display: block;
  
}
.header a.link{
  display: block;
  color: #fff;
  text-decoration: none;
  font-size: 1.2em;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding: 5px;
  width: 60%;
  margin: auto;
  background-color: rgba(255, 255, 255, 0.103);
  margin-top: 20px;
  overflow: hidden;
}
.header .logo img{
  width: 80%;
  max-width: 300px;
}
</style>