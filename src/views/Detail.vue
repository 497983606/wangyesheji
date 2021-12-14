<template>
  <div class="arc">
    <h1>
    {{ info[1] }}
    <p>{{ time(Number(info[0])) }}</p>
    </h1>
    <div v-html="arc" class="markdown"></div>
  </div>
</template>

<script>
import Axios from 'axios'
import { Remarkable } from 'remarkable';
const md = new Remarkable({
  html: true,  
});
const dateFormat = (fmt, date) => {
    let ret;
    let opt = {
        "Y+": date.getFullYear().toString(),        // 年
        "m+": (date.getMonth() + 1).toString(),     // 月
        "d+": date.getDate().toString(),            // 日
        "H+": date.getHours().toString(),           // 时
        "M+": date.getMinutes().toString(),         // 分
        "S+": date.getSeconds().toString()          // 秒
    };
    for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
            fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        };
    };
    return fmt;
}

export default {
  name: "Home",
  computed:{
    time(){
      return date => {
        return dateFormat('YYYY-mm-dd HH:MM:SS', new Date(date))
      }
    }
  },
  data(){
    return {
        arc: '',
        info: []
    }
  },
  watch: {
    $route: {
      async handler(obj){
        if(!obj.query.path) return
        let path = './post/md/'+ obj.query.path.replace(' ', '') + '.md'
        let res = await Axios.get(path)
        if(res.status == 200){
            this.info = res.data.split('-->').map(str => str.replace(/<!-- |\n|\r|' '/g, ''))
            this.arc = md.render(res.data)
        }
      },
      deep: true,
      immediate: true
    }
  },
};
</script>

<style>
    .arc{
        width: calc(70% - 40px);
        overflow: hidden;
        padding: 0 20px;
        float: right;
    }
    .arc h1{
        font-size: 40px;
        border-left: 10px solid rgba(255, 255, 255, 0.16);
        padding-left: 20px;
    }
    .arc h1 p{
        font-size: 14px;
        font-weight: 300;
        color: rgba(255, 255, 255, 0.56);
    }
    
  
</style>