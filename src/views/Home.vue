<template>
	<el-row class="panel">

		<el-col :span="24" class="panel-center">
			<aside class="sidebar-container">
				<div class="logo"><img src="../assets/logo_white.png"></div>
				<el-menu style="border-top: 1px solid #475669;"  class="el-menu-vertical-demo" @open="handleopen"
					@close="handleclose" @select="handleselect" theme="dark" unique-opened router>
					<template v-for="(item,index) in $router.options.routes" v-if="!item.hidden">
						<el-submenu :index="index+''" v-if="!item.leaf">
							<template slot="title"><i v-bind:class="item.iconCls"></i>{{item.name}}</template>
							<el-menu-item v-for="child in item.children" :index="child.path"><i class="fa fa-circle-thin"></i>{{child.name}}</el-menu-item>
						</el-submenu>
						<el-menu-item v-if="item.leaf&&item.children.length>0" :index="item.children[0].path"><i v-bind:class="item.iconCls"></i>{{item.children[0].name}}</el-menu-item>
					</template>
				</el-menu>
			</aside>

			<section class="panel-c-c">
				<div class="main-header">
					<div class="pull-right">
						<div class="user-image">
							<img src="../assets/timg4.jpg" alt="">
						</div>
						<div style="display: inline-block">
							<el-dropdown @command="logout" trigger="click" style="margin-right: 30px;">
							  	<span class="el-dropdown-link">
									{{loginName}} <i class="el-icon-caret-bottom el-icon--right"></i>
							  	</span>
								<el-dropdown-menu slot="dropdown">
									<el-dropdown-item>退出</el-dropdown-item>
								</el-dropdown-menu>
							</el-dropdown>
						</div>

					</div>

				</div>
				<div class="grid-content bg-purple-light" style="padding:15px;">
					<el-col :span="24" class="split-line">
						<strong style="width:200px;float:left;color: #475669;"><i class="fa fa-calendar"></i> {{currentPathName}}</strong>
						<!-- <el-breadcrumb separator="/" style="float:right;">
							<el-breadcrumb-item :to="{ path: '/adminHomePage' }">首页</el-breadcrumb-item>
							<el-breadcrumb-item v-if="currentPathNameParent!=''">{{currentPathNameParent}}</el-breadcrumb-item>
							<el-breadcrumb-item v-if="currentPathName!=''">{{currentPathName}}</el-breadcrumb-item>
						</el-breadcrumb> -->
					</el-col>
					<el-col :span="24" style="box-sizing: border-box;">
						<!-- <transition name="fade"> -->
							<router-view></router-view>
						<!-- </transition> -->
					</el-col>
				</div>
			</section>
		</el-col>
	</el-row>
</template>

<script>
  export default {
    data() {
      return {
          loginName:'',//登陆 用户名
		  currentPathName:'系统状态',
		  currentPathNameParent:'系统状态',
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        }
      }
    },
	watch: {
		'$route' (to, from) {//监听路由改变
			this.currentPathName=to.name;
			this.currentPathNameParent=to.matched[0].name;
		}
	},
	mounted: function () {
	  this.$nextTick(function () {
          this.loginName = this.util.getCookie("loginName");
	  });

	},
    methods: {
		onSubmit() {
			console.log('submit!');
		},
		handleopen(){
			//console.log('handleopen');
		},
		handleclose(){
			//console.log('handleclose');
		},
		handleselect:function(a,b){
		},
		//退出登录
		logout:function(){
			var _this=this;
			this.$confirm('确认退出吗?', '提示', {
				//type: 'warning'
			}).then(() => {
				_this.$router.replace('/login');
			}).catch(() => {

			});


		}
    }
  }
</script>

<style scoped>
	/*修改导航颜色*/
	.el-menu--dark {
	    background-color: #2A3845;
	}
	.el-menu-item,
	.el-submenu__title{
		height: 40px !important;
		line-height: 40px !important;
	}
	.fade-enter-active,
	.fade-leave-active {
		transition: opacity .5s
	}
	.fade-enter,
	.fade-leave-active {
		opacity: 0
	}
	.sidebar-container{
		width:210px;
		height: 100%;
		position: absolute;
		overflow-y: auto;
	}
	/*被选中的导航样式*/
	.el-menu-item.is-active{
		color:#EE4F6A;
	}
	.el-submenu.is-opened{
		background-color: #101F2E;
	}
	/****************************/

	.panel {
		position: absolute;
		top: 0px;
		bottom: 0px;
		width: 100%;
	}

	.panel-top {
		height: 60px;
		line-height: 60px;
		background: #1F2D3D;
		color: #c0ccda;
	}

	.panel-center {
		background: #2A3845;
		position: absolute;
		top: 0px;
		bottom: 0px;
		overflow: hidden;
	}

	.panel-c-c {
		background: #EFF1F6;
		position: absolute;
		right: 0px;
		top: 0px;
		bottom: 0px;
		left: 210px;
		overflow-y: scroll;
		/*padding: 20px;*/
	}

	/*.logout {
		background: url(../assets/logout_36.png);
		background-size: contain;
		width: 20px;
		height: 20px;
		float: left;
	}*/

	/*.logo {
		float: left;
		margin: 10px 10px 10px 18px;
	}*/

	.tip-logout {
		float: right;
		margin-right: 20px;
		padding-top: 5px;
		line-height: 50px;
	}

	.tip-logout i {
		cursor: pointer;
	}

	.logo {
		text-align: center;
	}

	.main-header{
		background: #E3EAF4;
		height: 50px;
	}
	/*分割线*/
	.split-line{
		border-bottom: 1px solid #BACAD6;
		margin-bottom: 15px;
    padding: 12px 0;
    font-size: 16px;
	}

	.user-image{
		display: inline-block;
		vertical-align: middle;
		margin-top: 2px;
		margin-right: 10px;
		/*width: 50px;*/
		/*height: 50px;*/
	}
	.user-image>img{
		width:45px;
		height:45px;
		border-radius:50%;
	}


</style>
