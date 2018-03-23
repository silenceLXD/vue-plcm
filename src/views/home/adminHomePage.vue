<template>
    <section>
      <!--<button class="polycom-btn" v-on:click="getData">查询</button>-->
      <!--<button class="polycom-border-btn">查询</button>-->
        <el-row class="chart">
          <el-col :span="8">
            <el-card class="box-card">
              <div class="card-title">会议状态<a href="#/myMeetings" class="fa fa-angle-right color-red pull-right"></a></div>
              <div style="height: 180px;padding: 10px 0;">
                <el-col :span="12" class="text-center">
                  <div class="home-bg oning-img"></div>
                  <p>进行中的会议（个）</p>
                  <p>{{status.conferenceCount}}</p>
                </el-col>
                <el-col :span="12" class="text-center">
                  <div class="home-bg attend-img"></div>
                  <p>在线参会方数</p>
                  <p>{{status.participantCount}}</p>
                </el-col>
              </div>
            </el-card>
          </el-col>

          <el-col :span="8">
            <el-card class="box-card">
              <div class="card-title">终端分布</div>
              <div id="chartBar" style="width:100%; height:180px;"></div>
              </el-card>
          </el-col>

          <el-col :span="8">
            <el-card class="box-card">
              <div class="card-title">终端状态<a href="#/endpointManagement" class="fa fa-angle-right color-red pull-right"></a></div>
              <el-col :span="13">
                <div id="chartPie" style="width:100%; height:180px;"></div>
              </el-col>
              <el-col :span="11">
                  <ul class="chartPie-li">
                    <li><i class="fa icon-poly-call"></i> 通话中 <span>{{endpointInfoData.inCall}}</span></li>
                    <li><i class="fa icon-poly-on-line"></i> 在线 <span>{{endpointInfoData.onLine}}</span></li>
                    <li><i class="fa icon-poly-off-line"></i> 离线 <span>{{endpointInfoData.offLine}}</span></li>
                  </ul>
              </el-col>

            </el-card>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="16">
            <el-card class="box-card">
              <div class="card-title">设备状态<a href="#/terminalManage" class="fa fa-angle-right color-red pull-right"></a></div>
              <table class="unborder-table">
                <col width="13%" />
                <col width="13%" />
                <col width="13%" />
                <col width="30%" />
                <col width="30%" />
                <thead>
                  <tr>
                    <th>名称</th>
                    <th>站点</th>
                    <th>状态</th>
                    <th>视频端口</th>
                    <th>音频端口</th>
                  </tr>
                </thead>
                <tbody>
                    <tr v-for="dma in deviceStatusData.dma">
                      <td>{{dma.name}}</td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr v-for="mcu in deviceStatusData.mcu">
                      <td>{{mcu.name}}</td>
                      <td>{{mcu.site}}</td>
                      <td>
                        <span v-if="mcu.status=='IN_SERVICE'">在线</span>
                        <span v-if="mcu.status=='UNKNOWN'">未知</span>
                        <span v-if="mcu.status=='BUSY_OUT'">忙碌</span>
                        <span v-if="mcu.status=='OUT_OF_SERVICE'">离线</span>
                      </td>
                      <td>
                        <div class="gradient-line">
                          <span class="gradient-txt">{{mcu.usedVideoPorts}}/{{mcu.totalVideoPorts}}</span>
                          <span class="line-step" :style="{left:mcu.usedVideoPorts/mcu.totalVideoPorts*100+'%'}"></span>
                        </div>
                      </td>
                      <td>
                        <div class="gradient-line">
                          <span class="gradient-txt">{{mcu.usedAudioPorts}}/{{mcu.totalAudioPorts}}</span>
                          <span class="line-step" :style="{left:mcu.usedAudioPorts/mcu.totalAudioPorts*100+'%'}"></span>
                        </div>
                      </td>
                    </tr>
                </tbody>
              </table>
              </el-card>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-card class="box-card">
              <div class="card-title">今日会议<a href="#/myMeetings" class="fa fa-angle-right color-red pull-right"></a></div>

              <div class="about-meeting">
                <div class="legend-square">
                  <div class="legend">
                    <span class="square square-jishi"></span> 即时会议
                  </div>
                  <div class="legend">
                    <span class="square square-yuyue"></span> 预约会议
                  </div>
                </div>

                <div class="gantt-box">
                  <div class="gantt-bg">
                    <!-- 带时间刻度条的背景 -->
                    <div class="gantt-bg2">
                      <!-- repeat背景 -->
                      <div class="rows" v-for="relate in relateMeAppoint">
                        <span v-for="spanli in relate" :class="spanli.type==0?'square-jishi':'square-yuyue'" :style="{ width:spanli.period/60+'px', left:spanli.startTimeLong/60 +'px'}" :title="spanli.name">{{spanli.name}}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </el-card>
          </el-col>
        </el-row>

    </section>
</template>

<script>
    import echarts from 'echarts'
    import axios from 'axios'
    import axiosApi from '../../common/axiosApi'
    export default{
        data (){
            return {
                chartBar:null,
                chartPie:null,
                endpointStatusData:[],//终端分布数据
                colorData:[],
                endpointInfoData:'',//终端状态数据
                endpointPercent:null,
                deviceStatusData:'',//设备状态数据
                //今日会议 数据
                relateMeAppoint:[],
                //会议状态
                status:{
                    conferenceCount:0,
                    participantCount:0
                }
            }
        },
        methods: {
            /* 终端分布 饼状图*/
            drawChartBarFn(id){
                this.chartBar = echarts.init(document.getElementById(id));
                var that=this;
                var barobj={};

                var colorArr=['#46AECC','#94A4F7','#D099FE','#B7A2DF','#FFA899','#63C5C9','#6AA7DE','#F0B885','#CD8082','#8F99B1','#CE72A8','#90726E','#9DB460','#F7D571','#74B566','#49A0A3','#B9D379','#EF7E5B','#F3B367','#8BD192'];

                /* 获取终端分布数据 */
                axios.get('/endpoint-status/distribution/position')
                    .then(
                        function(res){
                            let resData=res.data.data;
                            for (var i=0;i<resData.length;i++){
                                barobj={"value":resData[i].value,"name":resData[i].name};
                                that.endpointStatusData.push(barobj);
                            }
                            //that.colorData = that.util.getRandomNum(colorArr,5);
                            that.chartBar.setOption(option);
                        }
                    ).catch(
                    function(err){ console.log("error"); }
                );
                var option={
                    tooltip : {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c}"
                    },
                    color:['#46AECC','#94A4F7','#D099FE','#B7A2DF','#FFA899','#63C5C9','#6AA7DE','#F0B885','#CD8082','#8F99B1','#CE72A8','#90726E','#9DB460','#F7D571','#74B566','#49A0A3','#B9D379','#EF7E5B','#F3B367','#8BD192'],
                    series : [
                        {
                            name: '终端分布',
                            type: 'pie',
                            radius : '55%',
                            center: ['50%', '50%'],
                            data:this.endpointStatusData,
                            itemStyle: {
//                                emphasis: {
//                                    shadowBlur: 10,
//                                    shadowOffsetX: 0,
//                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
//                                },
                                normal: {
                                    label:{
                                        show: true,
                                        formatter: '{b} : {c}'
                                    }
                                },
                            }
                        }
                    ]
                };

            },
            /* 终端状态 pie图 */
            drawChartPieFn(id){
                this.chartPie = echarts.init(document.getElementById(id));
                var that=this;
                let options={
                    tooltip: {
                        formatter: "{a} <br/>{b} : {c}%"
                    },
                    series: [{
                        name: '',
                        type: 'gauge',
                        center: ['50%', '50%'], // 默认全局居中
                        radius: '80%',
                        axisLine: {
                            show: false,
                            lineStyle: { // 属性lineStyle控制线条样式
                                color: [
                                    [this.endpointPercent/100, '#46AECC'],
                                    [1, 'rgba(1, 147, 207, 0.3)']
                                ],
                                width: 10
                            }
                        },
                        splitLine: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        },
                        axisLabel: {
                            show: false
                        },
                        pointer: {
                            show: false,
                            length: '0',
                            width: '0'
                        },
                        detail: {
                            formatter: '{value}%',
                            offsetCenter: [0, '5%']
                        },
                        data: [{
                            value: this.endpointPercent,
                            label: {
                                textStyle: {
                                    fontSize: 12
                                }
                            }
                        }]
                    }]
                };
                /* 获取终端状态数据 */
                axios.get('/endpoint-info/status')
                    .then(
                        function(res){
                            that.endpointInfoData=res.data.data;
                            let resData = res.data.data;
                            let fixdData=((resData.inCall+resData.onLine)/resData.count).toFixed(2);
                            that.endpointPercent=parseInt(fixdData*100);

                            options.series[0].data[0].value = that.endpointPercent;
                            options.series[0].axisLine.lineStyle.color = [
                                [that.endpointPercent/100, '#46AECC'],
                                [1, 'rgba(1, 147, 207, 0.3)']
                            ];
                            that.chartPie.setOption(options,true);
                        }
                    ).catch(
                    function(err){ console.log("error"); }
                );

            },

            /* 获取会议状态数据*/
            getConferenceStatusData(){
                let _this=this;
                axios.get('/conference/status')
                    .then(
                        function(res){
//                        console.log(res.data.data);
                        }
                    ).catch(
                    function(err){ console.log("error"); }
                );
            },
            /* 获取设备状态数据 */
            getDeviceStatusData(){
              let _this=this;
                axios.get('/device/status')
                    .then(
                        function(res){
//                        console.log(res.data.data);
                            _this.deviceStatusData=res.data.data;
                        }
                    ).catch(
                    function(err){ console.log("error"); }
                );
            },
            /* 获取今日会议数据 */
            getDateInfoData(){
                let _this=this;
                axios.get('/conference/date/info')
                    .then(
                        function(res){
//                        console.log(res.data.data);
                            _this.relateMeAppoint=res.data.data;
                        }
                    ).catch(
                    function(err){ console.log("error"); }
                );
            },
            /*系统状态-会议状态*/
            getStatus(){
                let _this=this;
                axios.get('/conference-status/status')
                    .then(
                        function(res){
                            console.log('status=============');
                            console.log(res.data.data);
                            //_this.relateMeAppoint=res.data.data;
                            _this.status.conferenceCount=res.data.data.conferenceCount;
                            _this.status.participantCount=res.data.data.participantCount;
                        }
                    ).catch(
                    function(err){ console.log(err); }
                );
            }
        },

        mounted:function(){
            this.$nextTick(function () {
                this.getConferenceStatusData();//获取会议状态数据
                this.getDeviceStatusData();//获取设备状态数据
                this.getDateInfoData();//获取今日会议数据
                this.drawChartBarFn('chartBar');
                this.drawChartPieFn('chartPie');
                this.getStatus();//获取会议状态
            });
      }

    }
</script>

<style scoped>
    .chart {
        width: 100%;
        float: left;
    }
    /*.chart div {
        height: 400px;
        float: left;
    }*/

    .el-col {
        padding: 10px;
    }
    .card-title{
      margin-bottom: 10px;
      font-weight: bold;
    }
    .card-title a{
      cursor: pointer;
      display: inline-block;
    }
    .chartPie-li{
      margin: 30px 0;
    }
    .chartPie-li li{
      color: #999999;
    }
    .chartPie-li li>i{
      color: #46aecc;
      font-size: 24px;
      vertical-align: middle;
      padding-right: ;
    }


  /*会议状态*/
  .home-bg{
    width: 70px;
    height: 70px;
    background-image: url("../../assets/images/poly-icon.png");
    margin: 0 auto;
  }
  .oning-img{
    background-position: 0 0;
  }
  .attend-img{
    background-position: 0 -70px;
  }

  /*设备状态 渐变条*/
  .gradient-line{
    width: 100px;
    height: 5px;
    display: inline-block;
    position: relative;
    background: #91D880;
    background: -moz-linear-gradient(left,  #91D880 0%, #EFE613 50%, #EE4F6A 100%);
    background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#91D880),color-stop(50%,#EFE613), color-stop(100%,#EE4F6A));
    background: -webkit-linear-gradient(left,  #91D880 0%, #EFE613 50%, #EE4F6A 100%);
    background: -o-linear-gradient(left,  #91D880 0%, #EFE613 50%, #EE4F6A 100%);
    background: -ms-linear-gradient(left,  #91D880 0%, #EFE613 50%, #EE4F6A 100%);
    background: linear-gradient(to right,  #91D880 0%, #EFE613 50%, #EE4F6A 100%);
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#91D880', endColorstr='#EE4F6A',GradientType=0 );
  }
  .line-step{
    position: absolute;
    width: 2px;
    height: 10px;
    display: inline-block;
    color: #2AA0C2;
    background: #2AA0C2;
    top: -3px;
    left: 0;
  }
  .gradient-txt{
    position: absolute;
    top: -20px;
    left: 0;
    font-size: 10px;
  }

    /* 今日会议 */
    .square{
      width: 20px;
      height: 12px;
      display: inline-block;
      margin-right: 10px;
    }
    .square-jishi{
      background-color: #FFA899 !important;
      border: transparent !important;
    }
    .square-yuyue{
      background-color: #D099FE !important;
      border: transparent !important;
    }
    .legend-square .legend{
      display: inline-block;
      margin-right: 30px;
    }

    .about-meeting{
      padding: 10px;
    }
    .gantt-box{
      overflow: auto;
      padding: 10px;
      height: 132px;
    }
    .gantt-bg{
      width: 1447px;
      height: 100%;
      padding: 14px 0;
      background: url("../../assets/images/gantt_bg.png") 0 0 no-repeat;
    }
    .gantt-bg2{
      position: relative;
      background:url("../../assets/images/ganrt_bg_repeat.png") repeat-y;
    }

    .gantt-bg2 span{
      display: inline-block;
      width: 100px;
      height: 26px;
      margin: 2px 0;
      position: absolute;
      border-left: 3px solid #F73434!important;
      /*background: #f00;*/
      font-size: 10px;
      line-height: 26px;
      overflow:hidden;
      color:#f3f3f3;
      cursor:pointer;
    }
    .rows{
      position: relative;
      height: 29px;
      top: 1px;
    }
</style>
