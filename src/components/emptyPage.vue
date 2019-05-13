<template>
  <div class="emptyPage" v-show="emptyPage">
      <div class="i">
        <img src="./icons/i1.png" alt=""/>
      </div>
      <p class="tips">暂无数据</p>
  </div>
</template>

<script type="es6">
  export default {
    name: 'emptyPage',
    props: ['desc'],
    data () {
      return {
        emptyPage: true
      }
    },
    methods: {

    }
  }

</script>

<style scoped lang="less" type="text/less">
  @import "../assets/css/comm";
  .emptyPage{
    width: 100%;
    height: 100%;
    .i{
      margin-bottom: 96/@s;
      padding-top: 100/@s;
      text-align: center;
      img{
        width: 50%;
      }
    }
    .tips{
      color: #979595;
      font-size: 46/@r;
      text-align: center;
      margin-bottom: 110/@s;
      word-wrap: break-word;
      word-break: break-all;
    }
    .load{
      color: #ffffff;
      font-size: 50/@r;
      width: 468/@s;
      height: 110/@r;
      line-height: 110/@r;
      text-align: center;
      margin: 0 auto;
      background-color: #2d92f1;
      border-radius: 5px;;
    }
  }
</style>