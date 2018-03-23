<template>
	<div class="control-panel">
		<div class="meeting-msg">
			<span class="msg-span">会议号：{{conferenceData.conferenceNumber}}</span>
			<span class="msg-span">会议密码：{{conferenceData.conferencePwd}}</span>
			<span class="msg-span">会议已进行时长：{{meetingLongTime}}</span>
			<span v-if="isOutTime" class="msg-span" style="margin-top: -15px;">
				<div class="timeout-bg">
				   <div class="circle"></div>
				   <div class="circle2"></div>
				   <p class="text-center"><span class="icon-time"></span> 会议已超时{{meetingOutTime}}</p>
			   </div>
			</span>
		</div>
		<div class="meeting-update">
			<el-row>
				<el-col :span="2">
					<p  @click="addUsers()" class="control-icon fa icon-poly-control-add"></p>
					<p>添加与会者</p>
				</el-col>
				<el-col :span="2">
					<p @click="batchCallFn()" class="control-icon fa icon-poly-control-call"></p>
					<p>批量呼叫离线</p>
				</el-col>
				<el-col :span="2">
					<p @click="settingVideo()" class="control-icon fa icon-poly-control-screen"></p>
					<p>视频设置</p>
				</el-col>
				<el-col :span="2">
					<p @click="sendSubtitle()" :class="subStatus ? 'color-red':''" class="control-icon fa icon-poly-control-subtitle"></p>
					<p>{{ subStatus?'字幕中':'发送字幕' }}</p>
				</el-col>

				<!--<el-col :span="2">-->
					<!--<p class="control-icon fa icon-poly-control-delayed"></p>-->
					<!--<p>延时会议</p>-->
				<!--</el-col>-->


				<el-col :span="1">
					<p style="visibility: hidden"></p>
				</el-col>


				<el-col :span="2">
					<p @click="muteAllFn()" :class="muteAllStatus ? 'color-red icon-poly-control-unmute':'icon-poly-control-mute'" class="control-icon fa "></p>
					<p>参会者静音</p>
				</el-col>

				<el-col :span="2">
					<p @click="recordFn()" :class="recordStatus ? 'color-red':''" class="control-icon fa icon-poly-control-record"></p>
					<p>{{ recordStatus?'录制中':'开启录制' }}</p>
				</el-col>
				<el-col :span="2">
					<p @click="liveFn()" :class="liveStatus ? 'color-red':''" class="control-icon fa icon-poly-control-live"></p>
					<p>{{ liveStatus?'直播中':'开启直播' }}</p>
				</el-col>
				<el-col :span="2">
					<p @click="lockFn()" :class="lockStatus ? 'color-red icon-poly-control-unlock':'icon-poly-control-lock'" class="control-icon fa"></p>
					<p>{{ lockStatus?'解锁会议':'锁定会议' }}</p>
				</el-col>
				<el-col :span="1">
					<p style="visibility: hidden"></p>
				</el-col>

				<el-col :span="2">
					<p @click="endMeetingFn()" class="control-icon fa icon-poly-control-close color-red"></p>
					<p>结束会议</p>
				</el-col>
			</el-row>
		</div>
		<div style="position: relative">
			<el-form :inline="true" :model="controlForm">
				<el-form-item>
					<el-checkbox label="入会时静音" v-model="controlForm.isMute" @change="enterMuteFn()" name="isMute"></el-checkbox>
				</el-form-item>

				<el-form-item class="pull-right">
					<el-input v-model="searchInput" icon="search" placeholder="请输入关键字搜索"></el-input>
				</el-form-item>
			</el-form>

			<div class="meeting-log" :style="{right:logRightPx+ 'px'}">
				<div class="meeting-record" id="meetingRecord">
					<a href="javascript:;" @click="showLogMsg(conferenceData.cid)" class="meetingRecord-txt" title="查看会议日志"><i class="fa icon-poly-control-log" style="font-size: 26px;color: #fff;"></i></a>
					<p><b>会议日志 :</b></p>
					<div class="record-content">
						<p v-for="log in logData">
							<b class="record-time ">{{log.operationTime | formatDate('hh:mm') }}分 </b>
							<span>{{log.context}}</span>
						</p>
					</div>
				</div>
			</div>
		</div>
		<div class="marginTB10">
			<table class="table unborder-table">
				<thead>
				<tr>
					<th>站点</th>
					<th>用户</th>
					<th>状态</th>
					<th>终端</th>
					<th>IP地址</th>
					<th>音频</th>
					<th>视频</th>
					<th>呼叫</th>
					<th>更多操作</th>
				</tr>
				</thead>
				<tbody>
				<tr v-for="list in conferenceData.conferenceUsers">
					<td>{{list.siteName}}</td>
					<td><i class="color-poly fa " :class="list.lecturer?'icon-poly-control-user':''"></i>{{list.userName}}</td>
					<td>
						<span v-if="list.status==0">
							<i class="circle-green"></i>在线
						</span>
						<span v-else-if="1">
							<i class="circle-gray"></i>离线
						</span>
						<!--<span v-else-if="0">-->
							<!--<i class="circle-purple"></i>未呼入-->
						<!--</span>-->
					</td>
					<td>{{list.endpointName}}</td>
					<td>{{list.ip}}</td>
					<td>
						<div v-if="list.status==0">
							<span class="cursor-pointer fa font24" @click="switchAudioFn(list)" v-bind:class="list.audioMute?'color-red icon-poly-control-unmute':'color-green icon-poly-control-mute'"></span>
						</div>
						<div v-else="" class="fa font24 color-gray icon-poly-control-mute"></div>
					</td>
					<td>
						<div v-if="list.status==0">
							<span class="cursor-pointer fa font24" @click="switchVideoFn(list)" v-bind:class="list.videoMute?'color-red icon-poly-control-unvideo':'color-green icon-poly-control-video'"></span>
							<!--<span v-else="" class="fa font24 color-red icon-poly-control-unvideo"></span>-->
						</div>
						<div v-else="" class="fa font24 color-gray icon-poly-control-video"></div>
					</td>
					<td>
						<!--<div v-if="list.status==0">-->
							<span class="cursor-pointer fa font24" @click="switchCallFn(list)" v-bind:class="list.status==true?'color-green icon-poly-control-off':'color-red icon-poly-control-off'"></span>
							<!--<span v-else="" class="fa font24 color-red icon-poly-control-off"></span>-->
						<!--</div>-->
						<!--<div v-else="" class="fa font24 color-gray icon-poly-control-off"></div>-->
					</td>
					<td>
						<a href="javascript:;" class="cursor-pointer color-poly font24 fa fa-ellipsis-h" @click="getMousePosFn(list)"></a>
					</td>
				</tr>
				</tbody>
			</table>
			<operation-ul :model="operationItem" :mousePos="mousePosData"></operation-ul>
		</div>


		<!-- 添加与会者 dialog-->
		<el-dialog title="添加与会者" size="small" v-model="addDialogFormVisible" :close-on-click-modal="false">

			<el-row>
				<el-col :span="7">
					<el-radio-group v-model="userType" class="marginTB10">
						<el-radio-button label="user">用户</el-radio-button>
						<el-radio-button label="room">会议室</el-radio-button>
					</el-radio-group>
				</el-col>

				<el-col :span="16">
					<p class="pull-left">已添加（{{conferenceUsersNum}}）</p>
					<p class="pull-right"><a href="javascript:;" class="polycom-border-btn" @click="emptyAllUser"><i class="fa fa-trash"></i> 全部清空</a></p>
				</el-col>
			</el-row>

			<el-form :model="addDialogForm" ref="addDialogForm" id="dialogUsersForm">
				<el-row>
					<el-col :span="7">
						<el-form-item>
							<el-input v-model="addDialogForm.searchName" auto-complete="off" placeholder="请输入关键字搜索"></el-input>
						</el-form-item>
						<!-- 参会者 -->
						<el-form-item v-show="userType=='user'">
							<div class="tree-menu">
								<ul v-for="menuItem in theUserListModel">
									<my-tree :model="menuItem" @getUser="chooseUser" :menuList="menuItem" :hasCheckbox="true" :menuName="menuItem.realName" :menuUserId="menuItem.userId" :selectKeys="selectKeys"></my-tree>
								</ul>
							</div>
						</el-form-item>
						<!-- 云会议室 -->
						<el-form-item v-show="userType=='room'">
							<p class="text-center" style="background: #d0d5dd;">会议室名称</p>
							<ul class="room-content">
								<li class="room-list" v-for="room in theRoomListData">
									<label v-bind:for=room.userId>
										<input type="checkbox" v-bind:id=room.userId @click.stop="selroom(room)"/> {{ room.userName}}
									</label>
								</li>
							</ul>

						</el-form-item>
					</el-col>

					<el-col :span="16" class="addAttend-right">
						<el-form-item>
							<div class="addAttend-content">
								<el-tag v-for="tag in addDialogForm.dialogConferenceUsers" :key="tag.userId" :closable="true" type="primary" @close="deleteUser(tag)">{{tag.realName}}</el-tag>
								<el-tag v-for="tag in addDialogForm.dialogConferenceRooms" :key="tag.userId" :closable="true" type="primary" @close="deleteRoom(tag)">{{tag.realName}}</el-tag>
							</div>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<span slot="footer" class="dialog-footer">
			   <!--<el-button @click.native="addDialogFormVisible = false">取 消</el-button>-->
			   <el-button type="primary" @click.native="handleAddUser()">呼 叫</el-button>
			</span>
		</el-dialog>

		<!-- 发送字幕 dialog-->
		<el-dialog title="发送字幕" size="tiny" v-model="subtitleFormVisible" :close-on-click-modal="false">
			<el-form :model="subtitleForm" label-width="120px" :rules="subtitleFormRules" ref="subtitleForm" class="demo-ruleForm">
				<el-form-item label="内容" prop="subContent">
					<el-input v-model="subtitleForm.subContent" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="字体大小" prop="subFontSize">
					<el-select v-model="subtitleForm.subFontSize">
						<el-option label="10" value="10"></el-option>
						<el-option label="20" value="20"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="颜色" prop="subColor">
					<el-color-picker v-model="subtitleForm.subColor"></el-color-picker>
				</el-form-item>

				<el-form-item label="显示重复(次)" prop="subRepeat">
					<el-select v-model="subtitleForm.subRepeat">
						<el-option label="10" value="10"></el-option>
						<el-option label="20" value="20"></el-option>
					</el-select>
				</el-form-item>

				<el-form-item label="垂直位置" prop="subVerticalPosition">
					<el-slider v-model="subtitleForm.subVerticalPosition"></el-slider>
				</el-form-item>
				<el-form-item label="背景透明度" prop="subOpacity">
					<el-slider v-model="subtitleForm.subOpacity"></el-slider>
				</el-form-item>
				<el-form-item label="显示速度" prop="subSpeed">
					<el-slider v-model="subtitleForm.subSpeed"></el-slider>
				</el-form-item>

			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="subtitleFormVisible = false">取 消</el-button>
				<el-button type="primary" @click.native="editSubmit">确 定</el-button>
			</div>
		</el-dialog>

		<!-- 视频设置 dialog -->
		<el-dialog title="视频设置" size="small" custom-class="dialog-width" v-model="setVideoFormVisible" :close-on-click-modal="false">
			<el-form :model="setVideoForm" label-width="150px" :rules="setVideoFormRules" ref="setVideoForm" class="demo-ruleForm">
				<div class="splitModel-left">
					<el-row>
						<!--<el-col :span="12">-->
							<!--<el-form-item label="视频模式">-->
								<!--<el-select v-model="setVideoForm.videoModel">-->
									<!--<el-option label="演讲者模式" value="1"></el-option>-->
									<!--<el-option label="语音激励模式" value="2"></el-option>-->
									<!--<el-option label="大会模式" value="3"></el-option>-->
								<!--</el-select>-->
							<!--</el-form-item>-->
						<!--</el-col>-->
						<el-col :span="8">
							<el-form-item label="相同分屏">
								<el-checkbox v-model="setVideoForm.sameLayout" @change="setVideoForm.sameLayout?setVideoForm.layout='':''"></el-checkbox>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="自动分屏">
								<el-checkbox v-model="setVideoForm.autoLayout" @change="setVideoForm.autoLayout?setVideoForm.layout='':''"></el-checkbox>
							</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item label="设置轮询列表">
								<!--<el-checkbox v-model="setVideoForm.setPollingList" @change="setPollingFn()"></el-checkbox>-->
								<el-switch
										v-model="setVideoForm.setPollingList"
										on-text=""
										off-text=""
										@change="setPollingFn()">
								</el-switch>
							</el-form-item>
						</el-col>
					</el-row>
					<div v-bind:class="setVideoForm.autoLayout||setVideoForm.sameLayout?'disabled-div':''">
						<split-model :modelData="conferenceData" :cid="conferenceData.conferenceId" @getLayout="getLayoutFn"></split-model>
					</div>
				</div>
			</el-form>
			<span slot="footer" class="dialog-footer">
			   <el-button @click.native="setVideoFormVisible = false">取 消</el-button>
			   <el-button type="primary" @click="submitSettingVideo">确 定</el-button>
			</span>
		</el-dialog>

		<!-- 设置轮询列表 -->
		<el-dialog title="设置轮询列表" size="small" v-model="pollingFormVisible" :close-on-click-modal="false">
			<el-form :model="pollingForm" label-width="160px" :rules="pollingFormRules" ref="pollingForm" class="demo-ruleForm">
				<div class="splitModel-right ">
					<el-row>
						<el-form-item label="自动轮询时间间隔(s)">
							<el-select v-model="pollingForm.scanInterval">
								<el-option label="5" value="5"></el-option>
								<el-option label="10" value="10"></el-option>
								<el-option label="20" value="20"></el-option>
								<el-option label="30" value="30"></el-option>
								<el-option label="60" value="60"></el-option>
								<el-option label="90" value="90"></el-option>
								<el-option label="120" value="120"></el-option>
								<el-option label="150" value="150"></el-option>
								<el-option label="180" value="180"></el-option>
								<el-option label="210" value="210"></el-option>
								<el-option label="240" value="240"></el-option>
								<el-option label="270" value="270"></el-option>
								<el-option label="300" value="300"></el-option>
							</el-select>
						</el-form-item>
					</el-row>
					<el-row>
						<el-transfer v-model="pollingForm.choosedSelect" :data="pollingForm.leftSelectData" :titles="['未轮询与会者', '已轮询与会者']"></el-transfer>
					</el-row>
				</div>

			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="pollingFormVisible = false">取 消</el-button>
				<el-button type="primary" @click.native="submitPolling">确 定</el-button>
			</div>
		</el-dialog>
	</div>



</template>
<script>
	import util from '../../common/util'
	import NProgress from 'nprogress'
    import axios from 'axios'
    import axiosApi from '../../common/axiosApi'
    import myTree from '../../components/tree.vue'
    import splitModel from '../../components/splitModel.vue'


	export default {
        components: {
            myTree,  //树形结构
            splitModel,//视频设置
			//更多操作 局部组件
            'operation-ul' : {
				template: '<ul class="operation-ul" :style="{left:mousePos.x-370 +\'px\', top:mousePos.y+\'px\'}"><li class="cursor-pointer" @click="changeRoleFn(model,1)">{{model.lecturer==0?\'设为演讲者\':\'设为参会者\'}}</li><li class="cursor-pointer" @click="changeRoleFn(model,2)">{{model.type==0?\'设为讨论者\':\'取消讨论者权限\'}}</li><li class="cursor-pointer" @click="changeRoleFn(model,3)">{{model.type==0?\'设为双流发送者\':\'取消双流发送权限\'}}</li><li class="cursor-pointer" @click="changeRoleFn(model,4)">发送字幕</li><li class="cursor-pointer" @click="changeRoleFn(model,5)">设置分屏</li></ul>',
                props:['model','mousePos'],
                methods:{
                    changeRoleFn(data,type){
                        if(type == 1){
                            axios.post("/meeting-control/role/"+data.participantIdentifier+"/"+data.conferenceIdentifier+"/"+data.lecturer)
                                .then(function(res){
                                    data.lecturer=!data.lecturer;
                                }).catch(function(err){
                                console.log(" error");
                            });
						}
                        console.log(data.userId);
					}
				}
			}
        },
		props:['meetingId'],
		data() {
			return {
//                operationItem:['设为演讲者','设为讨论者','设为双流发送者','发送字幕','设置分屏'],
                controlForm:{
                    isMute:false,
                    searchInput:'',
				},
                conferenceData:{},
				meetingLongTime:'',//会议已进行时长
                isOutTime:false,//会是是否超时
				meetingOutTime:'',//会议超出时长
                tableData: [],//参会者 表格数据
				listLoading:false,

                recordStatus:false,// 是否录制状态
                liveStatus:false,// 是否直播状态
                muteAllStatus:false,// 是否静音全部参会者状态
                lockStatus:false,// 是否锁定会议状态（true：已锁定；false：未锁定）
                subStatus:false,// 是否字幕状态
                operationItem:{},// 更多操作组件数据
				mousePosData:{
                    x:0,y:0
				},//鼠标点击更多操作按钮，鼠标坐标

                /* 添加与会者 dialog begin*/
                addDialogFormVisible:false, //添加与会者dialog
                theUserListModel: [], //与会者 用户列表数据
                theRoomListData:[],//与会者 会议室列表数据
                userType:'user',
                addDialogForm:{
                    conferenceName: '',
                    searchName: '',
                    dialogConferenceUsers: [],
                    dialogConferenceRooms:[],
                },
                conferenceUsersNum:0, //已添加多少人

                conferenceUsers: {},//与会者-用户
                conferenceRooms: {},//与会者-会议室
                /* dialog end */

                /* 发送字幕 dialog begin */
                subtitleFormVisible:false,
                subtitleForm: {
                    subContent:'',//内容
                    subFontSize:'',//字体大小
                    subColor:'',//颜色
                    subRepeat:'',//重复次数
                    subVerticalPosition:'',//垂直位置
                    subOpacity:'',//显示透明度
                    subSpeed:'',//显示速度
				},
                /* dialog end */

                /* 视频设置 dialog begin */
                setVideoFormVisible:false,
				setVideoForm:{
                    sameLayout:false,//相同分屏
                    autoLayout:false,//自动分屏
                    setPollingList:false,//设置轮询列表
                    layout:'',
				},
//				submitForm:{
//                    layout:'',
//				},
                /* dialog end */

                /* 轮询列表设置 dialog begin */
                pollingFormVisible:false,
                pollingForm:{
                    scanInterval:30,
                    leftSelectData:[],
                    choosedSelect:[],//已轮询的与会者
				},
                /* dialog end */
                logData:'',//会议日志数据
                isShowLog:false,//默认不现实会议日志
                logRightPx:-360//会议日志位置

			}
		},
        mounted: function () {
            this.$nextTick(function () {
                this.getConferenceData(this.meetingId);
                this.getConferenceUserList(this.meetingId);
            });
        },
        created() {
            this.$eventBus.$on('getUser', this.chooseUser);//接收来自子组件myTree的数据
            this.$eventBus.$on('getLayout', this.getLayoutFn);//接收来自子组件splitModel的数据
        },
        beforeDestroy: function(){
            this.$eventBus.$off("getid")
		},
        watch:{
            //监听所选择的与会者人员
            conferenceUsersNum(){
                // console.log(this.conferenceUsersNum)
			}
		},
		methods: {
            /* 初始化数据 根据id获取会议详情 */
            getConferenceData(id){
                let _this=this;
                /*this.$eventBus.$on('getid', function (id) {*/
                    /*console.log(1111111111111111);
                    console.log(id);*/
                    axios.get('/conference/'+id)
                        .then(
                            function(res){
                                let resData=res.data.data;
                                _this.conferenceData=res.data.data;
                                _this.recordStatus=resData.isRecord;// 是否录制
                                _this.liveStatus=resData.isLive;// 是否直播
                                _this.muteAllStatus=resData.isMute;// 是否静音
								let longtime=_this.util.getTimestamp(resData.startTime);//根据开始时间 计算会议进行时长
                                _this.meetingLongTime=_this.util.getMeetingLongTime(longtime);

                                let outtime=_this.util.getTimestamp(resData.endTime);//根据结束时间 计算会议超时时长
                                _this.meetingOutTime=_this.util.getMeetingLongTime(outtime);

                                //当前时间大于会议结束时间 则显示会议超时提示
                                let getNowtime = new Date().getTime();
                                let theOutTimes = getNowtime - outtime;
                                if(theOutTimes > 0){
								    _this.isOutTime=true;
								}
                            }
                        ).catch(
                        function(err){ console.log("error"); }
                    );
                /*});*/
			},
			/* 获取 会议中的参会人员 */
            getConferenceUserList(id){
                let _this=this;
                axios.get('/conference-user/'+id)
                    .then(
                        function(res){
                            let resData=res.data.data;
                            _this.conferenceData.conferenceUsers=resData;
                            var leftSelect=[];
                            //轮询列表
							if(resData){
								for (var i=0;i<resData.length;i++){
									var sobj={"label":resData[i].userName,"key":resData[i].participantIdentifier};
								};
								leftSelect.push(sobj);
                            }else{
                                leftSelect=[];
							}
                            _this.pollingForm.leftSelectData=leftSelect;


                        }
                    ).catch(
                    function(err){ console.log("error"); }
                );
			},
            /*getId(id){
                console.log('getID');
                console.log(id);
			},*/

            /************** 添加与会者 begin *************/
            // 添加与会者dialog
            addUsers(){
                this.getUserListData();
                this.addDialogFormVisible = true;
                //this.addDialogForm = {};
            },
            //获取与会者所有人员
            getUserListData(){
                var _list=this;
                axios.get('/conference/user-room/null/null')
                    .then(
                        function(res){
                            _list.theUserListModel=res.data.data.users;
                            _list.theRoomListData=res.data.data.rooms;
                            console.log(res.data.data);
                        }
                    ).catch(
                    function(err){ console.log("获取与会者 error"); }
                );
            },
            //勾选与会者
            chooseUser(data){
                let _this=this;
                _this.addDialogForm.dialogConferenceUsers=data;
                let userLen=_this.addDialogForm.dialogConferenceUsers.length;
                let roomLen=_this.addDialogForm.dialogConferenceRooms.length;
                _this.conferenceUsersNum=userLen+roomLen;
            },
            //勾选会议室
            selroom: function(item){
                let _this=this;
                let obj={"realName":item.userName,"userId":item.userId,"apiUserId":item.apiUserId};
                if(typeof item.checked == 'undefind'){
                    this.$set(item,"checked",true)
                }else{
                    item.checked = !item.checked;
                }
                if(item.checked){
                    _this.addDialogForm.dialogConferenceRooms.push(obj)
                }else{
                    _this.addDialogForm.dialogConferenceRooms.splice(_this.addDialogForm.dialogConferenceRooms.indexOf(obj),1);
                }

                let userLen=_this.addDialogForm.dialogConferenceUsers.length;
                let roomLen=_this.addDialogForm.dialogConferenceRooms.length;
                _this.conferenceUsersNum=userLen+roomLen;
            },
            //移除与会者
            deleteUser: function(tag) {
                this.addDialogForm.dialogConferenceUsers.splice(this.addDialogForm.dialogConferenceUsers.indexOf(tag),1);
                $('#tree' + tag.userId)[0].checked = false;
                let userLen=this.addDialogForm.dialogConferenceUsers.length;
                let roomLen=this.addDialogForm.dialogConferenceRooms.length;
                this.conferenceUsersNum=userLen+roomLen;
            },
            //移除会议室
            deleteRoom: function(tag) {
                this.addDialogForm.dialogConferenceRooms.splice(this.addDialogForm.dialogConferenceRooms.indexOf(tag),1);
                $(""+tag.userId).checked = false;
                let userLen=this.addDialogForm.dialogConferenceUsers.length;
                let roomLen=this.addDialogForm.dialogConferenceRooms.length;
                this.conferenceUsersNum=userLen+roomLen;
            },
            // 全部清空（已选参会者）
            emptyAllUser(){
                this.addDialogForm.dialogConferenceUsers=[];
                this.addDialogForm.dialogConferenceRooms=[];
                $(".tree-menu").children("input").checked=false;
                this.conferenceUsersNum=0;
            },
            // 确定添加与会者和会议室
            handleAddUser(){
                let _this=this;
                let postData={
                    "conferenceUsers":_this.addDialogForm.dialogConferenceUsers,
                    "conferenceRooms":_this.addDialogForm.dialogConferenceRooms,
                    "conferenceId":_this.conferenceData.conferenceId
                };
                axios.post('/meeting-control/addUsers/'+_this.conferenceData.cid,postData)
                    .then(function(res){
                        console.log(res);
                        if(res.data.code==200){
                            setTimeout(function(){
                                _this.$notify({
                                    title: '成功',
                                    message: '呼叫成功',
                                    type: 'success'
                                });
                            },1000);
                        }
                    }).catch(function(err){
                    console.log("添加与会者 error");
                });
                this.dialogFormVisible = false;
            },

            /*************** 添加与会者 end ***************/

			/*************** 视频设置 begin ***********/
			//视频设置 dialog
			settingVideo(){
              this.setVideoFormVisible = true;
			},
			// 确定视频设置
			submitSettingVideo(){
                let _this=this;
                axios.post('/conference-control/screen/update/'+_this.conferenceData.cid,_this.setVideoForm)
                    .then(function(res){
                        if(res.data.code==200){
                            _this.setVideoFormVisible = false;
                            setTimeout(function(){
                                _this.$notify({
                                    title: '成功',
                                    message: '视频设置成功',
                                    type: 'success'
                                });
                            },1000);
                        }
                    }).catch(function(err){
                    console.log("确定视频设置 error");
                });
			},
			//获取分屏标识
			getLayoutFn(data){
                console.log(data);
			    let _this=this;
                _this.setVideoForm.layout=data;
			},
			// 设置轮询列表 dialog
            setPollingFn(){
			    let _this=this;
                _this.pollingFormVisible=_this.setVideoForm.setPollingList;

            },
			// 确定轮询列表
            submitPolling(){
                let _this=this;
                _this.pollingFormVisible=false;
                console.log(_this.pollingForm);
			},
			/*************** 视频设置 end ***************/


            /*************** 发送字幕 begin ***********/
            // 发送字幕dialog
            sendSubtitle() {
                this.subtitleForm = {};
                this.subStatus=!this.subStatus;
                if(this.subStatus){
                    this.subtitleFormVisible = true;
				}
            },
			/*************** 发送字幕 end ***************/


			// 批量呼叫离线与会者
			batchCallFn(){
			    let _this=this;
                axios.post('/meeting-control/dialMore/'+_this.conferenceData.cid)
                    .then(function(res){
                        console.log(res);
                        if(res.data.code==200){
                            setTimeout(function(){
                                _this.$notify({
                                    title: '成功',
                                    message: '呼叫成功',
                                    type: 'success'
                                });
                            },1000);
                        }
                    }).catch(function(err){
                    console.log("批量呼叫离线与会者 error");
                });
			},

			// 锁定会议
            lockFn() {
                let _this=this;
                _this.lockStatus=!_this.lockStatus;
                let lockUrl;
                if( _this.lockStatus){
                    lockUrl='/meeting-control/lock/'+_this.conferenceData.cid;
				}else{
                    lockUrl='/meeting-control/unlock/'+_this.conferenceData.cid;
				}
                axios.post(lockUrl)
                    .then(function(res){
                        console.log(res);
                        if(res.data.code==200){
                            setTimeout(function(){
                                _this.$notify({
                                    title: '成功',
                                    message: _this.lockStatus?'会议锁定成功':'会议解锁成功',
                                    type: 'success'
                                });
                            },1000);
                        }
                    }).catch(function(err){
                    console.log("锁定会议 error");
                });
			},

			// 参会者静音
            muteAllFn() {
                let _this=this;
                _this.muteAllStatus=!_this.muteAllStatus;
                let muteAllUrl;
                if( _this.muteAllStatus){
                    muteAllUrl='/meeting-control/mute-all/'+_this.conferenceData.cid;
                }else{
                    muteAllUrl='/meeting-control/unmute-all/'+_this.conferenceData.cid;
                }
                axios.post(muteAllUrl)
                    .then(function(res){
                        console.log(res);
                        if(res.data.code==200){
                            setTimeout(function(){
                                _this.$notify({
                                    title: '成功',
                                    message: _this.muteAllStatus?'参会者静音成功':'解除参会者静音成功',
                                    type: 'success'
                                });
                            },1000);
                        }
                    }).catch(function(err){
                    console.log("参会者静音 error");
                });
			},

			// 录制
            recordFn() {
                let _this=this;
                _this.recordStatus=!_this.recordStatus;
                let recordUrl;
                if( _this.recordStatus){
                    recordUrl='/meeting-control/start-recording/'+_this.conferenceData.cid;
                }else{
                    recordUrl='/meeting-control/stop-recording/'+_this.conferenceData.cid;
                }
                axios.post(recordUrl)
                    .then(function(res){
                        console.log(res);
                        if(res.data.code==200){
                            setTimeout(function(){
                                _this.$notify({
                                    title: '成功',
                                    message: _this.recordStatus?'开启录制成功':'关闭录制成功',
                                    type: 'success'
                                });
                            },1000);
                        }
                    }).catch(function(err){
                    console.log("录制 error");
                });
			},

			// 直播
			liveFn() {
                let _this=this;
                _this.liveStatus=!_this.liveStatus;
                let liveUrl;
                if( _this.liveStatus){
                    liveUrl='/meeting-control/start-live/'+_this.conferenceData.cid;
                }else{
                    liveUrl='/meeting-control/stop-live/'+_this.conferenceData.cid;
                }
                axios.post(liveUrl)
                    .then(function(res){
                        console.log(res);
                        if(res.data.code==200){
                            setTimeout(function(){
                                _this.$notify({
                                    title: '成功',
                                    message: _this.liveStatus?'开启直播成功':'关闭直播成功',
                                    type: 'success'
                                });
                            },1000);
                        }
                    }).catch(function(err){
                    console.log("录制 error");
                });
			},

			//结束会议
			endMeetingFn(){
                let _this=this;
                axios.post('/meeting-control/conference/disconnect/'+_this.conferenceData.cid)
                    .then(function(res){
                        console.log(res);

						_this.$confirm('是否确定结束会议?', '提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						}).then(() => {
							if(res.data.code==200) {
								_this.$eventBus.$emit('endmeeting', _this.conferenceData.conferenceId);
								_this.$notify({
									title: '成功',
									message: '会议结束成功',
									type: 'success'
								});
							}
						}).catch(() => {

						});

                    }).catch(function(err){
                    console.log("录制 error");
                });
			},

			//入会时静音
            enterMuteFn(){
                let _this=this;
                axios.post('/meeting-control/isMuted/'+_this.conferenceData.cid+'/'+_this.controlForm.isMute)
                    .then(function(res){
                        console.log(res);
                    }).catch(function(err){
                    console.log("入会时静音 error");
                });

			},

            /************ 在线与会者 表格操作 begin****************/
            //音频
            switchAudioFn(row){
                let userUrl;
                if(row.audioMute){
                    userUrl="/meeting-control/voice/open/"+row.conferenceIdentifier+"/"+row.participantIdentifier
				}else{
                    userUrl="/meeting-control/voice/close/"+row.conferenceIdentifier+"/"+row.participantIdentifier
				}
                axios.post(userUrl)
                    .then(function(res){
                        row.audioMute=!row.audioMute;
                    }).catch(function(err){
                    console.log("音频 error");
                });
			},
			//视频
            switchVideoFn(row){
                let userUrl;
                if(row.videoMute){
                    userUrl="/meeting-control/video/open/"+row.conferenceIdentifier+"/"+row.participantIdentifier
                }else{
                    userUrl="/meeting-control/video/close/"+row.conferenceIdentifier+"/"+row.participantIdentifier
                }
                axios.post(userUrl)
                    .then(function(res){
                        row.videoMute=!row.videoMute;
                    }).catch(function(err){
                    console.log("视频 error");
                });

            },
			//呼叫／挂断
            switchCallFn(row){
                let userUrl;
                if(row.call){
                    userUrl="/meeting-control/dial/disconnect"+row.conferenceIdentifier+"/"+row.participantIdentifier+"/"+row.userId
                }else{
                    userUrl="/meeting-control/dial/"+row.conferenceIdentifier+"/"+row.participantIdentifier+"/"+row.userId
                }
                axios.post(userUrl)
                    .then(function(res){
                        row.status=!row.status;
                    }).catch(function(err){
                    console.log("呼叫 error");
                });
            },
            //更多操作
            getMousePosFn(row){
                this.operationItem=row;
                let pos = this.util.getMousePos();
                this.mousePosData=pos;
            },
            /*************** 表格操作 end ***************/

            /* 查看会议日志 */
            showLogMsg(id){
                let _this=this;
                _this.isShowLog=!_this.isShowLog;
                if(_this.isShowLog){
                    _this.logRightPx = 0;
                    axios.get('/conference-log/'+id)
                        .then(
                            function(res){
                                let resData=res.data.data;
                                _this.logData=resData;
                            }
                        ).catch(
                        function(err){ console.log("查看会议日志 error"); }
                    );
				}else{
                    _this.logRightPx = -360;
				}
			}
		}
  	}
</script>

<style scoped>
	.el-table{
		border: none;
	}
	.control-panel{
		background: #fff;
		padding: 10px;
	}
	.meeting-msg{
		padding: 20px 0;
		margin: 0 5px;
		/*border-bottom: 1px solid #999;*/
		box-shadow:0 3px 2px #eee ;
	}
	.meeting-msg .msg-span{
		padding-right: 30px;
		display: inline-block;
	}
	.meeting-update{
		text-align: center;
		margin: 20px 0;
	}
	.control-icon{
		font-size: 42px;
		margin: 8px;
		color: #46AECC;
		cursor: pointer;
	}

	.addAttend-right{
		margin: 0 10px;
	}
	.addAttend-content{
		padding: 5px;
		border:1px solid #46aecc;
		border-radius: 5px;
		height: 280px;
		overflow-y: auto;
	}

	.room-content{
		margin-left: -40px;
	}
	.room-list{
		padding-left: 20px;
	}
	.room-list:nth-child(odd){background:#dfe2e8;}
	/* 会控操作 弹出层 */
	.operation-ul{
		display: inline-block;
		padding: 10px;
		background: rgba(0, 0, 0, 0.64);
		color: #fff;
		border-radius: 5px;
		position: absolute;
		top:0;
		left: 0;
	}
	.operation-ul>li{
		cursor: pointer;
	}

	/*会议超时*/
	.meeting-timeout{
		/*margin: 10px 32%;*/
		min-height: 300px;
	}
	.timeout-bg{
		/* width: 150px; */
		height: 22px;
		border-radius: 5px;
		background-color: #FA4546;
		position: relative;
		/* margin: 60px 32%; */
	}
	.timeout-bg p{
		/* line-height: 150px; */
		color: #fff;
		font-size: 12px;
		padding: 2px 5px;
	}
	.circle,.circle2{
		 width: 100%;
		height: 22px;
		border-radius: 5px;
		border: 6px solid #E35858;
		position: absolute;
	}
	.circle{
		opacity: 0.8;
		animation: scaleout 1.8s infinite ease-in-out;
		-webkit-animation: scaleout 1.8s infinite ease-in-out;
		-moz-animation: scaleout 1.8s infinite ease-in-out;
		-o-animation: scaleout 1.8s infinite ease-in-out;
	}
	.circle2{
		opacity: 1;
		animation: scaleout 2s infinite ease-in-out;
		-webkit-animation: scaleout 2s infinite ease-in-out;
		-moz-animation: scaleout 2s infinite ease-in-out;
		-o-animation: scaleout 2s infinite ease-in-out;
	}
	@keyframes scaleout {
		0% {
			transform: scale(0.95);
			-webkit-transform: scale(0.95);
			-moz-transform: scale(0.95);
			-o-transform:  scale(0.95);
		}50% {
			 transform: scale(1.0);
			 -webkit-transform: scale(1.0);
			 -moz-transform:scale(1.0);
			 -o-transform: scale(1.0);
		 }100% {
			  transform: scale(1.3);
			  -webkit-transform: scale(1.3);
			  -moz-transform: scale(1.3);
			  -o-transform: scale(1.3);
			  opacity: 0;
		  }
	}
	@-webkit-keyframes scaleout {
		0% {
			transform: scale(0.95);
			-webkit-transform: scale(0.95);
			-moz-transform: scale(0.95);
			-o-transform:  scale(0.95);
		}50% {
			 transform: scale(1.0);
			 -webkit-transform: scale(1.0);
			 -moz-transform:scale(1.0);
			 -o-transform: scale(1.0);
		 }100% {
			  transform: scale(1.3);
			  -webkit-transform: scale(1.3);
			  -moz-transform: scale(1.3);
			  -o-transform: scale(1.3);
			  opacity: 0;
		  }
	}
	@-moz-keyframes  scaleout {
		0% {
			transform: scale(0.95);
			-webkit-transform: scale(0.95);
			-moz-transform: scale(0.95);
			-o-transform:  scale(0.95);
		}50% {
			 transform: scale(1.0);
			 -webkit-transform: scale(1.0);
			 -moz-transform:scale(1.0);
			 -o-transform: scale(1.0);
		 }100% {
			  transform: scale(1.3);
			  -webkit-transform: scale(1.3);
			  -moz-transform: scale(1.3);
			  -o-transform: scale(1.3);
			  opacity: 0;
		  }
	}
	/* 会议日志 */
	.meeting-log{
		position: absolute;
		right: -360px;
		/*bottom: -40px;*/
		display: inline-block;
	}
	.meeting-record{
		min-width: 350px;

		display: inline-block;
		padding: 10px;
		background: rgba(0, 0, 0, 0.64);
		color: #fff;
		border-radius: 5px;
	}
	.meetingRecord-txt{
		position: absolute;
		left: -56px;
		background: #46AECC;
		padding: 8px 10px 8px 20px;
		border-bottom-left-radius: 20px;
		border-top-left-radius: 20px;
	}
	.record-content{
		max-height: 350px;
		overflow-y: auto;
	}
	.record-time{
		color: #46AECC;
	}

</style>
