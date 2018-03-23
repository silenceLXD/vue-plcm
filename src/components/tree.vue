<template>
    <li>
        <div>

             <span @click="toggle()" >
                 <i v-if="isFolder" class="fa" :class="[open ? 'fa-caret-down': 'fa-caret-right']"></i>
                 <input type="checkbox" v-if="hasCheckbox" @click.stop="selTree(model)" :id="'tree'+model.userId" :class="'group'+menuUserId" v-bind:name="model.userName" v-bind:data-apiid="model.apiUserId"/>

                     <i v-if="isFolder" class="fa color-poly" :class="[open ? 'fa-folder-open': 'fa-folder']"></i>
                     <i v-if="!isFolder" class="fa color-gray fa-user"></i>

                     {{ model.userName }}
             </span>
        </div>
        <ul v-show="open" v-if="isFolder">
            <tree-menu v-for="item in model.children" :model="item" :hasCheckbox="hasCheckbox" :menuList="menuList" :menuName="menuName" :menuUserId="menuUserId" :selectKeys="selectKeys"></tree-menu>
        </ul>
    </li>
</template>
<script>
    export default {
        name: 'treeMenu',
        props: ['model','menuList','menuName','menuUserId','selectKeys','hasCheckbox'],
        data() {
            return {
                open: false,
//               isFolder: true
                chooseListData:[]
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
                var objs = $('.group' + this.menuUserId + ':checked');
                for (let i = 0; i < objs.length; i++) {
                    let id = objs[i].id;
                    let name = objs[i].name;
                    let apiId = objs[i].getAttribute('data-apiid');
                    id = id.substring(4);
                    objArr={"realName":name,"userId":id,"apiUserId":apiId};
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
                objArr={"realName":model.userName,"userId":model.userId,"apiUserId":model.apiUserId};
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
                    let apiuserid = menu.apiUserId;
                    obj={"realName":name,"userId":id,"apiUserId":apiuserid};
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
            }
        },
        mounted () {
            // 禁止复选框的冒泡事件
            $("input[type='checkbox']").click(function (e) {
                e.stopPropagation()
            })
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

    .tree-menu li {
        line-height: 1.5;
        cursor: pointer;
    }
    .tree-menu ul{
        padding-left: 10px;
    }
</style>