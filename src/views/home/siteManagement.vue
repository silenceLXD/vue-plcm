<template>
	<section>
		<!--工具条-->
		<el-row type="flex" class="row-bg marginTB10" justify="space-between">
			<el-col :span="8" class="">
				<el-button type="primary" @click="addSite">添加站点</el-button>
			</el-col>
		</el-row>

		<template>
		  <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
				<!-- 站点拓扑 -->
				<el-tab-pane label="站点拓扑" name="first">
					<div id="chartGraph" style="width:100%; height:600px;"></div>
				</el-tab-pane>

				<!-- 站点列表 -->
		    <el-tab-pane label="站点列表" name="second">
				<!--列表-->
				<table class="table unborder-table">
					<thead>
					<tr>
						<th>站点名称</th>
						<th>关联站点</th>
						<th>最大带宽</th>
						<th>最大比特率</th>
						<th>子网</th>
						<th>操作</th>
					</tr>
					</thead>
					<tbody>
					<tr v-for="list in tableData">
						<td>{{list.name}}</td>
						<td>{{list.linkSites}}</td>
						<td>{{list.maxBandwidth}}</td>
						<td>{{ list.maxBitRate=='UNLIMITED'?'不限':list.maxBitRate }}</td>
						<td>{{list.subnetIps}}</td>
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

			</el-tab-pane>

		  </el-tabs>
		</template>

		<!-- 添加/编辑 终端 -->
		<el-dialog :title="editFormTtile+editFormNextTtile" v-model="editFormVisible" :close-on-click-modal="false">
			<div class="dialog-menu">
				<ul>
					<li v-for="(name,key,index) in tabmenu" v-on:click="toggleMenu(index,name)" v-bind:class="{menuactive:(thisactive==index)}">{{name}}</li>
				</ul>
			</div>

			<!--站点-->
			<div v-if="thisactive==0">
				<el-form :model="editForm" size="tiny" label-width="120px" :rules="editFormRules" ref="editForm" class="demo-ruleForm">

					<el-form-item label="站点名称" prop="name">
						<el-input v-model="editForm.name" ></el-input>
					</el-form-item>
					<el-form-item label="描述" prop="desc">
						<el-input v-model="editForm.desc" ></el-input>
					</el-form-item>
					<el-form-item style="margin-left: -110px;">
						<el-checkbox v-model="ismaxBandwidth">站点最大带宽 </el-checkbox>
						<el-input type="number" v-model="editForm.maxBandwidth" min="1" v-bind:disabled="!ismaxBandwidth" style="width: 30%"></el-input> Mbps
					</el-form-item>

					<!--<el-form-item label="站点最大带宽" prop="maxBandwidth">-->
						<!--<el-input type="number" v-model="editForm.maxBandwidth" min="1" style="width: 30%"></el-input> Mbps-->
					<!--</el-form-item>-->
					<el-form-item style="margin-left: -110px;">
						<el-checkbox v-model="ismaxBitRate">站点最大比特率</el-checkbox>
						<el-input type="number" v-model="editForm.maxBitRate" v-bind:disabled="!ismaxBitRate" min="1" step="100" style="width: 30%"></el-input> Kbps
					</el-form-item>

				</el-form>
			</div>

			<!--关联站点-->
			<div v-if="thisactive==1">
				<div class="marginTB10">
					<button class="polycom-btn" v-on:click="linkSitesFn">添加</button>
				</div>

				<table class="table unborder-table">
					<thead>
					<tr>
						<th>站点名称</th>
						<th>最大带宽</th>
						<th>最大比特率</th>
						<th>操作</th>
					</tr>
					</thead>
					<tbody>
					<tr v-for="list in linkSitesTableData">
						<td>{{list.name}}</td>
						<td>{{list.maxBandwidth}}</td>
						<td>{{list.maxBitRate}}</td>
						<td>
							<a href="javascript:;" class="update-a" @click="linkSitesEdit(list)">编辑</a>
							<a href="javascript:;" class="update-a" @click="linkSitesDelete(list)">删除</a>
						</td>
					</tr>
					</tbody>
				</table>
			</div>

			<!--子网-->
			<div v-if="thisactive==2">
				<div class="marginTB10">
					<button class="polycom-btn" v-on:click="subnetFn">添加</button>
				</div>
				<table class="table unborder-table">
					<thead>
					<tr>
						<th>IP地址</th>
						<th>掩码长度</th>
						<th>最大带宽</th>
						<th>最大比特率</th>
						<th>操作</th>
					</tr>
					</thead>
					<tbody>
					<tr v-for="list in subnetTableData">
						<td>{{list.status}}</td>
						<td>{{list.linkSites}}</td>
						<td>{{list.maxBandwidth}}</td>
						<td>{{list.maxBitRate}}</td>
						<td>
							<a href="javascript:;" class="update-a" @click="subnetEdit(list)">编辑</a>
							<a href="javascript:;" class="update-a" @click="subnetDelete(list)">删除</a>
						</td>
					</tr>
					</tbody>
				</table>
			</div>

			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取 消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">{{btnEditText}}</el-button>
			</div>
		</el-dialog>


		<!--添加关联站点 dialog-->
		<el-dialog title="添加关联站点" v-model="linkSitesFormVisible" :close-on-click-modal="false">
			<el-form :model="linkSitesForm" label-width="120px" class="demo-ruleForm" style="width: 300px;">
				<el-form-item label="站点名称" prop="name">
					<el-input v-model="linkSitesForm.name" ></el-input>
				</el-form-item>

				<el-form-item label="站点最大带宽" prop="maxBandwidth">
					<el-input type="number" v-model="linkSitesForm.maxBandwidth" min="1" style="width: 75%"></el-input> Mbps
				</el-form-item>
				<el-form-item label="站点最大比特率" prop="maxBitRate" >
					<el-input type="number" v-model="linkSitesForm.maxBitRate" min="1" step="100" style="width: 75%"></el-input> Kbps
				</el-form-item>

			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="linkSitesFormVisible = false">取 消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">确定</el-button>
			</div>
		</el-dialog>

		<!--添加子网 dialog-->
		<el-dialog title="添加子网" v-model="subnetFormVisible" :close-on-click-modal="false">
			<el-form :model="subnetForm" label-width="120px" class="demo-ruleForm" style="width: 300px;">
				<el-form-item label="IP地址" prop="ip">
					<el-input v-model="subnetForm.ip" ></el-input>
				</el-form-item>
				<el-form-item label="掩码长度" prop="name">
					<el-input v-model="subnetForm.name" ></el-input>
				</el-form-item>

				<el-form-item label="站点最大带宽" prop="maxBandwidth">
					<el-input type="number" v-model="subnetForm.maxBandwidth" min="1" style="width: 75%"></el-input> Mbps
				</el-form-item>
				<el-form-item label="站点最大比特率" prop="maxBitRate" >
					<el-input type="number" v-model="subnetForm.maxBitRate" min="1" step="100" style="width: 75%"></el-input> Kbps
				</el-form-item>

			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="subnetFormVisible = false">取 消</el-button>
				<el-button type="primary" @click.native="editSubnetSubmit" :loading="editLoading">确定</el-button>
			</div>
		</el-dialog>

	</section>
</template>
<script>
	import util from '../../common/util'
	import NProgress from 'nprogress'
    import axios from 'axios'
    import axiosApi from '../../common/axiosApi'
	import echarts from 'echarts'

	export default {
    data() {
      return {
		  activeName: 'first',//tab标签
		  chartGraph: null, //关系图

		  /* 初始化表格&分页数据 */
		  tableData: [],
          currentPage:1,//分页
          total:100,

		  /* 新增 or 编辑 dialog框 */
          editFormVisible:false,//编辑界面显是否显示
          editFormTtile:'编辑',//编辑界面标题
          editFormNextTtile:'站点',//编辑界面副标题
          btnEditText:'保存',//保存 按钮文字
          //编辑界面表单初始化数据
          editForm: {
              id:0,//id
              name: '',//站点名称
              desc: '',//描述
              maxBandwidth:'',//最大带宽
              maxBitRate:''//最大比特率


          },
          editFormRules:{//验证规则
              name:[
                  { required: true, message: '请输入站点名称', trigger: 'blur' },
                  { min: 1, max: 40, message: '长度在 1 到 40 个字符', trigger: 'blur' }
              ]
          },
          ismaxBandwidth: false,//是否有最大带宽限制 true：有限；false：不限
          ismaxBitRate: false,//是否有最大比特率限制 true：有限；false：不限
		  //编辑界面 左侧tab标签
          tabmenu:{a:"站点",b:"关联站点",c:"子网"},
          thisactive:0,//根据下标 选中哪个tab标签

		  /* 添加关联站点 */
          linkSitesFormVisible:false,
          linkSitesForm: {

		  },
          /* 添加子网 */
          subnetFormVisible:false,
          subnetForm: {

          }
	  }

    },

    methods: {
		/* 切换 站点／关联站点／子网 标签 */
        toggleMenu:function(index,name) {
            this.thisactive=index;
            this.editFormNextTtile=name;
            //alert(this.thisactive);
		},
      	handleClick(tab, event) {
        	console.log(tab, event);
      	},
        //获取表格数据
        getTableListData(){
            var _list=this;
            axios.get('/site/'+_list.currentPage+'/10')
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
        //编辑 初始化回显数据
        handleEdit:function(row){
            this.editFormVisible=true;
            this.editFormTtile='编辑';
            this.thisactive=0;

            this.editForm.id=1;
            this.editForm=row;
        },

        //新增 初始化数据
        addSite:function(){
            let _this=this;
            this.editFormVisible=true;
            this.editFormTtile='新增';
            this.thisactive=0;

            this.ismaxBandwidth=false;
			this.ismaxBitRate=false;
            this.editForm.id=0;
            this.editForm.name='';
            this.editForm.desc='';
            this.editForm.maxBandwidth='';
            this.editForm.maxBitRate='';
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
                            _this.$notify({
                                title: '成功',
                                message: '保存成功',
                                type: 'success'
                            });
                            _this.editFormVisible = false;

                            if(_this.editForm.id==0){
                                //新增
                                _this.tableData.push({
                                    id:new Date().getTime(),
                                    name: _this.editForm.name,
                                    desc: _this.editForm.desc,
                                    maxBandwidth: _this.editForm.maxBandwidth,
                                    maxBitRate: _this.editForm.maxBitRate
                                });
                            }else{
                                //编辑
                                for(var i=0;i<_this.tableData.length;i++){
                                    if(_this.tableData[i].id==_this.editForm.id){
                                        _this.tableData[i].name=_this.editForm.name;
                                        _this.tableData[i].desc=_this.editForm.desc;
                                        _this.tableData[i].maxBandwidth=_this.editForm.maxBandwidth;
                                        _this.tableData[i].maxBitRate=_this.editForm.maxBitRate;

                                        break;
                                    }
                                }
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
            let _this=this;
            this.$confirm('是否确认删除该设备?', '提示', {
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


		// 添加关联站点 dialog
		linkSitesFn:function () {
			this.linkSitesFormVisible=true;
        },
        // 添加子网 dialog
        subnetFn:function () {
            this.subnetFormVisible=true;
        },
		
		drawChartGraph: function () {

//            var _this=this;
            this.chartGraph = echarts.init(document.getElementById('chartGraph'));
			var graphData = {
                "data": [
                    {
                        "category": 0,
                        "draggable": true,
                        "id": 1,
                        "ip": "",
                        "maxBandwidth": "0",
                        "maxBitRate": "UNLIMITED",
                        "name": "Internet/VPN",
                        "value": 50
                    },
                    {
                        "category": 0,
                        "draggable": true,
                        "id": 2,
                        "ip": "172.18.4.159,172.18.7.163",
                        "maxBandwidth": "0",
                        "maxBitRate": "UNLIMITED",
                        "name": "Test",
                        "value": 50
                    },
                    {
                        "category": 0,
                        "draggable": true,
                        "id": 3,
                        "ip": "172.18.7.164,172.18.4.1,172.18.4.37",
                        "maxBandwidth": "0",
                        "maxBitRate": "UNLIMITED",
                        "name": "BJ-L1",
                        "value": 50
                    },
                    {
                        "category": 0,
                        "draggable": true,
                        "id": 4,
                        "ip": "172.18.4.33,172.18.7.166",
                        "maxBandwidth": "0",
                        "maxBitRate": "UNLIMITED",
                        "name": "HN-L2",
                        "value": 50
                    },
                    {
                        "category": 0,
                        "draggable": true,
                        "id": 5,
                        "ip": "172.18.4.193,172.18.7.165,172.18.4.30",
                        "maxBandwidth": "0",
                        "maxBitRate": "UNLIMITED",
                        "name": "HLJ-L2",
                        "value": 50
                    }
                ],
                "links": [
                    {
                        "source": 2,
                        "target": 5
                    },
                    {
                        "source": 2,
                        "target": 2
                    },
                    {
                        "source": 3,
                        "target": 3
                    },
                    {
                        "source": 3,
                        "target": 3
                    },
                    {
                        "source": 4,
                        "target": 3
                    },
                    {
                        "source": 4,
                        "target": 2
                    },
                    {
                        "source": 5,
                        "target": 3
                    },
                    {
                        "source": 5,
                        "target": 5
                    }
                ]
			}

			var option={
                tooltip: {},
                animationDurationUpdate: 1500,
                animationEasingUpdate: 'quinticInOut',
                // legend: {
                // 		x: "center",
                // 		show: true,
                // 		data: ["运维", "测试", '应用', '实施', '开发'] // 此处不显示根节点学生
                // },
                series: [
                    {
                        type: 'graph',
                        layout: 'force',
                        symbolSize: function(size) {
                            return size;
                        },
                        focusNodeAdjacency: true,
                        roam: false,
                        categories: [ {
                            name: '中央',
                            itemStyle: { //可配置颜色
                                normal: {
                                    color: "#5DB2ED",
                                }
                            }
                        }, {
                            name: '其他',
                            itemStyle: { //可配置颜色
                                normal: {
                                    color: "#B7A3DD",
                                }
                            }
                        },{
                            name: '',
                            itemStyle: { //可配置颜色
                                normal: {
                                    color: "#5DB2ED",
                                }
                            }
                        }],
                        label: {
                            normal: {
                                show: true,
                                textStyle: {
                                    fontSize: 14
                                },
                            }
                        },
                        force: {
                            repulsion: 500
                        },
                        tooltip: {
                            formatter: function(node) { // 区分连线和节点，节点上额外显示其他数字
                                if(node.data.maxBitRate=='UNLIMITED'){
                                    var maxBitRateTxt="不限";
								}else{
                                    var maxBitRateTxt=node.data.maxBitRate;
								}
                                if (!node.value) {
                                    return node.data.name;
                                } else {
                                    return "站点名："+node.data.name+"<br/>最大带宽："+node.data.maxBandwidth+"<br/>最大比特率："+maxBitRateTxt+"<br/>子网IP："+node.data.ip;
                                }
                            },
                        },
                        lineStyle: {
                            normal: {
                                opacity: 0.9,
                                width: 2,
                                color:'#5DB2ED',
                                curveness: 0.3
                            }
                        },
                        data: graphData.data,
                        links: graphData.links
                    }
                ]
            };

            this.chartGraph.setOption(option);

        }
	},
		mounted:function(){
            this.$nextTick(function(){
                this.getTableListData();
                this.drawChartGraph();
            });

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

	/*.site-dialog-menu{*/
		/*width: 130px;*/
		/*border: 1px solid #f00;*/
	/*}*/
	/*.site-dialog-menu li{*/
		/*border: 1px solid #333;*/
		/*padding: 3px 8px;*/
	/*}*/

</style>
