<template>
	<section>
		<div style="margin-bottom: 20px;">
			<a class="polycom-border-btn" @click="importFn()">导入通讯录</a>
			<a class="polycom-border-btn" v-on:click="exportExal()">导出通讯录</a>
		</div>
		<el-row type="flex" class="row-bg toolbar" justify="space-between">
			<el-col :span="5" class="" style="padding:0 20px;border-right:1px solid #ccc;">
				<div style="margin: 15px 0;">
					<el-input placeholder="姓名、工号" v-model="search">
						<el-button slot="append" icon="search"></el-button>
					</el-input>
				</div>
				<!--<div class="contactsMenu">

				</div>
				<el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>-->
				<div class="tree-menu">
					<ul v-for="menuItem in theModel">
						<my-tree :model="menuItem"></my-tree>
					</ul>
				</div>

			</el-col>
			<!-- 通讯录 表格 -->
			<el-col :span="19" class="">
				<div class="clearfix" style="overflow: hidden;" v-if="!showEditName">
					<h4 class="pull-left" >{{subName}}</h4>
					<i v-if="canAddUser" class="fa fa-pencil-square-o color-poly pull-left edit" aria-hidden="true" style="font-size: 20px;     margin: 20px;" @click="showEditNameFn"></i>
				</div>
				<div v-if="showEditName" style="overflow: hidden;">
					<span>
						<el-input style="width:200px;margin: 15px 0;" class="pull-left" v-model="subName" placeholder="" ></el-input>
					</span>
					<span class="fa fa-check green" @click="sureEditName()" style="font-size:20px;cursor: pointer; margin: 20px 10px;"></span>
					<span class="fa fa-times error" @click="cancelEdit()" style="font-size:20px;cursor: pointer; margin: 20px 0"></span>
				</div>
				<div class="marginTB10" style="margin:20px 0;">
					<a v-if="canAddUser" class="polycom-border-btn" type="primary" @click="addUserVisible=true">添加用户</a>
					<a class="polycom-border-btn" type="primary" @click="addSub()">添加部门/分公司</a>
					<a v-if="canAddUser" class="polycom-border-btn" v-bind:class="subData.count==0?'':'disabled btn-disabled'" type="primary" @click="deleDept(subData.count)">删除部门</a>
				</div>
				<table class="table unborder-table" style="margin-left:10px;">
					<colgroup>
						<col width="10%">
						<col width="15%">
						<col width="15%">
						<col width="10%">
						<col width="10%">
						<col width="10%">
						<col width="10%">
						<col width="10%">
					</colgroup>
					<thead>
					<tr>
						<th>姓名</th>
						<th>
							一级部门/分公司
						</th>
						<th>
							二级部门
						</th>
						<th>
							三级部门
						</th>
						<th>用户名</th>
						<th>
							<el-select v-model="value" placeholder="角色">
								<el-option
										v-for="item in options"
										:key="item.value"
										:label="item.label"
										:value="item.value">
								</el-option>
							</el-select>
						</th>
						<th>关联终端</th>
						<th>操作</th>
					</tr>
					</thead>
					<tbody>
						<tr v-for="item in userList">
							<td>{{item.realName}}</td>
							<td>{{item.deptName}}</td>
							<td>{{item.subdeptName}}</td>
							<td>{{item.threedeptName}}</td>
							<td>{{item.userName}}</td>
							<td v-if="item.roleId==0">管理员</td>
							<td v-if="item.roleId==1">普通角色</td>
							<td>{{item.deviceName}}</td>
							<td>
								<a href="javascript:;" class="color-poly" @click="editUserFn(item)">编辑</a>
								<a href="javascript:;" class="color-poly" @click="deleteUser(item.userId)">删除</a>
							</td>
						</tr>

					</tbody>
				</table>
				<div class="block pull-right marginTB10">
					<el-pagination
							@size-change="handleSizeChange"
							@current-change="handleCurrentChange"
							:current-page.sync="currentPage1"
							:page-size="10"
							layout="total, prev, pager, next"
							:total="totalCount">
					</el-pagination>
				</div>
			</el-col>
		</el-row>

		<!-- 下载通讯录模版，导入通讯录 -->
		<div class="importFileDiv" v-show="importPop">
			<h2>导入通讯录</h2>
			<ul class="importli">
				<li class="clearfix" style="overflow: hidden;">
					<div class="pull-left"><i class="num">1</i>下载通讯录模版，批量填写信息</div>
					<a class="pull-left polycom-btn" style="line-height: 20px; margin:0;"  @click="downloadTemplte">下载</a>
				</li>
				<li class="clearfix" style="overflow: hidden;">
					<span class="pull-left"><i class="num">2</i>上传填写好的通讯录</span>
					<form id="poiExcel" action="enterprise/uploadBook" method="post" enctype="multipart/form-data" class="pull-left">
						<!-- <input type="text" id="FileText" class="form-control" style="width: 240px;"> -->
						<input type="file"  id="UploadFile" @change="fileNameChanged"  name="excelFile" style="display:none">
						<a class="polycom-btn" @click="importFile">选择文件</a>
						<span id="FileText">{{fileName}}</span>
					</form>
				</li>
			</ul>
			<div class="text-center" style="margin-top:100px;">
				<el-button type="primary" @click="backImport()">取消</el-button>
				<a class="polycom-btn" @click="sureUploadFile">上传</a>
			</div>
		</div>

		<el-dialog
				title="添加部门/分公司"
				:visible.sync="dialogVisible"
				size="tiny"
				:before-close="handleClose">
			<el-form :model="addDeptForm" :rules="addDeptRules" ref="addDeptForm" label-width="100px" class="addDeptForm">
				<el-input type="text" v-model="addDeptForm.orgLevel" style="display: none;"></el-input>
				<el-input type="text" v-model="addDeptForm.orgId" style="display: none;"></el-input>

				<el-row type="flex" class="row-bg toolbar" justify="space-between">
					<el-col :span="5">
						<label>上级部门/分公司</label>
					</el-col>
					<el-col :span="19">
						<span>{{subName}}</span>
					</el-col>
				</el-row>
				<div style="margin-left:20px; margin-top:10px;">
					<el-form-item label="名称" prop="orgName">
						<el-input type="text" v-model="addDeptForm.orgName"></el-input>
					</el-form-item>
				</div>
				<div style="margin-left:20px; margin-top:10px;">
					<el-form-item>
						<el-button type="primary" @click="submitForm('addDeptForm')">提交</el-button>
						<el-button @click="resetForm('addDeptForm')">重置</el-button>
					</el-form-item>
				</div>
			</el-form>
		</el-dialog>

		<el-dialog
				title="添加用户"
				:visible.sync="addUserVisible"
				size="tiny"
				:before-close="handleClose">
			<el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-width="100px" class="demo-ruleForm">
				<el-input type="text" v-model="ruleForm2.orgLevel" style="display: none;"></el-input>
				<el-input type="text" v-model="ruleForm2.orgId" style="display: none;"></el-input>
				<el-form-item label="姓名" prop="realName">
					<el-input type="text" v-model="ruleForm2.realName"></el-input>
				</el-form-item>
				<el-form-item label="所属部门" >
					<el-input type="text" v-model="ruleForm2.orgName" :disabled="true"></el-input>
				</el-form-item>
				<el-form-item label="用户名" prop="userName">
					<el-input v-model="ruleForm2.userName"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="password">
					<el-input type="password" v-model="ruleForm2.password"></el-input>
				</el-form-item>
				<el-form-item label="确认密码" prop="checkPass">
					<el-input type="password" v-model="ruleForm2.checkPass"></el-input>
				</el-form-item>
				<el-form-item label="邮箱" prop="email">
					<el-input v-model="ruleForm2.email"></el-input>
				</el-form-item>
				<el-form-item label="角色" prop="roleId">
					<el-select v-model="ruleForm2.roleId" placeholder="请选择" style="width: 100%;">
						<el-option
								v-for="item in roleOptions"
								:key="item.value"
								:label="item.label"
								:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="submitForm('ruleForm2')">提交</el-button>
					<el-button @click="resetForm('ruleForm2')">重置</el-button>
				</el-form-item>

			</el-form>
		</el-dialog>
		<!--编辑用户-->
		<el-dialog
				title="编辑用户"
				:visible.sync="editUserVisible"
				size="tiny"
				:before-close="handleClose">
			<el-form :model="editUserForm" :rules="editUserRules" ref="editUserForm" label-width="100px" class="demo-ruleForm">
				<el-input type="text" v-model="editUserForm.userId" style="display: none;"></el-input>
				<el-form-item label="姓名" prop="realName">
					<el-input type="text" v-model="editUserForm.realName"></el-input>
				</el-form-item>
				<el-form-item label="一级部门/分公司" >
					<!--<el-input type="text" v-model="editUserForm.orgName" :disabled="true"></el-input>-->
					<!--v-on:change="deptChange(editUserForm.deptName)"-->
					<el-select v-model="editUserForm.deptId" placeholder="请选择" style="width: 100%;" v-on:change="deptChange(editUserForm.deptId)">
						<el-option
								v-for="item in orgNames"
								:key="item.orgId"
								:label="item.orgName	"
								:value="item.orgId">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="二级部门" >
					<el-select v-model="editUserForm.subdeptId" placeholder="请选择" style="width: 100%;" @change="threedeptChange(editUserForm.subdeptId)">
						<el-option
								v-for="item in subdepts"
								:key="item.orgId"
								:label="item.orgName"
								:value="item.orgId">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="三级部门" >
					<!--&lt;!&ndash;<el-input type="text" v-model="editUserForm.orgName" :disabled="true"></el-input>&ndash;&gt;-->
					<el-select v-model="editUserForm.threedeptId" placeholder="请选择" style="width: 100%;">
						<el-option
								v-for="item in threedeptNames"
								:key="item.orgId"
								:label="item.orgName"
								:value="item.orgId">
						</el-option>
					</el-select>
				</el-form-item>

				<el-form-item label="用户名" prop="userName">
					<el-input v-model="editUserForm.userName"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="password">
					<el-input type="password" v-model="editUserForm.password" style="display: none;"></el-input>
					<el-input type="password" value="123456"></el-input>
				</el-form-item>
				<el-form-item label="确认密码" prop="checkPass">
					<el-input type="password" v-model="editUserForm.checkPass" style="display: none;"></el-input>
					<el-input type="password" value="123456"></el-input>
				</el-form-item>
				<el-form-item label="邮箱" prop="email">
					<el-input v-model="editUserForm.email"></el-input>
				</el-form-item>
				<el-form-item label="角色" prop="roleId">
					<el-select v-model="editUserForm.roleId" placeholder="请选择" style="width: 100%;">
						<el-option
								v-for="item in roleOptions"
								:key="item.value"
								:label="item.label"
								:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="submitForm('editUserForm')">提交</el-button>
					<el-button @click="resetForm('editUserForm')">重置</el-button>
				</el-form-item>

			</el-form>
		</el-dialog>

	</section>
</template>

<script>
    import axios from 'axios'
    import axiosApi from '../../common/axiosApi'
    import util from '../../common/util'
    import myTree from '../../components/treeMenu.vue'
    function getPath(){
        var curWwwPath = window.document.location.href;
        var pathName = window.document.location.pathname;
        var pos = curWwwPath.indexOf(pathName);
        var localhostPaht = curWwwPath.substring(0, pos);
        return localhostPaht;
    }
    //判断浏览器
    function judgeBrowser(){
        var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
        var isOpera = userAgent.indexOf("Opera") > -1;
        //判断是否Opera浏览器
        if (isOpera) {
            return "Opera"
        };
        //判断是否Firefox浏览器
        if (userAgent.indexOf("Firefox") > -1) {
            return "FF";
        }
        //判断是否Chrome浏览器
        if (userAgent.indexOf("Chrome") > -1){
            return "Chrome";
        }
        //判断是否Safari浏览器
        if (userAgent.indexOf("Safari") > -1) {
            return "Safari";
        }
        //判断是否IE浏览器
        if ( !!window.ActiveXObject || "ActiveXObject" in window) {
            return "IE";
        };
    }
    export default {
        components: {
            myTree
        },
        data() {
            //验证密码
            var validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else {
                    if (this.ruleForm2.checkPass !== '') {
                        this.$refs.ruleForm2.validateField('checkPass');
                    }
                    callback();
                }
            };
            //验证两次
            var validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.ruleForm2.password) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            return {
                formInline: {
                    user: ''
                },
                pickerOptions0: {
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7;
                    }
                },

                value1:'',
                editFormVisible:false,//编辑界面显是否显示
                editFormTtile:'编辑',//编辑界面标题
                //编辑界面数据
                /*editForm: {
                    id:0,
                    name: '',
                    sex: -1,
                    age: 0,
                    birth: '',
                    addr: ''
                },*/
                editForm: {
                    id:0,/*id*/
                    userName: '',/*用户名称*/
                    level	: '',/*授权等级*/
                    psd: ''/*密码*/

                },
                editLoading:false,
                btnEditText:'保 存',
                editFormRules:{
                    name:[
                        { required: true, message: '请输入名称', trigger: 'blur' }
                    ]
                },

                freezeListVisible:false,
                userListVisible:true,

                listLoading:false,

                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                importPop:false,
                dialogVisible: false,
                addDepartForm:{
                    name:'',
                },
				//树形初始化
                theModel: [],
                userId:'',
				subName:'',
				//右侧表格初始化
                currentPage1: 1,
                totalCount: 0,
                userList: [],
				//是否有添加用户和删除部门权限（顶级没有权限）
				canAddUser:false,
				/*添加用户初始化*/
                addUserVisible:false,
                ruleForm2: {
                    orgId:null,
                    orgLevel:null,
                    realName: '',
                    orgName: '',
                    userName : '',
                    password:'',
                    checkPass:'',
                    email:'',
                    roleId:'',
                },
                rules2: {
                    password: [
                        { validator: validatePass, trigger: 'blur' }
                    ],
                    checkPass: [
                        { validator: validatePass2, trigger: 'blur' }
                    ],
                    realName: [
                        { required: true, message:'姓名不能为空', trigger: 'blur' }
                    ],
                    userName:[
                        { required: true, message:'用户名不能为空', trigger: 'blur' }
					],
					roleId:[
                        { required: true, message:'角色不能为空', trigger: 'change' }
					],
					email:[
                        { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                        { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change' }
					]
                },
				//角色下拉框
				roleOptions:[
					{value:'0',label:'管理员'},
                    {value:'1',label:'用户'}
				],

				//添加部门初始化
                addDeptForm:{
                    orgId:null,
                    orgLevel:null,
					orgName:''
				},
                addDeptRules:{
                    orgName:[
                        { required: true, message: '名称不能为空', trigger: 'blur' },
					]
				},

				/*编辑用户*/

                editUserVisible:false,
                editUserForm:{
                    realName: '',
                    userName : '',
                    password:'',
                    checkPass:'',
                    email:'',
                    roleId:null,
                    deptId:null,
                    subdeptId:null,
                    threedeptId:null,
					userId:null
                },
                orgNames:[],
                subdepts:[],
                threedeptNames:[],

				/*编辑部门名称*/
                showEditName:false,

				//获取host
				path:getPath(),

				/*上传通讯录*/
                fileName:'',
                formData:null,
            }


        },
        mounted:function(){
            this.getUserListData();
        },
        created() {
            this.$eventBus.$on('message', this.onReceive);
        },
        methods: {
            handleNodeClick(data) {
                console.log(data.value);
            },
            //删除记录
            handleDel:function(row){
                //console.log(row);
                var _this=this;
                this.$confirm('确认删除该用户吗?', '提示', {
                    //type: 'warning'
                }).then(() => {
                    _this.listLoading=true;
                    NProgress.start();
                    setTimeout(function(){
                        for(var i=0;i<_this.tableData.length;i++){
                            if(_this.tableData[i].id==row.id){
                                _this.tableData.splice(i,1);

                                _this.listLoading=false;
                                NProgress.done();
                                _this.$notify({
                                    title: '成功',
                                    message: '删除成功',
                                    type: 'success'
                                });

                                break;
                            }
                        }
                    },1000);
                }).catch(() => {

                });
            },

            //显示编辑界面
            handleEdit:function(row){
                this.editFormVisible=true;
                this.editFormTtile='编辑';
                this.editForm.id=row.id;
                this.editForm.userName=row.userName;
                this.editForm.level=row.level;
                this.editForm.psd=row.psd;

            },
            //显示新增界面
            handleAdd:function(){
                var _this=this;

                this.editFormVisible=true;
                this.editFormTtile='新增';

                this.editForm.id=0;
                this.editForm.userName='';
                this.editForm.level='';
                this.editForm.psd='';
            },

            importFn:function(){
                this.importPop=true;
            },
            backImport:function(){
                this.importPop=false;
            },
            //获取左侧树数据
            getUserListData(){
                var _this=this;
                axios.get('/user/left/tree?search=')
                    .then(
                        function(res){
                            _this.theModel=res.data;
                            //console.log(res.data);
							//console.log(res.data.data);
                            _this.subName=res.data.data.userName;
                            _this.getUserList(res.data.data,1);
                        }
                    ).catch(
                    function(err){ console.log("error"); }
                );
            },
            //监听树形组件的点击事件 返回节点信息
            onReceive (data){
                //console.log(data	);
                if(!data.spread){
					this.canAddUser=true;
				}else{
                    this.canAddUser=false;
                    this.showEditName=false;

				}
                this.getUserList(data,1);
            },
            //根据左侧点击 展示右侧人员列表
            getUserList:function(data,page){
                this.subData=data;
                this.subName=data.userName;
                this.ruleForm2.orgName=data.userName;
                this.ruleForm2.orgLevel=data.orgLevel;
                this.ruleForm2.orgId=data.userId;
				this.addDeptForm.orgLevel=data.orgLevel;
                this.addDeptForm.orgId=data.userId;
                var userId=data.userId;
                var _this=this;
                axios.get('/user/org/'+userId+'/'+data.orgLevel+'/-1/'+page+'/10')
                    .then(
                        function(res){
                            _this.userList=res.data.data.list;
                            _this.totalCount=res.data.data.total;
                        }
                    ).catch(
                    function(err){ console.log("error"); }
                );
            },
			//弹出添加部门弹框
            addSub:function(){
                this.dialogVisible=true;
			},
			//每页条数改变事件
            handleSizeChange(val) {
                console.log('每页 ${val} 条');
            },
			//翻页触发的事件
            handleCurrentChange(val) {
                var _page=this;
                _page.currentPage1=val;
                console.log('当前页: '+val);
                _page.getUserList(this.theModel.data,val);
            },
			//添加用户
            submitForm(formName) {
                var _this=this;
                _this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if(formName=='ruleForm2'){
                            delete _this.ruleForm2.checkPass;
                            axios.post('/user',_this.ruleForm2)
                                .then(function (response) {
                                    _this.$notify({
                                        title: '添加成功',
                                        message: '成功',
                                        type: 'success'
                                    });
                                    _this.getUserListData();
                                    _this.addUserVisible=false;
                                })
                                .catch(function (error) {
                                    console.log(error);
                                });
						}else if(formName=='addDeptForm'){
                            console.log(_this.addDeptForm);
                            axios.post('/organization',_this.addDeptForm)
                                .then(function (response) {
                                    _this.$notify({
                                        title: '添加成功',
                                        message: '成功',
                                        type: 'success'
                                    });
                                    _this.getUserListData();
                                    _this.dialogVisible=false;
                                })
                                .catch(function (error) {
                                    console.log(error);
                                });
						}else if(formName=='editUserForm'){
                            axios.get('/user/'+_this.editUserForm.userId)
                                .then(
                                    function(res){

                                        console.log(res.data.data.subdeptId);
                                        if(_this.editUserForm['subdeptId']==null){
                                            _this.editUserForm['subdeptId']=res.data.data.subdeptId;
										}
										if(_this.editUserForm['threedeptId']==null){
                                            _this.editUserForm['threedeptId']=res.data.data.threedeptId;
										}
										delete _this.editUserForm['checkPass'];
                                        delete _this.editUserForm['createTime'];
                                        //console.log(_this.editUserForm);
                                        axios.post('/user/'+_this.editUserForm.userId,_this.editUserForm)
                                            .then(function (response) {
                                                _this.$notify({
                                                    title: '修改成功',
                                                    message: '成功',
                                                    type: 'success'
                                                });
                                                _this.getUserListData();
                                                _this.editUserVisible=false;
                                            })
                                            .catch(function (error) {
                                                console.log(error);
                                            });
                                    }
                                ).catch(
                                function(err){ console.log(err); }
                            );

						}


                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },

            /*编辑用户*/
            editUserFn:function(model){
                var _this=this;
                axios.get('/user/'+model.userId)
                    .then(
                        function(res){
                            //console.log(2222222);
                            _this.editUserVisible=true;
                            res.data.data['userId']=model.userId;
                            _this.editUserForm=res.data.data;
                            /*_this.editUserForm.subdeptId=null;
                            _this.editUserForm.threedeptId=null;*/
                            _this.editUserForm.checkPass=res.data.data.password;

							axios.get('/organization/parentId/'+res.data.data.orgId)
                                .then(
                                    function(res){
                                        _this.orgNames=res.data.data;
                                    }
                                ).catch(
                                function(err){ console.log(err); }
                            );
                            axios.get('/organization/parentId/'+res.data.data.deptId)
                                .then(
                                    function(res){
                                        _this.subdepts=res.data.data;
                                    }
                                ).catch(
                                function(err){ console.log(err); }
                            );
                            axios.get('/organization/parentId/'+res.data.data.subdeptId)
                                .then(
                                    function(res){
                                        _this.threedeptNames=res.data.data;
                                    }
                                ).catch(
                                function(err){ console.log(err); }
                            );
                        }
                    ).catch(
                    function(err){ console.log(err); }
                );


			},
            handleClose(done) {
                done();
            },

			//切换一级部门 查询所属二级部门
			deptChange(deptId){
                var _this=this;
                axios.get('/organization/parentId/'+deptId)
					.then(
                        function(res){
                            _this.subdepts=res.data.data;
                        }
                    ).catch(
                    function(err){ console.log("error"); }
                );
			},
			//切换二级部门 查询所属三级部门
            threedeptChange(deptId){
                var _this=this;
                axios.get('/organization/parentId/'+deptId)
                    .then(
                        function(res){
                            _this.threedeptNames=res.data.data;
                        }
                    ).catch(
                    function(err){ console.log("error"); }
                );
            },

            //删除用户
            deleteUser(id){
                var _this=this;
                axios.delete('/user/'+id,[])
                    .then(function (response) {
                        _this.$notify({
                            title: '删除成功',
                            message: '成功',
                            type: 'success'
                        });
                        _this.getUserListData();
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
			},
			/*修改部门名称*/
            showEditNameFn :function(){
                this.showEditName=!this.showEditName;
			},
            cancelEdit :function(){
				this.showEditName=!this.showEditName;
			},
			sureEditName:function(){
                var _this=this;
                console.log(_this.subData);
                axios.post('/organization/'+_this.subData.userId,
					{'orgId':_this.subData.userId,'orgName':_this.subName,'orgLevel':_this.subData.orgLevel}
					)
                    .then(function (response) {
                        _this.$notify({
                            title: '修改成功',
                            message: '成功',
                            type: 'success'
                        });
                        getUserListData();
                        _this.showEditName=!_this.showEditName;
                    })
                    .catch(function (error) {
                        console.log(error);
                    });

			},
			//删除部门
            deleDept:function(count){
				if(count==0){
                    var _this=this;
                    //console.log(_this.subData);
                    axios.delete('/organization/'+_this.subData.userId,[])
                        .then(function (response) {
                            _this.$notify({
                                title: '删除成功',
                                message: '成功',
                                type: 'success'
                            });
                            _this.getUserListData();
                        })
                        .catch(function (error) {
                            console.log(error);
                        });
				}
			},
			//导出通讯录
            exportExal:function(){
				this.path='http://172.18.7.172:8086';
                location.href=this.path+"/user/export/excel";
			},
			//下载通讯录模板
            downloadTemplte:function(){
				this.path='http://172.18.4.51:8086';
                location.href=this.path+"/user/down/load";
			},

			//触发上传文件input
            importFile:function(){
                $("#UploadFile").click();
			},
			//获取选择的excel名称
            fileNameChanged:function(){
                var UploadFile = $("#UploadFile").val();
                var oBrower=judgeBrowser();
                if(oBrower=='Chrome'||oBrower=='IE'||oBrower=='Safari'){
                    var index = UploadFile .lastIndexOf("\\");
                    UploadFile  = UploadFile .substring(index + 1, UploadFile .length);
                }
                this.fileName=UploadFile;
			},
			//上传
            sureUploadFile(){
                var _this=this;
                var fd = new FormData();
                this.formData = document.querySelector('input[type=file]').files[0];
                fd.append('excelFile', this.formData);
                fd.append('label',0);
                axios.post('user/import/excel',
                    fd
                )
				.then(function (res) {
					//console.log(res.data);
					if(res.data.data==1000){
                        _this.$notify.error({
                            title: '错误',
                            message: '文件格式错误'
                        });
					}else if(res.data.data==2000){
                        _this.$notify.error({
                            title: '错误',
                            message: '企业名称错误'
                        });
					}else if(res.data.data==500){
                        _this.$notify.error({
                            title: '错误',
                            message: '文件内容格式不正确，请检查你要导入的文件是否正确！'
                        });
					}else{
					    if(res.data.data.totalRows>0){
                            _this.$router.push({ name: '导入通讯录', params: { 'list':res.data.data.list}});
						}else if(res.data.data.totalRows==0){
                            _this.$notify.error({
                                title: '错误',
                                message: '文件信息为空'
                            });
						}
					}
				})
				.catch(function (error) {
					console.log(error);
				});
			},


        },

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
	/******** 邀请参会者 meetingInvate.html *********/
	i.removeUser{
		cursor: pointer;
	}




	.contactsMenu {
		overflow:auto;
		max-width:350px;
		background:#F6F6F6;
		font:12px/1.5 Tahoma,Arial,sans-serif
	}
	.contactsMenu ul{
		list-style:none;
		margin:0;
		padding:0;
		font-size: 14px;
	}
	.contactsMenu ul li{
		text-indent:1em;
		white-space:nowrap;
		line-height: 32px;
	}
	.contactsMenu .active{
		cursor:pointer;
		/* width:100%;  */
		/* margin:1px 0;  */
		font:12px/31px '宋体';
		color:#fff;
		background:#07a2e8;
	}

	.contactsMenu ul li a{
		display:block;
		outline:none;
		height:30px;
		line-height:30px;
		margin:1px 5px;
		color:#1A385C;
		text-decoration:none;
	}

	.contactsMenu ul li a:hover{
		background-color: #07a2e8;
		background-image: none;
		color: #fff;
	}
	.upPhoneCon .setup input {
		display: block;
		height: 48px;
		padding: 6px 12px;
		font-size: 14px;
		line-height: 1.42857143;
		color: #555;
		background-color: #fff;
		background-image: none;
		border: 1px solid #ccc;
		border-radius: 4px;
	}
	.importFileDiv{
		position:absolute;
		right: 0px;
		top: 108px;
		width:330px;
		height:500px;
		background: #fafafa;
		box-shadow: 0px 3px 12px #ccc;
		border-radius: 3px;
		z-index:999;
	}
	.importFileDiv>h2{
		padding: 12px;
		font-size: 14px;
		border-bottom: 1px solid #ccc;
	}
	.importFileDiv ul.importli{
		padding: 25px 10px;
	}
	.importFileDiv .importli>li{
		line-height:35px;
		margin:20px 0;
	}

	.num{
		width: 36px;
		height: 36px;
		border:1px solid #1faaeb;
		color: #1faaeb;
		line-height: 36px;
		text-align: center;
		border-radius: 50%;
		display: inline-block;
		margin-right: 5px;
		background: #fff;
	}
	.tree-menu{
		border: 1px solid rgb(209, 223, 229);
		padding:10px;
	}

	h4{
		margin-left:10px;
	}
	.el-form-item__label{
		width: 200px !important;
	}
	.edit{
		cursor: pointer;
	}
	.green{
		color: #009900;
	}
	.error{
		color:red;
	}
	.btn-disabled {
		background: #ccc;
		border-color: #ccc;
		color: #fff;
		border: solid 1px #46aecc;
	}
</style>
