<template>
    <el-row class="screen-box" >
        <el-col :span="6" class="" style="min-width: 160px">
            <ul class="screen-side">
                <li>
                    <span class="screen-title" @click="toggleScreen(1)">1</span>
                    <div class="screen-icon" v-show="screenStatus==1">
                        <span class="screen-icon-border" v-for="i in 1" @click="previewScreen(1,i)" v-bind:class="screenActive==i?'screen-icon-active':''">
                            <i class="fa icon-poly-screen-11"></i>
                        </span>
                    </div>
                </li>
                <li>
                    <span class="screen-title" @click="toggleScreen(2)">2</span>
                    <div class="screen-icon" v-show="screenStatus==2">
                        <span class="screen-icon-border" v-for="i in 5" @click="previewScreen(2,i)" v-bind:class="screenActive==i?'screen-icon-active':''">
                            <i class="fa" v-bind:class="'icon-poly-screen-2'+i"></i>
                        </span>
                    </div>
                </li>
                <li>
                    <span class="screen-title" @click="toggleScreen(3)">3</span>
                    <div class="screen-icon" v-show="screenStatus==3">
                        <span class="screen-icon-border"  v-for="i in 7" @click="previewScreen(3,i)" v-bind:class="screenActive==i?'screen-icon-active':''">
                            <i class="fa" v-bind:class="'icon-poly-screen-3'+i"></i>
                        </span>
                    </div>
                </li>
                <li>
                    <span class="screen-title" @click="toggleScreen(4)">4</span>
                    <div class="screen-icon" v-show="screenStatus==4">
                        <span class="screen-icon-border" v-for="i in 10" @click="previewScreen(4,i)" v-bind:class="screenActive==i?'screen-icon-active':''">
                            <i class="fa" v-bind:class="'icon-poly-screen-4'+i"></i>
                        </span>
                    </div>
                </li>
                <li>
                    <span class="screen-title" @click="toggleScreen(5)">5+</span>
                    <div class="screen-icon" v-show="screenStatus==5">
                        <span class="screen-icon-border" v-for="i in 5" @click="previewScreen(5,i)" v-bind:class="screenActive==i?'screen-icon-active':''">
                            <i class="fa" v-bind:class="'icon-poly-screen-5'+i"></i>
                        </span>
                    </div>
                </li>
                <li>
                    <span class="screen-title" @click="toggleScreen(9)">9</span>
                    <div class="screen-icon" v-show="screenStatus==9">
                        <span class="screen-icon-border" v-for="i in 5" @click="previewScreen(9,i)" v-bind:class="screenActive==i?'screen-icon-active':''">
                            <i class="fa" v-bind:class="'icon-poly-screen-9'+i"></i>
                        </span>
                    </div>
                </li>
                <li>
                    <span class="screen-title" @click="toggleScreen(10)">10+</span>
                    <div class="screen-icon" v-show="screenStatus==10">
                        <span class="screen-icon-border" v-for="i in 5" @click="previewScreen(10,i)" v-bind:class="screenActive==i?'screen-icon-active':''">
                            <i class="fa" v-bind:class="'icon-poly-screen-10'+i"></i>
                        </span>
                    </div>
                </li>
                <li>
                    <span class="screen-title" @click="toggleScreen(11)">覆盖</span>
                    <div class="screen-icon" v-show="screenStatus==11">
                        <span class="screen-icon-border" v-for="i in 4" @click="previewScreen(11,i)" v-bind:class="screenActive==i?'screen-icon-active':''">
                            <i class="fa" v-bind:class="'icon-poly-screen-11'+i"></i>
                        </span>

                    </div>
                </li>
            </ul>
        </el-col>
        <el-col :span="18" class="screen-border">
            <el-form :inline="true" :model="layoutForm">
                <div class="screen-content" v-bind:class="'box-parent-'+screenStatus+' box-child-'+screenActive">
                    <div class="box" v-for="(num,index) in boxArr" v-bind:class="'box'+num">
                        <el-select v-model="layoutForm.layoutUser[index]" v-bind:name="'user'+index">
                            <el-option label="轮询" value="0"></el-option>
                            <el-option v-for="user in conferenceLayoutUsers" :label="user.userName" :value="user.userName"></el-option>
                        </el-select>
                    </div>
                </div>
            </el-form>
        </el-col>
    </el-row>
</template>
<script>

    export default {
        name: 'splitModel',
        props: ['modelData','cid'],
        data() {
            return {
                layoutForm:{
                    layout:'',
                    layoutUser:[],
                },
                conferenceLayoutUsers:[],
                screenStatus: 1,//默认显示展开视频设置分屏
                boxArr: [1],//默认右侧预览分屏为一分屏
                screenActive:1,//默认选中第一种布局
            }
        },
        mounted: function () {
            this.$nextTick(function () {
                this.getConferenceUserList();
            });

        },

        methods:{
            /* 获取 会议中的参会人员 */
            getConferenceUserList(){
                let _this=this;
                _this.conferenceLayoutUsers=_this.modelData.conferenceUsers;
                console.log(_this.conferenceLayoutUsers);
            },
            submitClick: function(){
                return this.layoutForm;
            },
            //切换分屏
            toggleScreen:function (index) {
                this.screenStatus=index;
                this.screenActive=1;
                if(index==1){
                    this.boxArr = [1];
                }else if(index==2){
                    this.boxArr=[1214,1214];
                }else if(index==3){
                    this.boxArr=[112,2,2];
                }else if(index==4){
                    this.boxArr=[2,2,2,2];
                }else if(index==5){
                    this.boxArr=[2323,3,3,3,3,3];
                }else if(index==9){
                    this.boxArr=[3,3,3,3,3,3,3,3,3];
                }else if(index==10){
                    this.boxArr=[4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4];
                }else if(index==11){
                    this.boxArr=[112,112];
                }
            },
            //预览分屏
            previewScreen:function (screen,num) {
                this.screenActive=num;
                if(screen==11){
                    if(num==1){
                        this.boxArr=[112,1312];
                        this.layoutForm.layout=26;//(26,"1 cell in the background, and 1 cell floats at the bottom","One in the background and one floats at the bottom")
                    }else if(num==2){
                        this.boxArr=[112,2,2];
                        this.layoutForm.layout=27;//(27,"1 cell in the background, and 2 cell floats at the bottom","One in the background and two floats at the bottom")
                    }else if(num==3){
                        this.boxArr=[112,1312,1312,1312];
                        this.layoutForm.layout=28;//(28,"1 cell in the background, and 3 cell floats at the bottom","One in the background and three floats at the bottom")
                    }else if(num==4){
                        this.boxArr=[112,1312];
                        this.layoutForm.layout=29;//(29,"1 cell in the background, and the ITP screen floats at the bottom","One in the background and the ITP screen floats at the bottom")
                    }
                }else if(screen==10){
                    if(num==1){
                        this.boxArr=[4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4];
                        this.layoutForm.layout=24;//(24,"4 horizontal by 4 vertical","Four by four mode")
                    }else if(num==2){
                        this.boxArr=[5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5];
                        this.layoutForm.layout=25;//(25,"5 horizontal by 5 vertical","Five by four mode")
                    }else if(num==3){
                        this.boxArr=[4,4,4,4,4,2,4,4,4,4,4,4,4];
                        this.layoutForm.layout=22;//(22,"1 center plus 4 top and 4 bottom and 2 right and 2 left","One and twelve mode")
                    }else if(num==4){
                        this.boxArr=[1413,1413,1413,1413,1213,1213,1413,1413,1413,1413];
                        this.layoutForm.layout=23;//(23,"2 horizontal plus 4 top and 4 bottom","Two and eight mode")
                    }else if(num==5){
                        this.boxArr=[1213,1213,1413,1413,1413,1413,1413,1413,1413,1413];
                        this.layoutForm.layout=99; //无效
                    }
                }else if(screen==9){
                    if(num==1){
                        this.boxArr=[3,3,3,3,3,3,3,3,3];
                        this.layoutForm.layout=21;//(21,"3 horizontal by 3 vertical","Three by three mode")
                    }else if(num==2){
                        this.boxArr=[1413,1413,1413,1413,113,1413,1413,1413,1413];
                        this.layoutForm.layout=18;// (18,"1 plus 4 top and 4 bottom","One and eight central mode")
                    }else if(num==3){
                        this.boxArr=[1413,1413,1413,1413,1413,1413,1413,1413,113];
                        this.layoutForm.layout=20;//(20,"1 plus 4 top and 4 top","One and eight upper mode")
                    }else if(num==4){
                        this.boxArr=[113,1413,1413,1413,1413,1413,1413,1413,1413];
                        this.layoutForm.layout=19;//(19,"1 plus 4 bottom and 4 bottom","One and eight lower mode"),
                    }else if(num==5){
                        this.boxArr=[1223,1413,1413,1413,1413,1413,1413,1413,1413];
                        this.layoutForm.layout=99; //无效
                    }
                }else if(screen==5){
                    if(num==1){
                        this.boxArr=[2323,3,3,3,3,3];
                        this.layoutForm.layout=13;// (13,"1 plus 4 top","One and four horizontal mode"),
                    }else if(num==2){
                        this.boxArr=[121,1214,1214,1214,1214];
                        this.layoutForm.layout=14;//(14,"1 plus 4 bottom","One and four horizontal upper mode")
                    }else if(num==3){
                        this.boxArr=[1412,1412,1412,1412,112];
                        this.layoutForm.layout=15;//(15,"1 plus 4 right","One and four vertical mode")
                    }else if(num==4){
                        this.boxArr=[112,1412,1412,1412,1412];
                        this.layoutForm.layout=16;//(16,"1 plus 3 bottom and 2 right","One and five mode")
                    }else if(num==5){
                        this.boxArr=[3434,4,4,4,4,4,4,4];
                        this.layoutForm.layout=17;//(17,"1 plus 4 bottom and 3 right","One and seven mode")
                    }
                }else if(screen==4){
                    if(num==1){
                        this.boxArr=[2,2,2,2];
                        this.layoutForm.layout=9;//(9,"1 plus 3 top","One and three horizontal mode")
                    }else if(num==2){
                        this.boxArr=[1312,1312,1312,112];
                        this.layoutForm.layout=10;//(10,"1 plus 3 bottom","One and three horizontal upper mode")
                    }else if(num==3){
                        this.boxArr=[121,1213,1213,1213];
                        this.layoutForm.layout=11;//(11,"1 plus 3 right","One and three vertical mode")
                    }else if(num==4){
                        this.boxArr=[112,1312,1312,1312];
                        this.layoutForm.layout=12;//(12,"2 horizontal by 2 vertical","Two by two mode")
                    }else if(num==5){
                        this.boxArr=[1312,1312,1212,1212];
                        this.layoutForm.layout=99; //无效
                    }else if(num==6){
                        this.boxArr=[1312,1312,1212,1212];
                        this.layoutForm.layout=99; //无效
                    }else if(num==7){
                        this.boxArr=[1212,1212,1312,1312];
                        this.layoutForm.layout=99; //无效
                    }else if(num==8){
                        this.boxArr=[1212,1212,1312,1312];
                        this.layoutForm.layout=99; //无效
                    }else if(num==9){
                        this.boxArr=[1312,1312,1312,1312];
                        this.layoutForm.layout=99; //无效
                    }else if(num==10){
                        this.boxArr=[1312,1312,1312,1312];
                        this.layoutForm.layout=99; //无效
                    }
                }else if(screen==3){
                    if(num==1){
                        this.boxArr=[112,2,2];
                        this.layoutForm.layout=6;// (6,"1 plus 2 top","One and two horizontal mode")
                    }else if(num==2){
                        this.boxArr=[2,2,112];
                        this.layoutForm.layout=7;// (7,"1 plus 2 bottom","One and two horizontal upper mode")
                    }else if(num==3){
                        this.boxArr=[121,2,2];
                        this.layoutForm.layout=8;//(8,"1 plus 2 right","One and two vertical mode")
                    }else if(num==4){
                        this.boxArr=[1312,1312,112];
                        this.layoutForm.layout=99; //无效
                    }else if(num==5){
                        this.boxArr=[1312,1312,112];
                        this.layoutForm.layout=99; //无效
                    }else if(num==6){
                        this.boxArr=[112,1312,1312];
                        this.layoutForm.layout=99; //无效
                    }else if(num==7){
                        this.boxArr=[112,1312,1312];
                        this.layoutForm.layout=99; //无效
                    }
                }else if(screen==2){
                    if(num==1){
                        this.boxArr=[1214,1214];
                        this.layoutForm.layout=2;// (2,"2 horizontal","One by two mode")
                    }else if(num==2){
                        this.boxArr=[1312,1312];
                        this.layoutForm.layout=3;// (3,"2 horizontal wide","One by two horizontal mode")
                    }else if(num==3){
                        this.boxArr=[112,112];
                        this.layoutForm.layout=4;// (4,"2 vertical tall","One by two vertical mode")
                    }else if(num==4){
                        this.boxArr=[121,121];
                        this.layoutForm.layout=5;// (5,"2 vertical","Two by one mode")
                    }else if(num==5){
                        this.boxArr=[1213,1213];
                        this.layoutForm.layout=99; //无效
                    }
                }else if(screen==1){
                    this.boxArr=[1];
                    this.layoutForm.layout=1;// (1,"1 cell","One by one mode")
                }
                // var layoutData = this.submitClick();
                this.$eventBus.$emit('getLayout', this.layoutForm.layout);
            },
        }
    }
</script>

<style>
    .el-form-item{
        margin-bottom: 18px;
    }
    .screen-border{
        border:1px solid #46aecc;
        height: 100%;
    }
    .screen-box{
        height: 500px;
    }
    .screen-side{
        margin: 0;
    }
    .screen-box .screen-side>li{
        border:1px solid #46aecc;
        margin: 0 auto;
        padding: 5px 0;
        text-align: center;
        cursor: pointer;
    }
    .screen-title{
        padding: 5px;
        display: block;
    }
    .screen-icon{
        min-height: 50px;
        padding: 10px;
        margin-bottom: -6px;
        background: #f0f0f0;
        border: 1px solid #999;
        text-align: left;
    }
    .screen-icon>span{
        display: inline-block;
        padding: 3px;
        margin: 2px 0;
        border: 1px solid #46aecc;
    }
    /*.screen-icon-border{*/
    /*border: 1px solid #46aecc;*/
    /*}*/
    .screen-icon-active{
        border: 2px solid #EE4F6A!important;
    }
    .screen-icon>span>i.fa{
        font-size: 22px;
    }
    .screen-content{
        /*width: 450px;*/
        /*height: 450px;*/
        margin: 20px;
        /*border: 1px solid #000;*/
        text-align: center;
        position: relative;
    }
    .disabled-div{
        pointer-events: none;
        cursor: not-allowed;
        background: #f0f0f0;
    }
    /*视频设置预览分屏*/
    .box{
        display: inline-block;
        /*background: #daf4fa;*/
        border: 1px solid #46aecc;
        margin: 1px;
        float:left;
    }
    .box1{
        width: 450px;
        height: 450px;
    }
    .box2{
        width: 226px;
        height: 226px;
    }
    .box3{
        width: 150px;
        height: 150px;
    }
    .box4{
        width: 112px;
        height: 112px;
    }
    .box5{
        width: 90px;
        height: 112px;
    }
    /*1/4 1/3*/
    .box1413{
        width: 112px;
        height: 150px;
    }
    /*1 1/3*/
    .box113{
        width: 450px;
        height: 150px;
    }
    /*1/2 2/3*/
    .box1223{
        width: 225px;
        height: 300px;
    }
    /*1 1/2*/
    .box112{
        width: 450px;
        height: 225px;
    }
    /*1/4 1/2*/
    .box1412{
        width: 112px;
        height: 225px;
    }
    /*3/4 3/4*/
    .box3434{
        width: 340px;
        height: 340px;
    }
    /*2/3 2/3*/
    .box2323{
        width: 300px;
        height: 300px;
    }
    /*1/2 1*/
    .box121{
        width: 225px;
        height: 450px;
    }
    /*1/2 1/4*/
    .box1214{
        width: 225px;
        height: 112px;
        /*margin: 200px auto;*/
    }
    /*1/3 1/2*/
    .box1312{
        width: 150px;
        height: 225px;
    }
    /*1/2 1/3*/
    .box1213{
        width: 225px;
        height: 150px;
    }
    /*1/2 1/2*/
    .box1212{
        width: 225px;
        height: 225px;
    }
    .box-parent-2.box-child-1{
        margin: 0 25px;
    }
    .box-parent-2.box-child-1>.box{
        margin: 200px auto;
    }
    .box-parent-2.box-child-2>.box{
        margin: 3px 180px;
    }
    .box-parent-2.box-child-5>.box{
        margin: 180px auto;
    }

    .box-parent-3.box-child-5>.box,
    .box-parent-3.box-child-6>.box{
        float: right;
    }

    .box-parent-4.box-child-5>.box,
    .box-parent-4.box-child-7>.box,
    .box-parent-4.box-child-10>.box{
        float: right;
    }
    .box-parent-4.box-child-9>.box1312,
    .box-parent-4.box-child-10>.box1312{
        width: 170px;
    }

    .box-parent-10.box-child-3>.box:nth-child(10){
        position: absolute;
        left: 0;
        top:227px;
    }
    .box-parent-11.box-child-1>.box1312,
    .box-parent-11.box-child-4>.box1312{
        margin-left: 150px;
    }
</style>