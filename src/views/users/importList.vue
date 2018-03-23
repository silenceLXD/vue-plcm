<template>
    <section>
        <div>
            <p style="margin-bottom:20px;">
                本次共导入<span>{{count}}</span>条数据
            </p>
        </div>
        <!--列表-->
        <table class="table unborder-table">
            <thead>
            <tr>
                <th>姓名</th>
                <th>用户名</th>
                <th>一级部门/分公司</th>
                <th>二级部门</th>
                <th>三级部门</th>
                <th>角色</th>
                <th>邮箱</th>
                <th>备注</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="list in tableData">
                <td>{{list.realName}}</td>
                <td>{{list.userName}}</td>
                <td>{{list.deptName}}</td>
                <td>{{list.subdeptName}}</td>
                <td>{{list.threedeptName}}</td>
                <td>{{list.roleName}}</td>
                <td>{{list.email}}</td>
                <td>{{list.email}}</td>
            </tr>
            </tbody>
        </table>
        <div>
            <a class="polycom-btn" @click="insertUser">保存</a>
            <a class="polycom-btn" @click="backUserManager">返回</a>
        </div>
    </section>
</template>

<script>
    import util from '../../common/util'
    import NProgress from 'nprogress'
    import axios from 'axios'

    export default {
        data() {
            return {
                //初始化表格数据
                tableData: [],
                count:0,
            }
        },
        mounted:function(){
            //渲染上传的表格数据
            var  routerParams = this.$route.params.list;
            this.tableData=routerParams;
            this.count=this.tableData.length;
            //验证导入数据是否正确
            axios.get('user/testdata/excel')
            .then(
                function(res){
                   //console.log(res);
                }
            ).catch(
            function(err){ console.log("error"); }
            );

        },
        methods: {
            //保存 确认长传
            insertUser:function(){
                axios.get('/user/insert/excel/-1')
                    .then(
                        function(res){
                            console.log(res);
                        }
                    ).catch(
                    function(err){ console.log("error"); }
                );
            },
            //返回
            backUserManager:function(){
                this.$router.push({path:'/userManager'});
            }
        }
    }
</script>