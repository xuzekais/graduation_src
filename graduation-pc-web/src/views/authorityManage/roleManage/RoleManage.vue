<template>
  <div>
    <my-header title="角色管理"></my-header>
    <!-- 主体内容 -->
    <section class="content">
      <!-- 搜索条件 -->
      <section class="content-searchfrom">
        <el-form 
          ref="searchFrom" 
          :model="searchFrom" 
          inline
          label-width="80px">
          <el-row>

            <el-form-item label="角色名称" prop="roleName">
              <el-input 
                v-model="searchFrom.roleName"
                clearable
                placeholder="请输入角色名称">
              </el-input>
            </el-form-item>

          </el-row>

          <el-row>
            <el-form-item>
              <el-button type="primary" @click="handleSearch">搜索</el-button>
              <el-button @click="handleReset">重置</el-button>
            </el-form-item>
          </el-row>
        </el-form>
      </section>

      <!-- 功能区 -->
      <section class="content-operation">
        <el-row>
          <el-button type="primary" @click="addRole">添加角色</el-button>
          <!-- <el-button type="danger" @click="batchRemove">批量删除</el-button> -->
          <!-- <el-button @click="resetPassword">刷新</el-button> -->
        </el-row>
      </section>

      <!-- 列表信息 -->
      <section class="content-tableInfo">
        <el-table
          :data="tableData"
          stripe
          border
          style="width: 100%">

          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            type="index"
            label="序号"
            width="50">
          </el-table-column>
          <el-table-column
            prop="roleName"
            label="账号"
            width="180">
          </el-table-column>
          <el-table-column
            prop="roleCode"
            label="角色编码"
            width="180">
          </el-table-column>
          <el-table-column
            prop="description"
            label="备注">
          </el-table-column>

          <el-table-column
            label="操作"
            width="200">
            <template slot-scope="scope">
              <el-button @click="handleMenu(scope.row)" type="text" size="small" style="color: #e6a23c;">菜单权限</el-button>
              <el-button @click="handleUpdate(scope.row)" type="text" size="small">编辑</el-button>
              <el-button @click="handleDelete(scope.row)"  type="text" size="small" style="color:#F56C6C;">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </section>
    </section>

    <!-- 页码管理 -->
    <footer class="footer">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage3"
        layout="prev, pager, next, jumper"
        :total="2">
      </el-pagination>
    </footer>

    <!-- 添加用户弹窗 -->
    <el-dialog :title="modelType == 0 ? '添加角色' : '编辑角色'" 
               :visible.sync="dialogAddVisible" 
               @closed="clearAll" 
               class="add-dialog">
      
      <el-form :model="addForm" :rules="addRules" class="add-form" ref="addForm">

        <el-form-item label="角色名称" :label-width="formLabelWidth" prop="roleName">
          <el-input v-model="addForm.roleName" placeholder="请输入角色名称"></el-input>
        </el-form-item>

        <el-form-item label="角色编码" :label-width="formLabelWidth" prop="roleCode">
          <el-input v-model="addForm.roleCode" placeholder="请输入角色编码"></el-input>
        </el-form-item>

        <el-form-item label="备注" :label-width="formLabelWidth" prop="description">
          <el-input v-model="addForm.description" placeholder="请输入备注"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="clearAll">取 消</el-button>
        <el-button type="primary" @click="handleRole">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 选择菜单权限弹窗 -->
    <el-dialog
      :title="'分配 '+ menuRoleName+' 的菜单权限(点击选择)'"
      :visible.sync="menuShow"
      @closed="clearDialog" 
      width="30%">

      <el-tree
        :props="defaultProps"
        ref="tree"
        :data="treeData"
        node-key="_id"
        show-checkbox
        default-expand-all
        :expand-on-click-node="false"
        :check-on-click-node="true"
        :default-checked-keys="menuData"
        @check-change="handleCheckChange"
        @check="handleCheck">
      </el-tree>

      <span slot="footer" class="dialog-footer">
        <el-button @click="clearDialog">取 消</el-button>
        <el-button type="primary" @click="allotMenu">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import MyHeader from '../../../components/MyHeader/MyHeader';
export default {
  name: 'RoleManage',
  components:{
    MyHeader
  },
  data() {
    return {
      //搜索表单
      searchFrom:{
        roleName:'',//角色名称
      },
      //表格数据
      tableData:[
        /* {
          roleName: '',//角色名称
          roleCode: '',//角色编码
          description: '',//备注
        }, */
      ],
      //操作类型
      modelType: 0,//0: 添加, 1: 编辑
      //添加角色弹窗
      dialogAddVisible: false,
      formLabelWidth: '80px',
      //添加角色表单
      addForm:{
        roleName: '',//角色名称
        roleCode: '',//角色编码
        description: '',//备注
      },
      //添加角色校验规则
      addRules:{
        roleName:[{required: true, message: "请输入角色名称", trigger: "blur"}]
      },
      //是否展示菜单权限弹窗
      menuShow: false,
      //当前角色的菜单权限表单
      menuRoleForm:{
        _id: "",
        menuData: []
      },
      //当前已勾选的节点id
      menuNode:[],
      //当前还为勾选的父级节点ID
      menuHalfNode: [],
      //默认的勾选节点
      menuData: [],
      menuRoleName: '',//当前选择操作的角色名
      //树形结构数据
      treeData:[
      // {
      //   _id: "",//当前节点ID
      //   menuName: "",//当前节点名称
      //   children: [],//当前节点的子结构
      // }
      ],
      defaultProps:{
        id: '_id',//组织ID
        children: 'children',//组织的子部门数据
        label: 'menuName',//组织名字
        isLeaf: 'isParent'
      },
    }
  },
  methods: {
    //初始化
    async init(){
      this.getRole()
      this.getTreeData()
    },
    //获取角色列表接口
    async getRole(){
      const res = await this.$http.get("getRole?roleName=" + this.searchFrom.roleName)
      console.log(`添加组织接口请求成功: ${JSON.stringify(res)}`)
      this.tableData = res.data.data
    },
    //获取菜单树
    async getTreeData(){
      const res = await this.$http.get("getAllMenu")
      console.log(`获取到的全部菜单: ${JSON.stringify(res)}`)
      this.treeData = res.data.data
    },
    //搜索
    handleSearch(){
      console.log(this.searchFrom.roleName)
      this.getRole()
    },
    //重置
    handleReset(){
      this.$refs['searchFrom'].resetFields()
      this.getRole()
    },
    //清空添加弹窗中的内容
    clearAll(){
      console.log(this.addForm)
      this.$refs['addForm'].resetFields()
      this.dialogAddVisible = false
    },
    //添加角色前的准备
    addRole(){
      this.modelType = 0
      this.addForm.roleName = ''
      this.addForm.roleCode = ''
      delete this.addForm.menuData
      delete this.addForm._id 
      this.addForm.description = ''
      this.dialogAddVisible = true
    },
    //编辑角色前的准备
    handleUpdate(data){
      console.log(data)
      let {roleName,roleCode,_id,menuData,description}=data
      this.modelType = 1
      this.addForm.roleName = roleName
      this.addForm.roleCode = roleCode
      this.addForm._id = _id
      this.addForm.menuData = menuData
      this.addForm.description = description

      this.dialogAddVisible = true
    },
    //处理角色
    async handleRole(){
      console.log(this.addForm)
      console.log(this.modelType)
      if(this.modelType == 0){
        const res = await this.$http.post("addRole",this.addForm)
        console.log(`添加角色接口请求成功: ${JSON.stringify(res)}`)
      }else{
        const res = await this.$http.post("updateRole",this.addForm)
        console.log(`编辑角色接口请求成功: ${JSON.stringify(res)}`)
      }
      this.clearAll()
      this.getRole()
    },
    //删除角色
    async handleDelete(data){
      console.log(data)
      const res = this.$http.get("deleteRole?id=" + data._id)
      console.log(`删除角色接口请求成功: ${JSON.stringify(res)}`)
      this.getRole()
    },
    //设置菜单权限
    async handleMenu(data){
      console.log(data)
      //分配角色目标
      this.menuRoleName = data.roleName
      this.menuRoleForm._id = data._id
      //获取当前角色已选菜单
      const result = await this.$http.get("getRoleMenu?id=" + data._id)
      console.log(`获取到的已选菜单数组: ${JSON.stringify(result)}`)
      this.menuData = result.data.data.menuData
      this.menuShow= true
    },
    //点击菜单复选框触发
    handleCheck(checkedNodes,checkedKeys ){
      this.menuNode = checkedKeys.checkedKeys
      this.menuHalfNode = checkedKeys.halfCheckedKeys
      // console.log()
    },
    //确定分配菜单
    async allotMenu(){
      console.log(this.menuNode)
      console.log(this.menuHalfNode)
      //处理传递数据
      for(let i = 0;  i< this.menuHalfNode.length; i++){
        this.menuNode.push(this.menuHalfNode[i])
      }
      this.menuNode.push(this.menuHalfNode.length)
      this.menuRoleForm.menuData = this.menuNode
      const res = await this.$http.post("allotMenu",this.menuRoleForm)
      console.log(`设置菜单成功: ${JSON.stringify(res)}`)
      console.log(JSON.stringify(this.menuRoleForm.menuData) )
      //关闭弹窗
      this.menuData = []
      this.menuShow = false
    },
    //关闭菜单弹窗
    clearDialog(){
      this.menuData = []
      this.menuShow = false
    }
  },
  created(){
    this.init()
  }
}
</script>

<style lang="scss" scoped>
   // 主体内容
  .content{
    padding: 20px 10px 10px 10px;
  }
  .content-tableInfo{
    margin-top: 20px;
  }
  // 页码
  .footer{
    text-align: center;
  }

  //添加角色弹窗
  .add-dialog /deep/ .el-dialog{
    width: 35%;
  }

  /deep/ .parent-item {
    .el-form-item__content  {
      display: flex;
      >div{
        width: 100%;
      }
      .el-button {
        margin-left: 20px;
      }
    }
  }
</style>