<template>
  <div id="sreach" class="sreach"> 
    <div class="sreachBox">
        <div class="in">
          <input class="searching" :placeholder="sreachtext.searchplaceholder" type="text" />
          <div class="searchBtn" @click="search"></div>
        </div>
    </div>
  </div>
</template>
<script type="es6">
  export default {
    name: 'sreach',
    props:['message'],
    data () {
      return {
        sreachtext:this.message,
        showMenu:false,
        popupVisible:false,
       
      }
    },
    mounted(){
      let vm = this
    },
    watch:{
      message:{
        handler(newValue,oldValue){
           this.sreachtext = newValue
        },
        deep:true
      }
    },
    methods:{
      search(){
        let vm = this 
        vm.popupVisible = false 
      },
      showScr(){
        let vm = this 
         vm.popupVisible = !vm.popupVisible
      },
      chooseType(el){
        let vm = this 
        let type = el.currentTarget.getAttribute('type')

        vm.typeList.forEach((item,i)=>{
          item.selected = false 
          if(type == item.type)
          {
            vm.typeList[i].selected = true 
          }
        })
      },
      chooseStatus(el){
        let vm = this 
        let type = el.currentTarget.getAttribute('type')

        vm.statusList.forEach((item,i)=>{
          item.selected = false 
          if(type == item.type)
          {
            vm.statusList[i].selected = true 
          }
        })
      },
      chooseOrange(el){
        let vm = this
        let type = el.currentTarget.getAttribute('type')

        vm.orangeList.forEach((item,i)=>{
          item.selected = false 
          if(type == item.type)
          {
            vm.orangeList[i].selected = true 
          }
        })
      },
      chooseYear(el){
        let vm = this
        let type = el.currentTarget.getAttribute('type')

        vm.dateList.forEach((item,i)=>{
          item.selected = false 
          if(type == item.type)
          {
            vm.dateList[i].selected = true 
          }
        })
      },
      /**
       * 路由后退
       * */
      routerBack() {
        this.$routerBack();
      }
    }
  }
</script>

<style lang="less">
@import "../assets/css/comm";
input::-webkit-input-placeholder{color: #bebebe;}
input::-moz-placeholder{color: #bebebe;}
input:-moz-placeholder{color: #bebebe;}
input:-ms-input-placeholder{color: #bebebe;}
  .sreachBox{

  }
</style>