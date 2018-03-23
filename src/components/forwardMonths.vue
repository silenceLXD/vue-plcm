<template>
    <el-select v-model="form1.mon" placeholder="请选择" v-on:change="selectMon(form1.mon)">
        <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
        </el-option>
    </el-select>
</template>
<script>

    export default {
        name: 'forwardMonths',
        props: ['len'],
        data() {
            return {
                options:[],
                form1:{
                    mon:'',
                }
            }
        },
        methods: {
            selectMon(value){
                //console.log(value);
                this.$emit('selectMonths',value)
            }
        },
        mounted () {
            function getMonthList(len){
                var monList = [];
                var d = new Date();
                var currYear = d.getFullYear();
                var currMon = d.getMonth();  // 获取上一个月份数值，此处不需要+1
                for(var i = 0; i < len; i++){
                    if(currMon < 10){
                        //monList.push("" + currYear + "0" + currMon);
                        monList.push({value:currYear+'-0'+currMon,label:currYear+'年'+currMon+'月'});
                    }else{
                        //monList.push("" + currYear + "" + currMon);
                        monList.push({value:currYear+'-'+currMon,label:currYear+'年'+currMon+'月'});
                    }
                    currMon -= 1; // 获取上一个月份
                    if(currMon == 0){
                        currYear -= 1;
                        currMon = 12;
                    }
                }
                return monList;
            }
            this.options=getMonthList(this.len);
        }
    }
</script>

<style>

</style>