<template>
	<!--<div>
		<h1>vuex 测试</h1>
		Clicked: {{ getCount }} times
		<button @click="increment">+</button>
		<button @click="decrement">-</button>
	</div>-->
	<section class="content">
		<!--工具条-->
		<el-form :inline="true" :model="formInline" style="height: 30px;">
			<el-row type="flex" class="row-bg toolbar" justify="space-between">
				<el-col :span="14">
					<a href="javascript:;" class="color-poly">
						<i class="fa fa-download" aria-hidden="true"></i>
						<span >下载详单</span>
					</a>
				</el-col>
				<el-col :span="10" class="text-right">
					<!--时间选择向前推六个月-->
					<forwardMonths :len="6" v-on:selectMonths="selectMonFn" style="width: 30%;"></forwardMonths>

					<el-form-item>
						<el-input v-model="formInline.name" icon="search" placeholder="请输入关键字搜索"></el-input>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<!--tab-->
		<template>
		  <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
		  	<!--企业详单-->
		    <el-tab-pane label="企业详单" name="first">
				<div v-show="!viewEntDetail">
					<div>
						<p style="margin:10px;">消耗总分钟数：{{consumeTime}}</p>
					</div>
					<table class="table unborder-table" style="margin-left:10px;">
						<thead>
						<tr>
							<th>会议开始时间</th>
							<th>会议名称</th>
							<th>参会方数（方）</th>
							<th>会议号</th>
							<th>时长</th>
							<th>消耗分钟数</th>
							<th>操作</th>
						</tr>
						</thead>
						<tbody>
						<tr v-for="item in entList">
							<td>{{item.startTime|formatDate('yyyy-MM-dd hh:mm')}}</td>
							<td>{{item.conferenceName}}</td>
							<td>{{item.concurrenceCount}}</td>
							<td>{{item.roomNumber}}</td>
							<td>{{item.duration}}</td>
							<td>{{secondToMinute(item.consumeTime)}}</td>
							<td>
								<a href="javascript:;" class="color-poly" @click="viewEntFn(item)">查看</a>
							</td>
						</tr>

						</tbody>
					</table>
				</div>

				<!--查看企业详单-->
				<div class="viewEntDetail" v-show="viewEntDetail">
					<div class="tit">
						<div class="clearfix">
							<a class="pull-left clearfix">
								<i class="fa fa-angle-left color-poly pull-left" style="font-size: 30px;" aria-hidden="true"></i>
								<span class="backBtn color-poly pull-left" style="font-size: 20px;" @click="backEntList">返回</span>
							</a>
							<i class="line pull-left"></i>
							<h4 class="pull-left" style="margin-top:5px;">{{entModel.conferenceName}}</h4>
						</div>
					</div>
					<el-row style="margin:10px 0 20px 10px;">
						<el-col :span="5">
							<div>开始时间:{{entModel.startTime | formatDate('yyyy-MM-dd hh:mm')}}</div>
						</el-col>
						<el-col :span="3">
							<div>参会方数（方）:{{entModel.concurrenceCount}}</div>
						</el-col>
						<el-col :span="3">
							<div>会议号:{{entModel.roomNumber}}</div>
						</el-col>
						<el-col :span="3">
							<div>时长:{{entModel.duration}}</div>
						</el-col>
						<el-col :span="3">
							<div>消耗分钟数:{{secondToMinute(entModel.consumeTime)}}</div>
						</el-col>
					</el-row>
					<table class="table unborder-table" style="margin-left:10px;">
						<thead>
						<tr>
							<th>进入时间</th>
							<th>姓名</th>
							<th>一级部门/分公司</th>
							<th>二级部门</th>
							<th>三级部门</th>
							<th>登录地区</th>
							<th>终端</th>
							<th>消耗分钟数</th>
						</tr>
						</thead>
						<tbody>
						<tr v-for="item in entDetailList">
							<td>{{item.startTime|formatDate('yyyy-MM-dd hh:mm')}}</td>
							<td>{{item.realName}}</td>
							<td>{{item.deptName}}</td>
							<td>{{item.subdeptName}}</td>
							<td>{{item.threedeptName}}</td>
							<td>{{item.location}}</td>
							<td>{{item.callWay}}</td>
							<td>{{secondToMinute(item.consumeTime)}}</td>
						</tr>

						</tbody>
					</table>
				</div>

		    </el-tab-pane>
		    <!--用户详单-->
		    <el-tab-pane label="用户详单" name="second">
				<div v-show="!viewUserDetail">
					<div>
						<p class="marginTB10">总消耗分钟数：{{consumeTime}}</p>
					</div>
					<div class="">
						<table class="table unborder-table">
							<colgroup>
								<col width="15%">
								<col width="20%">
								<col width="20%">
								<col width="20%">
								<col width="15%">
								<col width="10%">
							</colgroup>
							<thead>
							<tr>
								<th>姓名</th>
								<th>
									<el-select v-model="deptId" placeholder="一级部门" style="width: 70%" @change="deptChange(deptId)">
										<el-option
												v-for="item in orgNames"
												:key="item.orgId"
												:label="item.orgName"
												:value="item.orgId">
										</el-option>
									</el-select>
								</th>
								<th>
									<el-select v-model="subdeptId" placeholder="二级部门" style="width: 70%" @change="subDeptChange(subdeptId)">
										<el-option
												v-for="item in subdepts"
												:key="item.orgId"
												:label="item.orgName"
												:value="item.orgId">
										</el-option>
									</el-select>
								</th>
								<th>
									<el-select v-model="threedeptId" placeholder="三级部门" style="width: 70%" @change="threedeptChange(threedeptId)">
										<el-option
												v-for="item in threedeptNames"
												:key="item.orgId"
												:label="item.orgName"
												:value="item.orgId">
										</el-option>
									</el-select>
								</th>
								<th>消耗分钟数</th>
								<th>操作</th>
							</tr>
							</thead>
							<tbody >
							<tr v-for="item in userList">
								<td>{{item.realName}}</td>
								<td>{{item.deptName}}</td>
								<td>{{item.subdeptName}}</td>
								<td>{{item.threedeptName}}</td>
								<td>{{secondToMinute(item.consumeTime)}}</td>
								<td>
									<a href="javascript:;" class="color-poly" @click="viewUserFn(item)">查看</a>
								</td>
							</tr>
							</tbody>
						</table>
					</div>
				</div>

				<!--查看用户详单-->
				<div class="viewEntDetail" v-show="viewUserDetail">
					<div class="tit">
						<div class="clearfix">
							<a class="pull-left clearfix">
								<i class="fa fa-angle-left color-poly pull-left" style="font-size: 30px;" aria-hidden="true"></i>
								<span class="backBtn color-poly pull-left" style="font-size: 20px;" @click="backUserList">返回</span>
							</a>
							<i class="line pull-left"></i>
							<h4 class="pull-left" style="margin-top:5px;">{{userModel.realName}}</h4>
						</div>
					</div>
					<el-row style="margin:10px 0 20px 10px;">
						<el-col :span="4">
							<div>一级部门/公司:{{userModel.deptName}}</div>
						</el-col>
						<el-col :span="3">
							<div>二级部门:{{userModel.subdeptName}}</div>
						</el-col>
						<el-col :span="3">
							<div>三级部门:{{userModel.threedeptName}}</div>
						</el-col>
						<el-col :span="3">
							<div>消耗分钟数:{{secondToMinute(userModel.consumeTime)}}</div>
						</el-col>
					</el-row>
					<table class="table unborder-table" style="margin-left:10px;">
						<thead>
						<tr>
							<th>进入时间</th>
							<th>会议名称</th>
							<th>登录地区</th>
							<th>终端</th>
							<th>消耗分钟数</th>
						</tr>
						</thead>
						<tbody>
						<tr v-for="item in userDetailList">
							<td>{{item.startTime|formatDate('yyyy-MM-dd hh:mm')}}</td>
							<td>{{item.conferenceName}}</td>
							<td>{{item.location}}</td>
							<td>{{item.callWay}}</td>
							<td>{{secondToMinute(item.consumeTime)}}</td>
						</tr>

						</tbody>
					</table>
				</div>
			    <!--<div class="pageCon">
			    	<el-pagination
				      @size-change="handleSizeChange"
				      @current-change="handleCurrentChange"
				      :current-page.sync="currentPage1"
				      :page-size="100"
				      layout="total, prev, pager, next"
				      :total="1000">
				    </el-pagination>
			    </div>-->
		    </el-tab-pane>
		  </el-tabs>
			<div class="block pull-right marginTB10">
				<el-pagination
						@size-change="handleSizeChange"
						@current-change="handleCurrentChange"
						:current-page.sync="currentPage"
						:page-size="10"
						layout="total, prev, pager, next"
						:total="totalCount">
				</el-pagination>
			</div>
		</template>
	</section>
</template>

<script>
import { mapGetters } from 'vuex'
import { mapActions } from 'vuex'
import axios from 'axios'
import axiosApi from '../../common/axiosApi'
import forwardMonths from  '../../components/forwardMonths.vue'
import filter from '../../common/filter'

/*export default {
	computed: {
  	// 使用对象展开运算符将 getters 混入 computed 对象中
    ...mapGetters([
      'getCount'
      // ...
    ])
  },
   methods: {
    ...mapActions([
      'increment', // 映射 this.increment() 为 this.$store.dispatch('increment')
	  'decrement'
    ])
    //...mapActions({
    //  add: 'increment' // 映射 this.add() 为 this.$store.dispatch('increment')
    //})
  }
}*/
function getMon(){
    var str='';
    var d = new Date();
    var currYear = d.getFullYear();
    var currMon = d.getMonth()+1;
    if(currMon<10){
        str=currYear+'-0'+currMon;
	}else{
        str=currYear+'-'+currMon;
	}

	return str;
}
function secondToMinute(seconds){
	var minute=Math.floor(seconds/60);
	var second=seconds%60;
	return minute+'分钟'+second+'秒';
}
export default {
    components: {
        forwardMonths
    },
    data() {
      return {
				formInline: {
					name: '',
				},
		  		//默认选中企业详单
                activeName:'first',
		  		//月份
          		datetime:getMon(),
		  		//页数
				page:1,
				pageSize:10,
          		entList:[],
                currentPage:1,
		        totalCount:0,
                consumeTime:'',
		  		/*用户详单*/
                deptId:'',
                subdeptId:'',
                threedeptId:'',
				orgNames:[],
				subdepts:[],
				threedeptNames:[],

		  		/*查看企业详情*/
                viewEntDetail:false,
                entModel:{},
		  		dateType:'yyyy-MM-dd hh:mm',
                entDetailList:[],

		  		/*查看用户详单*/
                viewUserDetail:false,
                userModel:{},
		        userDetailList:[],
		  		dataType:'',
		  		model:null,
     		}
    },
    mounted:function(){
		this.getEntDetail();
		this.getConsumeTime();
		//获取一级部门
		var _this=this;
        axios.get('/organization/parentId/0')
            .then(
                function(res){
                    console.log(res.data.data);
                    _this.orgNames=res.data.data;
                }
            ).catch(
            function(err){ console.log(err); }
        );
	},
	methods: {
        //秒转分钟
        secondToMinute:function(seconds){
            var minute=Math.floor(seconds/60);
            var second=seconds%60;
            return minute+'分钟'+second+'秒';
		},
		//tab页切换
		handleClick(tab, event) {
			if(tab.name=='second'){
                this.getUserDetail();
			}else{
                this.getEntDetail();
			}
            this.currentPage=1;
            this.viewEntDetail=false;
            this.viewUserDetail=false;
			this.dataType=tab.name;
		},
		//切换页码
        handleCurrentChange(page){
            this.currentPage=page;
            if(dataType=='first'){
                this.getEntDetail();
			}else if(dataType=='second'){
				this.getUserDetail();
			}else if(dataType=='firstDetail'){
				this.viewEnt(this.model);
			}else if(dataType=='secondDetail'){
                this.viewUser(this.model);
			}
		},
        handleSizeChange(size){
            console.log(size);
		},
		selectMonFn:function(value){
			this.datetime=value;
            this.getEntDetail();
		},
		//企业详单
        getEntDetail:function(){
		    var _this=this;
            axios.get('/conference-history/detailed/ent/'+this.page+'/'+this.pageSize+'/'+this.datetime+'?keyword='+this.formInline.name)
                .then(
                    function(res){
                        _this.entList=res.data.data.list;
						_this.totalCount=res.data.data.total;
						_this.currentPage=1;
                    }
                ).catch(
                function(err){ console.log(err); }
				);
		},
		//用户详单
        getUserDetail:function(){
            var _this=this;
            axios.get('conference-history/detailed/person/'+this.page+'/'+this.pageSize+'/'+this.datetime+'?keyword='+this.formInline.name+'&deptId='+this.deptId+'&subdeptId='+this.subdeptId+'&threedeptId='+this.threedeptId)
                .then(
                    function(res){
                        _this.userList=res.data.data.list;
                        _this.totalCount=res.data.data.total;
                        _this.currentPage=1;
                    }
                ).catch(
                function(err){ console.log(err); }
            );
        },
		//获取总消耗分钟数
		getConsumeTime:function(){
            var _this=this;
            axios.get('/conference/detailed/count/'+this.datetime)
                .then(
                    function(res){
						var time=res.data.data.allTime;
                        _this.consumeTime=_this.secondToMinute(time);
                    }
                ).catch(
                function(err){ console.log(err); }
            );
		},

		/*查看企业详情*/
        viewEntFn:function(item){
            var _this=this;
			this.entModel=item;
			this.viewEntDetail=!this.viewEntDetail;
            this.dataType="firstDetail";
            this.model=item;
            this.viewEnt(item);
		},

		viewEnt:function(item){
            var _this=this;
            axios.get('/conference-detailed-list/'+this.page+'/'+this.pageSize+'/'+this.datetime+'/'+item.cuuid+'?keyword='+this.formInline.name)
                .then(
                    function(res){
                        //console.log(res.data);
                        _this.entDetailList=res.data.data.list;
                        _this.totalCount=res.data.data.total;
                        _this.currentPage=res.data.data.pageNum;
                    }
                ).catch(
                function(err){ console.log(err); }
            );
		},

		//返回企业详单
		backEntList:function(){
            this.viewEntDetail=!this.viewEntDetail;
		},

		//查看用户详单
        viewUserFn:function(item){
		    var _this=this;
		    this.userModel=item;
		    this.viewUserDetail=!this.viewUserDetail;
            this.dataType="secondDetail";
            this.model=item;
            this.viewUser(item);
		},
        viewUser:function(item){
            var _this=this;
            axios.get('/conference-user-list/'+this.page+'/'+this.pageSize+'/'+this.datetime+'/'+item.userId+'?keyword='+this.formInline.name)
                .then(
                    function(res){
                        console.log(res.data);
                        _this.userDetailList=res.data.data.list;
                        _this.totalCount=res.data.data.total;
                        _this.currentPage=res.data.data.pageNum;
                    }
                ).catch(
                function(err){ console.log(err); }
            );
        },
		//返回用户详单
        backUserList:function(){
            this.viewUserDetail=!this.viewUserDetail;
		},

		//切换一级部门 加载二级部门 查询数据
        deptChange:function (orgId) {
            var _this=this;
            axios.get('/organization/parentId/'+orgId)
                .then(
                    function(res){
                        _this.subdepts=res.data.data;
                    }
                ).catch(
                function(err){ console.log("error"); }
            );
            this.getUserDetail();
        },
        //切换二级部门 查询所属三级部门
        subDeptChange(deptId){
            var _this=this;
            axios.get('/organization/parentId/'+deptId)
                .then(
                    function(res){
                        _this.threedeptNames=res.data.data;
                    }
                ).catch(
                function(err){ console.log("error"); }
            );
            this.getUserDetail();
        },
        threedeptChange(orgId){
            this.getUserDetail();
		},

    }
  }
</script>
<style scoped>
	.line{
		border-left:1px solid #333;
		display: inline-block;
		height: 20px;
		margin: 4px 16px;
	}
	.backBtn{
		/*margin:0 10px;*/
	}
	.viewEntDetail{
		background: #fff;
		overflow: hidden;
		padding: 20px;
	}
	.tit{
		border-bottom: 3px solid #e3e6eb;
		padding-bottom: 10px;
		overflow: hidden;
		margin-bottom: 20px;
	}
</style>
