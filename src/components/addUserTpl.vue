<template>

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

    <el-form :model="dialogForm" ref="dialogForm">
        <el-row>
            <el-col :span="7">
                <el-form-item>
                    <el-input v-model="dialogForm.searchName" auto-complete="off" placeholder="请输入关键字搜索"></el-input>
                </el-form-item>
                <!-- 参会者 -->
                <el-form-item v-show="userType=='user'">
                    <div class="tree-menu">
                        <ul v-for="menuItem in theUserListModel">
                            <li>
                                <div>
                                 <span @click="toggle()" >
                                     <i v-if="isFolder" class="fa" :class="[open ? 'fa-caret-down': 'fa-caret-right']"></i>
                                     <input type="checkbox" v-if="hasCheckbox" @click.stop="selTree(model)" :id="'tree'+model.userId" :class="'group'+menuUserId" v-bind:name="model.userName"/>
                                      <i v-if="isFolder" class="fa color-poly" :class="[open ? 'fa-folder-open': 'fa-folder']"></i>
                                       <i v-if="!isFolder" class="fa color-gray fa-user"></i>
                                        {{ model.userName }}
                                 </span>
                                </div>
                            </li>

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
</template>
<script>
    import axios from 'axios'
    import axiosApi from '../common/axiosApi'
    export default {
        name: 'treeMenu',
        props: ['model','selectKeys'],
        data() {
            return {
                open: false,
//               isFolder: true
                chooseListData:[],
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
            }
        },
        computed: {
            isFolder: function() {
                return this.model.children && this.model.children.length
            },
            chooseUser: {
                get: function(){
                    var Selected;
                    if (this.children && this.children.length > 0) {
                        Selected=true;
                    }else {
                        Selected = false;
                    }
                    return Selected;

                },
                set: function (value) {
                    var Selected;
                    if (this.children && this.children.length > 0) {
                        Selected=value;
                    }else {
                        Selected = value;
                    }
                    console.log(value);
                    return Selected;
                }
            }
        },

        methods: {
            toggle: function() {
                if (this.isFolder) {
                    this.open = !this.open
                }
            },
            // 根据id获取menu对象
            getMeunById (id, allMenuList) {
                var menu = {}
                if (allMenuList.userId === id) { // 一级菜单
                    menu = allMenuList
                } else if (allMenuList.children && allMenuList.children.length) { // 二级菜单
                    for (let i = 0; i < allMenuList.children.length; i++) {
                        if (allMenuList.children[i].userId === id) {
                            menu = allMenuList.children[i]
                            break
                        } else if (allMenuList.children[i].children && allMenuList.children[i].children.length) { // 三级
                            for (let j = 0; j < allMenuList.children[i].children.length; j++) {
                                if (allMenuList.children[i].children[j].userId === id) {
                                    menu = allMenuList.children[i].children[j]
                                    break
                                }
                            }
                        }
                    }
                }
                return menu
            },
            getAllKeys () {
                var keys = [];
                var objArr;
                var objs = $('.group' + this.menuUserId + ':checked')
                for (let i = 0; i < objs.length; i++) {
                    let id = objs[i].id;
                    let name = objs[i].name;
                    id = id.substring(4);
                    objArr={"realName":name,"userId":id};
                    if(!isNaN(parseInt(id))){
                        //keys.push((id - 0)) // 保存选中菜单id
                        keys.push(objArr);
                    }

                }
                return keys
            },
            // checkbox点击事件
            selTree(model){
                var obj = $('#tree' + model.userId)[0]; // checkbox DOM对象
                var objArr;
                objArr={"realName":model.userName,"userId":model.userId};
                if (obj.checked) { // 选中
                    // 若存在下级，下级全部选中
                    if (model.children && model.children.length) {
                        this.subMenusOp(model.children, 1)
                    }
                    // 若存在上级,确认是否需要选中上级CheckBox
                    if (model.supMenuId !== 0) {
                        this.supMenusOp(model.supMenuId, 1)
                    }

                } else { // 取消
                    // 若存在下级，下级全部取消
                    if (model.children && model.children.length) {
                        this.subMenusOp(model.children, 0)
                    }
                    // 若存在上级，确认是否需要取消上级CheckBox
                    if (model.supMenuId !== 0) {
                        this.supMenusOp(model.supMenuId, 0)
                    }
                    //this.chooseListData.splice(this.chooseListData.indexOf(objArr),1);
                }
                this.getAllKeys();
                console.log("allKey==="+this.getAllKeys());
                this.chooseListData=this.getAllKeys();
                //console.log(this.chooseListData);
                this.$eventBus.$emit('getUser', this.chooseListData);
                //this.$emit('getUser',this.chooseListData);
            },
            // 下级菜单操作 flag=1为选中,flag=0为取消
            subMenusOp (childNode, flag) {
                var obj;
                for (let i = 0; i < childNode.length; i++) {
                    var menu = childNode[i];
                    var id = menu.userId;
                    var name = menu.userName;
                    obj={"realName":name,"userId":id};
                    if (flag === 1) { // 选中
                        $('#tree' + id)[0].checked = true;
                    } else { // 取消
                        $('#tree' + id)[0].checked = false;
                        //this.chooseListData.splice(this.chooseListData.indexOf(obj),1);
                    }
                    if (menu.children && menu.children.length) {
                        this.subMenusOp(menu.children, flag)
                    }
                }
            },
            // 上级菜单操作（选中:flag=1,取消:flag=0）
            supMenusOp (id, flag) {
                var menu = this.getMeunById(id, this.menuList)
                if (menu.children && menu.children.length) {
                    var childLength = menu.children.length // 直接子级个数
                    var selectCount = 0
                    for (let i = 0; i < childLength; i++) {
                        let id1 = menu.children[i].userId
                        if ($('#tree' + id1)[0].checked) {
                            selectCount++
                        }
                    }
                    if (flag === 1) { // 选中
                        if (childLength === selectCount) {
                            $('#tree' + id)[0].checked = true
                            if (menu.supMenuId !== 0) {
                                this.supMenusOp(menu.supMenuId, flag)
                            }
                        }
                    } else if (flag === 0) {
                        if (childLength !== selectCount) {
                            $('#tree' + id)[0].checked = false
                            if (menu.supMenuId !== 0) {
                                this.supMenusOp(menu.supMenuId, flag)
                            }
                        }
                    }
                }
            },
            // 计算所有下级节点是否全部选中，是返回true，否返回false
            isAllSel (childNodes, selectKeys) {
                var nodeKeys = [] // 选中的id集合
                this.addKeys(childNodes, selectKeys, nodeKeys)
                var allKeys = []
                this.getNodesCount(childNodes, allKeys)
                if (nodeKeys.length === allKeys.length) {
                    return true
                } else {
                    return false
                }
            },
            // 计算childNodes下选中的id集合
            addKeys (childNodes, selectKeys, Arrs) {
                for (let i = 0; i < childNodes.length; i++) {
                    if (selectKeys.indexOf(childNodes[i].userId) >= 0) {
                        Arrs.push(childNodes[i].userId)
                    }
                    if (childNodes[i].children && childNodes[i].children.length) {
                        this.addKeys(childNodes[i].children, selectKeys, Arrs)
                    }
                }
            },
            // 计算childNodes的子级数
            getNodesCount (childNodes, allKeys) {
                for (let i = 0; i < childNodes.length; i++) {
                    allKeys.push(childNodes[i].userId)
                    if (childNodes[i].children && childNodes[i].children.length) {
                        this.getNodesCount(childNodes[i].children, allKeys)
                    }
                }
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
        },
        mounted () {
            this.$nextTick(function () {
                this.getUserListData();//获取与会者（用户，会议室）列表
            })
            // 禁止复选框的冒泡事件
            $("input[type='checkbox']").click(function (e) {
                e.stopPropagation()
            });
            // 选中菜单使能
            if (this.selectKeys instanceof Array && this.selectKeys.length > 0 && this.selectKeys.indexOf(this.model.userId) >= 0) {
                if (this.model.children && this.model.children.length) { // 包含子级,一级菜单除外
                    // 计算所有子节点是否全部选中
                    if (this.isAllSel(this.model.children, this.selectKeys)) {
                        $('#tree' + this.model.userId)[0].checked = true
                    }
                } else {
                    $('#tree' + this.model.userId)[0].checked = true
                }
            }
        }
    }
</script>

<style>
    .blk_border{
        border:1px solid #d1dbe5;
        padding-bottom: 15px;
    }
    .blk_border ul{
        padding-left: 15px;
    }
    ul {
        list-style: none;
    }

    .tree-menu li {
        line-height: 1.5;
    }
    li.btnCls {
        float: left;
        margin-right: 10px;
    }
    li.menuCls {
        clear: both;
        line-height:30px;
    }
    .checkCls {
        vertical-align: middle;
    }
    .el-tabs__content{
        color:#48576A;
    }
</style>