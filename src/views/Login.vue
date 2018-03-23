<template>
  <div class="login-bg">
    <h3 class="title"><img src="../assets/logo_white.png"></h3>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="left" label-width="0px" class="demo-ruleForm card-box loginform">
      <el-form-item prop="userName">
        <span class="login-icon fa icon-poly-login-user"></span>
        <input type="text" class="login-input" v-model="ruleForm.userName" auto-complete="off" placeholder="账号">
      </el-form-item>
      <el-form-item prop="password">
        <span class="login-icon fa icon-poly-login-lock"></span>
        <input type="password" class="login-input" v-model="ruleForm.password" auto-complete="off" placeholder="密码">
      </el-form-item>
      <el-checkbox v-model="checked" checked style="margin-bottom:25px;color: #fff;">记住密码</el-checkbox>
      <div class="color-red text-center">{{ submitErrorMsg }}</div>
      <el-form-item style="width:100%;">
        <el-button type="primary" style="width:100%; height:45px;" @click.native.prevent="handleSubmit">登 录</el-button>
        <!-- <el-button style="width:45%;" @click.native.prevent="handleReset2">重置</el-button> -->
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
//    import util from '../common/util'
    import axios from 'axios'
    import axiosApi from '../common/axiosApi'
  export default {
    data() {
      return {
        ruleForm: {
          userName: '',
          password: ''
        },
          submitErrorMsg:'',
        rules: {
            userName: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            //{ validator: validaePass }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            //{ validator: validaePass2 }
          ]
        },
        checked: true
      };
    },
    methods: {
      handleSubmit(ev) {
        var _this=this;
        _this.$router.replace('/adminHomePage');
         // let formData = new FormData($(this.$el).find(".loginform")[0]);
          var formData = JSON.stringify(this.ruleForm);
          this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            //_this.$router.push('/table');
              axios.post('/login',formData)
                  .then(
                      function(res){
                          let resData=res.data.data;
                          console.log(res)
                          if(resData == 100){
                              _this.submitErrorMsg='用户名为空';
                          }else if(resData == 101){
                              _this.submitErrorMsg='密码为空';
                          }else if(resData == 102){
                              _this.submitErrorMsg='用户名不存在';
                          }else if(resData == 103){
                              _this.submitErrorMsg='用户名密码错误';
                          }else if(resData == 200){
                              _this.submitErrorMsg='';
                              _this.util.setCookie("loginName",_this.ruleForm.userName);
                              _this.util.setCookie("sessionToken",res.data.msg);
                              _this.$router.replace('/adminHomePage');
                          }
                      }
                  ).catch(
                  function(err){
                  console.log("登陆error"); }
              );
          } else {
            console.log('error submit!!');
              _this.submitErrorMsg='';
            return false;
          }
        });
      }
    }
  }
</script>

<style scoped>
  .login-bg{
    margin: 120px auto;
  }
  .card-box {
    padding: 20px;
    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin-bottom: 20px;
    /*background-color: #F9FAFC;*/
    background-color: rgba(255, 255, 255, 0.16);
    margin: 30px auto;
    width: 320px;
    border: 1px solid #8492A6;
  }

  .title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #505458;
  }

  .loginform {
    width: 350px;
    padding: 35px 35px 15px 35px;
  }

  .login-input{
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background-color: transparent;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #bfcbd9;
    box-sizing: border-box;
    color: #fff;
    font-size: inherit;
    height: 40px;
    width: 100%;
    line-height: 1;
    outline: 0;
    padding: 3px 10px 3px 50px;
    transition: border-color .2s cubic-bezier(.645,.045,.355,1);
  }
  .login-icon{
    position: absolute;
    z-index: 2;
    font-size: 20px;
    top: 10px;
    left: 8px;
    color: #fff;
    border-right: 1px solid #fff;
    padding-right: 9px;
  }

</style>
