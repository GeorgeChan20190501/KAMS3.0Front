<template>
  <div>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>系统管理</el-breadcrumb-item>
    <el-breadcrumb-item>角色管理</el-breadcrumb-item>
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
                <el-button type="primary" @click="addRole()">添加角色</el-button>
        </el-col>
      </el-row>
      <div class="h2"></div>
          <el-table :data="tableData" style="width: 100%" border stripe    size="mini" highlight-current-row :header-cell-style="{fontSize:'14px',color:'black'}" >
               <el-table-column label="#"  type="index"></el-table-column>
               <el-table-column label="角色ID"  >
                <template slot-scope="scope">  
                  <span style="margin-left: 10px">{{ scope.row.roleId }}</span>
                </template>
               </el-table-column>
              <el-table-column label="角色名称"  prop="roleName"></el-table-column>
              <el-table-column label="角色描述"  prop="describ"></el-table-column>
              <el-table-column label="是否启用"  prop="flag"></el-table-column>
              <el-table-column label="创建时间">
                <template slot-scope="scope">
                    {{scope.row.createTime | dataFormat}}
                </template>
              </el-table-column>
              <el-table-column label="操作" min-width="150px">
                <template slot-scope="scope">
                  <el-button size="mini" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
                  <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
                  <el-button size="mini" type="success" @click="grant(scope.row)">授权</el-button>
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

    <el-dialog  title="添加角色" :visible.sync="addRoledialogVisible"
        width="50%" @close="resetaddroleForm">
          <el-form ref="addroleFormRef" :rules="addroleFormRule" :model="addroleForm" label-width="80px">
            <el-form-item label="角色名称" prop="roleName">
              <el-input v-model="addroleForm.roleName"></el-input>
            </el-form-item>
            <el-form-item label="角色描述" prop="describ">
              <el-input v-model="addroleForm.describ"></el-input>
            </el-form-item>
           </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="resetaddroleForm">取 消</el-button>
          <el-button type="primary" @click="confirm()">确 定</el-button>
        </span>
    </el-dialog>

      <el-dialog  title="修改角色" :visible.sync="updateRoledialogVisible"
        width="50%">
          <el-form ref="roleFormRef" :model="roleForm" label-width="80px">
            <el-form-item label="角色ID">
              <el-input v-model="roleForm.roleId"></el-input>
            </el-form-item>
            <el-form-item label="角色名称">
              <el-input v-model="roleForm.roleName"></el-input>
            </el-form-item>
            <el-form-item label="角色描述">
              <el-input v-model="roleForm.describ"></el-input>
            </el-form-item>
            <el-form-item label="是否启用">
              <el-input v-model="roleForm.flag"></el-input>
            </el-form-item>
           </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="updateRoledialogVisible=false">取 消</el-button>
          <el-button type="primary" @click="confirmUpdate()">确 定</el-button>
        </span>
</el-dialog>


      <el-dialog  title="角色授权" :visible.sync="roleGrantdialogVisible"
        width="50%" >
          <tree-transfer :title="title" :from_data='fromData' :to_data='toData' :defaultCheckedKeys="defaultCheckedKey" :defaultProps="{label:'label'}"  @addBtn='add' @removeBtn='remove' :mode='mode' height='540px' filter openAll>
          </tree-transfer>
        <span slot="footer" class="dialog-footer">
          <el-button @click="roleGrantdialogVisible=false">取消</el-button>
          <el-button type="primary" @click="confirmGrant()">授权</el-button>
        </span>
    </el-dialog>
  </div>


</template>

<script>
export default {
  data () {
    return {
       roleGrantdialogVisible:false,
       updateRoledialogVisible:false,
       addRoledialogVisible:false,
       menuList:[],
       addroleFormRule:{ 
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
       roleForm:{
          
          roleId:'',
          roleName:'' ,
          flag:'',
          describ:''
       },
       addroleForm:{
          roleName:'' ,
          describ:''  
       },
       tableData: [],
       title:['目前权限','即将分配'],  
       mode: "transfer",  
       fromData:[],
       defaultCheckedKey:[],
       AllData:[],
       toData:[],
       value:[],
       curr:{}
       //{id:10000,pid:'10000',label:'系统管理',children:[{id:10101,pid:'10000',label:'用户管理'}]
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
    this.getList();
    this.getMenuList();
  },
  methods:{
  
    async getMenuList(){
        var {data:res} =await this.$http.get('/menus',{ params: {param:''}})
        
        if(res.err_code!==200){
          return this.$message.error('获取菜单失败')
        }
        var tempObj = res.data
        this.fromData=tempObj
        this.AllData=tempObj
   
     },
    async confirmGrant(){
      //this.curr
      var roleName = this.curr.roleName
      var roleId = this.curr.roleId

 

 
      var aaa = {roleId:roleId,roleName:roleName,right:this.value}
   
  
      var {data:res} = await this.$http.post('grant' ,aaa)
   
      this.roleGrantdialogVisible=false;
      this.$message.success('授权成功')


    },
    async grant(row){
      
      this.defaultCheckedKey=[]
      this.fromData=this.AllData
  
      this.roleGrantdialogVisible=true;
      this.curr = row
    
      var {data:res} = await this.$http.get('right' ,{params:row})
     
      var rolehid = res.data.roleId
      var rolehname = res.data.roleName
      var rights = res.data.right
     
     
 
    
      var aa = []
      rights.forEach(right => {
         
         right.children.forEach(child=>{
            
            aa.push((child.id-0))
         })
        
      });
 

      this.defaultCheckedKey=aa
 
  
      
    
    },
    resetaddroleForm(){
      this.$refs.addroleFormRef.resetFields();
      this.addRoledialogVisible = false  
    },
     addRole(){
      this.addRoledialogVisible=true 
    }, 
     confirm(){
      this.$refs.addroleFormRef.validate( async valid=>{
        if(!valid){
          return this.$message.error('数据未按要求填写！')
        }
        var {data:res} = await this.$http.post('addRole' ,this.addroleForm)  
        this.getList();
        this.addRoledialogVisible = false;
        if(res.err_code==200)
        this.$message.success('添加成功')
        if(res.err_code==402)
        this.$message.error('该角色名已经存在')
      }) 
      
      
    },
 
    async confirmUpdate(){
        
          var {data:res} = await this.$http.put('updateRole' ,this.roleForm)
          this.getList();
          this.updateRoledialogVisible=false
          this.$message.success('更新成功')
    },
     handleDelete(row){
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          
          var {data:res} = await this.$http.delete('deleteRole',{params:row} )
          this.getList();
          this.$message.success('删除成功')
          
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });

      
    },
    async handleEdit(row){ 
  
      this.updateRoledialogVisible=true;
        
        this.roleForm = row;
    },
    clear(){   
      this.queryInfo.param=''
      this.queryInfo.pageNow=1
      this.getList();
    },
    async getList(){
         
        var {data:res} = await this.$http.get('roles' ,{ params: this.queryInfo})
        this.tabletemp=res.data;
        this.total = this.tabletemp.length
        this.setPaginations();
    },
    serach(){
      this.getList()
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

     handleNodeClick(data) {
        
      },
      // 切换模式 现有树形穿梭框模式transfer 和通讯录模式addressList
      changeMode() {
        if (this.mode == "transfer") {
          this.mode = "addressList";
        } else {
          this.mode = "transfer";
        }
      },
      // 监听穿梭框组件添加
      add(fromData,toData,obj){
        // 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的{keys,nodes,halfKeys,halfNodes}对象
        // 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
      
        this.value=toData
      },
      // 监听穿梭框组件移除
      remove(fromData,toData,obj){
        // 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的{keys,nodes,halfKeys,halfNodes}对象
        // 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
        
        this.value=toData
      }



  }
 }
</script>

<style scoped>
   
</style>