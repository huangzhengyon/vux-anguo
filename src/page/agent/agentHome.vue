<template>
  <div class="agentHome">
    <grid  :cols="3" >
      <grid-item class="gridItem" :label="item.name" v-for="(item,index) in gridData" @click.native="gotoOrderList(item.status)" :key="index">
        <img slot="icon" :src="item.imgUrl">
      </grid-item>
      <grid-item class="gridItem" link="./agentPolicy" label="我的保单">
        <img slot="icon" src="./icons/index09.png">
      </grid-item>
    </grid>
  </div>
</template>

<script>
import _ from 'lodash'
import { Grid, GridItem, GroupTitle } from 'vux'

const indexList = [
  {
    name:'预约待确认',
    imgUrl:require('./icons/index01.png'),
    status:['140','145']
  },
  {
    name:'预约不成功',
    imgUrl:require('./icons/index02.png'),
    status:['160']
  },
  {
    name:'预约排期成功',
    imgUrl:require('./icons/index03.png'),
    status:['200']
  },
  {
    name:'核保中',
    imgUrl:require('./icons/index04.png'),
    status:['300']
  },
  {
    name:'核保异常',
    imgUrl:require('./icons/index05.png'),
    status:['350','700']
  },
  {
    name:'承保完成',
    imgUrl:require('./icons/index06.png'),
    status:['600','610']
  },
  {
    name:'预约取消',
    imgUrl:require('./icons/index07.png'),
    status:['170']
  },
  {
    name:'签单失败',
    imgUrl:require('./icons/index08.png'),
    status:['500']
  },
]

export default {
  components: {
    Grid,
    GridItem,
    GroupTitle
  },
  data () {
    return {
      gridData:indexList
    }
  },
  mounted(){
    let vm = this 
    vm.$hideShare()
  },
  methods:{
    gotoOrderList(id){
      let vm = this 
      vm.$utils.sessionStorage.setItem('statusCode', id.toString())
      vm.$router.push({path:'./agent'})
    }
  }
}
</script>

<style lang="less">
  @import "../../assets/css/comm";
  body{margin: 0;}
  .agentHome{
    .gridItem{
      .weui-grid__icon{
        width: 118/@r;
        height: 125/@r;
      }
    }
  }
</style>
