<template>
  <div class="cpdf">
    <!-- <x-header >PDF预览</x-header> -->
    <!-- <c-pdf @closepdf="closepdf" v-show="isshowpdf" :pdfurl="testpdfurl"></c-pdf> -->
    <iframe class="iframe" style="width: 100%;height:100%" :src="fileUrl"></iframe>
  </div>
</template>
<!-- <template>
  <div>
    <x-header >PDF预览</x-header>
    <back options=""></back>
    <pdf
      v-for="i in numPages"
      :key="i"
      :src="src"
      :page="i"
      style="display: inline-block; width: 100%"
    ></pdf>
  </div>
</template>

<script>

import pdf from 'vue-pdf'

export default {
  components: {
    pdf
  },
  data() {
    return {
      src: '',
      numPages: undefined,
    }
  },
  mounted() {
    let vm = this 
    let getUrl = vm.$route.query.id
    vm.src = pdf.createLoadingTask(getUrl)
    vm.src.then(pdf => {
      vm.numPages = pdf.numPages;
    });
  },
  methods:{

  }
}

</script> -->
<script>

import pdf from 'vue-pdf'



export default {
  data() {
    return {
      isshowpdf:false,
      testpdfurl:'//cdn.mozilla.net/pdfjs/tracemonkey.pdf',
      fileUrl:''
    }
  },
  mounted() {
    let vm = this 
    vm.fileUrl = vm.$route.query.id
    console.log(vm.fileUrl)
  },
  methods:{
     closepdf(){
      this.isshowpdf=false
     },
  }
}

</script>
<style lang="less">
  @import "../../assets/css/comm";
  .cpdf{
    min-height: 100%;
    height: 100%;
    .iframe{
      width: 100%;
    }
  }
</style>