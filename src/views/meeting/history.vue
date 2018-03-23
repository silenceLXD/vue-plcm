<template>
	<section>
		<div v-if="showTableData">
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

			<!--列表-->
			<table class="table unborder-table">
				<thead>
				<tr>
					<th>会议开始时间</th>
					<th>会议名称</th>
					<th>发起人</th>
					<th>会议号</th>
					<th>会议时长</th>
					<th>参会方</th>
					<th>操作</th>
				</tr>
				</thead>
				<tbody>
				<tr v-for="list in tableData">
					<td>{{list.startTime | limitTo(0,16)}}</td>
					<td>{{list.conferenceName}}</td>
					<td>{{list.createUserName}}</td>
					<td>{{list.conferenceNumber}}</td>
					<td>{{list.duration}}小时</td>
					<td>{{list.conferenceUsers.length}}</td>
					<td>
						<a href="javascript:;" class="update-a" @click="previewDetail(list)">查看</a>
						<!--<a href="javascript:;" class="update-a" @click="previewLog(list)">日志</a>-->
					</td>
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

		</div>

		<!--查看 详情-->
		<div v-if="!showTableData">
			<h3 class="">
				<a href="javascript:;" class="update-a font18" @click="showTableData=true"><i class="fa fa-chevron-left"></i> 返 回</a>
				<span class="font18">{{ detailData.conferenceName }}</span>
			</h3>
			<p class="detail-title">
				<span>会议详情</span>
				<a href="javascript:;" class="color-poly pull-right">
					<i class="fa fa-download" aria-hidden="true"></i>
					<span @click="previewLog(detailData.cid)"> 日志</span>
				</a>
			</p>
			<ul class="detail-content">
				<li>
					<span class="detail-label">会议开始时间</span>
					<span>{{ detailData.startTime | limitTo(0,16) }}</span>
				</li>
				<li>
					<span class="detail-label">发起人</span>
					<span>{{ detailData.createUserName }}</span>
				</li>
				<li>
					<span class="detail-label">会议类型</span>
					<span>{{ detailData.conferenceName }}</span>
				</li>
				<li>
					<span class="detail-label">会议时长</span>
					<span>{{ detailData.duration }} 小时</span>
				</li>
				<li>
					<span class="detail-label">参会方</span>
					<span>{{ detailData.conferenceUsers.length }}</span>
				</li>
				<li>
					<span class="detail-label">与会者</span>
					<span>
						<span v-for="user in detailData.conferenceUsers">{{user.realName}}, </span>
					</span>
				</li>
				<li>
					<span class="detail-label">会议模版</span>
					<span>{{ detailData.conferenceTemplateIdentifier }}</span>
				</li>
				<li>
					<span class="detail-label">会议号</span>
					<span>{{ detailData.conferenceNumber }}</span>
				</li>
				<li>
					<span class="detail-label">会议密码</span>
					<span>{{ detailData.conferencePwd }}</span>
				</li>
				<li>
					<span class="detail-label">会议描述</span>
					<span>{{ detailData.description }}</span>
				</li>

			</ul>
		</div>

		<!-- 会议日志 dialog-->
		<el-dialog title="会议日志" size="tiny" v-model="dialogLogVisible" :close-on-click-modal="false">
			<ul>
				<li v-for="log in logData">
					<span class="color-poly">{{log.operationTime | formatDate('hh:mm') }}分</span>
					<span>{{log.context}}</span>
				</li>
			</ul>
			<span slot="footer" class="dialog-footer">
           		<el-button @click.native="dialogLogVisible = false">取 消</el-button>
           		<el-button type="primary" @click.native="downLoadLogFn(detailData.cid)">下载</el-button>
         </span>
		</el-dialog>

	</section>
</template>

<script>
	import util from '../../common/util'
	import NProgress from 'nprogress'
    import axios from 'axios'
    import axiosApi from '../../common/axiosApi'

	export default {
		data() {
		return {
            showTableData:true,//默认显示表格
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

			/* 会议详情数据 */
            detailData:'',
            dialogLogVisible:false,//会议日志dialog
			logData:'',//日志详情

			listLoading:false
			}
    	},
        mounted:function(){
            this.$nextTick(function(){
                this.getTableListData();
            });
        },
		methods: {
            /* 获取历史会议 表格数据*/
            getTableListData(){
                var _list=this;
                if(!this.searchForm.searchInput){
                    this.searchForm.searchInput=''
                }
                var data="?starttime="+this.searchForm.startTime+"&endtime="+this.searchForm.endTime+"&keyword="+this.searchForm.searchInput;
                axios.get('/conference-history/'+_list.currentPage+'/10'+data)
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

			/* 查看 */
            previewDetail(list){
                this.showTableData=!this.showTableData;
                this.detailData=list;
			},

			/* 预览日志 */
            previewLog(id){
                let _this=this;
                axios.get('/conference-log/'+id)
                    .then(
                        function(res){
                            let resData=res.data.data;
                            _this.dialogLogVisible=true;
                            _this.logData=resData;
                        }
                    ).catch(
                    function(err){ console.log("预览日志 error"); }
                );
            },
            /* 下载日志 */
            downLoadLogFn(id){
                let _this=this;
                let path=_this.util.getPath();
                location.href=path+"conference-log/down/"+id;
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
	.detail-title{
		padding: 15px;
		background: #dfe2e8;
		margin-bottom: -14px;
	}
	.detail-content{
		background: #fff;
		padding: 10px 35px;
	}
	.detail-content li{
		padding: 10px;
		border-bottom: 1px solid #e4e4e4;
	}
	.detail-content li span.detail-label{
		min-width: 150px;
		display: inline-block;
	}
</style>
