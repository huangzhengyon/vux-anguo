<template>
  <div class="back">
    <div class="i" @click="backmount">
      <img src="./icons/backIcon.png" alt>
    </div>
  </div>
</template>

<script type="es6">
export default {
  name: "back",
  props: ["options"],
  data() {
    return {};
  },
  methods: {
    backmount() {
      let vm = this;
      if (vm.options == "index") {
        vm.$router.push({ path: "./" });
      } else if (vm.options == "agent") {
        vm.$router.push({ path: "./agentHome" });
      } else {
        vm.$router.go(-1);
      }
    }
  }
};
</script>

<style scoped lang="less" type="text/less">
@import "../assets/css/comm";
.back {
  position: fixed;
  top: 40 / @r;
  left: 40 / @r;
  background: #b1b1b1;
  width: 96 / @r;
  height: 96 / @r;
  z-index: 502;
  .center;
  border: solid 0.5px #b1b1b1;
  border-radius: 50%;
  opacity: 0.5;
  .i {
    .center;
    img {
      width: 40%;
    }
  }
}
</style>