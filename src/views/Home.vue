<template>
  <div class="list">
    <dl v-for="(v, key) in list" :key="key" @click="route()">
      <dt>{{ key }}</dt>
      <dd>{{ v.describe }}</dd>
      <p>{{ time(Number(v.time)) }}</p>
    </dl>
  </div>
</template>

<script>
import Axios from 'axios'

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
      list: {}
    }
  },
  async mounted(){
    let res = await Axios.get('./post/db.json')
        if(res.status == 200){
          this.list = res.data
        }
  }
};
</script>

<style>
  .list{
    width: calc(70% - 40px);
    overflow: hidden;
    padding: 0 20px;
    float: right;
    cursor: pointer;
  }
  .list dl{
    background-color: rgba(221, 221, 221, 0.06);
    padding: 20px;
    margin: 20px 0;
  }
  .list dl p{
    font-family: Arial, Helvetica, sans-serif;
    color: rgba(255, 255, 255, 0.287);
  }
  .list dt{
    font-size: 32px;
    font-weight: bold;
    padding: 10px 0;
  }
  .list dd{
    width: 100%;
    font-size: 20px;
    line-height: 1.5;
    padding: 10px 0;
    margin: 0;
    color: rgba(255, 255, 255, 0.624);
  }
</style>