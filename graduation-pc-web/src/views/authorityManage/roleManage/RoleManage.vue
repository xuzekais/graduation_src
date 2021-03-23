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

            <!-- <el-form-item label="所属部门" prop="department">
              <el-input 
                v-model="searchFrom.department"
                clearable
                placeholder="请输入所属部门">
              </el-input>
            </el-form-item> -->
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
          <el-button type="primary" @click="showAddDialog">添加角色</el-button>
          <el-button type="danger" @click="batchRemove">批量删除</el-button>
          <el-button @click="resetPassword">刷新</el-button>
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
            fixed="right"
            label="操作"
            width="200">
            <template slot-scope="scope">
              <el-button @click="handleClick(scope.row)" type="text" size="small">菜单权限</el-button>
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
       tableData:[
        /* {
          roleName: '',//角色名称
          roleCode: '',//角色编码
          description: '',//备注
        }, */
        {
          roleName: '普通用户',//角色名称
          roleCode: 'OPERATE',//角色编码
          description: '普通的访客',//备注
        },
        {
          roleName: '管理员',//角色名称
          roleCode: 'ADMIN',//角色编码
          description: '管理员',//备注
        },
      ],
    }
  },
  methods: {
    //搜索
    handleSearch(){

    },
    handleReset(){
      this.$refs['searchFrom'].resetFields()
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