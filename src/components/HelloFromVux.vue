<template>
  <div>
    <div class="vux-demo">
      <img class="logo" src="../assets/img/vux_logo.png">
      <h1>{{msg}}</h1>
    </div>
    <span class="vux-close"></span>
    <group title="cell demo">
      <cell title="VUX" value="cool" is-link link="http://www.baidu.com"></cell>
    </group>
  </div>
</template>

<script>
import { Group, Cell } from 'vux'

export default {
  components: {
    Group,
    Cell
  },
  data () {
    return {
      // note: changing this line won't causes changes
      // with hot-reload because the reloaded component
      // preserves its current state and we are modifying
      // its initial state.
      msg: 'Hello World!'
    }
  },
  mounted(){
    // this.$vux.loading.show({
    //   text: '加载中...'
    // });
    // setTimeout(() => {
    //   this.$vux.loading.hide()
    // }, 1000);
    // this.$vux.toast.show({
    //   type: 'text',
    //   position: 'middle',
    //   text: '请输入查询内容!'
    // });
  }
}
</script>

<style>
.vux-demo {
  text-align: center;
}
.logo {
  width: 100px;
  height: 100px
}
</style>
