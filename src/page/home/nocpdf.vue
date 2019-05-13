<template>
  <div id="container" class="container">
    <div class='pdf-page'>
      <back options=""></back>
      <div class="downloadBtn" @click="downloadFile"></div>
      <!-- <canvas v-for="page in pages" :id="'the-canvas'+page" :key="page"></canvas>
      <div class="buttons">
          <div class="defaultbtn" @click="zoomBig">
            <img src="./icons/ujia.png">
          </div>
          <div class="defaultbtn">
             <img src="./icons/ujian.png">
          </div>
          <div class="defaultbtn">
             <img src="./icons/download.png">
          </div>
      </div> -->
    </div>
  </div>
</template>
<script>
import PDFJS from 'pdfjs-dist'
import wx from 'weixin-js-sdk'
let Base64 = require('js-base64').Base64

export default {
  data () {
    return {
      title: '',
      pdfDoc: null,
      loadding: false,
      scale:1,
      pages: 0,
      url:'',//文件路径
    }
  },
  methods: {
    downloadFile(){//下载PDF
      let vm = this 
      
      var elemIF = document.createElement("iframe");   
      elemIF.src = vm.url;   
      elemIF.style.display = "none";   
      document.body.appendChild(elemIF);   
      
    },
    zoomBig(){
      let vm = this 
      vm.scale += 0.1 
      vm.renderPage(1)
    },
    renderPage (num) {
      let _this = this
      this.pdfDoc.getPage(num).then(function (page) {
        let canvas = document.getElementById('the-canvas' + num)
        let ctx = canvas.getContext('2d')
        let dpr = window.devicePixelRatio || 1
        let bsr = ctx.webkitBackingStorePixelRatio ||
                  ctx.mozBackingStorePixelRatio ||
                  ctx.msBackingStorePixelRatio ||
                  ctx.oBackingStorePixelRatio ||
                  ctx.backingStorePixelRatio || 1
        let ratio = dpr / bsr
        var viewport = page.getViewport(screen.availWidth / page.getViewport(_this.scale).width)
        canvas.width = viewport.width * ratio 
        canvas.height = viewport.height * ratio 
        canvas.style.width = viewport.width  + 'px'
        canvas.style.height = viewport.height  + 'px'
        ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
        var renderContext = {
          canvasContext: ctx,
          viewport: viewport
        }
        page.render(renderContext)
        if (_this.pages > num) {
          _this.renderPage(num + 1)
        }
      })
    },
    loadFile (url) {
      let _this = this
      PDFJS.getDocument(url).then(function (pdf) {
        _this.pdfDoc = pdf
        _this.pages = _this.pdfDoc.numPages
        _this.$nextTick(() => {
          _this.renderPage(1)
        })
      })
    },
    getTicket(url){
      let vm = this 
      
    }
  },
  mounted () {
    let vm = this 
    let url = this.$route.query.id

    vm.url = url 
    this.loadFile(url)
    vm.$nextTick(()=>{
      var pdfh5 = new Pdfh5('.container', {
          pdfurl: vm.url
      });
      vm.$showShare()
      // vm.getTicket(encodeURIComponent(url))
      // vm.getTicket(url)
    })
  }
}
</script>
 
<style lang="less" scoped>
#container {
  background-color: rgba(0,0,0,0.75);
  position:fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  text-align: center;
  padding: 5px;
}
 
.pdf-page {
  .downloadBtn{
    width: 50px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    position: absolute;
    bottom: 90px;
    right: 15px;
    font-size: 18px;
    z-index: 99;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.2) url('./icons/download.png') no-repeat center;
    background-size: 50% 50%;
  }
}
 
.foot {
  position: fixed;
  transform: translate(-50%,0);
  left: 50%;
}
</style>
