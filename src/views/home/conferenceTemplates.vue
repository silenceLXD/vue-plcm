<template>
	<section>
		<!--工具条-->
		<el-row type="flex" class="row-bg toolbar" justify="space-between">
			<el-col :span="8" class="">
				<el-button type="primary" @click="handleAdd">新建模版</el-button>
			</el-col>
			<el-col :span="4">
				<el-form :inline="true" :model="searchForm" class="demo-form-inline">
						<el-form-item>
							<el-input v-model="searchForm.searchInput" icon="search" placeholder="名称"></el-input>
						</el-form-item>
					</el-form>
				</el-col>
		</el-row>

		<!--列表-->
		<table class="table unborder-table">
			<thead>
			<tr>
				<th>名称</th>
				<th>描述</th>
				<th>线路速率</th>
				<th>操作</th>
			</tr>
			</thead>
			<tbody>
			<tr v-for="list in tableData">
				<td>{{list.name}}</td>
				<td>{{list.description}}</td>
				<td>{{list.plcmLineRate.lineRate | filterObj }}</td>
				<td>
					<a href="javascript:;" class="update-a" @click="handleEdit(list)">编辑</a>
					<a href="javascript:;" class="update-a" @click="handleDel(list)">删除</a>
				</td>
			</tr>
			</tbody>
		</table>

		<!--编辑界面-->
		<el-dialog :title="editFormTtile" size="small" v-model="editFormVisible" :close-on-click-modal="false">
			<div class="dialog-menu">
				<ul>
					<li v-for="(name,key,index) in tabmenu" v-on:click="toggleMenu(index)" v-bind:class="{menuactive:(tabIndexId==index)}">{{name}}</li>
				</ul>
			</div>
			<el-form :model="editForm" label-width="170px" :rules="editFormRules" ref="editForm">
				<!--基本设置-->
				<div v-show="tabIndexId==0">
					<el-form-item label="名称" prop="name">
						<el-input v-model="editForm.name" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="描述">
						<el-input v-model="editForm.description" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="线路速率">
						<el-select v-model="editForm.plcmLineRate.lineRate" placeholder="请选择">
							<el-option v-for="option in plcmLineRateData" v-bind:label="option.name" v-bind:value="option.value"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="会议模式" prop="conferenceMode">
						<el-select v-model="editForm.conferenceMode" placeholder="请选择">
							<el-option label="AVC only" value="AVC only"></el-option>
							<el-option label="SVC only" value="SVC only"></el-option>
							<el-option label="Mixed AVC and SVC(v8.0)" value="CP&Mixed AVC and SVC(v8.0)"></el-option>
							<!--<el-option label="CP" value="CP"></el-option>-->
							<!--<el-option label="VSW" value="VSW"></el-option>-->
							<!--<el-option label="仅限SVC" value="only SVC"></el-option>-->
							<!--<el-option label="CP和SVC" value="CP&SVC"></el-option>-->
						</el-select>
					</el-form-item>
					<el-form-item label="加密">
						<el-select v-model="editForm.encryption" placeholder="请选择">
							<el-option label="不加密" value="UNENCRYPTED_ONLY"></el-option>
							<el-option label="全部加密" value="ENCRYPTED_ONLY"></el-option>
							<el-option label="尽可能加密" value="ENCRYPTED_PREFERRED"></el-option>
						</el-select>
					</el-form-item>
					<div class="div-line"></div>
					<el-form-item prop="useCascading">
						<el-radio-group v-model="editForm.useCascading">
							<el-radio class="radio" label="1" value="1">带宽级联</el-radio>
							<el-radio class="radio" label="2" value="2">容量级联</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item>
						<el-checkbox v-model="editForm.lostPacketRecovery">丢包补偿（LPR和DBA）</el-checkbox>
					</el-form-item>
					<div class="div-line"></div>
					<div style="margin: 8px">
						<el-checkbox v-model="editForm.autoTerminate">自动结束</el-checkbox>
					</div>
					<el-form-item label="第一位与会者加入之前">
						<!--<el-checkbox v-model="editForm.linerate">第一位与会者加入之前 </el-checkbox>-->
						<el-input type="number" class="input50" v-model="editForm.firstJoin" max="30" min="1" v-bind:disabled="!editForm.autoTerminate"></el-input> 分
					</el-form-item>
					<el-form-item label="会议结束后">
						<!--<el-checkbox v-model="editForm.linerate">会议结束后 </el-checkbox>-->
						<el-input type="number" class="input50" v-model="editForm.atTheEnd" max="10" min="0" v-bind:disabled="!editForm.autoTerminate"></el-input> 分
					</el-form-item>
					<el-form-item>
						<el-radio-group v-model="editForm.lastParticipant">
							<el-radio class="radio" label="1" value="1" v-bind:disabled="!editForm.autoTerminate">最后一位与会者退出后</el-radio>
							<el-radio class="radio" label="2" value="2" v-bind:disabled="!editForm.autoTerminate">只剩最后一位与会者时</el-radio>
						</el-radio-group>
					</el-form-item>
					<!--<div class="div-line"></div>-->
					<!--<div style="margin: 8px">-->
						<!--<el-checkbox v-model="editForm.linerate">自动重拨</el-checkbox>-->
					<!--</div>-->
					<!--<el-form-item label="次数" prop="linerate">-->
						<!--<el-select v-model="editForm.linerate">-->
							<!--<el-option label="1" value="1"></el-option>-->
							<!--<el-option label="2" value="2"></el-option>-->
							<!--<el-option label="3" value="3"></el-option>-->
							<!--<el-option label="4" value="4"></el-option>-->
						<!--</el-select>-->
					<!--</el-form-item>-->
					<!--<el-form-item label="时间间隔" prop="desc">-->
						<!--<el-input v-model="editForm.desc" auto-complete="off" class="input195"></el-input>-->
						<!--<span>秒</span>-->
					<!--</el-form-item>-->
					<div class="div-line"></div>
					<el-form-item>
						<el-checkbox v-model="editForm.exclusiveContent">内容独占模式</el-checkbox>
					</el-form-item>
					<el-form-item>
						<el-checkbox v-model="editForm.enableFecc">启用FECC</el-checkbox>
					</el-form-item>
				</div>

				<!--视频质量-->
				<div v-show="tabIndexId==1">
					<div class="div-line">人物视频定义</div>
					<el-form-item label="视频质量">
						<el-select v-model="editForm.videoQuality">
							<el-option label="清晰" value="SHARPNESS"></el-option>
							<el-option label="运动" value="MOTION"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="最大分辨率">
						<el-select v-model="editForm.maxResolution">
							<el-option label="自动" value="0"></el-option>
							<el-option label="CIF" value="1"></el-option>
							<el-option label="SD" value="2"></el-option>
							<el-option label="HD 720" value="3"></el-option>
							<el-option label="HD 1080" value="4"></el-option>
						</el-select>
					</el-form-item>

					<div class="div-line">内容视频定义</div>
					<el-form-item label="内容设置">
						<el-select v-model="editForm.H239Settings" style="width: 220px;">
							<el-option label="Graphics" value="GRAPHICS"></el-option>
							<el-option label="HiResGraphics" value="HIRESGRAPHICS"></el-option>
							<el-option label="LiveVideo" value="LIVEVIDEO"></el-option>
							<el-option label="CustomizedContentRate" value="CUSTOMIZEDCONTENTRATE"></el-option>
						</el-select>
						<el-select v-model="editForm.H239SettingsKbps" v-if="editForm.H239Settings=='CUSTOMIZEDCONTENTRATE'" style="width: 100px;">
							<el-option label="0kbps" value="0kbps"></el-option>
							<el-option label="64kbps" value="64kbps"></el-option>
							<el-option label="128kbps" value="128kbps"></el-option>
							<el-option label="192kbps" value="192kbps"></el-option>
							<el-option label="256kbps" value="256kbps"></el-option>
							<el-option label="384kbps" value="384kbps"></el-option>
							<el-option label="512kbps" value="512kbps"></el-option>
							<el-option label="768kbps" value="768kbps"></el-option>
							<el-option label="1024kbps" value="1024kbps"></el-option>
							<el-option label="1152kbps" value="1152kbps"></el-option>
							<el-option label="1280kbps" value="1280kbps"></el-option>
						</el-select>

					</el-form-item>
					<el-form-item>
						<el-checkbox v-model="editForm.asSipContent">AS SIP内容</el-checkbox>
					</el-form-item>
					<div style="margin: 8px">
						<el-checkbox v-model="editForm.multipleResolution">多分辨率</el-checkbox>
					</div>
					<el-form-item label="编码转换为">
						<el-checkbox-group v-model="editForm.contentTranscoding">
							<el-checkbox value="1" label="1" name="contentTranscoding">H.264</el-checkbox>
							<el-checkbox value="2" label="2" name="contentTranscoding">H.263</el-checkbox>
							<el-checkbox value="3" label="3" name="contentTranscoding">H.264级联</el-checkbox>
						</el-checkbox-group>
					</el-form-item>
					<el-form-item label="内容协议">
						<el-select v-model="editForm.h239Protocol">
							<el-option label="H.263" value="H263"></el-option>
							<el-option label="H.263和H.264自动选择" value="H_264_DYNAMIC"></el-option>
							<el-option label="H.264级联优化" value="UP_TO_H264"></el-option>
							<el-option label="H.264HD" value="H_264_FIX"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="内容分辨率">
						<el-select v-model="editForm.contentResolution">
							<el-option label="720 5fps" value="H239_720_5FPS"></el-option>
							<el-option label="720 30fps" value="H239_720_30FPS"></el-option>
							<el-option label="1080 15fps" value="H239_1080_15FPS"></el-option>
						</el-select>
					</el-form-item>
					<el-checkbox v-model="editForm.notSupport239">对不支持H.239的终端发送双流时，用双流内容代替会场视频</el-checkbox>
				</div>

				<!--视频设置-->
				<div v-show="tabIndexId==2" style="padding-bottom: 80px;">
					<!--<el-form-item label="视频模式" prop="linerate">-->
						<!--<el-select v-model="editForm.linerate">-->
							<!--<el-option label="演讲者模式" value="1"></el-option>-->
							<!--<el-option label="语音激励模式" value="2"></el-option>-->
							<!--<el-option label="大会模式" value="3"></el-option>-->
						<!--</el-select>-->
					<!--</el-form-item>-->

					<el-form-item label="演讲者模式">
						<el-checkbox v-model="editForm.presentationMode"></el-checkbox>
					</el-form-item>
					<el-form-item label="相同分屏">
						<el-checkbox v-model="editForm.sameLayout" v-bind:disabled="editForm.presentationMode"></el-checkbox>
					</el-form-item>
					<el-form-item label="自动分屏">
						<el-checkbox v-model="editForm.autoLayout"></el-checkbox>
					</el-form-item>
					<el-form-item label="自动轮询时间间隔(s)">
						<el-select v-model="editForm.scanInterval">
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

					<el-row class="screen-box" v-bind:class="editForm.autoLayout?'disabled-div':''">
						<el-col :span="6" class="">
							<ul class="screen-side">
								<li>
									<span class="screen-title" @click="toggleScreen(1)">1</span>
									<div class="screen-icon" v-show="screenStatus==1">
										<span class="screen-icon-border" v-for="i in 1" @click="previewScreen(1,i)" v-bind:class="screenActive==i?'screen-icon-active':''">
											<i class="fa icon-poly-screen-11"></i>
										</span>
									</div>
								</li>
								<li>
									<span class="screen-title" @click="toggleScreen(2)">2</span>
									<div class="screen-icon" v-show="screenStatus==2">
										<span class="screen-icon-border" v-for="i in 5" @click="previewScreen(2,i)" v-bind:class="screenActive==i?'screen-icon-active':''">
											<i class="fa" v-bind:class="'icon-poly-screen-2'+i"></i>
										</span>
									</div>
								</li>
								<li>
									<span class="screen-title" @click="toggleScreen(3)">3</span>
									<div class="screen-icon" v-show="screenStatus==3">
										<span class="screen-icon-border"  v-for="i in 7" @click="previewScreen(3,i)" v-bind:class="screenActive==i?'screen-icon-active':''">
											<i class="fa" v-bind:class="'icon-poly-screen-3'+i"></i>
										</span>
									</div>
								</li>
								<li>
									<span class="screen-title" @click="toggleScreen(4)">4</span>
									<div class="screen-icon" v-show="screenStatus==4">
										<span class="screen-icon-border" v-for="i in 10" @click="previewScreen(4,i)" v-bind:class="screenActive==i?'screen-icon-active':''">
											<i class="fa" v-bind:class="'icon-poly-screen-4'+i"></i>
										</span>
									</div>
								</li>
								<li>
									<span class="screen-title" @click="toggleScreen(5)">5+</span>
									<div class="screen-icon" v-show="screenStatus==5">
										<span class="screen-icon-border" v-for="i in 5" @click="previewScreen(5,i)" v-bind:class="screenActive==i?'screen-icon-active':''">
											<i class="fa" v-bind:class="'icon-poly-screen-5'+i"></i>
										</span>
									</div>
								</li>
								<li>
									<span class="screen-title" @click="toggleScreen(9)">9</span>
									<div class="screen-icon" v-show="screenStatus==9">
										<span class="screen-icon-border" v-for="i in 5" @click="previewScreen(9,i)" v-bind:class="screenActive==i?'screen-icon-active':''">
											<i class="fa" v-bind:class="'icon-poly-screen-9'+i"></i>
										</span>
									</div>
								</li>
								<li>
									<span class="screen-title" @click="toggleScreen(10)">10+</span>
									<div class="screen-icon" v-show="screenStatus==10">
										<span class="screen-icon-border" v-for="i in 5" @click="previewScreen(10,i)" v-bind:class="screenActive==i?'screen-icon-active':''">
											<i class="fa" v-bind:class="'icon-poly-screen-10'+i"></i>
										</span>
									</div>
								</li>
								<li>
									<span class="screen-title" @click="toggleScreen(11)">覆盖</span>
									<div class="screen-icon" v-show="screenStatus==11">
										<span class="screen-icon-border" v-for="i in 4" @click="previewScreen(11,i)" v-bind:class="screenActive==i?'screen-icon-active':''">
											<i class="fa" v-bind:class="'icon-poly-screen-11'+i"></i>
										</span>

									</div>
								</li>
							</ul>
						</el-col>
						<el-col :span="18" class="screen-border">
							<div class="screen-content" v-bind:class="'box-parent-'+screenStatus+' box-child-'+screenActive">
								<div class="box" v-for="num in boxArr" v-bind:class="'box'+num">
									<el-select v-model="editForm.layout">
										<el-option label="轮询" value="0"></el-option>
									</el-select>
								</div>
							</div>
						</el-col>
					</el-row>
				</div>

				<!--音频设置-->
				<div v-show="tabIndexId==3" style="padding-bottom: 80px;">
					<el-form-item label="发言持续时间(秒)">
						<el-select v-model="editForm.speakerUpdateInterval">
							<el-option label="自动" value="_AUTO"></el-option>
							<el-option label="1.5" value="_150"></el-option>
							<el-option label="3" value="_300"></el-option>
							<el-option label="5" value="_500"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="自动静音噪音端点">
						<el-checkbox v-model="editForm.muteNoisyParties"></el-checkbox>
					</el-form-item>
					<el-form-item label="静音除演讲者的与会者">
						<el-checkbox v-model="editForm.muteAllButLecturer"></el-checkbox>
					</el-form-item>
				</div>

				<!--录制-->
				<div v-show="tabIndexId==4" style="padding-bottom: 80px;">
					<el-form-item label="录制">
						<el-select v-model="editForm.recordingType">
							<el-option label="不开启" value="DISABLED"></el-option>
							<el-option label="立即" value="IMMEDIATELY"></el-option>
							<el-option label="根据要求" value="UPON_REQUEST"></el-option>
						</el-select>
					</el-form-item>
					<!--<el-form-item label="启用录制记录" prop="linerate">-->
						<!--<el-checkbox v-model="editForm.linerate" value="1"></el-checkbox>-->
					<!--</el-form-item>-->
					<el-form-item label="录播系统地址">
						<el-input v-model="editForm.recordingLink" auto-complete="off"></el-input>
					</el-form-item>

					<el-form-item label="仅音频">
						<el-checkbox v-model="editForm.audioOnlyRecording"></el-checkbox>
					</el-form-item>
				</div>

				<!--外观及字幕设置-->
				<div v-show="tabIndexId==5">
					<el-row>
						<el-col :span="12">
							<div class="screen-img">
								<img src="../../assets/images/screen_1.png" v-bind:class="editForm.chooseImg=='1'?'img-border':''"  @click="chooseImgFn(1)" alt="">
								<!--<p>-->
									<!--<a href="javascript:;" class="polycom-btn"  style="padding:8px 70px">选 择</a>-->
								<!--</p>-->
							</div>
						</el-col>
						<el-col :span="12">
							<div class="screen-img">
								<img src="../../assets/images/screen_2.png" v-bind:class="editForm.chooseImg=='2'?'img-border':''" @click="chooseImgFn(2)" alt="">
								<!--<p>-->
									<!--<a href="javascript:;" class="polycom-btn"  style="padding:8px 70px">选 择</a>-->
								<!--</p>-->
							</div>
						</el-col>
					</el-row>
					<div style="margin: 8px">
						<el-checkbox v-model="editForm.isShowSubTitle">启用字幕</el-checkbox>
					</div>
					<el-form-item label="内容">
						<el-input v-model="editForm.subContent" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="字体大小">
						<!--<el-select v-model="editForm.subtitleFontSize">-->
							<!--<el-option label="10" value="10"></el-option>-->
							<!--<el-option label="20" value="20"></el-option>-->
						<!--</el-select>-->
						<el-input type="number" class="input80" v-model="editForm.subtitleFontSize" min="9" max="32"></el-input>
					</el-form-item>
					<el-form-item label="颜色">
						<!--<div class="block">-->
						<!--<el-color-picker v-model="editForm.subtitleColor" @active-change="changeColor"></el-color-picker>-->
						<!--</div>-->
						<el-select v-model="editForm.subtitleColor">
							<el-option
									v-for="item in subColorList"
									:key="item.value"
									label="AaBbCcDd"
									:value="item.value"
									:style="{'color':item.fontColor,'background':item.bgColor}">
							</el-option>
						</el-select>
					</el-form-item>

					<el-form-item label="显示重复(次)">
						<!--<el-select v-model="editForm.subtitleRepeat">-->
							<!--<el-option label="10" value="10"></el-option>-->
							<!--<el-option label="20" value="20"></el-option>-->
						<!--</el-select>-->
						<el-input type="number" class="input80" v-model="editForm.subtitleRepeat" min="1" max="99"></el-input>
					</el-form-item>

					<el-form-item label="垂直位置">
						<div class="block">
							<el-slider v-model="editForm.subtitleVerticalPosition" @change="changeTop"></el-slider>
						</div>
					</el-form-item>
					<el-form-item label="背景透明度">
						<el-slider v-model="editForm.subtitleOpacity"></el-slider>
					</el-form-item>
					<el-form-item label="显示速度">
						<!--<el-slider v-model="editForm.subtitleSpeed"></el-slider>-->
						<el-select v-model="editForm.subtitleSpeed">
							<el-option label="静止" value="static"></el-option>
							<el-option label="慢速" value="slow"></el-option>
							<el-option label="快速" value="fast"></el-option>
						</el-select>
					</el-form-item>

                        <div class="previewSubtitle">
                            <img src="../../assets/images/screen_1.png" alt="">
                            <p class="subtitle-txt" v-bind:style="{top: subTitleShowTop+'%'}">
                                <span v-bind:style="{ color: subTitleShowColor, fontSize: subTitleShowSize + 'px', opacity:subTitleShowOpacity}">{{editForm.subContent}}</span>
                            </p>
                        </div>

                    </div>


                </el-form>
                <div slot="footer" class="dialog-footer">
                    <button class="polycom-border-btn" v-on:click="editFormVisible = false">取 消</button>
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
                    //搜索
                    searchForm: {
                        searchInput:''
                    },
                    /* 编辑界面数据 */
                    editFormVisible: false,//编辑界面显是否显示
                    editFormTtile: '编辑模版',//编辑界面标题

                    editForm: {
                        /* 基本设置 */
                        id: 0,// id
                        name: '',//名称
                        description: '',//描述
                        plcmLineRate: {
                            lineRate:'',
                        },//线路速率
                        conferenceMode: '',//会议模式
                        encryption: '',//加密（select）
                        useCascading: '',//带宽级联／容量级联（radio）
                        lostPacketRecovery: '',//丢包补偿（checkbox）
                        autoTerminate: '',//自动结束（checkbox）
                        firstJoin: '',//第一位与会者加入之前
                        atTheEnd: '',//会议结束后
                        lastParticipant: '',//最后一位与会者退出后/只剩最后一位与会者时(radio)
                        exclusiveContent: '',//内容独占模式
                        enableFecc: '',//启用FECC

                        /* 视频质量 */
                        videoQuality: 'SHARPNESS',//视频质量
                        maxResolution: '0',//最大分辨率
                        H239Settings: 'GRAPHICS',//内容设置
                        H239SettingsKbps: '64kbps',//内容设置 kbps
                        multipleResolution: false,//多分辨率
                        asSipContent: false,//AS SIP内容（boolean）
                        h239Protocol: 'H263',//内容协议
                        contentResolution: 'H239_720_5FPS',//内容分辨率
                        contentTranscoding: ['1', '2'],//编码转换为 H264/H263/H264级联
                        notSupport239:'',//对不支持239的终端发送双流

                        /* 视频设置 */
                        presentationMode: false,//演讲者模式
                        sameLayout: false,//相同分屏
                        autoLayout: true,//自动分屏
                        scanInterval: '10',//自动轮询时间间隔
                        layout: [],//分屏设置

                        /* 音频设置 */
                        muteAllButLecturer: '',//静音除演讲者的与会者
                        muteNoisyParties: true,//自动静音噪音端点
                        speakerUpdateInterval: '_AUTO',//发言持续时间(秒)

                        /* 录制 */
                        recordingType: 'DISABLED',//开启录制
                        //enableRecordingIndication:'',//启用录制记录
                        audioOnlyRecording: false,//仅音频(boolean)
                        recordingLink: '',//录播系统地址

                        /* 外观及字幕设置 */
                        chooseImg:1,//字幕显示样式
                        isShowSubTitle:false,//是否启用字幕
                        subContent:'',//内容
                        subtitleFontSize:'',//字体大小
                        subtitleColor:'#46aecc',//字体颜色
                        subtitleRepeat:'',//显示重复(次)
                        subtitleVerticalPosition:0,//垂直位置
                        subtitleOpacity:0,//背景透明度
                        subtitleSpeed:'',//显示速度
                    },
                    /* 预览字幕显示样式 */
                    subTitleShowColor:'#46aecc',
                    subTitleShowSize:18,
                    subTitleShowTop:3,
                    subTitleShowOpacity:1,
                    subColorList:[ //字幕颜色备选参数
                        {"value":"Withe font on light blue background","fontColor":"#fff","bgColor":"#ADD8E6"},
                        {"value":"Withe font on black background","fontColor":"#fff","bgColor":"#000"},
                        {"value":"Withe font on grey background","fontColor":"#fff","bgColor":"#c0c0c0"},
                        {"value":"Withe font on red background","fontColor":"#fff","bgColor":"#f00"},
                        {"value":"Withe font on orange background","fontColor":"#fff","bgColor":"#FFA500"},

                        {"value":"Withe font on blue background","fontColor":"#fff","bgColor":"#00f"},
                        {"value":"Withe font on olive green background","fontColor":"#fff","bgColor":"#808000"},
                        {"value":"Withe font on green background","fontColor":"#fff","bgColor":"#0f0"},
                        {"value":"Withe font on purple background","fontColor":"#fff","bgColor":"#800080"},
                        {"value":"Red font on white background","fontColor":"#f00","bgColor":"#fff"},

                        {"value":"Withe font on dark brown background","fontColor":"#fff","bgColor":"#800"},
                        {"value":"Withe font on brown background","fontColor":"#fff","bgColor":"#9a7057"},
                        {"value":"Yellow font on black background","fontColor":"#ff0","bgColor":"#000"},
                        {"value":"Yellow font on dark blue background","fontColor":"#ff0","bgColor":"#000080"},
                        {"value":"Light blue font on black background","fontColor":"#ADD8E6","bgColor":"#000"},

                        {"value":"Blue font on white background","fontColor":"#00f","bgColor":"#000"},
                        {"value":"Green font on black background","fontColor":"#0f0","bgColor":"#000"},
                        {"value":"Grey green font on white background","fontColor":"#158522","bgColor":"#fff"},
                        {"value":"Black font on grey background","fontColor":"#000","bgColor":"#c0c0c0"},
                        {"value":"Black font on white background","fontColor":"#000","bgColor":"#fff"},
                    ],


                    //线路速率 备选参数
                    plcmLineRateData: [
                        {"name": "64kbps", "value": "LR_64"},
                        {"name": "96kbps", "value": "LR_96"},
                        {"name": "128kbps", "value": "LR_128"},
                        {"name": "192kbps", "value": "LR_192"},
                        { "name": "256kbps", "value": "LR_256"},
                        {"name": "320kbps", "value": "LR_320"},
                        {"name": "384kbps", "value": "LR_384"},
                        {"name": "512kbps", "value": "LR_512"},
                        {"name": "768kbps", "value": "LR_768"},
                        {"name": "832kbps", "value": "LR_832"},
                        {"name": "1024kbps", "value": "LR_1024"},
                        {"name": "1152kbps", "value": "LR_1152"},
                        {"name": "1280kbps", "value": "LR_1280"},
                        {"name": "1472kbps", "value": "LR_1472"},
                        {"name": "1536kbps", "value": "LR_1536"},
                        {"name": "1728kbps", "value": "LR_1728"},
                        {"name": "1920kbps", "value": "LR_1920"},
                        {"name": "2048kbps", "value": "LR_2048"},
                        {"name": "2560kbps", "value": "LR_2560"},
                        {"name": "3072kbps", "value": "LR_3072"},
                        {"name": "3584kbps", "value": "LR_3584"},
                        {"name": "4096kbps", "value": "LR_4096"}],
                    editLoading: false,
                    btnEditText: '确 定',
                    editFormRules: {
                        name: [
                            {required: true, message: '请输入名称', trigger: 'blur'},
                            { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
                        ],
                        description: [
                            { min: 0, max: 50, message: '长度在 0 到 50 个字符', trigger: 'blur' }
                        ],
                        plcmLineRate: [
                            {required: true, message: '请选择线路速率', trigger: 'change'}
                        ],
                        conferenceMode: [
                            {required: true, message: '请选择会议模式', trigger: 'change'}
                        ]

                    },
                    screenStatus: 1,//默认显示展开视频设置分屏
                    boxArr: [1],//默认右侧预览分屏为一分屏
                    screenActive:1,//默认选中第一种布局

                    tabIndexId: 0,
                    tabmenu: {"a": "基本设置", "b": "视频质量", "c": "视频设置", "d": "音频设置", "e": "录制", "g": "外观及字幕设置"},
                    /* 表格数据 */
                    tableData: [],
                    listLoading: false,

                }
              },
            mounted: function () {
                this.$nextTick(function () {
                    this.getTableData();
                    //this.getDefaultFormData();
                })
            },
            filters:{
                filterObj: function(value) {
                    //var data =value;
                    var data = value.substr(3);
                    return data+"kbps";
                }
            },
              methods: {

                //获取会议模版表格list
                getTableData: function () {
                    var _table=this;
                    axios.get('/conference-templates?keyWord='+_table.searchForm.searchInput)
                        .then(
                            function(res){
                                console.log("success");
    //                            console.log(res.data.data);
                                _table.tableData=res.data.data;
                            }
                        ).catch(
                        function(err){
                            console.log("error");
                        }
                    );
                },
                //获取会议模版表单初始化数据
                getDefaultFormData:function () {
                    var _self=this;
                    axios.get('/conference-template/default/parameters')
                        .then(
                            function(res){
                                console.log("success");
                                console.log(res.data.data);
                                _self.editForm=res.data.data;
                            }
                        ).catch(
                        function(err){
                            console.log("error");
                            _self.editForm=err.data.data;
                        }
                    );
    //                var url="http://172.18.4.40:8086/conference-template/default/parameters";
    //                $.ajax({
    //                    type: 'GET',
    //                    url: url,
    //                    dataType:'json',
    //                    success:function(data) {
    //                        // _self.newdata = JSON.stringify(data);
    //                        // _self.newdata=eval("(" + data +")");
    //                        console.log(_self.editForm);
    //                        _self.editForm=data.data;
    //                    }
    //                });
                },
                //显示新增界面
                handleAdd:function(){
                    //var _this=this;
                    this.tabIndexId=0;
                    this.editFormVisible=true;
                    this.editFormTtile='新建模版';
                    this.editForm.id=0;
                    this.getDefaultFormData();
                },
                //显示编辑界面
                handleEdit:function(row){
                    this.tabIndexId=0;
                    this.editFormVisible=true;
                    this.editFormTtile='编辑模版';
                    this.editForm=row;
                    console.log(row)
                },
                //编辑 or 新增
                editSubmit:function(){
                    var _this=this;
                    _this.$refs.editForm.validate((valid)=>{
                        if(valid){
                            _this.$confirm('确认提交吗？','提示',{}).then(()=>{
                                _this.editLoading=true;
                                NProgress.start();
                                _this.btnEditText='保存中';
                                setTimeout(function(){
                                    _this.editLoading=false;
                                    NProgress.done();
                                    _this.btnEditText='确 定';
                                    _this.$notify({
                                        title: '成功',
                                        message: '保存成功',
                                        type: 'success'
                                    });
                                    _this.editFormVisible = false;
                                    var formNewData = JSON.stringify(_this.editForm);
                                    if(!_this.editForm.conferenceTemplateIdentifier){
                                        //新增
                                        axios.post('/conference-template',formNewData)
                                            .then(
                                                function(res){
                                                    console.log("success");
                                                    console.log(res.data.data);
                                                }
                                            ).catch(
                                            function(err){
                                                console.log("新增／编辑模版 error");
                                            }
                                        );
                                    }else{
                                        //编辑
                                        axios.post('/conference-template/'+id,formNewData)
                                            .then(
                                                function(res){
                                                    console.log("success");
                                                    console.log(res.data.data);
                                                }
                                            ).catch(
                                            function(err){
                                                console.log("新增／编辑模版 error");
                                            }
                                        );
                                    }
                                },1000);

                            });

                            var formData = JSON.stringify(this.editForm);
                            console.log(formData);
                        }
                    });

                },
                //删除模板
                handleDel:function(row){
                    var _this=this;
                    let id=row.conferenceTemplateIdentifier;
                    this.$confirm('确认删除该模板吗?', '提示', {
                        //type: 'warning'
                    }).then(() => {
                        _this.listLoading=true;
                        NProgress.start();
                        axios.delete('/conference-template/'+id)
                            .then(
                                function(res){
                                    _this.listLoading=false;
                                    _this.getTableData();
                                    setTimeout(function(){
                                        NProgress.done();
                                        _this.$notify({
                                            title: '成功',
                                            message: '删除成功',
                                            type: 'success'
                                        });
                                    },1000)
                                }
                            ).catch(
                            function(err){
                                console.log("删除模版error");
                            }
                        );
                    }).catch(() => {

                    });
                },

                /* 切换 标签 */
                toggleMenu:function(index) {
                    this.tabIndexId=index;
                    //alert(this.thisactive);
                },
                //切换分屏
                toggleScreen:function (index) {
                    this.screenStatus=index;
                    this.screenActive=1;
                    if(index==1){
                        this.boxArr = [1];
                    }else if(index==2){
                        this.boxArr=[1214,1214];
                    }else if(index==3){
                        this.boxArr=[112,2,2];
                    }else if(index==4){
                        this.boxArr=[2,2,2,2];
                    }else if(index==5){
                        this.boxArr=[2323,3,3,3,3,3];
                    }else if(index==9){
                        this.boxArr=[3,3,3,3,3,3,3,3,3];
                    }else if(index==10){
                        this.boxArr=[4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4];
                    }else if(index==11){
                        this.boxArr=[112,112];
                    }

                },
                //预览分屏
                previewScreen:function (screen,num) {
                    this.screenActive=num;
                    if(screen==11){
                        if(num==1){
                            this.boxArr=[112,1312];
                        }else if(num==2){
                            this.boxArr=[112,2,2];
                        }else if(num==3){
                            this.boxArr=[112,1312,1312,1312];
                        }else if(num==4){
                            this.boxArr=[112,1312];
                        }
                    }else if(screen==10){
                        if(num==1){
                            this.boxArr=[4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4];
                        }else if(num==2){
                            this.boxArr=[5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5];
                        }else if(num==3){
                            this.boxArr=[4,4,4,4,4,2,4,4,4,4,4,4,4];
                        }else if(num==4){
                            this.boxArr=[1413,1413,1413,1413,1213,1213,1413,1413,1413,1413];
                        }else if(num==5){
                            this.boxArr=[1213,1213,1413,1413,1413,1413,1413,1413,1413,1413];
                        }
                    }else if(screen==9){
                        if(num==1){
                            this.boxArr=[3,3,3,3,3,3,3,3,3];
                        }else if(num==2){
                            this.boxArr=[1413,1413,1413,1413,113,1413,1413,1413,1413];
                        }else if(num==3){
                            this.boxArr=[1413,1413,1413,1413,1413,1413,1413,1413,113];
                        }else if(num==4){
                            this.boxArr=[113,1413,1413,1413,1413,1413,1413,1413,1413];
                        }else if(num==5){
                            this.boxArr=[1223,1413,1413,1413,1413,1413,1413,1413,1413];
                        }
                    }else if(screen==5){
                        if(num==1){
                            this.boxArr=[2323,3,3,3,3,3];
                        }else if(num==2){
                            this.boxArr=[121,1214,1214,1214,1214];
                        }else if(num==3){
                            this.boxArr=[1412,1412,1412,1412,112];
                        }else if(num==4){
                            this.boxArr=[112,1412,1412,1412,1412];
                        }else if(num==5){
                            this.boxArr=[3434,4,4,4,4,4,4,4];
                        }
                    }else if(screen==4){
                        if(num==1){
                            this.boxArr=[2,2,2,2];
                        }else if(num==2){
                            this.boxArr=[1312,1312,1312,112];
                        }else if(num==3){
                            this.boxArr=[121,1213,1213,1213];
                        }else if(num==4){
                            this.boxArr=[112,1312,1312,1312];
                        }else if(num==5){
                            this.boxArr=[1312,1312,1212,1212];
                        }else if(num==6){
                            this.boxArr=[1312,1312,1212,1212];
                        }else if(num==7){
                            this.boxArr=[1212,1212,1312,1312];
                        }else if(num==8){
                            this.boxArr=[1212,1212,1312,1312];
                        }else if(num==9){
                            this.boxArr=[1312,1312,1312,1312];
                        }else if(num==10){
                            this.boxArr=[1312,1312,1312,1312];
                        }
                    }else if(screen==3){
                        if(num==1){
                            this.boxArr=[112,2,2];
                        }else if(num==2){
                            this.boxArr=[2,2,112];
                        }else if(num==3){
                            this.boxArr=[121,2,2];
                        }else if(num==4){
                            this.boxArr=[1312,1312,112];
                        }else if(num==5){
                            this.boxArr=[1312,1312,112];
                        }else if(num==6){
                            this.boxArr=[112,1312,1312];
                        }else if(num==7){
                            this.boxArr=[112,1312,1312];
                        }
                    }else if(screen==2){
                        if(num==1){
                            this.boxArr=[1214,1214];
                        }else if(num==2){
                            this.boxArr=[1312,1312];
                        }else if(num==3){
                            this.boxArr=[112,112];
                        }else if(num==4){
                            this.boxArr=[121,121];
                        }else if(num==5){
                            this.boxArr=[1213,1213];
                        }
                    }else if(screen==1){
                        this.boxArr=[1];
                    }

                },

                //选择字幕样式
                chooseImgFn(num){
                    this.editForm.chooseImg=num;
                },
                //改变字幕颜色
                changeColor(){
                    this.subTitleShowColor=this.editForm.subtitleColor;
                },
                //改变字幕垂直位置
                changeTop(){
                    this.subTitleShowTop=this.editForm.subtitleVerticalPosition;
                }

            }
      }
    </script>

    <style scoped>
        .el-form-item{
            margin-bottom: 18px;
        }
        .screen-border{
            border:1px solid #46aecc;
            height: 100%;
            max-width: 510px;
        }
        .screen-box{
            height: 500px;
        }
        .screen-side{
            margin: 0;
        }
        .screen-box .screen-side>li{
            border:1px solid #46aecc;
            margin: 0 auto;
            padding: 5px 0;
            text-align: center;
            cursor: pointer;
        }
        .screen-title{
            padding: 5px;
            display: block;
        }
        .screen-icon{
            min-height: 50px;
            padding: 10px;
            margin-bottom: -6px;
            background: #f0f0f0;
            border: 1px solid #999;
            text-align: left;
        }
        .screen-icon>span{
            display: inline-block;
            padding: 3px;
            margin: 2px 0;
            border: 1px solid #46aecc;
        }
        /*.screen-icon-border{*/
            /*border: 1px solid #46aecc;*/
        /*}*/
        .screen-icon-active{
            border: 2px solid #EE4F6A!important;
        }
        .screen-icon>span>i.fa{
            font-size: 22px;
        }
        .screen-content{
            /*width: 450px;*/
            /*height: 450px;*/
            margin: 20px;
            /*max-width: 510px;*/
            /*border: 1px solid #000;*/
            text-align: center;
            position: relative;
        }
        .disabled-div{
            pointer-events: none;
            cursor: not-allowed;
            background: #f0f0f0;
        }
        /*视频设置预览分屏*/
        .box{
            display: inline-block;
            /*background: #daf4fa;*/
            border: 1px solid #46aecc;
            margin: 1px;
            float:left;
        }
        .box1{
            width: 450px;
            height: 450px;
        }
        .box2{
            width: 226px;
            height: 226px;
        }
        .box3{
            width: 150px;
            height: 150px;
        }
        .box4{
            width: 112px;
            height: 112px;
        }
        .box5{
            width: 90px;
            height: 112px;
        }
        /*1/4 1/3*/
        .box1413{
            width: 112px;
            height: 150px;
        }
        /*1 1/3*/
        .box113{
            width: 450px;
            height: 150px;
        }
        /*1/2 2/3*/
        .box1223{
            width: 225px;
            height: 300px;
        }
        /*1 1/2*/
        .box112{
            width: 450px;
            height: 225px;
        }
        /*1/4 1/2*/
        .box1412{
            width: 112px;
            height: 225px;
        }
        /*3/4 3/4*/
        .box3434{
            width: 340px;
            height: 340px;
        }
        /*2/3 2/3*/
        .box2323{
            width: 300px;
            height: 300px;
        }
        /*1/2 1*/
        .box121{
            width: 225px;
            height: 450px;
        }
        /*1/2 1/4*/
        .box1214{
            width: 225px;
            height: 112px;
            /*margin: 200px auto;*/
        }
        /*1/3 1/2*/
        .box1312{
            width: 150px;
            height: 225px;
        }
        /*1/2 1/3*/
        .box1213{
            width: 225px;
            height: 150px;
        }
        /*1/2 1/2*/
        .box1212{
            width: 225px;
            height: 225px;
        }
        .box-parent-2.box-child-1{
            margin: 0 25px;
        }
        .box-parent-2.box-child-1>.box{
            margin: 200px auto;
        }
        .box-parent-2.box-child-2>.box{
            margin: 3px 180px;
        }
        .box-parent-2.box-child-5>.box{
            margin: 180px auto;
        }

        .box-parent-3.box-child-5>.box,
        .box-parent-3.box-child-6>.box{
            float: right;
        }

        .box-parent-4.box-child-5>.box,
        .box-parent-4.box-child-7>.box,
        .box-parent-4.box-child-10>.box{
            float: right;
        }
        .box-parent-4.box-child-9>.box1312,
        .box-parent-4.box-child-10>.box1312{
            width: 170px;
        }

        .box-parent-10.box-child-3>.box:nth-child(10){
            position: absolute;
            left: 0;
            top:227px;
        }
        .box-parent-11.box-child-1>.box1312,
        .box-parent-11.box-child-4>.box1312{
            margin-left: 150px;
        }


        /* 字幕及外观设置 */
        .screen-img{
            text-align: center;
        }
        .screen-img>img{
            width: 50%;
        }
        .img-border{
            border: 4px solid #46aecc;
        }

        /*预览字幕*/
        .previewSubtitle{
            position: relative;
            margin-left: 100px;
            width: 250px;
            height: 200px;
        }
        .subtitle-txt{
            position: absolute;
            top: 0;
            left: 0;
            color: #fff;
            background: rgba(0, 0, 0, 0.35);
            padding: 0 5px;
            margin: 0;
            border-radius: 2px;
        }
    </style>
