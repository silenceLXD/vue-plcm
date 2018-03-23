<template>
	<div class="schedule-list">
		<!--工具条-->
		<el-form :inline="true" :model="searchForm" class="">
			<el-row type="flex" class="row-bg" justify="space-between">
				<el-col :span="20">
					<el-form-item>
						<el-date-picker type="date" placeholder="选择日期" format="yyyy-MM-dd" @change="searchByStartDate" v-model="searchForm.startdate" :picker-options="pickerBeginDateBefore" style="width: 100%;"></el-date-picker>
					</el-form-item>

					<el-form-item label="至" label-width="25px">
						<el-date-picker type="date" placeholder="选择日期" format="yyyy-MM-dd" @change="searchByEndDate" v-model="searchForm.enddate" :picker-options="pickerBeginDateAfter" style="width: 100%;"></el-date-picker>
					</el-form-item>
				</el-col>
				<el-col :span="4">
					<el-form-item>
						<el-input v-model="searchForm.searchInput" icon="search" @keyup.native="getTableListData" placeholder="请输入关键字搜索"></el-input>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<div v-if="tableData.length>0">
			<div class="schedule-list-box" v-for="list in tableData">
				<el-col :span="4">
					<div class="list-left" v-bind:class="list.status==1?'ongoing':''">
						<p class="list-header">{{list.status==1?'进行中':list.startTime | limitTo(0,10)}}</p>
						<p class="list-time">{{list.startTime | limitTo(10,16)}} <span v-if="list.endTime">-{{list.endTime | limitTo(10,16)}} </span></p>
					</div>
				</el-col>
				<el-col :span="1">
					<div :class="list.status==1?'list-line-red':'list-line-blue'"></div>
				</el-col>
				<el-col :span="13">
					<div class="list-center">
						<p class="list-header">{{list.conferenceName}}</p>
						<p class="list-time">
							<span>会议号：{{list.conferenceNumber}}</span>
							<span>会议密码：{{list.conferencePwd}}</span>
							<!--<span>主席密码：{{list.chairmanPwd}}</span>-->
							<span>发起人：{{list.createUserName}}</span>
						</p>
					</div>
					<div class="list-detail" v-if="list.isShowDetail" v-model="isShowDetail">
						<p>会议模版：{{list.conferenceTemplateIdentifier}}</p>
						<p>与会者：<span v-for="user in list.conferenceUsers">{{user.realName}}，</span></p>
						<p>会议描述：{{list.description}}</p>
					</div>
					<div class="" style="text-align:center;">
						<a href="javascript:;" class="update-a" v-on:click="showDetailFn(list)">
							<i style="font-size: 20px;" class="fa" v-bind:class="list.isShowDetail?'fa-angle-double-up':'fa-angle-double-down'"></i>
						</a>
					</div>
				</el-col>
				<el-col :span="4">
					<div class="list-right">
						<div v-if="list.status==1">
							<a href="javascript:;" class="polycom-btn" style="margin:0 10px;" @click.capture="addTab(list)">会议控制</a>
						</div>
						<div v-else="">
							<!--<a href="javascript:;" @click="editMeetingFn(list)" class="update-a">编辑</a>-->
							<router-link class="update-a" :to="{ name: '发起会议', params: { id: list.conferenceId }}">编辑</router-link>
							<a href="javascript:;" class="update-a" v-on:click="handleDel(list)">删除</a>
						</div>

					</div>
				</el-col>
			</div>

			<!--分页-->

			<el-col :span="24" class="block text-right" style="padding-bottom:10px;">
				<el-pagination
						@current-change="handleCurrentChange"
						:current-page.sync="currentPage"
						:page-size="5"
						layout="total, prev, pager, next"
						:total="total">
				</el-pagination>
			</el-col>
		</div>
		<div v-else="" class="noDataImg">
			<img src="../../assets/images/poly-none.png" alt="">
		</div>
	</div>
</template>
<script>

	import NProgress from 'nprogress'
    import axios from 'axios'
    import axiosApi from '../../common/axiosApi'

  export default {
    data() {
      return {
		isShowDetail:false,
          //form表单数据 查询
          searchForm: {
              searchInput: '',
              startdate:this.util.getFormatDate(Date.now()),
              enddate:this.util.getFormatDate(Date.now()+7*24*3600*1000)
          },
          pickerBeginDateBefore:{
              disabledDate: (time) => {
                  let beginDateVal = this.searchForm.enddate;
				  return time.getTime() > new Date(beginDateVal);
              }
          },
          pickerBeginDateAfter:{
              disabledDate: (time) => {
                  let beginDateVal = this.searchForm.startdate;
                  if (beginDateVal) {
                      return time.getTime() < new Date(beginDateVal);
                  }
              }
          },

		  /* 初始化表格&分页数据 */
		  tableData: [],
          currentPage:1,
          total:0,

          detailData:'',
          //tab标签页数据
          editableTabsValue: '1',
          editableTabs: {},
          tabIndex: 1,

          listLoading:false

	  }
    },
      mounted:function(){
          this.$nextTick(function(){
              this.getTableListData();
          });
      },
      methods: {
          //获取所有会议日程
          getTableListData(){
              var _list=this;
              if(!this.searchForm.searchInput){
                  this.searchForm.searchInput=''
			  }
			  var data="?startTime="+this.searchForm.startdate+"&endTime="+this.searchForm.enddate+"&keyWord="+this.searchForm.searchInput;
              axios.get('/conference-schedule/'+_list.currentPage+'/5'+data)
                  .then(
                      function(res){
                          var resData=res.data.data;
                          _list.total=resData.total;
						  _list.tableData=resData.list;
                      }
                  ).catch(
                  function(err){ console.log("error"); }
              );
          },
          //分页
          handleCurrentChange(val) {
              var _page=this;
              this.currentPage=val;
              _page.getTableListData();
              console.log(`当前页: ${val}`);
          },

		  // 修改时间查询
          searchByStartDate: function (val) {
              this.searchForm.startdate=val;
              this.getTableListData();
          },
          searchByEndDate: function (val) {
              this.searchForm.enddate=val;
              this.getTableListData();
          },
		  // 动态添加tab会控标签
          addTab(list) {
              this.editableTabs={};
              let newTabName = list.conferenceId;
              this.editableTabs={
                  "title": list.conferenceName,
                  "name": newTabName,
                  "content": "control"
              };
              this.editableTabsValue = newTabName;
              this.$eventBus.$emit('addtab', this.editableTabs);
              //console.log(1111111111111);
              //console.log(list.conferenceId);
              this.$eventBus.$emit('getid',list.conferenceId);
          },
		  getId(list){
              this.$eventBus.$emit('getid',list.conferenceId);
		  },
		  // 切换tab标签
          tabToggle(tabText) {
              this.currentView = tabText;
          },
		  //显示详细会议信息
          showDetailFn(list) {
              if(typeof list.isShowDetail == 'undefined'){
                  this.$set(list,"isShowDetail",true);
			  }else{
                  list.isShowDetail = !list.isShowDetail;
			  }
		  },

		  // 编辑会议
          editMeetingFn(list){
              var _detail=this;
              let id=list.conferenceId;
              axios.get('/conference/'+id)
                  .then(
                      function(res){
                          console.log(res.data.data);
//                          _detail.$router.replace('/book');
                          _detail.$router.push({ name: 'book', params: { conferenceId: id }})
                      }
                  ).catch(
                  function(err){ console.log("error"); }
              );
          },
          //删除会议
          handleDel:function(row){
              var _this=this;
              let id=row.conferenceId;
              this.$confirm('确认删除该会议吗?', '提示', {
                  //type: 'warning'
              }).then(() => {
                  _this.listLoading=true;
                  NProgress.start();
                  axios.delete('/conference/'+id)
                      .then(
                          function(res){
                              _this.getTableListData();
                              _this.listLoading=false;
                              NProgress.done();
                              _this.$notify({
                                  title: '成功',
                                  message: '删除成功',
                                  type: 'success'
                              });
                          }
                      ).catch(
                      function(err){ console.log("error"); }
                  );
              }).catch(() => {

              });
          },
      }
  }
</script>
<style scoped>
	.toolbar .el-form-item {
		margin-bottom: 10px;
	}

	.toolbar {
		background: #fff;
		padding: 10px 10px 0px 10px;
	}
	.update-a{
		text-decoration: none;
		color: #2aa0c2;
		margin: 0 5px;
	}
	.noDataImg{
		text-align: center;
		margin-top: 12%;
	}

	/*会议日程 列表*/
	.schedule-list-box{
		padding: 5px;
		margin:10px 5px;
    	/*border: 1px solid #d1dbe5;*/
    	border-radius: 4px;
    	background-color: #fff;
    	overflow: hidden;
    	/*box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);*/
		-moz-box-shadow:2px 2px 10px rgba(102, 101, 99, 0.18);
		-webkit-box-shadow:2px 2px 10px rgba(102, 101, 99, 0.18);
		box-shadow:2px 2px 10px rgba(102, 101, 99, 0.18);

	}
	/*.list-left{*/
		/*border-right: 1px solid rgba(153, 153, 153, 0.34);*/
	/*}*/
	.list-left .list-header,
	.list-left .list-time{
		color: #2aa0c2;
	}
	.list-left>p{
		text-align: center;
	}
	.ongoing .list-header{
		color: #f00;
		font-size: 16px;
		font-weight: bold;
	}
	.ongoing .list-time{
		color: #000;
	}
	.list-center{
		padding: 0 10px;
	}
	.list-center .list-header{
		font-size: 16px;
		font-weight: bold;
	}
	.list-center .list-time>span{
		margin-right: 15px;
	}
	.list-detail{
		padding: 0 10px;
		border-top: 1px dashed #999;
	}
	.list-right{
		line-height: 100px;
		text-align: right;
	}
	.list-right a.update-a{
		margin-right: 20px;
	}
	.list-line-blue{
		background-image: url("../../assets/images/line_blue.png");
		width: 100%;
		height: 100px;
		background-size: 100%;
		background-repeat: round;
	}
	.list-line-red{
		background-image: url("../../assets/images/line_red.png");
		width: 100%;
		height: 100px;
		background-size: 100%;
		background-repeat: round;
	}
</style>
