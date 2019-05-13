<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive" class="router" id="router"/>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive" class="router" id="router"/>
    <loading v-model="isLoading"></loading>
  </div>
</template>

<script>
import { Loading } from 'vux'
import { mapState } from 'vuex'

export default {
  name: 'app',
  components: {
    Loading
  },
  computed: {
    ...mapState({
      isLoading: state => state.vux.isLoading
    })
  },
  methods:{
    

  }
}
</script>

<style lang="less">
@import '~vux/src/styles/reset.less';
@import '~vux/src/styles/1px.less';
@import '~vux/src/styles/close.less';
@import "./assets/css/comm";
  *{
    margin: 0;
    padding: 0;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }
  html,body{
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
  }
  input{
    border: none;
    outline:none;
  }
  .jtempop{
    z-index: 502!important;
  }
  .jtempopHeader{
    background: #fff;
    padding: 20/@r 15px;
    position: relative;
    span{
      font-size: 48/@r;
      color: #333;
    }
    .spanTitle{
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%,-50%);
      color: #000;
      font-size: 50/@r;
    }
  }
  .vux-swiper-desc{height: auto !important}
  #app {
    font-family: 'Microsoft YaHei','Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    width: 100%;
    height: 100%;
    box-shadow: border-box;
    background-color: #fff;
    -webkit-user-select: none;
    user-select: none;
    -webkit-touch-callout: none;
  }
  .weui-search-bar{
    
    &:after{
      display: none;
    }
    &:before{
      display: none;
    }
  }
  .weui-search-bar__label{
      display: flex;
      justify-content: center;
      align-items: center;
  }
  .weui-search-bar__box{
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 1.7rem;
      padding-left: 10px!important;
      padding-right: 10px!important;
  }
  .weui-search-bar__box .weui-icon-search{
    position: relative!important;
    left: 0!important;
  }
  .weui-search-bar__box .weui-icon-clear{
    position: relative!important;
  }
  .weui-search-bar{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .weui-search-bar__cancel-btn{
    color: #3594ee!important;
    font-size: 16px;
  }
  .weui-search-bar__box .weui-search-bar__input{
    height: 1.7rem!important;
  }
</style>
