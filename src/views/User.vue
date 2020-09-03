<template>
  <div>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>系统管理</el-breadcrumb-item>
    <el-breadcrumb-item>用户管理</el-breadcrumb-item>
  </el-breadcrumb>
  <div class="h2"></div>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
           <el-input placeholder="请输入内容" v-model="queryInfo.param" clearable @clear="clear" >
        <el-button slot="append" icon="el-icon-search" @click="serach()"></el-button>
          </el-input>
        </el-col>
        <el-col :span="10">
                <el-button type="primary" @click="addUser()">添加用户</el-button>
        </el-col>
      </el-row>
      <div class="h2"></div>
          <el-table :data="tableData" style="width: 100%" border stripe    size="mini" highlight-current-row :header-cell-style="{fontSize:'14px',color:'black'}" >
               <el-table-column label="#"  type="index"></el-table-column>
               <el-table-column label="UserID"  >
                <template slot-scope="scope">  
                  <span style="margin-left: 10px">{{ scope.row.userId }}</span>
                </template>
               </el-table-column>
              <el-table-column label="账号"  prop="account"></el-table-column>
              <el-table-column label="昵称"  prop="username"></el-table-column>
              <el-table-column label="邮箱"  prop="email"></el-table-column>
              <el-table-column label="角色"  prop="roleName"></el-table-column>
              <el-table-column label="创建时间">
                <template slot-scope="scope">
                    {{scope.row.createTime | dataFormat}}
                </template>

              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button size="mini"  @click="handleEdit(scope.row)">编辑</el-button>
                  <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
                </template>
              </el-table-column>
  </el-table> 
    </el-card>
    <div class="h2"></div>
   <el-pagination @size-change="handleSizeChange"  @current-change="handleCurrentChange" 
    :current-page="queryInfo.pageNow"  :page-sizes="[3, 5, 10, 20]"
      :page-size="queryInfo.pageSize"
      layout="prev, pager, next, jumper,sizes,total"
      :total="total">
    </el-pagination>

    <el-dialog  title="添加用户" :visible.sync="addUserdialogVisible"
        width="50%" @close="resetadduserForm">
          <el-form ref="adduserFormRef" :rules="adduserFormRule" :model="adduserForm" label-width="80px">
             <el-form-item label="账号" prop="account">
              <el-input v-model="adduserForm.account"></el-input>
            </el-form-item>
            <el-form-item label="昵称" prop="username">
              <el-input v-model="adduserForm.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="adduserForm.password"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="adduserForm.email"></el-input>
            </el-form-item>
            <el-form-item label="角色" prop="roleName">
              <el-input v-model="adduserForm.roleName"></el-input>
            </el-form-item>
             
           </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="resetadduserForm">取 消</el-button>
          <el-button type="primary" @click="confirm()">确 定</el-button>
        </span>
    </el-dialog>

      <el-dialog  title="修改用户" :visible.sync="updateUserdialogVisible"
        width="50%">
          <el-form ref="userFormRef" :model="userForm" label-width="80px">
            <el-form-item label="昵称">
              <el-input v-model="userForm.username"></el-input>
            </el-form-item>
            <el-form-item label="密码">
              <el-input v-model="userForm.password"></el-input>
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="userForm.email"></el-input>
            </el-form-item>
            <el-form-item label="角色">
              <el-input v-model="userForm.roleName"></el-input>
            </el-form-item>
            
 
           </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="updateUserdialogVisible=false">取 消</el-button>
          <el-button type="primary" @click="confirmUpdate()">确 定</el-button>
        </span>
</el-dialog>
  </div>


</template>

<script>
export default {
  data () {
    return {
       updateUserdialogVisible:false,
       addUserdialogVisible:false,
       menuList:[],
       adduserFormRule:{
         account:[
                   { required: true, message: '请输入账号', trigger: 'blur' },
                   { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                 ],
          username:[
                   { required: true, message: '请输入昵称', trigger: 'blur' },
                   { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                 ],
          password:[
                   { required: true, message: '请输入密码', trigger: 'blur' },
                   { min: 3, max: 10, message: '长度在 6 到 15 个字符', trigger: 'blur' }
                 ],
           email:[
                   { required: true, message: '请输入邮箱', trigger: 'blur' } 
                  
                 ],
           roleName:[
                   { required: true, message: '请输入角色', trigger: 'blur' },
                   
                 ]                        
          },
       queryInfo:{
         param:'',
         pageNow:1,
         pageSize:3
       },
       total:10,
       tabletemp:[],
       userForm:{
          username:'',
          password:'',
          email:'',
          roleName:'' 
       },
       adduserForm:{
          account:'',
          username:'',
          password:'',
          email:'',
          roleName:'',
          
       },
       tableData: []
    }
  },
  filters:{
    dataFormat(val){
       var tempdate = new Date(val)
        var y = tempdate.getFullYear()
        var m = (tempdate.getMonth() + 1 + "").padStart("2", "0")
        var d = (tempdate.getDate() + "").padStart("2", "0")
        var h = (tempdate.getHours() + "").padStart("2", "0")
        var min = (tempdate.getMinutes() + "").padStart("2", "0")
        var s = (tempdate.getSeconds() + "").padStart("2", "0")
     
 
       
        var newDate = y + "-" + m + "-" + d + " " + h + ":" + min + ":" + s
      
     
        return newDate 
    }
  },
  created(){  
    this.getUserList();
  },
  methods:{
    resetadduserForm(){
      this.$refs.adduserFormRef.resetFields();
      this.addUserdialogVisible = false  
    },
     addUser(){
      this.addUserdialogVisible=true 
    }, 
     confirm(){
      this.$refs.adduserFormRef.validate( async valid=>{
        if(!valid){
          return this.$message.error('数据未按要求填写！')
        }
      var {data:res} = await this.$http.post('addUser' ,this.adduserForm)  
      this.getUserList();
      this.addUserdialogVisible = false;
      if(res.err_code==200)
      this.$message.success('添加成功')
      }) 
    },
 
    async confirmUpdate(){
          var {data:res} = await this.$http.put('updateUser' ,this.userForm)
          this.getUserList();
          this.updateUserdialogVisible=false
          this.$message.success('更新成功')
    },
     handleDelete(row){

      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          var {data:res} = await this.$http.delete('deleteUser',{params:row} )
          this.getUserList();
          this.$message.success('删除成功')
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });

      
    },
    async handleEdit(row){ 
      this.updateUserdialogVisible=true;
 
      var {data:res} = await this.$http.get('getUsers' ,{params: row} )
       
      this.userForm = res.data;
      
    },
    clear(){   
      this.queryInfo.param=''
      this.queryInfo.pageNow=1
      this.getUserList();
    },
    async getUserList(){
        var {data:res} = await this.$http.get('users' ,{ params: this.queryInfo})
        this.tabletemp=res.data;
        this.total = this.tabletemp.length
        this.setPaginations();
    },
    serach(){
      this.getUserList()
    },

    handleSizeChange(newSize){
        this.queryInfo.pageSize=newSize
        this.setPaginations();
    },
    handleCurrentChange(current){
      this.queryInfo.pageNow=current
      this.setPaginations();
    },

    setPaginations(){
				this.tableData = this.tabletemp.slice((this.queryInfo.pageNow-1)*this.queryInfo.pageSize,this.queryInfo.pageNow*this.queryInfo.pageSize)  
     },



  }
 }
</script>

<style scoped>
   
</style>