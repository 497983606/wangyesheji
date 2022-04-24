<template>
  <div class="list">
    <dl v-for="v in list" :key="v.time" @click="$router.push({name: 'Detail', query: { path: v.title.replace(' ', '')}})">
      <dt>{{ v.title }}</dt>
      <div>
        <img :src="v.img" v-if="v.img && v.img.indexOf('./post/') > -1"> 
        <dd>{{ v.describe }} <p> {{ time(Number(v.time)) }}</p></dd>
      </div>
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
      list: []
    }
  },
  async mounted(){
    let res = await Axios.get('./post/db.json')
        if(res.status == 200){
          this.list = res.data.sort((x,y) => y.time - x.time)
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
  .list dd p{
    font-family: Arial, Helvetica, sans-serif;
    color: rgba(255, 255, 255, 0.287);
    font-size: 18px;
    margin-top: 10px;
  }
  .list div{
    overflow: hidden;
  }
  .list div img{
    height: 100px;
    margin-right: 10px;
    display: block;
    float: left;
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
    margin: 0;
    color: rgba(255, 255, 255, 0.624);
  }
</style>
