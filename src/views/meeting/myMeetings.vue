<template>
	<div>
		<el-tabs v-model="editableTabsValue" type="card" closable @tab-remove="removeTab">
		  <el-tab-pane v-for="(item,index) in editableTabs" :key="item.name" :label="item.title" :name="item.name">
			  <div>
				  <component :is='item.content' :meetingId="meetingId" keep-alive></component>
			  </div>
		  </el-tab-pane>
		</el-tabs>
		<!--<div><meetings></meetings></div>-->
	</div>
</template>

<script>
	import util from '../../common/util'
	import NProgress from 'nprogress'
    import meetingControl from '../../components/meeting/meetingControl.vue'//会议管理-会议控制
    import allMeetings from '../../components/meeting/allMeetings.vue'//会议管理-所有会议
  export default {
	  components:{
		  'control': meetingControl,
		  'meetings':allMeetings
	  },

    data() {
      return {
          currentView: "meetings",
		//tab标签页数据
		editableTabsValue: '111',
		editableTabs: [{
		  	title: '所有会议',
		  	name: '111',
			content:'meetings'
		}],
		tabIndex: 1,
		meetingId:'',
		listLoading:false
	  }
    },
      created() {
          this.$eventBus.$on('addtab', this.creatTab);
          this.$eventBus.$on('getid', this.getId);
          this.$eventBus.$on('endmeeting',this.removeTab);//结束会议
      },
	  methods: {

//          tabToggle(tabText) {
//              alert(tabText);
//              this.currentView = tabText;
//          },
		  creatTab:function (data) {
              var _this=this;
              _this.editableTabsValue=data.name;
              _this.editableTabs.push(data);
              _this.editableTabs=_this.util.uniqueByName(_this.editableTabs);
              this.meetingId=data.name;
			  console.log(_this.editableTabs)
          },
          getId:function(id){
			  this.meetingId=id;
		  },
          removeTab(targetName) {
              //所有会议tab标签不删除
              if(targetName!='111'){
                  let _this=this;
                  let tabs = _this.editableTabs;
                  let activeName = _this.editableTabsValue;
                  if (activeName === targetName) {
                      tabs.forEach((tab, index) => {
                          if (tab.name === targetName) {
                              let nextTab = tabs[index + 1] || tabs[index - 1];
                              if (nextTab) {
                                  activeName = nextTab.name;
                              }
                          }
                      });
                  }
                  _this.editableTabsValue = activeName;
                  _this.editableTabs = tabs.filter(tab => tab.name !== targetName);
			  }

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

	/*会议日程 列表*/
	.schedule-list-box{
		padding: 10px;
		margin:10px 5px;
    border: 1px solid #d1dbe5;
    border-radius: 4px;
    background-color: #fff;
    overflow: hidden;
    /*box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);*/
		-moz-box-shadow:2px 2px 12px #666563;
		-webkit-box-shadow:2px 2px 12px #666563;
		box-shadow:2px 2px 12px #666563;
	}
	.list-left{
		border-right: 1px solid rgba(153, 153, 153, 0.34);
	}
	.list-left .list-header,
	.list-left .list-time{
		color: #2aa0c2;
	}
	.list-left>p{
		text-align: center;
	}
	.ongoing .list-header{
		color: #f00;
		font-size: 16px;
		font-weight: bold;
	}
	.ongoing .list-time{
		color: #000;
	}
	.list-center{
		padding: 0 10px;
	}
	.list-center .list-header{
		font-size: 16px;
		font-weight: bold;
	}

	.list-detail{
		padding: 0 10px;
		border-top: 1px dashed #999;
	}
</style>
