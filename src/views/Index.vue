<template>
  <div class="mainpage">
      <div class="choosebox" :class="{show:ifchoose}">
        <p class="title">PUSH THE BOX!</p>
        <button class="choosebtn" @click="chooselevel">选择关卡</button>
        <button class="choosebtn" @click="toWorkshop">创意工坊</button>
        <button class="choosebtn" @click="toCreate">创建地图</button>
      </div>
      <!--弹窗-->
      <div class="out" :class="{show:ifchoose}">
          <p class="title2">选择关卡</p>
          <div class="level-content">
              <button 
              v-for="(item,index) in officials"
               :key="index" class="btn" @click="levelis(index+1)"
                :class="{active:level == index + 1 }">第{{index + 1}}关</button>
          </div>
          <div class="level-btn">
              <button class="btn btn-ok" @click="toGame">确定</button>
              <button class="btn btn-no" @click="chooselevel">返回</button>
          </div>
      </div>
  </div>
</template>

<script>
import {official} from "../assets/js/level"
export default {
    data:function(){
        return {
            ifchoose:false,
            officials:[],
            level:""
        }
    },
methods:{
    //跳转创建地图
    toCreate(){
        this.$router.push("/create")
    },
    //选择关卡按钮弹出
    chooselevel(el){
          this.ifchoose = !this.ifchoose 
          this.level = ""
    },
    //选择关卡
    levelis(num){
        this.level = num
    },
    //跳转游戏页面
    toGame(){
        if(this.level === ""){
             this.$message({
             message: '请选择关卡后再确定',
             type: 'warning'
        });
        }else{
            this.$router.push({path:"game",query:{level:this.level}})
        }
    },
    //跳转创意工坊
    toWorkshop(){
        this.$router.push('/workshop')
    }
},
created(){
    this.officials = official
}
}
</script>

<style>
/*首页*/
.mainpage{
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    position: relative;
}
.choosebox{
    width: 100vw;
    height: 100vh;
    background: rgb(149, 229, 240);
    border-radius: 15px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    transition: all .5s;
}
.choosebtn,.title{
    width: 50%;
    height: 50px;
    text-align: center;
    margin-top: 10px;
}
.choosebtn{
    border-radius: 10px;
    cursor: pointer;
    border: 1px solid rgb(2, 20, 31);
}
.choosebtn:hover{
    border: 1px solid rgb(15, 137, 207);
    color: rgb(15, 137, 207);
}
.title{
    width: 100%;
    margin-top: 30px;
    font-size: 20px;
    animation: change 5s infinite;
    position: relative;
    top: -20vh;
}
@keyframes change {
  0% {
    color: #c89c4b;
  }
  25% {
    color: #C779D0;
  }
  50%{
    color: rgb(194, 66, 66);
  }
  75%{
      color: rgb(110, 143, 18);
  }
  100%{
      color: rgb(48, 190, 60);
  }
}
.show{
    transform: translate(0,-100vh);
    transition: all 1s;
}
/*弹窗 */
.out{
    width: 100vw;
    height: 100vh;
     background: rgb(149, 229, 240);
    transition: all .5s;
    padding-top: 50px;
}
.title2{
    font-size: 30px;
    animation: change 5s infinite;
    margin: 0 auto 50px;
    text-align: center;
}
.level-content{
    width: 80%;
    height: 50vh;
    margin: 0 auto 5px;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-content: flex-start;
}
.level-btn{
    width: 80%;
    display: flex;
    justify-content: center;
    margin: 0 auto 10px;
}
.btn{
    width: 30%;
    height: 50px;
    margin-left: 5px;
    margin-top: 5px;
    border:none;
    cursor: pointer;
    color: #ffffff;
    background: rgb(16, 162, 219);
    border-radius: 10px;
}
.btn-ok{
   background: rgb(16, 162, 219);
   margin-right: 10px;
}
.btn-no{
    background: rgb(255, 46, 46);
    margin-left: 10px;
}
.active{
  background: rgb(26, 23, 179);
}
</style>