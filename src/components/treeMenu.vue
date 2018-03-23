<template>
    <li>
        <span v-if="model.userId==undefined?false:true" :id="'tree'+model.userId" @click="toggle(),selUsers(model)">
            <i v-if="isFolder" class="fa" :class="[open ? 'fa-caret-down': 'fa-caret-right']"></i>
            <label :for="model.userId">
              <i v-if="isFolder" class="fa color-poly" :class="[open ? 'fa-folder-open': 'fa-folder']"></i>
              <i v-if="!isFolder" class="fa color-poly" :class="[open ? 'fa-folder-open': 'fa-folder']"></i>
                <!--<span :id="'tree'+model.userId" @click.stop="selUsers(model)"><i style="display: none">{{model.userId}}</i>{{ model.userName }}</span>-->
                {{ model.userName }}({{model.count}})
                <span style="display: none">{{model.userId}}</span>
            </label>
        </span>

        <!--<div>
            <input type="checkbox" v-model="chooseUser" :id="model.id"/>
            <span @click="toggle" >
                 <i v-if="isFolder" class="fa" :class="[open ? 'fa-caret-down': 'fa-caret-right']"></i>
                 <label :for="model.id">
                     <i v-if="isFolder" class="fa color-poly" :class="[open ? 'fa-folder-open': 'fa-folder']"></i>
                     <i v-if="!isFolder" class="fa color-gray fa-user"></i>
                     {{ model.menuName }}
                 </label>
             </span>
        </div>-->
        <ul v-show="open" v-if="isFolder">
            <tree-menu v-for="item in model.children" :model="item"></tree-menu>
        </ul>
    </li>
</template>

<script>
    /*import Vue from 'vue';
    import Bus from '../common/bus.js'*/
    export default {
        name: 'treeMenu',
        props: ['model'],
        data() {
            return {
                open: false,
                //isFolder: true
                _this:this
            }
        },
        computed: {
            isFolder: function() {
                return this.model.children && this.model.children.length
            }
        },

        methods: {
            toggle: function() {
                if (this.isFolder) {
                    this.open = !this.open
                }
            },

            selUsers:function(model){
                this.$eventBus.$emit('message', model);
            }
        },
        mounted () {
            // 禁止冒泡事件
            $("span").click(function (e) {
                e.stopPropagation()
            })
        }
    }
</script>

<style>
    /*ul {
        list-style: none;
    }*/

    .tree-menu li {
        line-height: 1.5;
        cursor: pointer;
    }
    .tree-menu span{
        cursor: pointer;
    }
</style>