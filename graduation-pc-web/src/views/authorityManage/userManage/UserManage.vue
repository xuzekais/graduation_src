<template>
  <div>
    <!-- 头部标题 -->
    <my-header title="用户管理"></my-header>
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
            <el-form-item label="账号" prop="userName">
              <el-input 
                v-model="searchFrom.userName"
                clearable
                placeholder="请输入账号">
              </el-input>
            </el-form-item>

            <el-form-item label="昵称" prop="nickName">
              <el-input 
                v-model="searchFrom.nickName"
                clearable
                placeholder="请输入昵称">
              </el-input>
            </el-form-item>

            <el-form-item label="所属部门" prop="department">
              <el-input 
                v-model="searchFrom.department"
                clearable
                placeholder="请输入所属部门">
              </el-input>
            </el-form-item>
          </el-row>

          <el-row>
            <el-form-item label="角色类型" prop="roleName">
              <el-select v-model="searchIndex" placeholder="请选择角色类型">
                <el-option 
                  v-for="(item,index) in roleOptions"
                  :key="item._id"
                  :label="item.roleName"
                  :value="index">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="创建时间">
              <el-date-picker
                v-model="searchFrom.time"
                clearable
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
          </el-row>
          <!-- <el-form-item label="手机号码">
            <el-input v-model="searchFrom.phoneNumber"></el-input>
          </el-form-item> -->
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
          <el-button type="primary" @click="showAddDialog">添加用户</el-button>
          <!-- <el-button type="danger" @click="batchRemove">批量删除</el-button> -->
          <!-- <el-button @click="resetPassword">重置密码</el-button> -->
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
            prop="userName"
            label="账号"
            width="180">
          </el-table-column>
          <el-table-column
            prop="nickName"
            label="昵称"
            width="180">
          </el-table-column>
          <el-table-column
            prop="departInfo[0].departmentName"
            label="所属部门">
          </el-table-column>
          <el-table-column
            prop="mobile"
            label="手机号码">
          </el-table-column>
          <el-table-column
            prop="roleInfo.roleName"
            label="角色类型">
          </el-table-column>
           <el-table-column
            prop="creatTime"
            :formatter="handleDate"
            label="创建时间">
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="100">
            <template slot-scope="scope">
              <el-button @click="handleEdit(scope.row)" type="text" size="small">编辑</el-button>
              <el-button @click="handleDelete(scope.row)" type="text" size="small" style="color:#F56C6C;">删除</el-button>
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
    <el-dialog :title="this.modelType == 0 ? '添加用户' : '编辑用户'" 
               :visible.sync="dialogAddVisible"
               class="add-dialog"
               @closed="clearAddDialog">
      <el-form :model="addForm" :rules="addRules"  ref="addForm" >

        <el-form-item label="昵称" :label-width="formLabelWidth" prop="nickName">
          <el-input v-model="addForm.nickName" placeholder="请输入昵称"></el-input>
        </el-form-item>

        <el-form-item v-if="this.modelType == 0 ?  true: false" label="手机号码" :label-width="formLabelWidth" prop="mobile">
          <el-input v-model="addForm.mobile" placeholder="请输入手机号码"></el-input>
        </el-form-item>

        <!-- <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input v-model="addForm.password" placeholder="请输入密码"></el-input>
        </el-form-item> -->

        <el-form-item required label="所属组织" :label-width="formLabelWidth">
          <my-department-choose
            ref="deparmentChoose"
            @chooseNode="chooseNode" 
            @clearInupt="clearInupt"
            :key="changeIndex"></my-department-choose>
        </el-form-item>

        <el-form-item required label= "角色类型" :label-width="formLabelWidth">
          <el-select v-model="roleIndex" placeholder="请选择角色类型">
            <el-option 
              v-for="(item,index) in roleOptions"
              :key="item._id"
              :label="item.roleName"
              :value="index">
            </el-option>
          </el-select>
        </el-form-item>
       
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="clearAddDialog">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import MyHeader from '../../../components/MyHeader/MyHeader';
import MyDepartmentChoose from '../../../components/MyDepartmentChoose/MyDepartmentChoose'
import {formatDateTime} from "../../../plugins/util"
export default {
  name: 'UserManage',
  components:{
    MyHeader,
    MyDepartmentChoose
  },
  data() {
    const validateMobile = (rule, value, callback) => {
      var reg = /^[1][3,4,5,6,7,8][0-9]{9}$/;
      if (!reg.test(value)) {
        callback(new Error("手机号格式错误"));
      } else {
        callback();
      }
    }
    const validateDepart = (rule, value, callback) => {
      console.log(value)
      if(!value){
        callback(new Error("请选择组织"))
      }
    }
    const validateRole = (rule, value, callback) => {
      if(!value){
        callback(new Error("请选择角色类型"))
      }
    }
    return {
      //搜索条件表单信息
      searchFrom:{
        userName: '',//账号
        nickName: '',//昵称
        department: '',//所属部门
        //phoneNumber: '',//手机号码
        roleName: '', //角色类型名字
        time:'',//时间范围
      },
      //搜索的角色类型序列号
      searchIndex: undefined,
      // 表格列表信息
      tableData:[
        /* {
          userName: '',//账号
          nickName: '',//昵称
          department: '',//所属部门
          phoneNumber: '',//手机号码
          roleType: '', //角色类型  0:普通用户 1:管理员 2:超级管理员
          creatTime:'',
        }, */
      ],
      
      //添加用户弹窗
      dialogAddVisible: false,
      formLabelWidth: '80px',
      modelType: 0,//0:添加用户 1: 编辑用户
      //添加用户表单
      addForm:{
        nickName: '',//昵称
        mobile:'',//手机号码
        //角色信息
        roleInfo: {
          roleName:'',//角色名字
          roleId: '',//角色ID
        },
        departInfo: [],//部门ID
      },
      roleIndex: undefined,//当前选择的角色序号
      //添加用户的检验规则
      addRules:{
        nickName:[{required:true,message:"昵称不能为空", trigger:"blur"}],
        mobile:[{required:true ,validator: validateMobile, trigger: "blur"}],
        departInfo:[{required:true, validator: validateDepart, trigger: "blur"}],
        roleInfo:[{required:true, validator: validateRole, trigger: "blur"}],
      },
      //角色列表
      roleOptions:[],
      //所属组织
      departObj:{
        departmentId: '',
        departmentName: "",
      },
    }
  },
  created(){
    this.init()
  },
  methods: {
    //初始化
    init(){
      this.getUserList()
      this.getRoleList()
    },
    //获取用户列表
    async getUserList(){
      console.log(JSON.stringify(this.searchFrom));
      const res = await this.$http.get("getUser?searchFrom=" + JSON.stringify(this.searchFrom))
      console.log(`获取列表数据:${JSON.stringify(res)}`)
      this.tableData = res.data.data
      
    },
    //获取角色列表
    async getRoleList(){
      const res = await this.$http.get("getRoleDict")
      // console.log(`获取角色列表数据:${JSON.stringify(res)}`)
      this.roleOptions = res.data.data
      console.log(this.roleOptions)
    },
    //处理时间格式
    handleDate(row){
      return formatDateTime(row.creatTime)
    },
    //搜索
    handleSearch(){
      console.log(this.searchIndex)
      // console.log(this.searchFrom);
      if(this.searchIndex != undefined){
        console.log("进来了")
        this.searchFrom.roleName = this.roleOptions[this.searchIndex].roleName
      }
      this.getUserList()
    },
    //重置搜索条件
    handleReset(){
      //重置输入框等表单
      this.$refs['searchFrom'].resetFields()
      //重置时间选择器
      this.searchFrom.time = ''
      this.searchIndex = undefined
      this.searchFrom.roleName = ''
      this.getUserList()
    },
    //添加用户弹窗
    showAddDialog(){
      this.modelType = 0
      this.addForm.nickName =""
      this.dialogAddVisible = true
    },
    //编辑用户
    handleEdit(data){
      this.modelType = 1
      // console.log(data)
      //回显内容
      let {departInfo,nickName,userName} = data
      this.addForm.departInfo = departInfo
      // this.$refs.deparmentChoose.parentName= departInfo.departmentName
      //回显部门,因为此时组件刚刚加载,还不能获取到this.$refs的属性
      this.$nextTick( () => {
        console.log(this.$refs.deparmentChoose)
        this.$refs.deparmentChoose.parentName= departInfo[0].departmentName
      })
      // //回显角色名
      // this.addForm.roleInfo = roleInfo
      // for(let i = 0; i < this.roleOptions.length; i++){
      //   console.log(this.roleOptions)
      //   if(roleInfo.roleName == this.roleOptions[i].roleName){
      //     this.roleIndex = i
      //   }
      // }
      this.addForm.nickName = nickName
      this.addForm.userName = userName
      this.dialogAddVisible = true
      console.log(this.addForm)
    },
    //添加用户
    async addUser(){
      let that = this
      this.addForm.roleInfo = this.roleOptions[this.roleIndex]
      if(this.departObj.departmentId){
        this.addForm.departInfo[0]=this.departObj
      }
      this.$refs['addForm'].validate(async (valid) => {
        console.log(valid)
          if (valid) {
            if(that.modelType ==0){
              const res = await that.$http.post("addUser", that.addForm)
              console.log(`添加用户:${JSON.stringify(res)}`)
            }else{
              const res = await that.$http.post("updateUser", that.addForm)
              console.log(`编辑用户:${JSON.stringify(res)}`)
            }
            
            that.getUserList()
          } else {
            return false;
          }
        });
      this.dialogAddVisible = false

    },
    //选择组织节点
    chooseNode(data){
      console.log(`所属组织节点信息: ${JSON.stringify(data)}`)
      this.departObj.departmentId = data.id
      this.departObj.departmentName = data.label
      console.log(this.departObj)
    },
    //清空所选组织
    clearInupt(){
      this.departObj = {}
      this.$refs.deparmentChoose.clearInupt()
      // console.log(this.$refs.deparmentChoose)
    },
    //清空输入项
    clearAddDialog(){
      this.$refs['addForm'].resetFields()
      this.roleIndex =  undefined
      this.clearInupt()
      // console.log(this.addForm)
      this.dialogAddVisible = false
    },
    //删除用户
    async handleDelete(data){
      console.log(data)
      const res = await this.$http.get("deleteUser?userName=" + data.userName)
      console.log(`删除用户:${JSON.stringify(res)}`)
      this.getUserList()
    },
    
    //重置密码
    resetPassword(){

    },
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