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
            <el-form-item label="角色类型" prop="roleType">
              <el-select 
                v-model="searchFrom.roleType" 
                placeholder="请选择角色类型">
                <el-option label="普通用户" value="0"></el-option>
                <el-option label="管理员" value="1"></el-option>
                <el-option label="超级管理员" value="2"></el-option>
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
          <el-button type="danger" @click="batchRemove">批量删除</el-button>
          <el-button @click="resetPassword">重置密码</el-button>
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
            prop="department"
            label="所属部门">
          </el-table-column>
          <el-table-column
            prop="mobile"
            label="手机号码">
          </el-table-column>
          <el-table-column
            prop="roleType"
            label="角色类型">
          </el-table-column>
           <el-table-column
            prop="creatTime"
            label="创建时间">
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="100">
            <template slot-scope="scope">
              <el-button @click="handleClick(scope.row)" type="text" size="small">编辑</el-button>
              <el-button type="text" size="small">删除</el-button>
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
    <el-dialog title="收货地址" :visible.sync="dialogAddVisible">
      
      <el-form :model="addForm" :rules="addRules">

        <el-form-item label="昵称" :label-width="formLabelWidth" prop="nickName">
          <el-input v-model="addForm.nickName" placeholder="请输入昵称"></el-input>
        </el-form-item>

        <el-form-item label="手机号码" :label-width="formLabelWidth" prop="mobile">
          <el-input v-model="addForm.mobile" placeholder="请输入手机号码"></el-input>
        </el-form-item>

        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input v-model="addForm.password" placeholder="请输入密码"></el-input>
        </el-form-item>

        <el-form-item label="所属单位" :label-width="formLabelWidth">
          <el-input v-model="addForm.departmentId" placeholder="请输入密码"></el-input>
        </el-form-item>

        <el-form-item label= "角色类型" :label-width="formLabelWidth">
          <el-select v-model="addForm.roleType" placeholder="请选择角色类型">
            <el-option label="普通用户" value="0"></el-option>
            <el-option label="管理员" value="1"></el-option>
            <el-option label="超级管理员" value="2"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="活动名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="活动区域" :label-width="formLabelWidth">
          <el-select v-model="form.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import MyHeader from '../../../components/MyHeader/MyHeader';
export default {
  name: 'UserManage',
  components:{
    MyHeader
  },
  data() {
    return {
      //搜索条件表单信息
      searchFrom:{
        userName: '',//账号
        nickName: '',//昵称
        department: '',//所属部门
        //phoneNumber: '',//手机号码
        roleType: '', //角色类型  0:普通用户 1:管理员 2:超级管理员
        time:'',//时间范围
      },
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
        {
          userName: 'admin',//账号
          nickName: 'admin',//昵称
          department: '大公司',//所属部门
          phoneNumber: '18420014917',//手机号码
          roleType: '普通用户', //角色类型  0:普通用户 1:管理员 2:超级管理员
          creatTime:'2021-03-09',
        },
        {
          userName: 'manager',//账号
          nickName: '大管理员',//昵称
          department: '小公司',//所属部门
          phoneNumber: '18476301080',//手机号码
          roleType: '超级管理员', //角色类型  0:普通用户 1:管理员 2:超级管理员
          creatTime:'2021-03-10',
        },
      ],
      
      //添加用户弹窗
      dialogAddVisible: false,
      formLabelWidth: '120px',
      //添加用户表单
      addForm:{
        nickName: '',//昵称
        mobile:'',//手机号码
        password: '',//密码
        roleType: '',//角色类型
        departmentId: '',//部门ID
      },
      //添加用户的检验规则
      addRules:{
        nickName:[{required:true,trigger:"blur"}],
        mobile:[{required:true}],

      }

    }
  },
  created(){
    //
  },
  methods: {
    //-------------------------------网络请求
    //获取角色类型下拉框
    getRoleTypeList(){

    },
    //搜索
    handleSearch(){
      console.log(this.searchFrom);
      
    },
    //重置搜索条件
    handleReset(){
      //重置输入框等表单
      this.$refs['searchFrom'].resetFields()
      //重置时间选择器
      this.searchFrom.time = ''
    },
    //添加用户弹窗
    showAddDialog(){
      this.getRoleTypeList()
      this.dialogAddVisible = true
    },
    //添加用户
    addUser(){

    },
    //批量删除
    batchRemove(){

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
</style>