<template>
	<section>
		<!--工具条-->
		<el-row type="flex" class="row-bg toolbar" justify="space-between">
			<el-col :span="8" class="">
				<el-button type="primary" @click="handleAdd">添加会议室</el-button>
			</el-col>
			<el-col :span="4">
				<el-form :inline="true" :model="searchForm" class="demo-form-inline">
						<el-form-item>
							<el-input v-model="searchForm.searchInput" icon="search" @keyup.native="getTableListData" placeholder="请输入关键字搜索"></el-input>
						</el-form-item>
					</el-form>
				</el-col>
		</el-row>

		<!--列表-->
		<table class="table unborder-table">
			<thead>
			<tr>
				<th>名称</th>
				<th>会议号</th>
				<th>会议密码</th>
				<th>会议模版</th>
				<th>状态</th>
				<th>操作</th>
			</tr>
			</thead>
			<tbody>
			<tr v-for="list in tableData">
				<td>{{list.roomName}}</td>
				<td>{{list.roomNum}}</td>
				<td>{{list.roomConferenceCode}}</td>
				<td>{{list.conferenceTemplate}}</td>
				<td>{{list.roomStatus==0?'空闲':'进行中'}}</td>
				<td>
					<a href="javascript:;" class="update-a" @click="handleEdit(list)">编辑</a>
					<a href="javascript:;" class="update-a" @click="handleDelete(list)">删除</a>
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

		<!--编辑界面-->
		<el-dialog :title="editFormTtile" size="small" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="名称" prop="roomName">
					<el-input v-model="editForm.roomName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="会议号" prop="roomNum">
					<el-col :span="18" class="">
						<el-input  v-model="editForm.roomNum" auto-complete="off"></el-input>
					</el-col>
					<el-col :span="4" class="automatic">
						<el-button type="primary" @click="autoConferenceNum">自动生成</el-button>
					</el-col>

				</el-form-item>
				<el-form-item label="会议密码" prop="roomConferenceCode">
					<el-input v-model="editForm.roomConferenceCode" auto-complete="off" :min="4" :max="20"></el-input>
				</el-form-item>
				<el-form-item label="主席密码" >
					<el-input auto-complete="off" disabled :min="4" :max="20"></el-input>
				</el-form-item>
				<el-form-item label="会议模版" prop="conferenceTemplate">

					<el-select v-model="editForm.conferenceTemplate" placeholder="请选择" style="width: 100%;">
						<el-option
								v-for="item in templatesData"
								:key="item.name"
								:label="item.name"
								:value="item.name">
						</el-option>
					</el-select>
				</el-form-item>

			</el-form>
			<div slot="footer" class="dialog-footer">
				 <el-button @click.native="editFormVisible = false">取 消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">{{btnEditText}}</el-button>
			</div>
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
		searchForm: {
			searchInput: ''
		},
		  isEdit:true,//判断是编辑（true）；还是新增（false）
		/* 新增&编辑 dialog */
		editFormVisible:false,//编辑界面显是否显示
		editFormTtile:'编辑',//编辑界面标题
		//编辑界面form数据
		editForm: {
            roomName: '',/*名称*/
            roomNum	: '',/*会议号*/
            roomConferenceCode: '',/*会议密码*/
            conferenceTemplate: ''/*会议模板*/
		},
		editLoading:false,
		btnEditText:'保 存',
		editFormRules:{
            roomName:[
                { required: true, message: '请输入名称', trigger: 'blur' }
			],
            roomConferenceCode:[
                { min: 4, max: 20, message: '长度在 4 到 20 个字符', trigger: 'blur' }
			]
		},
		/* 初始化表格&分页数据 */
		tableData: [],
		currentPage:1,//分页
		total:0,
		listLoading:false,
		  //会议模版option选项
		  templatesData:[],
		templeteOptions: []
	  }
    },
	mounted: function () {
	  this.$nextTick(function () {
		  this.getTableListData();
          this.getTemplatesData();
	  })
	},
    methods: {
        //获取表格数据
        getTableListData(){
            var _list=this;
            axios.get('/vmr/'+_list.currentPage+'/10?keyword='+_list.searchForm.searchInput)
                .then(
                    function(res){
                        console.log(res.data.data);
                        var resData=res.data.data;
                        _list.total=resData.recordTotal;
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
		//删除
        handleDelete:function(row){
			var _this=this;
			let id=row.roomNum;
			this.$confirm('是否确认删除会议室?', '提示', {
				//type: 'warning'
			}).then(() => {
				_this.listLoading=true;
				NProgress.start();
                axios.delete('/vmr/'+id)
                    .then(
                        function(res){
                            let resData=res.data;
                            if(resData.code==200){
                                _this.getTableListData();
                                _this.listLoading=false;
                                NProgress.done();
                                _this.$notify({title: '成功',message: '删除成功',type: 'success'});
							}

                        }
                    ).catch(
                    function(err){ console.log("error"); }
                );
			}).catch(() => {

			});
		},

		//显示编辑界面
		handleEdit:function(row){
			this.editFormVisible=true;
			this.editFormTtile='编辑';
            this.isEdit=true;

            this.editForm.roomName=row.roomName;
            this.editForm.roomNum=row.roomNum;
            this.editForm.roomConferenceCode=row.roomConferenceCode;
            this.editForm.conferenceTemplate=row.conferenceTemplate;
		},

		//显示新增界面
		handleAdd:function(){
			var _this=this;
			this.editFormVisible=true;
			this.editFormTtile='添加会议室';
            this.isEdit=false;

			this.editForm.roomName='';
			this.editForm.roomNum='';
			this.editForm.roomConferenceCode='';
			this.editForm.conferenceTemplate='';
		},
		//编辑 or 新增
		editSubmit:function(){
			var _this=this;
			_this.$refs.editForm.validate((valid)=>{
				if(valid){
					_this.$confirm('确认保存吗？','提示',{}).then(()=>{
						_this.editLoading=true;
						NProgress.start();
						_this.btnEditText='保存中';
						setTimeout(function(){
							_this.editLoading=false;
							NProgress.done();
							_this.btnEditText='保 存';
							_this.editFormVisible = false;

							if(!_this.isEdit){
                                //新增
                                let formData = JSON.stringify(_this.editForm);
                                axios.post('/vmr',formData)
                                    .then(
                                        function(res){
                                            if(res.data.code==200){
                                                _this.$notify({title: '成功',message: '保存成功',type: 'success'});
                                                _this.getTableListData();
                                            }
                                        }
                                    ).catch(
                                    function(err){ console.log("error"); }
                                );

                            }else{
								//编辑
								let id=_this.editForm.roomNum;
                                let formData = JSON.stringify(_this.editForm);
                                axios.post('/vmr/'+id,formData)
                                    .then(
                                        function(res){
                                            if(res.data.code==200){
                                                _this.$notify({title: '成功',message: '编辑成功',type: 'success'});
                                                _this.getTableListData();
                                            }
                                        }
                                    ).catch(
                                    function(err){ console.log("error"); }
                                );
							}
						},1000);

					});

				}
			});

		},
		/* 获取会议模版 conference-templates?keyWord=*/
        getTemplatesData(){
            var _tpl=this;
            axios.get('/conference-templates?keyword=')
                .then(
                    function(res){
                        let resData=res.data.data;
                        _tpl.templatesData=resData;
                        console.log(resData)
                    }
                ).catch(
                function(err){ console.log("error"); }
            );
        },
		/* 自动生成会议号 */
		autoConferenceNum(){
            let _this=this;
            _this.editForm.roomNum=_this.mathRand(6);
		},

		/* 随机生成n位数字 */
        mathRand(n){
			var Num="";
			for(var i=0;i<n;i++){
				Num+=Math.floor(Math.random()*10);
			}
			return Num;
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
	.automatic{
		margin-left:20px;
	}
</style>
