<template>
	<section>
		<!--工具条-->
		<el-row type="flex" class="row-bg toolbar" justify="space-between">
			<el-col :span="8" class="">
				<el-button type="primary" @click="handleAllot">添加会议室</el-button>
			</el-col>
			<el-col :span="4">
				<el-form :inline="true" :model="searchForm" class="demo-form-inline">
						<el-form-item>
							<el-input v-model="searchForm.searchInput" icon="search" placeholder="请输入关键字搜索"></el-input>
						</el-form-item>
					</el-form>
				</el-col>
		</el-row>

		<!--列表-->
		<table class="table unborder-table">
			<thead>
			<tr>
				<th>会议室名称</th>
				<th>用户名</th>
				<th>关联终端</th>
				<th>操作</th>
			</tr>
			</thead>
			<tbody>
			<tr v-for="list in tableData">
				<td>{{list.displayName}}</td>
				<td>{{list.userName}}</td>
				<td>
					<span v-for="span in list.deviceList">{{span.deviceName}}<i v-if="list.deviceList.length>1">, </i></span>
				</td>
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
		<el-dialog :title="editFormTitle"  size="small" v-model="editFormVisible" :close-on-click-modal="false">
			<div class="dialog-menu">
				<ul>
					<li v-for="(name,key,index) in tabmenu" v-on:click="toggleMenu(index,name)" v-bind:class="{menuactive:(thisactive==index)}">{{name}}</li>
				</ul>
			</div>
			<!--会议室-->
			<div v-if="thisactive==0">
				<el-form :model="editForm" label-width="120px" :rules="editFormRules" ref="editForm">
					<el-form-item label="会议室名称" prop="displayName">
						<el-input v-model="editForm.displayName" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="用户名" prop="userName">
						<el-input v-model="editForm.userName" :disabled="isEdit" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="密码">
						<el-input v-model="editForm.pwd" type="password" auto-complete="off" placeholder="如不填写密码为初始密码"></el-input>
					</el-form-item>
					<el-form-item label="确认密码">
						<el-input v-model="editForm.repwd" type="password" auto-complete="off" placeholder="如不填写密码为初始密码"></el-input>
					</el-form-item>
					<el-form-item label="邮箱">
						<el-input v-model="editForm.email" type="email" auto-complete="off"></el-input>
					</el-form-item>

				</el-form>
			</div>

			<!--关联终端-->
			<div v-if="thisactive==1">
				<div class="marginTB10">
					<button class="polycom-btn" @click="handleEndpointAdd">添加终端</button>
				</div>
				<table class="table unborder-table">
					<thead>
					<tr>
						<th>终端名称</th>
						<th>状态</th>
						<th>终端类型</th>
						<th>网络类型</th>
						<th>IP地址</th>
						<th>拨号字符串</th>
						<!--<th>操作</th>-->
					</tr>
					</thead>
					<tbody>
					<tr v-for="list in terminalTableData">
						<td>{{list.deviceName}}</td>
						<td>
							<span v-if="list.plcmDeviceStatus.deviceStatusEnum=='OFFLINE'">离线</span>
							<span v-if="list.plcmDeviceStatus.deviceStatusEnum=='ONLINE'">在线</span>
							<span v-if="list.plcmDeviceStatus.deviceStatusEnum=='INCALL'">通话中</span>
						</td><!--状态--->
						<td>{{list.deviceType}}</td>
						<td>{{list.netWorkType}}</td><!--网络类型--->
						<td>{{list.ipAddress}}</td>
						<td>{{list.dailAlias}}</td>
						<!--<td>-->
							<!--<a href="javascript:;" class="update-a" @click="handleEndpointEdit(list)">编辑</a>-->
							<!--<a href="javascript:;" class="update-a" @click="handleEndpointDel(list)">删除</a>-->
						<!--</td>-->
					</tr>
					</tbody>
				</table>
			</div>

			<div slot="footer" class="dialog-footer">
				<!-- <el-button @click.native="editFormVisible = false">取 消</el-button> -->
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">{{btnEditText}}</el-button>
			</div>
		</el-dialog>

		<!-- 添加/编辑 终端 -->
		<el-dialog :title="endpointFormTitle" size="tiny" v-model="endpointFormVisible" :close-on-click-modal="false">
			<el-form :model="endpointForm" label-width="120px" :rules="endpointFormRules" ref="endpointForm" class="demo-ruleForm">
				<el-form-item label="终端名称" prop="deviceName">
					<el-input v-model="endpointForm.deviceName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="终端型号" prop="deviceType">
					<el-input v-model="endpointForm.deviceType" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="IP地址" prop="ipAddress">
					<el-input v-model="endpointForm.ipAddress" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="端口" prop="port">
					<el-input v-model="endpointForm.port" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="用户名" prop="userName">
					<el-input v-model="endpointForm.userName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="password">
					<el-input v-model="endpointForm.password" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>

			<div slot="footer" class="dialog-footer">
				<el-button @click.native="endpointFormVisible = false">取 消</el-button>
				<el-button type="primary" @click.native="editEndpointSubmit" :loading="editLoading">保存</el-button>
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
            //编辑界面 左侧tab标签
		  	tabmenu:{'a':'会议室','b':'关联终端'},
            thisactive:0,//根据下标 选中哪个tab标签

            //编辑界面数据
            isEdit:true,
            templatesData:[],//会议模版option选项
			editFormVisible:false,//编辑界面显是否显示
			editFormTitle:'编辑会议室',//编辑界面标题
			editForm: {
				displayName: '',/*会议室名称*/
				userName	: '',/*用户名*/
                pwd: '',/*密码*/
				repwd: '',/*确认密码*/
                email: '',/*邮箱*/
                deviceList:[]/*关联终端*/
			},
			editLoading:false,
			btnEditText:'保 存',
            editFormRules:{
                displayName:[
					{ required: true, message: '请输入会议室名称', trigger: 'blur' }
				],
                userName:[
                    { required: true, message: '请输入用户名', trigger: 'blur' }
                ]
			},
            /* 初始化表格&分页数据 */
            tableData: [],
            currentPage:1,//分页
            total:0,

			/* 编辑终端 */
			reTerminalTableData:[],
            terminalTableData:[],//终端数据
            endpointFormVisible:false,
            endpointFormTitle:'编辑终端',
            isEndpointEdit:true,
            endpointForm:{
                deviceName:'',
                deviceType:'',
                ipAddress:'',
                port:'',
                userName:'',
                password:''
			},
            endpointFormRules:{//添加终端 验证规则
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
			listLoading:false
		}
    },
      mounted: function () {
          this.$nextTick(function () {
              this.getRoomListData();
              this.getTemplatesData();
          })
      },
    methods: {
        //获取会议室列表数据
        getRoomListData :function () {
            var _list=this;
//                ?keyword='+_list.searchForm.searchInput
            axios.get('/real-room/'+_list.currentPage+'/10')
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
            _page.getRoomListData();
            console.log(`当前页: ${val}`);
        },
        /* 切换 站点／关联站点／子网 标签 */
        toggleMenu:function(index,name) {
            this.thisactive=index;
            this.editFormNextTtile=name;
            //alert(this.thisactive);
        },
		//删除
		handleDelete:function(row){
			var _this=this;
			this.$confirm('是否确认删除会议室?', '提示', {
				//type: 'warning'
			}).then(() => {
				_this.listLoading=true;
				NProgress.start();
                let id=row.userId;
                axios.delete('/real-room/'+id)
                    .then(
                        function(res){
                            if(res.data.code==200){
                                _this.$notify({
                                    title: '成功',
                                    message: '删除成功',
                                    type: 'success'
                                });
                                _this.getRoomListData();
                            }
                        }
                    ).catch(
                    function(err){ console.log("error"); }
                );
			}).catch(() => {

			});
		},

		//编辑 会议室
		handleEdit:function(row){
			this.editFormVisible=true;
			this.editFormTitle='编辑会议室';
			this.isEdit=true;

			this.editForm=row;

			this.terminalTableData=row.deviceList;
		},

		//添加 会议室
		handleAllot:function(){
//			var _this=this;
			this.editFormVisible=true;
			this.editFormTitle='添加会议室';
			this.isEdit=false;

			this.terminalTableData=[];
			this.editForm.displayName='';
			this.editForm.userName='';
			this.editForm.pwd='';
			this.editForm.repwd='';
			this.editForm.email='';
            this.editForm.deviceList=[];
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
                                _this.editForm.deviceList=_this.terminalTableData;
                                let formData = JSON.stringify(_this.editForm);
                                axios.post('/real-room',formData)
                                    .then(
                                        function(res){
                                            if(res.data.code==200){
                                                _this.$notify({
                                                    title: '成功',
                                                    message: '保存成功',
                                                    type: 'success'
                                                });
                                                _this.getRoomListData();
                                            }
                                        }
                                    ).catch(
                                    function(err){ console.log("error"); }
                                );

							}else{
								//编辑
                                _this.editForm.deviceList=_this.terminalTableData;
                                let formData = JSON.stringify(_this.editForm);
                                let id=_this.editForm.userId;
                                axios.post('/real-room/'+id,formData)
                                    .then(
                                        function(res){
                                            if(res.data.code==200){
                                                _this.$notify({
                                                    title: '成功',
                                                    message: '编辑成功',
                                                    type: 'success'
                                                });
                                                _this.getRoomListData();
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

		/* 添加 终端 */
        handleEndpointAdd(){
            this.endpointFormVisible=true;
            this.editFormTitle='添加终端';
            this.isEndpointEdit=false;
        },
		/* 编辑 终端 */
        handleEndpointEdit(row){
            this.endpointFormVisible=true;
            this.editFormTitle='编辑终端';
            this.isEndpointEdit=true;
            this.endpointForm=row;
		},
        /* 删除终端 */
        handleEndpointDel(row){

        },
		/* 保存终端 */
        editEndpointSubmit:function () {
            var _this=this;
            var endpointObj={};
            _this.$refs.endpointForm.validate((valid)=>{
                if(valid){
                    _this.$confirm('确认保存吗？','提示',{}).then(()=>{
                            _this.endpointFormVisible = false;
                            // 新增
                            endpointObj={"deviceName":_this.endpointForm.deviceName,"deviceType":_this.endpointForm.deviceType,"ipAddress":_this.endpointForm.ipAddress,"port":_this.endpointForm.port,"userName":_this.endpointForm.userName,"password":_this.endpointForm.password,"netWorkType":"","dailAlias":"","plcmDeviceStatus":{"deviceStatusEnum":""}};
                            _this.terminalTableData.push(endpointObj);
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
</style>
