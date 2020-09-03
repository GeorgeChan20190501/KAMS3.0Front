<template>
   <div class="loginbg">
    <div class="loginBox">
        <div class="avatar">
            <img src="../assets/images/favicon.png">
        </div>    

        <div class="loginform">
            <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" >
                <el-form-item prop="account">
                    <el-input v-model="loginForm.account" prefix-icon="iconfont icontouxiang"></el-input>
                </el-form-item>
                 <el-form-item prop="password">
                    <el-input type="password"  v-model="loginForm.password" prefix-icon="iconfont iconmima"></el-input>
                </el-form-item>
                <el-form-item class="btns">
                   <el-button type="primary" @click="onSubmit">登录</el-button>
                   <el-button type="info" @click="resetForm">重置</el-button>
                </el-form-item>
            </el-form>   
            <el-link @click="regis">立即注册</el-link> 
        </div>  
        
    </div>
    <div class="footer">	 
         <el-link href='http://www.beian.miit.gov.cn' class="beian"> 沪ICP备17053022号-1 </el-link> <span class="banquan">Copyright © 2017 - 2020 Feibotech. All Rights Reserved</span>
    </div>
  </div>


</template>

<script>
export default {
  data () {
    return {
      loginForm:{
          account:'',
          password:''
      },
      loginFormRules:{
          account:[
              {required:true,message:'用户名不能为空',trigger:'blur'},
              {min:3,max:10,message:'用户名长度3-10位',trigger:'blur'}
          ],
          password:[
              {required:true,message:'密码不能为空',trigger:'blur'},
              {min:6,message:'密码长度至少6位',trigger:'blur'}
          ]
      }
    }
  },
  methods:{
      regis(){
          this.$router.push("/register")
      },
      onSubmit(){
          this.$refs.loginFormRef.validate(valid=>{
            if(!valid){
              console.log('验证失败');
              return;
             }
             this.$http.post('login',this.loginForm).then(res=>{
                var data = res.data;
                if(data.err_code==404){
                    this.$message.error('用户名或密码错误')
                    return;
                }
                if(data.err_code==405){
                    this.$message.error('用户名或密码不能为空')
                    return;
                }
                if(data.err_code==500){
                    this.$message.error('服务器忙，稍后尝试')
                    return;
                }  
                localStorage.setItem('token',data.token)
                localStorage.setItem('account',this.loginForm.account)
                this.$router.push('/index')
             })
             return 
          })        
      },
      resetForm(){
          this.$refs.loginFormRef.resetFields();
      }
  }
}
</script>

<style scoped>
    .beian{
        color:white;
        font-size:12px
    }
    .banquan{
        color:white;
        font-size:12px;
        margin-left:20px;
    }
    .footer{
        position: absolute;
        left:50%;
        transform: translate(-50%,-50%);
        bottom:20px;
        color:white;
        font-size: 12px;
    }
    .loginbg{
        background-color: rgb(1,76,119);
        height: 100%;
    }
    .loginBox{
        position: absolute;
        width: 450px;
        height:350px;
        background: white;
        top:50%;
        left:50%;
        transform: translate(-50%,-50%);
        border-radius: 3px; 
        
    }
    .avatar{
            width:130px;
            height:130px;
            position: absolute;
            background: white;
            left:50%;
            transform: translate(-50%,-50%);
            border-radius: 50%;
            padding:10px;
            border:1px solid #eee;
    }
    img{
        width:100%;
        border-radius: 50%;
        background-color: #eee;
    }
    .btns{
        display: flex;
        justify-content: flex-end;
    }
    .loginform{
        position: absolute;
        box-sizing: border-box;
        padding: 20px;
        width:100%;
        bottom: 0;
    }

</style>
