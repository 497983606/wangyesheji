<template>
  <div class="about">
<<<<<<< Updated upstream
    <h1> 关于我 </h1>
    <div v-html="arc" class="markdown"></div>
  </div>
</template>
<script>
import { Remarkable } from 'remarkable';
import Axios from 'axios'
const md = new Remarkable({
  html: true,  
});
export default {
  data(){
    return {
      arc: ''
    }
  },
  async mounted(){
    let res = await Axios.get('./post/about.md')
    if(res.status == 200){
        this.arc = md.render(res.data)
    }
  }
}
</script>
<style>
  .about{
    width: calc(70% - 40px);
    overflow: hidden;
    padding: 0 20px;
    float: right;
  }
  .about h1{
    font-size: 40px;
    border-left: 10px solid rgba(255, 255, 255, 0.16);
    padding-left: 20px;
  }
  
</style>
=======
    <h1>This is an about page</h1>
  </div>
</template>
>>>>>>> Stashed changes
