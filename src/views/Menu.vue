<template>
  <div>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>系统管理</el-breadcrumb-item>
    <el-breadcrumb-item>菜单管理</el-breadcrumb-item>
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
                <el-button type="primary" @click="addMenu()">添加菜单</el-button>
        </el-col>
      </el-row>
      <div class="h2"></div>
          <el-table row-key="id" :tree-props="{children: 'children'}"  :data="tableData" style="width: 100%" border stripe    size="mini" highlight-current-row :header-cell-style="{fontSize:'14px',color:'black'}" >
               <el-table-column label="#"  type="index"></el-table-column>
               <el-table-column label="菜单ID"  >
                <template slot-scope="scope">  
                  <span style="margin-left: 10px">{{ scope.row.id }}</span>
                </template>
               </el-table-column>
              <el-table-column label="菜单名称"  prop="label"></el-table-column>
              <el-table-column label="菜单描述"  prop="describ"></el-table-column>
              <el-table-column label="是否启用"  prop="flag"></el-table-column>
              <el-table-column label="创建时间">
                <template slot-scope="scope">
                    {{scope.row.updateTime | dataFormat }}
                </template>
              </el-table-column>
              <el-table-column label="操作" min-width="150px">
                <template slot-scope="scope">
                  <el-button size="mini" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
                  <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
                  <el-button v-if="scope.row.children!=null" size="mini" type="success" @click="addSubMenu(scope.row)">新增子节点</el-button>
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

    <el-dialog  title="添加菜单" :visible.sync="addMenudialogVisible"
        width="50%" @close="resetaddMenuForm">
          <el-form ref="addMenuFormRef" :rules="addMenuFormRule" :model="addMenuForm" label-width="100px">
            <el-form-item label="菜单ID" prop="id">
              <el-input v-model="addMenuForm.id"></el-input>
            </el-form-item>
            <el-form-item label="菜单名称" prop="label">
              <el-input v-model="addMenuForm.label"></el-input>
            </el-form-item>
            
            <el-form-item label="菜单路由" prop="pageUrl">
              <el-input v-model="addMenuForm.pageUrl"></el-input>
            </el-form-item>
            <el-form-item label="菜单描述" prop="describ">
              <el-input v-model="addMenuForm.describ"></el-input>
            </el-form-item>
           </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="resetaddMenuForm">取 消</el-button>
          <el-button type="primary" @click="confirm()">确 定</el-button>
        </span>
    </el-dialog>

      <el-dialog  title="修改菜单" :visible.sync="updateMenudialogVisible"
        width="50%">
          <el-form ref="menuFormRef" :model="menuForm" label-width="80px">
            <el-form-item label="菜单ID">
              <el-input v-model="menuForm.id" disabled></el-input>
            </el-form-item>
            <el-form-item label="菜单名称">
              <el-input v-model="menuForm.label"></el-input>
            </el-form-item>
            <el-form-item label="父级ID">
              <el-input v-model="menuForm.pid"></el-input>
            </el-form-item>
            <el-form-item label="菜单描述">
              <el-input v-model="menuForm.describ"></el-input>
            </el-form-item>
            <el-form-item label="是否启用">
              <el-input v-model="menuForm.flag"></el-input>
            </el-form-item>
           </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="updateMenudialogVisible=false">取 消</el-button>
          <el-button type="primary" @click="confirmUpdate()">确 定</el-button>
        </span>
</el-dialog>

    <el-dialog  title="添加子菜单" :visible.sync="addSubMenudialogVisible"
        width="50%">
          <el-form ref="submenuFormRef" :model="submenuForm" label-width="80px">
            <el-form-item label="父级ID">
              <el-input v-model="submenuForm.pid" disabled></el-input>
            </el-form-item>
            <el-form-item label="菜单ID">
              <el-input v-model="submenuForm.id"></el-input>
            </el-form-item>
            <el-form-item label="菜单名称">
              <el-input v-model="submenuForm.label"></el-input>
            </el-form-item>
            <el-form-item label="菜单路由">
              <el-input v-model="submenuForm.pageUrl"></el-input>
            </el-form-item>
            <el-form-item label="菜单描述">
              <el-input v-model="submenuForm.describ"></el-input>
            </el-form-item>
            <el-form-item label="是否启用">
              <el-input v-model="submenuForm.flag"></el-input>
            </el-form-item>
           </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addSubMenudialogVisible=false">取 消</el-button>
          <el-button type="primary" @click="confirmadd()">确 定</el-button>
        </span>
</el-dialog>


 
  </div>


</template>

<script>
export default {
  data () {
    return {
       addSubMenudialogVisible:false,
       updateMenudialogVisible:false,
       addMenudialogVisible:false,
       menuList:[],
       addMenuFormRule:{ 
                  label:[
                    { required: true, message: '请输入菜单名称', trigger: 'blur' },
                  ]  ,   
                   id:[
                    { required: true, message: '请输入菜单ID', trigger: 'blur' },
                  ]  ,  
                   pageUrl:[
                    { required: true, message: '请输入菜单url', trigger: 'blur' },
                  ]  ,  
                   describ:[
                    { required: true, message: '请输入菜单描述', trigger: 'blur' },
                  ]                      
              },
       queryInfo:{
         param:'',
         pageNow:1,
         pageSize:3
       },
       total:10,
       tabletemp:[],
       menuForm:{
          id:'' ,
          pid:'' ,
          label:'' ,
          describ:'' ,
          flag:'',
          
       },
       submenuForm:{
          id:'' ,
          pid:'' ,
          label:'' ,
          describ:'' ,
          flag:'',
          pageUrl:''
          
       },
       addMenuForm:{
          id:'' ,
          pid:'' ,
          label:'' ,
          pageUrl:'',
          describ:''  
       },
       tableData:[]
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
    //this.getMenuList();
  },
  mounted(){
    
  },
  methods:{
    async confirmadd(){
          var id = this.submenuForm.pid
          this.submenuForm.createTime=new Date()
          this.submenuForm.updateTime=new Date()
           var updataElement = null
          this.tabletemp.forEach(element => {
             if(element.id==id){
               element.children.push(this.submenuForm)
               updataElement=element
             }
          });
          console.log('添加后')
          console.log(this.tabletemp)
          var {data:res} = await this.$http.put('updateMenu' ,updataElement)
       
          this.getList();
          this.addSubMenudialogVisible=false
          this.$message.success('新增成功')
    },
    addSubMenu(row){
        this.submenuForm.pid = row.id
        this.addSubMenudialogVisible=true
   
       

    },
    async getMenuList(){
        var {data:res} =await this.$http.get('/menus')
        if(res.err_code!==200){
          return this.$message.error('获取菜单失败')
        }
        var tempObj = res.data
        this.fromData=[]
        console.log("========================================") 
        console.log(tempObj) 
        
       
     },
    async confirmGrant(){
      //this.curr
      var roleName = this.curr.roleName
      var roleId = this.curr.roleId
      console.log('=====将选权限为：') //什么组
  
      console.log(this.toData) //什么权限
      var aaa = {roleId:roleId,roleName:roleName,right:this.toData}
      console.log('=====封装后对象为：') 
      console.log(aaa) //什么组
      var {data:res} = await this.$http.post('grant' ,aaa)
      console.log('=========')
      console.log(res) 


    },
     
    resetaddMenuForm(){
      this.$refs.addMenuFormRef.resetFields();
      this.addMenudialogVisible = false  
    },
     addMenu(){
      this.addMenudialogVisible=true 

    }, 
    async confirm(){
       console.log('来了也')
       this.$refs.addMenuFormRef.validate( async valid=>{
        if(!valid){
          return this.$message.error('数据未按要求填写！')
        }
        console.log('验证完了')
        this.addMenuForm.pid=this.addMenuForm.id
        var {data:res} = await this.$http.post('addMenu' ,this.addMenuForm)  
        console.log(res)
        this.getList();
        this.addMenudialogVisible = false;
        if(res.err_code==200)
        this.$message.success('添加成功')
        if(res.err_code==402)
        this.$message.error('该角色名已经存在')
      }) 
      
      
    },
 
    async confirmUpdate(){
          console.log('新数据为')
          console.log(this.menuForm)
          //获取父级
          console.log('获取父级')
          console.log("父级ID"+this.menuForm.pid)
          var updataElement = null
          this.tabletemp.forEach(element => {
             if(element.id==this.menuForm.pid){
               element.children.forEach(child => {
                  if(child.id==this.menuForm.id){
                    console.log('要换的是啥？？？')
                    console.log(child)
                    child=this.menuForm
                    child.updateTime = new Date()
                  }
               })
               console.log('父级')
               console.log(element)
               updataElement=element
             }
          });
          console.log('最后渲染的外层')
          console.log(this.tabletemp)
          var {data:res} = await this.$http.put('updateMenu' ,updataElement)
       
          this.getList();
          this.updateMenudialogVisible=false
          this.$message.success('更新成功')
    },
     handleDelete(row){
      console.log(row)
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => { 
          if(!row.children){
                var updataElement = null
                this.tabletemp.forEach(element => {
                  if(element.id==row.pid){
                    element.children.splice(element.children.indexOf(row),1)
                    updataElement=element 
                  }
                });
                console.log('删除后')
                console.log(updataElement)
                var {data:res} = await this.$http.put('updateMenu' ,updataElement)
                }
                else{
                  console.log("说明删父节点")
                  var {data:res} = await this.$http.delete('deleteMenu',{params:row} )
                }
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
  
      this.updateMenudialogVisible=true;
        console.log(row)
        this.menuForm = row;
    },
    clear(){   
      this.queryInfo.param=''
      this.queryInfo.pageNow=1
      this.getList();
    },
    async getList(){
        console.log('前台参数')
        console.log(this.queryInfo)
        var {data:res} = await this.$http.get('menus' ,{ params: this.queryInfo})
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
     }

     



  }
 }
</script>

<style scoped>
   
</style>