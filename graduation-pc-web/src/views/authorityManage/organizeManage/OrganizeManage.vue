<template>
  <div>
    <!-- 头部标题 -->
    <my-header title="组织管理"></my-header>
    <!-- 主体内容 -->
    <section class="content">
      <!-- 功能区 -->
      <section class="content-operation">
        <el-row>
          <el-button type="primary" @click="dialogAddVisible = true">添加组织</el-button>
          <!-- <el-button type="danger">批量删除</el-button> -->
        </el-row>
      </section>
      <!-- 组织信息 -->
      <section class="content-mainInfo">
        <el-row gutter="20">

          <!-- 左边组织树 -->
          <el-col span="7">
            <el-card shadow="never">
              <div slot="header" >
                <span>组织列表</span>
              </div>
              <div>
                <el-row class="alert">
                  <el-alert
                    title="当前选择编辑:"
                    :description="currentDepart"
                    type="info"
                    :closable="false"
                    show-icon>
                  </el-alert>
                </el-row>
                <!-- 组织树 -->
                <el-row>
                  <my-tree @getInfo="getInfo" :key="changeIndex"></my-tree>
                </el-row>
              </div>
            </el-card>
          </el-col>

          <!-- 右边组织信息 -->
          <el-col span="16">
            <el-card shadow="never">
              <div slot="header">
                <span>组织信息</span>
              </div>
              <div class="depart-info">
                <el-form 
                  ref="departmentForm" 
                  :model="departmentForm" 
                  label-width="80px"
                  prop="departmentForm"
                  :rules="updateRules">
                  <el-form-item label="部门名称" prop="departmentName">
                    <el-input v-model="departmentForm.departmentName"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="onUpate">修改并保存</el-button>
                    <el-button type="danger" @click="onRemove">删除</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </section>
    </section>

    <!-- 添加用户弹窗 -->
    <el-dialog title="添加组织" :visible.sync="dialogAddVisible" @closed="clearAll" class="add-dialog">
      
      <el-form :model="addForm" :rules="addRules" class="add-form" ref="addForm">
        
        <el-form-item label="所属组织" :label-width="formLabelWidth" prop="parentId" class="parent-item">
          <my-department-choose
            ref="deparmentChoose"
            @chooseNode="chooseNode" 
            @clearInupt="clearInupt"
            :key="changeIndex"></my-department-choose>
        </el-form-item>

        <!-- <el-form-item label="所属组织" :label-width="formLabelWidth" prop="parentId" class="parent-item">
          <el-input v-model="addForm.nickName" placeholder="请选择所属组织"></el-input>
        <el-button @click="dialogAddVisible = false">清空已选</el-button>
        </el-form-item> -->

        <el-form-item label="组织名称" :label-width="formLabelWidth" prop="departmentName">
          <el-input v-model="addForm.departmentName" placeholder="请输入组织名称"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="clearAll">取 消</el-button>
        <el-button type="primary" @click="addDepartment">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import MyHeader from '../../../components/MyHeader/MyHeader';
import MyTree from '../../../components/MyTree/MyTree';
import MyDepartmentChoose from '../../../components/MyDepartmentChoose/MyDepartmentChoose'
export default {
  name: 'OrganizeManage',
  components:{
    MyHeader,
    MyTree,
    MyDepartmentChoose
  },
  data() {
    return {
      //控制是否重新渲染组件
      changeIndex: 0,
      //当前选中部门文本
      currentDepart:'',
      // 组织表单数据
      departmentForm:{
        departmentName:'',//部门名称
        departmentId:"",//部门ID
      },
      //修改组织校验规则
      updateRules:{
        departmentName:[{required: true, message: "请输入组织名称", trigger: "change"}]
      },
      //添加组织弹窗
      dialogAddVisible: false,
      formLabelWidth: '80px',
      //添加组织表单
      addForm:{
        parentId: '',//父级ID
        departmentName: '',//组织名称
      },
      //添加组织校验规则
      addRules:{
        parentId:[{required: true, message: "请选择父级组织", trigger: "change"}],
        departmentName:[{required: true, message: "请输入组织名称", trigger: "blur"}]
      },
      
    }
  },
  methods: {
    //初始化
    async init(){
      // const res = await this.$http.get("getInitialDepatment")
      // console.log(res)
    },
    //获取单个组织的信息
    getInfo(data){
      console.log(data)
      //赋值给左边提示
      this.currentDepart = data.departmentName
      //赋值给右边表单
      this.departmentForm = data
    },
    //修改组织信息
    async onUpate(){
      console.log(`当前选择的部门:${JSON.stringify(this.departmentForm)}`)
      const res = await this.$http.post("updateDepartment",this.departmentForm)
      console.log(`修改组织接口返回数据:${JSON.stringify(res)}`)
      this.changeIndex += 1
    },
    //删除组织
    async onRemove(){
      let {departmentId,parentId} = this.departmentForm
      const res = await this.$http.get("deleteDepatment?departmentId=" + departmentId +"&parentId=" + parentId)
      console.log(`删除组织接口返回数据:${JSON.stringify(res)}`)
      this.departmentForm = {}
      this.changeIndex += 1
    },
    //获取添加组织时的父级id
    chooseNode(data){
      console.log(data)
      this.addForm.parentId = data
    },
    //清空选择内容
    clearInupt(){
      this.addForm.parentId = ""
    },
    //清空全部内容
    clearAll(){
      this.clearInupt()
      this.$refs.deparmentChoose.clearInupt()
      this.addForm.departmentName = ""
      this.dialogAddVisible = false
    },
    //添加组织
    addDepartment(){
      console.log(this.addForm)
      let that = this
      this.$refs.addForm.validate( async (valid) => {
        if(valid){
          //调用添加组织接口
          const res = await that.$http.post("addDepatment",that.addForm)
          console.log(res)
          console.log(`添加组织接口请求成功: ${JSON.stringify(res)}`)
          this.changeIndex += 1
          this.dialogAddVisible = false
          that.clearAll()
        }else{
          //this.clearAll()
          return false
        }
      })
    },
  },
  created() {
    this.init()
  }
}
</script>

<style lang="scss" scoped>
  // 主体内容
  .content{
    padding: 20px 10px 10px 10px;
  }
  .content-operation{
    
  }
  // 组织信息
  .content-mainInfo{
    margin-top: 20px;
  }
  //消息提示
  .content-mainInfo .alert{
    margin-bottom: 20px;
  }

  //组织信息的内容
  .depart-info{
    width: 50%;
  }

  //添加组织弹窗
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

  // .add-form{
  //   width: 50%;
  // }
</style>