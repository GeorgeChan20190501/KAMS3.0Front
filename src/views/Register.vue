<template>
   <div class="loginbg">
    <div class="loginBox">
        <div class="avatar">
            <img src="../assets/images/favicon.png">
        </div>    

        <div class="loginform">
            <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" >
                <el-form-item prop="username">
                    <el-input v-model="loginForm.username" prefix-icon="iconfont icontouxiang"></el-input>
                </el-form-item>
                 
                <el-form-item prop="password">
                    <el-input type="password"  v-model="loginForm.password" prefix-icon="iconfont iconmima"></el-input>
                </el-form-item>
                <el-form-item prop="nickname">
                    <el-input v-model="loginForm.nickname" prefix-icon="el-icon-s-opportunity"></el-input>
                </el-form-item>
                <el-form-item prop="roleName">
                    <el-input v-model="loginForm.roleName" prefix-icon="el-icon-s-opportunity"></el-input>
                </el-form-item>
                <el-form-item class="btns">
                   <el-button type="primary" @click="onSubmit">注册</el-button>
                   <el-button type="info" @click="resetForm">重置</el-button>
                </el-form-item>
            </el-form>   
            <el-link @click="login">已有账号?立即登录</el-link> 
        </div>  
        
    </div>
  </div>


</template>

<script>
export default {
  data () {
    return {
      loginForm:{
          username:'',
          password:'',
          nickname:'',
          roleName:''
      },
      loginFormRules:{
          username:[
              {required:true,message:'用户名不能为空',trigger:'blur'},
              {min:3,max:10,message:'用户名长度3-10位',trigger:'blur'}
          ],
          nickname:[
              {required:true,message:'昵称不能为空',trigger:'blur'},
              {min:3,max:10,message:'昵称长度3-10位',trigger:'blur'}
          ],
          password:[
              {required:true,message:'密码不能为空',trigger:'blur'},
              {min:6,message:'密码长度至少6位',trigger:'blur'}
          ],
          roleName:[
              {required:true,message:'角色不能为空',trigger:'blur'},
             
          ]
      }
    }
  },
  methods:{
      login(){
          this.$router.push('/')
      },
      onSubmit(){
          this.$refs.loginFormRef.validate(valid=>{
            if(!valid){
              console.log('验证失败');
              return;
             }
             //调用后台接口验证登录。
             this.$http.post('register',this.loginForm).then(res=>{
                var data = res.data;
                console.log(data);
                if(data.code==403){
                    this.$message.warning('用户名或昵称已存在')
                    return;
                }
                if(data.code==500){
                    this.$message.warning('服务器忙，稍后尝试')
                    return;
                }
                this.$message.success('注册成功')
               this.$router.push('/')
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
        height:400px;
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
