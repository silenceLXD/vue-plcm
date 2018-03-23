<template>
	<section class="content">
		<el-form :inline="true" :model="formInline">
			<el-row type="flex" class="row-bg toolbar" justify="space-between">
				<el-col :span="8">
					<!--<el-select v-model="value" placeholder="请选择">
						<el-option
								v-for="item in options"
								:key="item.value"
								:label="item.label"
								:value="item.value">
						</el-option>
					</el-select>-->
					<!--时间选择向前推六个月-->
					<forwardMonths :len="6" v-on:selectMonths="selectMonFn" style="width: 30%;"></forwardMonths>
				</el-col>
			</el-row>
		</el-form>

		<p>会议概览</p>
		<el-row>
			<el-col :span="8">
				<div class="item bg-blue">
					<el-col :span="9">
						<div class="overViewItem">
							<p>共召开会议：</p>
							<p>参会方数：</p>
							<p>合计消耗：</p>
							<p>平均每天消耗：</p>
						</div>
					</el-col>
					<el-col :span="7">
						<div class="overViewItem">
							<p>{{conferenceData.map.mapConfer.count+conferenceData.map.mapAppoint.count}} 场</p>
							<p>{{conferenceData.map.mapConfer.concurrenceCount+conferenceData.map.mapAppoint.concurrenceCount}}方</p>
							<p>{{conferenceData.map.mapConfer.consumeTime/60+conferenceData.map.mapAppoint.consumeTime/60}} 分钟</p>
							<p>{{averageTime}} 分钟</p>
						</div>
					</el-col>
					<el-col :span="8">
						<div class="iconStyle">
							<i class="fa icon-poly-sum-meeting"></i>
						</div>
					</el-col>
				</div>
			</el-col>
			<el-col :span="8">
				<div class="item bg-pink">
					<el-col :span="9">
						<div class="overViewItem">
							<p>即时会议：</p>
							<p>参会方数：</p>
							<p>消耗：</p>
						</div>
					</el-col>
					<el-col :span="7">
						<div class="overViewItem">
							<p>{{conferenceData.map.mapConfer.count}} 场</p>
							<p>{{conferenceData.map.mapConfer.concurrenceCount}}方</p>
							<p>{{conferenceData.map.mapConfer.consumeTime/60}} 分钟</p>
						</div>
					</el-col>
					<el-col :span="8">
						<div class="iconStyle">
							<i class="fa icon-poly-reservation-meeting"></i>
						</div>
					</el-col>
				</div>
			</el-col>
			<el-col :span="8">
				<div class="item bg-purple">
					<el-col :span="9">
						<div class="overViewItem">
							<p>预约会议：</p>
							<p>参会方数：</p>
							<p>消耗：</p>
						</div>
					</el-col>
					<el-col :span="7">
						<div class="overViewItem">
							<p>{{conferenceData.map.mapAppoint.count}} 场</p>
							<p>{{conferenceData.map.mapAppoint.concurrenceCount}}方</p>
							<p>{{conferenceData.map.mapAppoint.consumeTime/60}} 分钟</p>
						</div>
					</el-col>
					<el-col :span="8">
						<div class="iconStyle">
							<i class="fa icon-poly-immediately-meeting"></i>
						</div>
					</el-col>
				</div>
			</el-col>
		</el-row>

		<p>会议分析</p>
		<el-row>
			<el-col :span="12">
				<div class="item chartSheet">
					<h4 class="hTit">会议分布</h4>
					<div id="chartDistributed" style="width: 100%; height: 100%;"></div>
				</div>
			</el-col>
			<el-col :span="12">
				<div class="item chartSheet">
					<h4 class="hTit">消耗分钟数</h4>
					<div id="chartwWastage" style="width: 100%; height: 100%;"></div>
				</div>
			</el-col>
		</el-row>
		<el-row>
			<el-col :span="12">
				<div class="item chartSheet topSheet">
					<h4 class="hTit">站点会议排行Top5</h4>
					<el-col :span="12">
						<div>
							<div class="desc">
								<div class="clearfix tits">
									<span class="pull-left">会议数</span>
									<span class="pull-right">数量</span>
								</div>
								<div class="line"></div>
							</div>
							<div id="chartSites" style="width: 100%; height: 300px;"></div>
						</div>

					</el-col>
					<el-col :span="12">
						<div class="desc">
							<div class="clearfix tits">
								<span class="pull-left">消耗分钟数</span>
								<span class="pull-right">数量</span>
							</div>
							<div class="line"></div>
						</div>
						<div id="chartMinutes" style="width: 100%; height: 300px"></div>
					</el-col>
				</div>
			</el-col>
			<el-col :span="12">
				<div class="item chartSheet topSheet">
					<h4 class="hTit">用户会议排行Top5</h4>
					<el-col :span="12">
						<div>
							<div class="desc">
								<div class="clearfix tits">
									<span class="pull-left">会议数</span>
									<span class="pull-right">数量</span>
								</div>
								<div class="line"></div>
							</div>
							<div id="userSites" style="width: 100%; height: 300px;"></div>
						</div>

					</el-col>
					<el-col :span="12">
						<div class="desc">
							<div class="clearfix tits">
								<span class="pull-left">消耗分钟数</span>
								<span class="pull-right">数量</span>
							</div>
							<div class="line"></div>
						</div>
						<div id="userMinutes" style="width: 100%; height: 300px"></div>
					</el-col>
				</div>
			</el-col>
		</el-row>

	</section>
</template>

<script>
    import util from '../../common/util'
    import NProgress from 'nprogress'
    import echarts from 'echarts'
    import axios from 'axios'
    import axiosApi from '../../common/axiosApi'
    import forwardMonths from  '../../components/forwardMonths.vue'
	function preMonth(){
        var date=new Date();
        var year=date.getFullYear();
        var mon=date.getMonth()+1;
        if(mon<10){
			mon='0'+mon;
		}
		var str=year+'-'+mon;
        return str;
	}
    export default {
        components: {
            forwardMonths
        },
        data() {
            return {
                value:'',
                datetime:preMonth(),
				conferenceData:{
                    map:{
                        mapAppoint:{},
                        mapConfer:{}
					},
                    mapList:{
                        listDay:{},
                        listTime:{},
					},
                    stationMap:{
                        mapSite:{},
                        mapTime:{}
					},
                    userMap:{
                        userCount:{},
                        userTime:{}
					}
				},
                averageTime:0,/*
                chartDistributed:null,*/
            }
        },
        methods: {
            //获取数据
            getData:function(cb){
                var _this=this;
                axios.get('/conference-overview/'+this.datetime)
                    .then(
                        function(res){
                            //console.log(res.data.data);
                            _this.conferenceData=res.data.data;
                            var date=new Date();
                            var year=date.getFullYear();
                            var mon=date.getMonth();
                            var d = new Date(year,mon+1,0);
                            _this.averageTime=((_this.conferenceData.map.mapAppoint.consumeTime/60+_this.conferenceData.map.mapConfer.consumeTime/60)/d.getDate()).toFixed(2);

                            /*渲染图表*/
                            //会议分布
                            var listTimeCount=[];
                            for(var i=0;i<_this.conferenceData.mapList.listTime.length;i++){
                                listTimeCount.push(_this.conferenceData.mapList.listTime[i].count);
                            }

							var stationMap={};
							/*站点排行*/
                            //站点分布
							var mapSiteYData=[];
							var mapSiteValuesData=[];
							if(_this.conferenceData.stationMap.mapSite.length>5){
                                for(var i=0;i<5;i++){
                                    mapSiteYData.unshift(_this.conferenceData.stationMap.mapSite[i].site);
                                    mapSiteValuesData.unshift({'name':_this.conferenceData.stationMap.mapSite[i].count,'value':_this.conferenceData.stationMap.mapSite[i].count});
                                }
							}else{
                                for(var i=0;i<_this.conferenceData.stationMap.mapSite.length;i++){
                                    mapSiteYData.unshift(_this.conferenceData.stationMap.mapSite[i].site);
                                    mapSiteValuesData.unshift({'name':_this.conferenceData.stationMap.mapSite[i].count,'value':_this.conferenceData.stationMap.mapSite[i].count});
                                }
							}

							//消耗分钟数
                            var mapTimeYData=[];
                            var mapTimeValuesData=[];
                            if(_this.conferenceData.stationMap.mapTime.length>5){
                                for(var i=0;i<5;i++){
                                    mapTimeYData.unshift(_this.conferenceData.stationMap.mapTime[i].site);
                                    mapTimeValuesData.unshift({'name':_this.conferenceData.stationMap.mapTime[i].count,'value':_this.conferenceData.stationMap.mapTime[i].count});
                                }
							}else{
                                for(var i=0;i<_this.conferenceData.stationMap.mapTime.length;i++){
                                    mapTimeYData.unshift(_this.conferenceData.stationMap.mapTime[i].site);
                                    mapTimeValuesData.unshift({'name':_this.conferenceData.stationMap.mapTime[i].count,'value':_this.conferenceData.stationMap.mapTime[i].count});
                                }
							}

                            /*用户排行*/
                            //会议数
                            var userCountYData=[];
                            var userCountValuesData=[];
                            if(_this.conferenceData.userMap.userCount.length>5){
                                for(var i=0;i<5;i++){
                                    userCountYData.unshift(_this.conferenceData.userMap.userCount[i].real_name);
                                    userCountValuesData.unshift({'name':_this.conferenceData.userMap.userCount[i].count,'value':_this.conferenceData.userMap.userCount[i].count});
                                }
							}else{
                                for(var i=0;i<_this.conferenceData.userMap.userCount.length;i++){
                                    userCountYData.unshift(_this.conferenceData.userMap.userCount[i].real_name);
                                    userCountValuesData.unshift({'name':_this.conferenceData.userMap.userCount[i].count,'value':_this.conferenceData.userMap.userCount[i].count});
								}

                            }
                            //消耗分钟数
                            var userTimeYData=[];
                            var userTimeValuesData=[];
                            if(_this.conferenceData.userMap.userTime.length>5){
                                for(var i=0;i<5;i++){
                                    userTimeYData.unshift(_this.conferenceData.userMap.userTime[i].real_name);
                                    userTimeValuesData.unshift({'name':_this.conferenceData.userMap.userTime[i].count,'value':_this.conferenceData.userMap.userTime[i].count});
                                }
							}else{
                                for(var i=0;i<_this.conferenceData.userMap.userTime.length;i++){
                                    userTimeYData.unshift(_this.conferenceData.userMap.userTime[i].real_name);
                                    userTimeValuesData.unshift({'name':_this.conferenceData.userMap.userTime[i].count,'value':_this.conferenceData.userMap.userTime[i].count});
                                }
							}
                            //会议分析-消耗分钟数
                            var listDayCount={'data':[],'time':[]};
                            for(var i=0;i<_this.conferenceData.mapList.listDay.length;i++){
                                listDayCount['data'].push(_this.conferenceData.mapList.listDay[i].consumeTime);
                            }
                            var year=_this.datetime.split('-')[0];
                            var month=_this.datetime.split('-')[1];
                            var d= new Date(year, month, 0);
                            var days=d.getDate();
                            for(var i=1;i<=days;i++){
                                listDayCount['time'].push(i);
							}
                            console.log(listDayCount);
                            stationMap['mapSite']={'id':'chartSites','yData':mapSiteYData,'color':'#B7A2DF','valuesData':mapSiteValuesData};
                            stationMap['mapTime']={'id':'chartMinutes','yData':mapTimeYData,'color':'#94A4F7','valuesData':mapTimeValuesData};
                            stationMap['userCount']={'id':'userSites','yData':userCountYData,'color':'#B7A2DF','valuesData':userCountValuesData};
                            stationMap['userTime']={'id':'userMinutes','yData':userTimeYData,'color':'#94A4F7','valuesData':userTimeValuesData};
                            stationMap['listDayCount']=listDayCount;
                            _this.listFn(listTimeCount,stationMap);

                        }
                    ).catch(
                    function(err){ console.log(err); }
                );
			},
			//下拉选择月份
			selectMonFn:function(value){
                this.datetime=value;
                this.getData();
            },
            listFn:function(listTime,stationMap){
				//会议分布
				this.chartDistributed = echarts.init(document.getElementById('chartDistributed'));
				this.chartDistributed.setOption({
					/*title : {
						text: '会议分布',
						subtext: ''
					},*/
					tooltip : {
						trigger: 'axis'
					},
					color:["#46AECC"],
					calculable : true,
					xAxis : [
						{
							type : 'category',
							boundaryGap : false,
							data : ['0:00','1:00','2:00','3:00','4:00','5:00','6:00','7:00','8:00','9:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00']

						}
					],
					yAxis : [
						{
							type : 'value',
							axisLabel : {
								formatter: '{value}'
							}
						}
					],
					series : [
						{
							name:'会议数（个）',
							type:'line',
							data:listTime,
						}
					],
					grid: {
						left: '2%',
						top: '2%',
						containLabel: true
					}
				});

                //消耗分钟数图表
                this.chartwWastage = echarts.init(document.getElementById('chartwWastage'));
                this.chartwWastage.setOption({
                    /*title : {
                        text: '消耗分钟数',
                        subtext: ''
                    },*/
                    tooltip : {
                        trigger: 'axis'
                    },
                    color:["#46AECC"],
                    calculable : true,
                    xAxis : [
                        {
                            type : 'category',
                            boundaryGap : false,
                            data : stationMap.listDayCount.time
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value',
                            axisLabel : {
                                formatter: '{value}'
                            }
                        }
                    ],
                    series : [
                        {
                            name:'会议数（个）',
                            type:'line',
                            data:stationMap.listDayCount.data,
                        }
                    ],
                    grid: {
                        left: '2%',
                        top: '2%',
                        containLabel: true
                    }
                });

                //站点会议排行图表
                var _this=this;
                function rankChart(data){
                    _this.chartSites = echarts.init(document.getElementById(data.id));
                    _this.chartSites.setOption({
                        "tooltip": {
                            "trigger": "axis",
                            "axisPointer": { // 坐标轴指示器，坐标轴触发有效
                                "type": "shadow" // 默认为直线，可选为："line" | "shadow"
                            }
                        },
                        "grid": {
                            "left": "3%",
                            "right": "10%",
                            "bottom": "3%",
                            "containLabel": true
                        },
                        "yAxis": [{
                            "type": "category",
                            "data":data.yData ,
                            "axisLine": {
                                "show": false
                            },
                            "axisTick": {
                                "show": false,
                                "alignWithLabel": true
                            },
                            "axisLabel": {
                                "textStyle": {
                                    "color": "#333"
                                }
                            }
                        }],
                        "xAxis": [{
                            "type": "value",
                            "axisLine": {
                                "show": false
                            },
                            "axisTick": {
                                "show": false
                            },
                            "axisLabel": {
                                "show": false
                            },
                            "splitLine": {
                                "show": false
                            }
                        }],
                        grid: {
                            left: '2%',
                            top: '2%',
                            containLabel: true
                        },
                        "series": [{
                            "name": "应用使用率",
                            "type": "bar",
                            "data": data.valuesData,
                            "barCategoryGap": "35%",
                            "label": {
                                "normal": {
                                    "show": true,
                                    "position": "right",
                                    "formatter": function(params) {
                                        return params.data.name;
                                    },
                                    "textStyle": {
                                        "color": "#333" //color of value
                                    }
                                }
                            },
                            "itemStyle": {
                                "normal": {
                                    "color":data.color
                                }
                            }
                        }]
                    });
                }
                //console.log(stationMap.mapSite);
                var sitesData={"id":stationMap.mapSite.id,"yData":stationMap.mapSite.yData,"color":stationMap.mapSite.color,
                    "valuesData":stationMap.mapSite.valuesData};
                rankChart(sitesData);
                var minutesData={"id":stationMap.mapTime.id,"yData":stationMap.mapTime.yData,"color":stationMap.mapTime.color,
                    "valuesData":stationMap.mapTime.valuesData};
                rankChart(minutesData);
                var userSites={"id":stationMap.userCount.id,"yData":stationMap.userCount.yData,"color":stationMap.userCount.color,
                    "valuesData":stationMap.userCount.valuesData};
                rankChart(userSites);
                var userMinutesData={"id":stationMap.userTime.id,"yData":stationMap.userTime.yData,"color":stationMap.userTime.color,
                    "valuesData":stationMap.userTime.valuesData};
                rankChart(userMinutesData);
			},
        },
        mounted:function(){
            this.getData(this.listFn);
        }
    }
</script>

<style scoped>
	.item{
		height: 160px;
		border-radius: 10px;
		color:#fff;
		width: 90%;
	}
	.bg-blue{
		background: #8ac3f8;
	}
	.bg-pink{
		background: #bc8def;
	}
	.bg-purple{
		background: #8892f3;
	}
	.overViewItem{
		padding: 8px 0 0 25px;
	}
	.iconStyle i{
		font-size: 60px;
		margin-top:50px;
		margin-left: 20px;
	}
	.chartSheet{
		height: 380px;
		background: #fff;
		margin: 10px 0;
	}
	.chartSheet{
		color: #333;
	}
	.hTit{
		padding: 10px 0 0 10px;
	}
	h1,h2,h3,h4,h5,h6{
		font-weight: normal;
	}
	.line{
		border-bottom:1px solid #ccc;
	}
	.desc{
		margin:0 10px;
	}
	.desc .tits{
		height:32px;
		color: #ccc;
	}
</style>