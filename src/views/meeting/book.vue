<template>
    <section>
      <el-form :inline="true" ref="bookForm" :rules="bookFormRules" :model="bookForm" label-width="100px" class="demo-ruleForm">
        <el-card class="box-card">
          <el-row>
          <el-form-item label="会议名称：" prop="conferenceName">
                <el-input v-model="bookForm.conferenceName" placeholder="会议名称"></el-input>
            </el-form-item>
          </el-row>

          <el-row>
            <el-form-item label="会议类型：" prop="type">
              <!--<el-radio-group v-model="bookForm.type">-->
                <!--<el-radio label="立即" value="0"></el-radio>-->
                <!--<el-radio label="预约" value="1"></el-radio>-->
              <!--</el-radio-group>-->
              <el-radio class="radio" v-model="bookForm.type" label="0" value="0" v-bind:disabled="isDisabledType">即时</el-radio>
              <el-radio class="radio" v-model="bookForm.type" label="1" value="1" v-bind:disabled="isDisabledType">预约</el-radio>
            </el-form-item>
          </el-row>

          <el-row v-if="bookForm.type==='1'">
            <el-form-item label="开始时间：" prop="startTime">
              <el-col :span="10">
                <el-date-picker type="date" placeholder="选择日期" v-model="startDate" @change="setStartDate" :picker-options="pickerOptions" style="width: 95%;"></el-date-picker>
              </el-col>
              <el-col :span="4">
                <el-select v-model="startHours" @change="setStartTime" style="width: 90%;">
                  <el-option :label="hours" :value="hours" v-for="hours in startHoursArr"></el-option>
                </el-select>
              </el-col>
              <el-col :span="1">时</el-col>
              <el-col :span="4">
                <el-select v-model="startMinutes" @change="setStartTime" style="width: 90%;">
                  <el-option :label="minutes" :value="minutes" v-for="minutes in startminutesArr"></el-option>
                </el-select>
              </el-col>
              <el-col :span="1">分</el-col>
            </el-form-item>
          </el-row>
          <input type="hidden" v-model="bookForm.startTime">

          <el-row>
            <el-form-item label="会议时长：" prop="duration">
              <el-col :span="8">
                <el-input v-model="bookForm.duration" placeholder="" style="width: 100%;"></el-input>
              </el-col>
              <el-col :span="16"> 小时 <span class="color-ccc" style="width: 100%;"> 最小单位0.5小时</span></el-col>
               <!--<el-col :span="7"><span class="color-ccc" style="width: 100%;"> 最小单位0.5小时</span></el-col>-->
            </el-form-item>
          </el-row>
        </el-card>

        <el-card>
          <el-row>
              <el-form-item label="与 会 者：" prop="conferenceUsers">
                  <el-tag v-for="tag in bookForm.conferenceUsers" :key="tag.realName" :closable="true" type="primary" @close="deleteUser(tag)">{{tag.realName}}</el-tag>
                <el-tag v-for="tag in bookForm.conferenceRooms" :key="tag.realName" :closable="true" type="primary" @close="deleteRoom(tag)">{{tag.realName}}</el-tag>
                  <el-button class="button-new-tag" style="border-radius: 50%;" size="small" @click.native="addUsers()">+</el-button>
              </el-form-item>
          </el-row>

          <el-row>
            <el-form-item label="会议模版：" prop="conferenceTemplateIdentifier">
              <el-select v-model="bookForm.conferenceTemplateIdentifier">
                <el-option
                        v-for="tpl in templatesData"
                        :label="tpl.name"
                        :value="tpl.name">
                </el-option>
              </el-select>
            </el-form-item>
          </el-row>

          <el-row>
            <el-form-item label="会议密码：">
                <el-input v-model="bookForm.conferencePwd" placeholder=""></el-input>
            </el-form-item>
          </el-row>

          <el-row>
            <el-form-item label="主席密码：">
                <el-input v-model="bookForm.chairmanPwd" placeholder="" disabled></el-input>
            </el-form-item>
          </el-row>

          <el-row>
            <el-col :span="20">
              <el-form-item label="会议描述：">
                <el-input type="textarea" v-model="bookForm.description" :autosize="{ minRows: 2, maxRows: 10}" style="width: 200%;"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
      </el-card>
      <div style="text-align:center;">
        <el-button type="primary" class="polycom-btn" size="large" :loading="issubmit" @click="onSubmit" style="padding: 12px 80px;margin:20px auto;">提 交</el-button>
      </div>
      </el-form>

      <!-- 添加与会者 dialog-->
      <el-dialog title="添加与会者" size="small" v-model="dialogFormVisible" :close-on-click-modal="false">

        <el-row>
          <el-col :span="7">
            <el-radio-group v-model="userType" class="marginTB10">
              <el-radio-button label="user">用户</el-radio-button>
              <el-radio-button label="room">会议室</el-radio-button>
            </el-radio-group>
          </el-col>

          <el-col :span="16">
              <p class="pull-left">已添加（0）</p>
              <p class="pull-right"><a href="javascript:;" class="polycom-border-btn" @click="emptyAllUser"><i class="fa fa-trash"></i> 全部清空</a></p>
          </el-col>
        </el-row>

        <el-form :model="dialogForm" ref="dialogForm" id="dialogUsersForm">
          <el-row>
            <el-col :span="7">
              <el-form-item>
                <el-input v-model="dialogForm.searchName" auto-complete="off" placeholder="请输入关键字搜索"></el-input>
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
                  <el-tag v-for="tag in dialogForm.dialogConferenceUsers" :key="tag.userId" :closable="true" type="primary" @close="deleteUser(tag)">{{tag.realName}}</el-tag>
                  <el-tag v-for="tag in dialogForm.dialogConferenceRooms" :key="tag.userId" :closable="true" type="primary" @close="deleteRoom(tag)">{{tag.realName}}</el-tag>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
         </el-form>
         <span slot="footer" class="dialog-footer">
           <el-button @click.native="dialogFormVisible = false">取 消</el-button>
           <el-button type="primary" @click.native="handleAddUser()">添加</el-button>
         </span>
       </el-dialog>

    </section>
</template>
<script>
    import axios from 'axios'
    import axiosApi from '../../common/axiosApi'
    import myTree from '../../components/tree.vue'

export default {
    components: {
        myTree  //树形结构
    },
    data() {
        /* 自定义 验证规则 */
      var checkDuration = (rule, value, callback) => {
          if (!value) {
              return callback(new Error('请输入会议时长'));
          }
          var reg=/^\d+(\.\d+)?$/;
          if (!reg.test(value)) {
              callback(new Error('请输入数字'));
          } else {
              if (value % 0.5 != 0) {
                  callback(new Error('最少时长0.5小时'));
              } else {
                  callback();
              }
          }
      };
      return {
          /* 发起会议 表单初始化数据 */
          bookForm: {
              conferenceName: '',//会议名称
              type: '',//会议类型
              conferencePwd: '',//会议密码
              chairmanPwd: '',//主席密码
              startTime:'',//开始时间
              duration: '1',//会议时长
              description: '',//会议描述
              conferenceTemplateIdentifier:'',//会议模版
              conferenceUsers: {},//与会者-用户
              conferenceRooms: {},//与会者-会议室
          },
          isDisabledType:false,
          templatesData:[],//会议模版数据
          pickerOptions: {
              disabledDate(time) {
                  return time.getTime() < Date.now() - 8.64e7;
              }
          },
          /* 发起会议表单验证 */
          bookFormRules: {
              conferenceName: [
                  {required: true, message: '请输入会议名称', trigger: 'blur'},
                  { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
              ],
              type: [
                  {required: true, message: '请选择会议类型', trigger: 'change'},
              ],
              duration: [
                  {required: true, message: '请输入会议时长', trigger: 'blur'},
                  { validator: checkDuration, trigger: 'blur' }
              ],
              conferenceTemplateIdentifier: [
                  {required: true, message: '请选择会议模版', trigger: 'change'},
              ],
//              startTime: [
//                    {required: true, message: '请选择会议开始时间', trigger: 'change'}
//              ],
              conferenceUsers: [
                  {required: true, message: '请选择会议与会者', trigger: 'change'}
              ]

          },
          /* 添加与会者 dialog begin*/
          dialogFormVisible:false, //添加与会者dialog
          theUserListModel: [], //与会者列表数据
          theRoomListData: [],
          userType:'user',
          dialogForm:{
              conferenceName: '',
              searchName: '',
              dialogConferenceUsers: [],
              dialogConferenceRooms:[]
          },
          /* dialog end */

          /* 开始时间 */
          startDate: Date.now(),//当前日期
          startHours: new Date().getHours(),
          startMinutes:  new Date().getMinutes(),
          startHoursArr: ["00","01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23"],
          startminutesArr: ["00","10","20","30","40","50"]
      }
    },
    mounted: function () {
        this.$nextTick(function () {
            let oldId=this.$route.params.id;
            if(oldId){//如果存在id 则是编辑会议
                let url='/conference/'+oldId;
                this.getDefaultData(url);
                this.isDisabledType=true; //编辑会议时不可编辑会议类型
            }else{
                let url='/conference/start/default/param';
                this.getDefaultData(url);//初始化发起会议数据
            }
            this.getUserListData();//获取初始化与会者（用户，会议室）列表
            this.getTemplatesData();//获取初始化会议模版数据
        })
    },
    created() {
        this.$eventBus.$on('getUser', this.chooseUser);
    },
    methods: {
        //获取初始化 默认数据
        getDefaultData: function (url) {
            var _this=this;
            axios.get(url)
                .then(
                    function(res){
                        let resData=res.data.data;
                        _this.bookForm=resData;
                        _this.bookForm.conferenceName=resData.conferenceName;
                        _this.bookForm.type=resData.type+'';
                        _this.bookForm.duration=resData.duration+'';
                        _this.bookForm.conferencePwd=resData.conferencePwd;
                        _this.bookForm.startTime=resData.startTime;

                        if(resData.conferenceTemplateIdentifier){
                            _this.bookForm.conferenceTemplateIdentifier=resData.conferenceTemplateIdentifier;
                        }else{
                            _this.bookForm.conferenceTemplateIdentifier=_this.templatesData[0].name;
                        }

                        _this.startDate=resData.startTime.substring(0,10);
                        _this.startHours=resData.startTime.substring(10,13);
                        _this.startMinutes=resData.startTime.substring(14,16);

//                        _this.bookForm.conferenceUsers=resData.conferenceUsers;
                        console.log(res.data.data);
                    }
                ).catch(
                function(err){ console.log("error"); }
            );
        },
        setStartDate: function (val) {
            this.startDate=val;
            this.bookForm.startTime=this.startDate+" "+this.startHours+":"+this.startMinutes;
        },
        setStartTime: function () {
            this.bookForm.startTime=this.startDate+" "+this.startHours+":"+this.startMinutes;
        },
        //移除与会者
        deleteUser: function(tag) {
          this.dialogForm.dialogConferenceUsers.splice(this.dialogForm.dialogConferenceUsers.indexOf(tag),1);
          $('#tree' + tag.userId)[0].checked = false;
        },
        //移除会议室
        deleteRoom: function(tag) {
          this.dialogForm.dialogConferenceRooms.splice(this.dialogForm.dialogConferenceRooms.indexOf(tag),1);
          $(""+tag.userId).checked = false;
        },
        // 添加与会者（按钮）
        addUsers(){
          this.dialogFormVisible = true;
          //this.dialogForm = {};
        },
        // 确定添加与会者和会议室
        handleAddUser(){
            this.bookForm.conferenceUsers=this.dialogForm.dialogConferenceUsers;
            this.bookForm.conferenceRooms=this.dialogForm.dialogConferenceRooms;
            this.dialogFormVisible = false;
        },
        // 全部清空（已选参会者）
        emptyAllUser(){
            this.dialogForm.dialogConferenceUsers=[];
            this.dialogForm.dialogConferenceRooms=[];
            $(".tree-menu").children("input").checked=false;
        },
        // 提交会议
        onSubmit(){
            var _this=this;
            var formData = JSON.stringify(this.bookForm);
            console.log(formData);
            axios.post('/conference/start',formData)
              .then(function(res){
                  console.log(res);
                  if(res.data.code==200){
                      setTimeout(function(){
                          _this.$notify({
                              title: '成功',
                              message: '提交成功',
                              type: 'success'
                          });
                      },1000);
                      _this.$router.replace('/myMeetings');
                  }

              }).catch(function(err){
                  console.log("error");
              });
        },
        //获取与会者所有人员
        getUserListData(){
            var _list=this;
            axios.get('/conference/user-room/null/null')
                .then(
                    function(res){
                        _list.theUserListModel=res.data.data.users;
                        _list.theRoomListData=res.data.data.rooms;
                        console.log(_list.theUserListModel);
                    }
                ).catch(
                function(err){ console.log("error"); }
            );
        },
        //勾选与会者
        chooseUser(data){
            var _this=this;
            console.log(data);
            _this.dialogForm.dialogConferenceUsers=data
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
              _this.dialogForm.dialogConferenceRooms.push(obj)
          }else{
              _this.dialogForm.dialogConferenceRooms.splice(_this.dialogForm.dialogConferenceRooms.indexOf(obj),1);
          }
        },
        /* 获取会议模版 conference-templates?keyWord=*/
        getTemplatesData(){
            let _tpl=this;
            axios.get('/conference-templates?keyword=')
                .then(
                    function(res){
                        let resData=res.data.data;
                        _tpl.templatesData=resData;
                        //console.log(resData)
                    }
                ).catch(
                function(err){ console.log("error"); }
            );
        },
  }
}
</script>

<style scoped>
	a {
		text-decoration: none;
    color: #337ab7;
	}
  .color-ccc{
    color: #ccc;
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
</style>
