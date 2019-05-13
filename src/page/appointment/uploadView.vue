<template>
  <div class="uploadView">
    <!-- <x-header>资料上传</x-header> -->
    <back options=""></back>
    <div class="main">
      <ul class="mainWrap">
        <li class="liWrap" v-for="(item,key) in typeData" :key="key">
          <div class="typeTitle">
            <span>{{item.imageTypeName}}</span>
            <span class="requiredspan" v-show="item.isRequired == '0' ">*</span>
          </div>
          <div class="typeDesc">
            <span>{{item.imageTypeDesc}}</span>
          </div>
          <div class="typeMain">
            <div class="listwrap">
              <ul>
                <li v-for="(jtem,index) in item.filePath" :key="index">
                   <img :src="`../../${jtem.imageUrl}`">
                   <div class="deletebtn" @click="deleteImg(item.imageTypeCode,jtem.imageId)">
                     <img src="./icons/delete2.png">
                   </div>
                </li>
              </ul>
            </div>
            <div class="btnbox">
              <img src="./icons/add.png" alt="" class="addIcon">
              <input type="file" accept="image/*" class="upbtn"  multiple ref="picers" @change="newUpload($event,item.imageTypeCode)">
            </div>
          </div>
        </li>
      </ul>
      <box class="nextstepbtn" @click.native="gotoNextstep">
        <x-button >下一步</x-button>
      </box>
    </div>
  </div>
</template>

<script>
import { Swiper,SwiperItem, Group, Cell,Box,XButton } from 'vux'

const imgAccount = 20



export default {
  components: {
    Swiper,
    Group,
    Cell,
    Box,
    XButton
  },
  data () {
    return {
      productId:'',//产品Id
      typeData:[],//类型列表
      orderNo:'',//订单号
      statusCode:'',//订单状态码
    }
  },
  mounted(){
    let vm = this 
    vm.productId = vm.$route.query.productId
    vm.orderNo = vm.$route.query.orderNo
    vm.statusCode = vm.$route.query.statusCode
    vm.getDataQuery()
    vm.$hideShare()
  },
  methods:{
    deleteImg(type,id){//删除图片
      let vm = this 
      let obj = {
          servicePath:'KINGWORKS_001_007_005',
          jsonData: {
             imageId:id
          }
      }
      vm.$showModel()
      vm.$doajax(obj)
        .then(function (response) {
          var data = response.data,
            header = data.header,
            retCode = header.retCode,
            retMsg = header.retMsg;
          vm.$retCodeHandle(data, function () {
            var body = data.body;
            vm.getUploadedImg()
          },{
            'else':function(){
              vm.$toast(retMsg)
              vm.$hideModel()
            }
          });
        })
        .catch(function (error) {
          vm.$hideModel()
          var toast = vm.$getRetMsg(error);
          vm.$toast(toast);
        });
    },
    gotoNextstep(){//必传图片已上传下一步
      let vm = this 
      let hasDone = true 
      vm.typeData.map(item=>{
        if(item.isRequired == '0' && item.filePath.length == 0){
          hasDone = false
        }
      })
      if(hasDone){
        vm.$router.push({path:'./orderDate',query:{orderNo:vm.orderNo,productId:vm.productId,statusCode:vm.statusCode}})
      }else{
        vm.$toast('您有理赔资料未上传，请补全上传资料')
      }
    },
    getUploadedImg(){//获取已上传图片
      let vm = this 
      let obj = {
          servicePath:'KINGWORKS_001_007_002',
          jsonData: {
             orderNo:vm.orderNo
          }
      }
      vm.$showModel()
      vm.$doajax(obj)
        .then(function (response) {
          var data = response.data,
            header = data.header,
            retCode = header.retCode,
            retMsg = header.retMsg;
          vm.$retCodeHandle(data, function () {
            var body = data.body;
            vm.typeData.forEach(item=>{
              item.filePath = new Array()
            })   
            body.imageList.map(item=>{
              vm.typeData.map((jtem,i)=>{
                if(item.imageType == jtem.imageTypeCode){
                  vm.typeData[i].filePath.push(item)
                }
              })
            })
            console.log(vm.typeData)
            vm.$hideModel()
          },{
            'else':function(){
              vm.$toast(retMsg)
              vm.$hideModel()
            }
          });
        })
        .catch(function (error) {
          vm.$hideModel()
          var toast = vm.$getRetMsg(error);
          vm.$toast(toast);
        });
    },
    getDataQuery(){//获取类型列表
      let vm = this 
      let obj = {
          servicePath:'KINGWORKS_001_007_001',
          jsonData: {
             productId:vm.productId
          }
      }
      vm.$showModel()
      vm.$doajax(obj)
        .then(function (response) {
          var data = response.data,
            header = data.header,
            retCode = header.retCode,
            retMsg = header.retMsg;
          vm.$retCodeHandle(data, function () {
            var body = data.body;   
            
            vm.typeData = body.imageTypeList.map(item=>{
              let newArr = new Array()
              return Object.assign({},{filePath:newArr},item)
            })
            vm.getUploadedImg()
            vm.$hideModel()
          },{
            'else':function(){
              vm.$toast(retMsg)
              vm.$hideModel()
            }
          });
        })
        .catch(function (error) {
          vm.$hideModel()
          var toast = vm.$getRetMsg(error);
          vm.$toast(toast);
        });
    },
    newUpload:function(e,code){//图片上传code为图片类型编码
        var vm = this;
        var file = e.target.files[0];
        var fileType = file.type;
        var instance=vm.$axios.create({
            withCredentials: true
        });
        if(file.size > 500000){
            //压缩图片
            new Smaller({
                file: file,
                scale: 0.3,
                success: function (data) {
                    var file = data.file;
                    var url = data.url;
                    var formData = new FormData();
                    formData.append('img', file, 'jpg');
                    instance.post(vm.$getServicer().localhostPath+'/anguo/restfull/hklifesop/KINGWORKS_001_007_003', formData)
                            .then(function (res) {
                                vm.updateImglist(code,res.data.body.imageId)
                            });
                }
            })
        }else{
            var formData = new FormData();
            formData.append('file',file,file.name);//通过append向form对象添加数据
            formData.append('chunk','0');
            instance.post(vm.$getServicer().localhostPath+'/anguo/restfull/hklifesop/KINGWORKS_001_007_003', formData).then(function (res) {
                          vm.updateImglist(code,res.data.body.imageId)
                      });
            
        }
    },
    updateImglist(code,id){//更新图片
      let vm = this 
      let obj = {
          servicePath:'KINGWORKS_001_007_004',
          jsonData: {
              imageId:id,
              outImageTypeCode:code,
              orderNo:vm.orderNo
          }
      }
      vm.$showModel()
      vm.$doajax(obj)
        .then(function (response) {
          var data = response.data,
            header = data.header,
            retCode = header.retCode,
            retMsg = header.retMsg;
          vm.$retCodeHandle(data, function () {
            var body = data.body;   
            vm.$toast(retMsg)
            vm.getUploadedImg()
            vm.$hideModel()
          },{
            'else':function(){
              vm.$toast(retMsg)
              vm.$hideModel()
            }
          });
        })
        .catch(function (error) {
          vm.$hideModel()
          var toast = vm.$getRetMsg(error);
          vm.$toast(toast);
        });
    }
  }
}
</script>

<style lang="less">
  @import "../../assets/css/comm";
  .uploadView{
    .main{
      padding: 60/@r;
      .nextstepbtn{
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        padding: 60/@r;
        z-index: 11;
        background: #fff;
        button{
          background: #3594ee;
          color: #fff;
          height: 130/@r;
          font-size: 54/@r;
        }
      }
      .mainWrap{
        position: relative;
        padding-bottom: 2.5rem;
        .liWrap{
          border-bottom: solid 0.5px #ececec;
          .start;
          flex-wrap: wrap;
          &:last-child{
            border-bottom: none;
          }
          .typeTitle{
            width: 100%;
            span{
              font-size: 50/@r;
            }
            .requiredspan{
              color: red;
            }
          }
          .typeDesc{
            width: 100%;
            span{
              font-size: 44/@r;
              color: #666;
            }
          }
          .typeMain{
            width: 100%;
            flex-wrap: wrap;
            padding: 30/@r 0;
            .start;
            .btnbox{
              position: relative;
              width: 5rem;
              height: 5rem;
              background: #f3f3f3;
              img{
                position: absolute;
                width: 1.4rem;
                height: 1.4rem;
                top: 50%;
                left: 50%;
                margin-left: -.7rem;
                margin-top: -.7rem;
              }
              .upbtn{
                position: absolute;
                width: 5rem;
                height: 5rem;
                opacity: 0;
                top: 0;
                left: 0;
                cursor: pointer;
                z-index: 5;
              }
            }
            .listwrap{
              position: relative;
              .start;
              ul{
                .between;
                flex-wrap: wrap;
                padding: 30/@r 0;
                li{
                  .center;
                  width: 5rem;
                  height: 5rem;
                  margin-right: 30/@r;
                  position: relative;
                  img{
                    width: 100%;
                    height: 100%;
                  }
                  .deletebtn{
                    position: absolute;
                    top: 0;
                    right: 0;
                    .center;
                    img{
                      width: 80/@r;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
</style>
