<template>
  <div>
    <my-header title="菜单管理"></my-header>
    <!-- 主体内容 -->
    <section class="content">
      <!-- 功能区 -->
      <section class="content-operation">
        <el-row>
          <el-button type="primary" @click="dialogAddVisible = true">添加菜单</el-button>
          <!-- <el-button type="danger">批量删除</el-button> -->
        </el-row>
      </section>

      <section class="content-mainInfo">
        <el-row gutter="20">

          <!-- 左边组织树 -->
          <el-col span="7">
            <el-card shadow="never">
              <div slot="header" >
                <span>菜单列表</span>
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
                  <el-row class="searchInput">
                    <el-input
                      placeholder="搜索菜单"
                      v-model="filterText">
                    </el-input>
                  </el-row>
                  
                  <el-row class="tree">
                    <el-tree
                      ref="tree"
                      :data="treeData"
                      :props="defaultProps"
                      :filter-node-method="filterNode"
                      highlight-current
                      :expand-on-click-node="false"
                      @node-click="getMenuInfo"
                    >
                    <!-- highlight-current
                      :expand-on-click-node="false"
                      :filter-node-method="filterNode"
                      @node-click="getInfo" -->
                    </el-tree>
                  </el-row>
                </el-row>
              </div>
            </el-card>
          </el-col>

          <!-- 右边组织信息 -->
          <el-col span="16">
            <el-card shadow="never">
              <div slot="header">
                <span>菜单信息</span>
              </div>
              <div class="depart-info">
                <el-form 
                  ref="menuForm" 
                  :model="menuForm" 
                  label-width="80px"
                  prop="menuForm"
                  :rules="menuRules">
                  <el-form-item label="类型" prop="isParent">
                    <span>{{menuForm.isParent == 1 ? '导航' : '菜单'}}</span>
                  </el-form-item>

                  <el-form-item label="名称" prop="menuName">
                    <el-input v-model="menuForm.menuName"></el-input>
                  </el-form-item>

                  <el-form-item label="路径" prop="menuPath">
                    <el-input v-model="menuForm.menuPath"></el-input>
                  </el-form-item>

                  <el-form-item label="排序值" prop="order">
                    <el-select v-model="menuForm.order" placeholder="请选择排序值">
                      <el-option
                        v-for="item in orderOptions"
                        :key="item.value"
                        :label="item.value"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>

                  <el-form-item label="是否启用" prop="isUsed">
                    <el-switch
                      v-model="menuForm.isUsed"
                      :active-text="menuForm.isUsed == true ? '启用' : '不启用'"
                      active-value="1"
                      inactive-value="0">
                    </el-switch>
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

    <!-- 添加菜单弹窗 -->
    <el-dialog title="添加菜单" :visible.sync="dialogAddVisible" @closed="clearAll" class="add-dialog">
      
      <el-form :model="addForm" :rules="addRules" class="add-form" ref="addForm">
        
        <el-form-item label="类型" :label-width="formLabelWidth" prop="isParent" class="parent-item">
          <el-select v-model="addForm.isParent" placeholder="请选择类型">
            <el-option
              v-for="item in isParentOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item 
          label="所属导航" 
          :label-width="formLabelWidth" 
          v-show="addForm.isParent == 0"
          prop="parentId">
          <el-select v-model="addForm.parentId" placeholder="请选择所属导航">
            <el-option
              v-for="item in treeData"
              :key="item._id"
              :label="item.menuName"
              :value="item._id">
            </el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item label="名称" :label-width="formLabelWidth" prop="menuName">
          <el-input v-model="addForm.menuName" placeholder="请输入名称"></el-input>
        </el-form-item>

        <el-form-item label="路径" :label-width="formLabelWidth" prop="menuPath">
          <el-input v-model="addForm.menuPath" placeholder="请输入路径"></el-input>
        </el-form-item>

        <el-form-item label="排序值"  :label-width="formLabelWidth" prop="order">
          <el-select v-model="addForm.order" placeholder="请选择排序值">
            <el-option
              v-for="item in orderOptions"
              :key="item.value"
              :label="item.value"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="是否启用" :label-width="formLabelWidth" prop="isUsed">
          <el-switch
            v-model="addForm.isUsed"
            :active-text="addForm.isUsed == true ? '启用' : '不启用'"
            active-value="1"
            inactive-value="0">
          </el-switch>
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
export default {
  name: 'MenuManage',
  components:{
    MyHeader
  },
  //监听搜索框的值的变化
  watch:{
    filterText(val){
      console.log(val)
      this.$refs.tree.filter(val)
    }
  },
  data() {
    //所属类型自定义检验规则
    // var myRules = (rlue,value,callback) => {
    //     if(this.addForm.isParent == 0){
    //       if (value == '') {
    //         callback(new Error('请选择所属组织'));
    //       }
    //     }
    // }
    return {
      
      //控制是否重新渲染组件
      changeIndex: 0,
      //当前选中部门文本
      currentDepart:'',
      //搜索框的值
      filterText: '',
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
      //排序值的下拉框
      orderOptions:[
        {value: 0},
        {value: 1},
        {value: 2},
        {value: 3},
        {value: 4},
        {value: 5},
        {value: 6},
        {value: 7},
        {value: 8},
        {value: 9},
      ],
      //菜单表单数据
      menuForm:{
        isParent: 0,// 0:菜单,1:导航
        menuName: "",//名称
        menuPath: "",//路径
        order: 0,//排序值
        isUsed: 0,//是否启用
      },
      //菜单表单校验规则
      menuRules:{
        menuName:[{required: true, message: "请输入名称", trigger: "blur"}],
        menuPath:[{required: true, message: "请输入路径", trigger: "blur"}],
      },
      //是否展示添加菜单弹窗
      dialogAddVisible: false,
      formLabelWidth: '80px',
      //选择类型下拉框
      isParentOptions:[
        {value: 0,label: "菜单"},
        {value: 1,label: "导航"}
      ],
      //添加组织表单
      addForm:{
        isParent: 0,//0:菜单,1:导航
        parentId: "",//父级ID
        menuName: "",//名称
        menuPath: "",//路径
        order: 0,//排序值
        isUsed: 0,//是否启用
      },
      //添加组织校验规则
      addRules:{
        menuName:[{required: true, message: "请输入名称", trigger: "blur"}],
        menuPath:[{required: true, message: "请输入路径", trigger: "blur"}]
        // parentId:[{required: true, validator: myRules ,trigger: "change"}]

      },
    }
  },
  methods: {
    //初始化
    async init (){
      const res = await this.$http.get("getAllMenu")
      console.log(`初始化数据结果: ${JSON.stringify(res)}`)
      this.treeData = res.data.data
    },
    //过滤搜索菜单关键树
    filterNode(value, data) {
      console.log(`value:${JSON.stringify(value)}`)
      console.log(`data:${JSON.stringify(data)}`)
      if (!value) return true
      return data.menuName.indexOf(value) !== -1
    },
    //获取单个菜单信息
    async getMenuInfo (data) {
      console.log(`e:${JSON.stringify(data)}`)
      this.currentDepart = data.menuName
      this.menuForm = data
    },
    //清空添加菜单的内容
    clearAll(){
      this.addForm= {}
      this.dialogAddVisible = false
    },
    //增加菜单
    async addDepartment (){
      console.log(this.addForm)
      let that = this
      console.log(this.$refs.addForm)
      this.$refs.addForm.validate( async (valid) => {
        if(valid){
          //调用添加组织接口
          const res = await that.$http.post("addMenu",that.addForm)
          console.log(res)
          console.log(`添加菜单接口请求成功: ${JSON.stringify(res)}`)
          // this.changeIndex += 1
          this.dialogAddVisible = false
          that.clearAll()
        }else{
          //this.clearAll()
          console.log("出错了")
          return false
        }
      })
    },
    //修改菜单信息
    async onUpate(){
      console.log(this.menuForm)
      let that = this
      console.log(this.$refs.addForm)
      this.$refs.menuForm.validate( async (valid) => {
        if(valid){
          //调用添加组织接口
          const res = await that.$http.post("updateMenu",that.menuForm)
          console.log(res)
          console.log(`修改菜单接口请求成功: ${JSON.stringify(res)}`)
        }else{
          //this.clearAll()
          console.log("出错了")
          return false
        }
      })
    },
    async onRemove(){
      console.log(this.menuForm)
      const res = await this.$http.get("deleteMenu?id=" + this.menuForm._id)
      console.log(`删除菜单接口请求成功: ${JSON.stringify(res)}`)

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
  .tree{
    margin-top: 20px;
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
</style>