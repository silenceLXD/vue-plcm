<template>
	<section>
		<!--工具条-->
		<el-form :inline="true" :model="searchForm" class="">
		<el-row type="flex" class="row-bg toolbar" justify="space-between">
			<el-col :span="20">
				<el-form-item>
					<el-date-picker type="date" placeholder="选择日期" v-model="searchForm.startTime" :picker-options="pickerBeginDateBefore" @change="searchByStartDate" :editable="false" :clearable="false" style="width: 100%;"></el-date-picker>
				</el-form-item>

				<el-form-item>
					<el-date-picker type="date" placeholder="选择日期" v-model="searchForm.endTime" :picker-options="pickerBeginDateAfter" @change="searchByEndDate" :editable="false" :clearable="false" style="width: 100%;"></el-date-picker>
				</el-form-item>
			</el-col>
			<el-col :span="4">
				<el-form-item>
					<el-input v-model="searchForm.searchInput" @keyup.native="getTableListData" icon="search" placeholder="请输入关键字搜索"></el-input>
				</el-form-item>
			</el-col>

		</el-row>
		</el-form>
		<div class="pull-right marginTB10 color-poly downloadLog">
			<a href="javascript:;" class="color-poly">
				<i class="fa fa-download" aria-hidden="true"></i>
				<span @click="downLoadLog">下载操作日志</span>
			</a>
		</div>
		<!--列表-->
		<table class="table unborder-table">
			<thead>
			<tr>
				<th>操作人员</th>
				<th>操作人角色</th>
				<th>操作人IP</th>
				<th>操作内容</th>
				<th>操作时间</th>
			</tr>
			</thead>
			<tbody>
			<tr v-for="list in tableData">
				<td>{{list.operatorUser}}</td>
				<td>{{list.operatorRole}}</td>
				<td>{{list.operatorIp}}</td>
				<td>{{list.operatorCon}}</td>
				<td>{{list.operatorTime | limitTo(0,19)}}</td>

			</tr>
			</tbody>
		</table>

		<!--分页-->
		<el-col :span="24" class="block text-right" style="padding-bottom:10px;">
			<el-pagination
					@current-change="handleCurrentChange"
					:current-page.sync="currentPage"
					:page-size="10"
					layout="total, prev, pager, next"
					:total="total">
			</el-pagination>
		</el-col>



	</section>
</template>

<script>
	import util from '../../common/util'
	import NProgress from 'nprogress'
    import axios from 'axios'
//    import axiosApi from '../../common/axiosApi'

  	export default {
		data() {
		    return {
			/* 搜索查询 */
				searchForm: {
				  searchInput: '',
				  startTime:this.util.getFormatDate(Date.now()-7*24*3600*1000),
				  endTime:this.util.getFormatDate(Date.now())
				},
				pickerBeginDateBefore:{
				  disabledDate: (time) => {
					  let beginDateVal = this.searchForm.endTime;
					  return time.getTime() > new Date(beginDateVal);
				  }
				},
				pickerBeginDateAfter:{
				  disabledDate: (time) => {
					  let beginDateVal = this.searchForm.startTime;
					  if (beginDateVal) {
						  return time.getTime() < new Date(beginDateVal);
					  }
				  }
				},
				/* 初始化表格&分页数据*/
				tableData: [],
				currentPage:1,
				total:0,

				listLoading:false
		    }
		},
		mounted:function(){
		  this.$nextTick(function(){
			  this.getTableListData();
		  });
		},
		methods: {
		  /* 获取所有会议日志 */
		  getTableListData(){
			  var _list=this;
			  if(!this.searchForm.searchInput){
				  this.searchForm.searchInput=''
			  }
			  var data="?starttime="+this.searchForm.startTime+"&endtime="+this.searchForm.endTime+"&keyword="+this.searchForm.searchInput;
			  axios.get('/operation-log/'+_list.currentPage+'/10'+data)
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
                this.searchForm.startTime=val;
                this.getTableListData();
            },
            searchByEndDate: function (val) {
                this.searchForm.endTime=val;
                this.getTableListData();
            },

			// 下载操作日志
			downLoadLog() {
                window.location.href='/operation-log/down-load/?starttime='+this.searchForm.startTime+'&endtime='+this.searchForm.endTime;
			}
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
	.downloadLog{
		margin-right:6%;
	}
</style>
