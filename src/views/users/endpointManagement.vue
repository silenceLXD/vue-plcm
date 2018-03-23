<template>
	<section>
		<!--工具条-->
		<el-row type="flex" class="row-bg toolbar" justify="space-between">
			<el-col :span="8" class="">
				<el-button type="primary" @click="addTermina">添加终端</el-button>
			</el-col>
			<el-col :span="4">
				<el-form :inline="true" :model="searchForm" class="demo-form-inline">
						<el-form-item>
							<el-input v-model="searchForm.searchInput" icon="search" @keyup.native="getEndpointListData" placeholder="请输入关键字搜索"></el-input>
						</el-form-item>
					</el-form>
				</el-col>
		</el-row>

		<!--列表-->
		<template>
			<table class="table unborder-table">
				<colgroup>
					<col width="20%">
					<col width="10%">
					<col width="10%">
					<col width="10%">
					<col width="10%">
					<col width="10%">
					<col width="10%">
					<col width="10%">
					<col width="10%">
				</colgroup>
				<thead>
				<tr>
					<th>终端名称</th>
					<th>
						<el-select v-model="deviceStatusValue" @change="getEndpointListData" placeholder="状态">
							<el-option
									v-for="item in deviceStatusOptions"
									:key="item.value"
									:label="item.label"
									:value="item.value">
							</el-option>
							<!--<el-option label="离线" value="0"></el-option>-->
							<!--<el-option label="在线" value="1"></el-option>-->
							<!--<el-option label="通话中" value="2"></el-option>-->
						</el-select>
					</th>
					<th>终端型号</th>
					<th>网络类型</th>
					<th>IP地址</th>
					<th>拨号字符串</th>
					<th>站点</th>
					<th>所有者</th>
					<th>操作</th>
				</tr>
				</thead>
				<tbody>
				<tr v-for="list in tableData">
					<td>{{list.deviceName}}</td><!--终端名称--->
					<td>
						<span v-if="list.plcmDeviceStatus.deviceStatusEnum=='OFFLINE'">离线</span>
						<span v-if="list.plcmDeviceStatus.deviceStatusEnum=='ONLINE'">在线</span>
						<span v-if="list.plcmDeviceStatus.deviceStatusEnum=='INCALL'">通话中</span>
					</td><!--状态--->
					<td>{{list.deviceType}}</td><!--终端型号--->
					<td>{{list.netWorkType}}</td><!--网络类型--->
					<td>{{list.ipAddress}}</td><!--IP地址--->
					<td>{{list.dailAlias}}</td><!--拨号字符串-->
					<td>{{list.site}}</td><!--站点--->
					<td>{{list.deviceOwner}}</td><!--所有者--->
					<td>
						<a href="javascript:;" class="update-a" v-on:click="handleDelete(list)">删除</a>
					</td>
				</tr>
				</tbody>
			</table>

		</template>

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
				<el-form-item label="终端名称" prop="deviceName">
					<el-input v-model="editForm.deviceName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="终端型号" prop="deviceType">
					<el-input v-model="editForm.deviceType" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="IP地址" prop="ipAddress">
					<el-input v-model="editForm.ipAddress" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="端口" prop="port">
					<el-input v-model="editForm.port" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="用户名" prop="userName">
					<el-input v-model="editForm.userName" auto-complete="off"></el-input>
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
		/* ip地址正则校验 */
        var checkIp = (rule, value, callback) => {
            var reg=/^((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))$/;
            if (!reg.test(value)) {
                callback(new Error('请输入正确的IP地址'));
            } else {
                callback();
            }
        };
      return {
          searchForm: {
              searchInput: ''
			},

			editFormVisible:false,//编辑界面显是否显示
			editFormTtile:'编辑',//编辑界面标题
			//编辑界面数据
			editForm: {
				id:0,/*id*/
				deviceName: '',/*终端名称*/
				ipAddress: '',/*IP地址／电话*/
				deviceType:'',//终端型号
				port:'',//端口
				userName: '',//用户名
				password: ''//密码
			},
			editLoading:false,
			btnEditText:'保 存',
			editFormRules:{//验证规则
				deviceName:[
					{ required: true, message: '请输入终端名称', trigger: 'blur' },
					{ min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
				],
				ipAddress:[
					{ required: true, message: '请输入IP地址', trigger: 'blur' },
                    { validator: checkIp, trigger: 'blur' }
				],
				userName:[
					{ required: true, message: '请输入用户名', trigger: 'blur' }
				],
				password:[
					{ required: true, message: '请输入密码', trigger: 'blur' }
				]
			},
          /* 初始化表格&分页数据 */
          tableData: [],
          currentPage:1,//分页
          total:0,

			listLoading:false,
			deviceStatusOptions:[
                {value:'',label:"状态"},
                {value:'OFFLINE',label:"离线"},
				{value:'ONLINE',label:"在线"},
				{value:'INCALL',label:"通话中"}
			],
          deviceStatusValue:'',
		}
    },
      mounted: function () {
          this.$nextTick(function () {
              this.getEndpointListData();
          })
      },
    methods: {
        //获取终端列表数据
		getEndpointListData :function () {
            var _list=this;
            axios.get('/endpoint/'+_list.currentPage+'/10?plcmDeviceStatus='+_list.deviceStatusValue+'&keywords='+_list.searchForm.searchInput)
                .then(
                    function(res){
                        let resData=res.data.data;
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
            _page.getEndpointListData();
            console.log(`当前页: ${val}`);
        },
        //删除
			handleDelete:function(row){
				var _this=this;
				this.$confirm('是否确认删除该终端?', '提示', {
					//type: 'warning'
				}).then(() => {
					_this.listLoading=true;
					NProgress.start();
                    let id=row.deviceIdentifier;
                    axios.delete('/endpoint/'+id)
                        .then(
                            function(res){
                                if(res.data.code==200){
                                    _this.$notify({
                                        title: '成功',
                                        message: '删除成功',
                                        type: 'success'
                                    });
                                    _this.getEndpointListData();
                                }
                            }
                        ).catch(
                        function(err){ console.log("error"); }
                    );
				}).catch(() => {

				});
			},

			//新增
			addTermina:function(){
				var _this=this;
				this.editFormVisible=true;
				this.editFormTtile='添加';

				this.editForm.deviceName='';
				this.editForm.ipAddress='';
				this.editForm.deviceType='';
                this.editForm.port='';
				this.editForm.userName='';
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

								// 新增
                                let formData = JSON.stringify(_this.editForm);
                                axios.post('/endpoint',formData)
                                    .then(
                                        function(res){
                                            if(res.data.code==200){
                                                _this.$notify({
                                                    title: '成功',
                                                    message: '保存成功',
                                                    type: 'success'
                                                });
                                                _this.getEndpointListData();
                                            }
                                        }
                                    ).catch(
                                    function(err){ console.log("error"); }
                                );
							},1000);

						});

					}else{
						console.log("error");
						return false;
					}
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
