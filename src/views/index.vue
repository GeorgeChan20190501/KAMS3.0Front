<template>
  <el-container>
    <el-header>
        <el-row>
        <el-col :xs="16" :sm="18" :md="20" :lg="21" :xl='22'>
        <div class="img">
            <img src="..\assets\images\favicon.png" width="50px"> 
            欢迎使用KAMS系统
        </div>
        </el-col >
         <el-col :xs="8" :sm="6" :md="4" :lg="3" :xl='2'>
              <el-dropdown @command="handleCommand" style="color:rgb(64,158,255);font-size:12px;display:flex; top:20px;cursor:pointer">
                <span class="el-dropdown-link"> 欢迎您，{{profiles.username}}<i class="el-icon-arrow-down el-icon--right"></i></span>
                <el-dropdown-menu slot="dropdown" >
                  <el-dropdown-item command=1>个人资料</el-dropdown-item>
                  <el-dropdown-item command=2>重新登录</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
          </el-col>
        </el-row>
    </el-header>
    <el-container>
        
        <el-aside :width="isCollapse?'64px':'200px'" :style="{background:bgcolor}">

          <el-row class="aaa" >
            <el-col :span="20" v-show="isCollapse?false:true"><span >系统导航</span></el-col>
            <el-col :span="2" v-show="isCollapse?false:true"><el-button type="text"  @click="ssss" icon="el-icon-d-arrow-left" style="color:white"></el-button></el-col>
            <el-col :span="24" v-show="isCollapse?true:false"><el-button type="text" @click="ssss" icon="el-icon-d-arrow-right" style="color:white"></el-button></el-col>
          </el-row >
           <el-menu  default-active="1" router :collapse="isCollapse" :collapse-transition="false" unique-opened>
              <el-submenu :index="item.pageUrl+''" v-for="item in menuList" :key="item.pageUrl">
                <template slot="title">
                  <i :class="[classObj[item.id]]" style="font-size:13px;color:#0061a0"></i>
                  <span style="font-size:13px;color:#0061a0">{{item.label}}</span>
                </template>   
                    <el-menu-item  :index="item1.pageUrl+''"  v-for="item1 in item.children" :key="item1.pageUrl">
                        <template slot="title" >
                            <i class="el-icon-menu" style="font-size:10px;color:rgb(1,105,181)"></i>
                            <span style="font-size:10px;color:rgb(1,105,181)">{{item1.label}}</span>
                        </template>
                    </el-menu-item>
              </el-submenu>
           </el-menu>
           <div class="aaa" style="position:fixed;bottom:0;width:200px;text-align:center" v-show="isCollapse?false:true">
              <el-button type="text" style="color:white;font-size:10px;text-align:center"> Copyright © 2020 KAMS版权所有</el-button>
           </div > 
        </el-aside>
       
        <el-main>
                <router-view />
        </el-main>
    </el-container>
        <el-dialog  title="个人信息" :visible.sync="profilesdialogVisible"
        width="50%" >
          <el-form ref="adduserFormRef" :model="profiles" label-width="80px">
             <el-form-item label="ID">
              <el-input v-model="profiles.userId"></el-input>
            </el-form-item>
             <el-form-item label="账号">
              <el-input v-model="profiles.account"></el-input>
            </el-form-item>
            <el-form-item label="昵称">
              <el-input v-model="profiles.username"></el-input>
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="profiles.email"></el-input>
            </el-form-item>
            <el-form-item label="角色">
              <el-input v-model="profiles.roleName"></el-input>
            </el-form-item>
            <el-form-item label="创建">
              <el-input v-model="profiles.createTime"></el-input>
            </el-form-item>
           </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="profilesdialogVisible=false">取 消</el-button>
          <el-button type="primary" @click="profilesdialogVisible=false">确 定</el-button>
        </span>
    </el-dialog>
</el-container>
 
        
      
</template>

<script>
export default {
  data () {
    return {
       profilesdialogVisible:false,
       classObj:{
          10000:'el-icon-setting',
          20000:'el-icon-help',
          30000:'el-icon-coordinate'
       },
       menuList:[],
       isCollapse:false,
       bgcolor:'#fff',
       profiles:{
         userId:'',
         account:'',
         username:'',
         email:'',
         createTime:'',
         roleName:'',
         token:''
       },
       
    }
  },
  created(){
    this.getMenuList();
    this.getUsername();
    
  },
  mounted(){
    this.checkToken();
  },
  methods:{
     async checkToken(){
        var token1 = localStorage.getItem('token')
        var username=localStorage.getItem('account')
      
        if(token1==null){
           this.$router.push('/')
           return 
        }
        var {data:res} =await this.$http.get('checkToken',{params:{token:token1,account:username}})
        if(res.data==null || (res.data!=null && res.data.token!=token1)){
           this.$router.push('/')
           return 
        }
     }, 
 
     async getUsername(){
        var username=localStorage.getItem('account')
        var {data:res} =await this.$http.get('getUser',{params:{account:username}})
        this.profiles = res.data  
     },
     handleCommand(command) {
        if(command==1){
           this.profilesdialogVisible=true
        }
        else{
            localStorage.removeItem('token')
            this.$router.push('/')
        }
      },
     async getMenuList(){
        var {data:res} =await this.$http.get('/menus',{params:{account:localStorage.getItem('account')}})
        if(res.err_code!==200){
          return this.$message.error('获取菜单失败')
        }
        this.menuList = res.data
     },
     ssss(){
       this.isCollapse=!this.isCollapse
     }
  }
 }
</script>

<style scoped>
    .aaa{
      font-size: 14px;
      line-height: 36px;
      text-align: center;
      background: rgb(1,105,181);;
      color: white;
    }
  .img{
    display: flex;
    margin-top:3px;
    align-items: center;
  }
   .el-container{
     height: 100%;
   } 
   
    .el-menu{
      border-right:none
     }
   
   .el-header{
     border-bottom: 3px solid rgb(1,105,181);
   } 
   .el-main{
     background: rgb(242,242,242);;
   }

 .el-menu-item {
	line-height: 40px;
	height: 40px;
}
  
</style>