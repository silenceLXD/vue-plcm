<template>
	<section>
		<!--工具条-->
		<el-row type="flex" class="marginTB10" justify="space-between">
			<el-col :span="8" class="">
				<el-button type="primary" @click="addTermina">添加设备</el-button>
			</el-col>
			<el-col :span="4" class="">
				<el-input v-model="searchInput" icon="search" placeholder="请输入关键字搜索" @keyup.native="getTableListData"></el-input>
			</el-col>
		</el-row>

		<!--列表-->
		<table class="table unborder-table">
			<thead>
			<tr>
				<th>设备名称</th>
				<th>设备型号</th>
				<th>IP地址</th>
				<th>站点</th>
				<th>状态</th>
				<th>操作</th>
			</tr>
			</thead>
			<tbody>
				<tr v-for="list in tableData">
					<td>{{list.name}}</td>
					<td>{{list.model}}</td>
					<td>{{list.ip}}</td>
					<td>{{list.site}}</td>
					<td>{{list.status=='0'?'离线':'在线'}}</td>
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

		<!-- 添加/编辑 终端 -->
		<el-dialog :title="editFormTtile" size="tiny" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="120px" :rules="editFormRules" ref="editForm" class="demo-ruleForm">
				<el-form-item label="设备名称" prop="name">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="设备型号" prop="type">
					<el-select v-model="editForm.type" placeholder="请选择">
						<el-option label="RealPresence DMA" value="1"></el-option>
						<el-option label="RealPresence Media Suite" value="2"></el-option>
						<el-option label="MCU" value="3"></el-option>
						<el-option label="RealPresence Resource Manager" value="4"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="IP地址" prop="ip">
					<el-input v-model="editForm.ip" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="端口" prop="port">
					<el-input v-model="editForm.port" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="用户名" prop="username">
					<el-input v-model="editForm.username" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="password">
					<el-input v-model="editForm.password" auto-complete="off"></el-input>
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
        var checkIp = (rule, value, callback) => {
            var reg=/^((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))$/;
            if (!reg.test(value)) {
                callback(new Error('请输入正确的IP地址'));
            } else {
               callback();
            }
        };
      return {
          /* 查询表单 */
		  	searchInput: '',
          	isEdit:true,//判断是编辑（true）；还是新增（false）
		  /* 初始化表格&分页数据 */
		    tableData: [],
		    currentPage:1,
		    total:0,

		  /* 添加&编辑 表单 */
		  	editFormVisible:false,//编辑界面显是否显示
			editFormTtile:'编辑',//编辑界面标题
			//编辑界面数据
			editForm: {
				id:0,/*id*/
				name: '',/*设备名称*/
				ip: '',/*IP地址*/
				site: '',/*站点*/
                type: '',/*设备型号*/
				status: '',/*状态*/
				port:'',/*端口*/
				username:'',/*用户名*/
				password:''/*密码*/

			},
			editLoading:false,
			btnEditText:'保 存',
			editFormRules:{//验证规则
				name:[
					{ required: true, message: '请输入设备名称', trigger: 'blur' },
					{ min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
				],
				ip:[
					{ required: true, message: '请输入IP地址', trigger: 'blur' },
                    { validator: checkIp, trigger: 'blur' }
				],
				username:[
					{ required: true, message: '请输入用户名', trigger: 'blur' }
				],
				password:[
					{ required: true, message: '请输入密码', trigger: 'blur' }
				]
			},
		  listLoading:false,

	  }
    },
      mounted: function () {
          this.$nextTick(function () {
              this.getTableListData();
          })
      },
    methods: {
		//获取表格数据
		getTableListData(){
			var _list=this;
			axios.get('/device/'+_list.currentPage+'/10?keywords='+_list.searchInput)
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

		//编辑
		handleEdit:function(row){
			this.editFormVisible=true;
			this.editFormTtile='编辑';
			this.isEdit=true;

			this.editForm.name=row.name;
			this.editForm.ip=row.ip;
			this.editForm.site=row.site;
			this.editForm.model=row.model;
			this.editForm.port=row.port;
			this.editForm.username=row.username;
			this.editForm.password=row.password;
		},

		//新增
		addTermina:function(){
			var _this=this;
			this.editFormVisible=true;
			this.editFormTtile='新增';
			this.isEdit=false;

			this.editForm.name='';
			this.editForm.ip='';
			this.editForm.site='';
			this.editForm.model='';
			this.editForm.port='';
			this.editForm.username='';
			this.editForm.password='';
		},

		//提交 编辑 or 新增
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
								var formData = JSON.stringify(_this.editForm);
								axios.post('/device',formData)
									.then(
										function(res){
											if(res.data.code==200){
												_this.$notify({
													title: '成功',
													message: '保存成功',
													type: 'success'
												});
												_this.getTableListData();
											}
										}
									).catch(
									function(err){ console.log("error"); }
								);

							}else{
								//编辑
                                let formData = JSON.stringify(_this.editForm);
                                let id=_this.editForm.plcmDeviceId;
                                axios.post('/device/'+id,formData)
                                    .then(
                                        function(res){
                                            if(res.data.code==200){
                                                _this.$notify({
                                                    title: '成功',
                                                    message: '编辑成功',
                                                    type: 'success'
                                                });
                                                _this.getTableListData();
                                            }
                                        }
                                    ).catch(
                                    function(err){ console.log("error"); }
                                );
							}
						},1000);

					});

				}else{
					console.log("error");
					return false;
				}
			});

		},
        //删除
        handleDelete:function(row){
            var _this=this;
            this.$confirm('是否确认删除该设备?', '提示', {
                //type: 'warning'
            }).then(() => {
                _this.listLoading=true;
                NProgress.start();
                let id=row.plcmDeviceId;
                axios.delete('/device/'+id)
                    .then(
                        function(res){
                            if(res.data.code==200){
                                _this.$notify({
                                    title: '成功',
                                    message: '删除成功',
                                    type: 'success'
                                });
                                _this.getTableListData();
                            }
                        }
                    ).catch(
                    function(err){ console.log("error"); }
                );
            }).catch(() => {

            });
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

</style>
