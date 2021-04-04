<template>
  <div>
    <my-header title="申报内容管理"></my-header>
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
            <el-form-item label="选项标题" prop="optionTitle">
              <el-input 
                v-model="searchFrom.optionTitle"
                clearable
                placeholder="请输入选项标题">
              </el-input>
            </el-form-item>

            <el-form-item label="选项类型" prop="optionType">
              <el-select v-model="searchFrom.optionType" placeholder="请选择选项类型">
                <el-option
                  v-for="item in typeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="是否必填" prop="isRequired">
              <el-select v-model="searchFrom.isRequired" placeholder="请选择是否必填">
                <el-option
                  v-for="item in requiredOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-row>

          <el-row>
            <el-form-item label="是否启用" prop="isEnable">
              <el-select v-model="searchFrom.isEnable" placeholder="请选择是否启用">
                <el-option
                  v-for="item in enableOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="创建时间">
              <el-date-picker
                v-model="searchFrom.time"
                clearable
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd">
              </el-date-picker>
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
          <el-button type="primary" @click="showAddDialog">添加选项</el-button>
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

          <!-- <el-table-column
            type="selection"
            width="55">
          </el-table-column> -->
          <el-table-column
            type="index"
            label="序号"
            width="50">
          </el-table-column>
          <el-table-column
            prop="optionTitle"
            label="选项标题"
            align='center'
            width="180">
          </el-table-column>
          <el-table-column
            prop="optionType"
            label="选项类型"
            align='center'
            width="100">
            <template slot-scope="scope">
              <span>{{ typeOptions[scope.row.optionType-1].label }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="sourceList"
            label="答案来源"
            align='center'>
            <template slot-scope="scope">
              <div v-if="scope.row.optionType != '3'">
                <span 
                  v-for="item in scope.row.sourceList"
                  :key="item.value">
                  {{item.label}}
                </span>
              </div>
              <div v-else>
                <span>用户自行输入答案</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="isEnable"
            label="是否启用"
            align='center'
            width="200">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.isEnable"
                active-value='1'
                inactive-value='0'
                :active-text="scope.row.isEnable== '1'? '启用':'不启用'"
                @change="handleEnable(scope.row)">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column
            prop="isRequired"
            label="是否必填"
            align='center'
            width="100">
            <template slot-scope="scope">
              <span>{{scope.row.isRequired == '1'? '是':'否'}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="order"
            label="填报顺序"
            align='center'
            width="100">
          </el-table-column>
          <el-table-column
            label="操作"
            width="200">
            <template slot-scope="scope">
              <el-button 
                @click="handleEdit(scope.row)" 
                type="text" 
                size="small">编辑
              </el-button>
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
    <el-dialog :title="this.modelType == 1 ? '新增选项' : '编辑选项'" 
               :visible.sync="dialogAddVisible"
               class="add-dialog"
               @closed="clearAddDialog">
      <el-form :model="dialogForm" :rules="dialogRules"  ref="dialogForm" >

        <el-form-item label="选项标题" :label-width="formLabelWidth" prop="optionTitle">
          <el-input 
            v-model="dialogForm.optionTitle" 
            placeholder="请输入选项标题"
            >
          </el-input>
        </el-form-item>

        <el-form-item label="选项类型" :label-width="formLabelWidth" prop="optionType">
          <el-select v-model="dialogForm.optionType" placeholder="请选择选项类型">
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <!-- <el-form-item label="是否启用" :label-width="formLabelWidth" prop="isEnable">
          <el-select v-model="dialogForm.isEnable" placeholder="请选择是否启用">
            <el-option
              v-for="item in enableOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item> -->

        <el-form-item label="填报排序" :label-width="formLabelWidth" prop="order">
          <el-input 
            v-model="dialogForm.order" 
            placeholder="请输入填报排序值（0-100）"
            >
          </el-input>
        </el-form-item>

        <el-form-item label="是否必填" :label-width="formLabelWidth" prop="isRequired">
          <el-select v-model="dialogForm.isRequired" placeholder="请选择是否启用">
            <el-option
              v-for="item in requiredOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        
        <div v-show="dialogForm.optionType != '3'">
          <el-form-item label="答案来源" :label-width="formLabelWidth" prop="sourceList" required>
            <section 
              v-for="(item, index) in dialogForm.sourceList"
              :key="index">
              <section v-if="index == 0" style="display: flex;">
                <el-input 
                  v-model="dialogForm.sourceList[index].label"
                  placeholder="请输入自定义答案"
                  clearable
                  @keyup.enter.native="addSourceList"
                  >
                </el-input>
                <el-button 
                  type="primary" 
                  icon="el-icon-plus" 
                  plain 
                  circle 
                  style="margin-left:10px;"
                  @click="addSourceList">
                </el-button>
              </section>
              <section v-if="index !=0" style="display:flex;margin-top:10px;">
                <el-input 
                  v-model="dialogForm.sourceList[index].label"
                  placeholder="请输入自定义答案"
                  clearable
                  @keyup.enter.native="addSourceList"
                  >
                </el-input>
                <el-button 
                  type="danger" 
                  icon="el-icon-delete" 
                  plain 
                  circle 
                  style="margin-left:10px;"
                  @click="removeSourceList(index)">
                </el-button>
              </section>
            </section>
          </el-form-item>
        </div>
        

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="clearAddDialog">取 消</el-button>
        <el-button type="primary" @click="addProblem">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import MyHeader from '../../../components/MyHeader/MyHeader';
export default {
  name: 'ReportProblem',
  components:{
    MyHeader
  },
  data() {
    return {
      //搜索表单
      searchFrom:{
        optionTitle:'',//选项标题
        optionType: '',//选项类型
        isRequired: '',//是否必填
        isEnable:'',//是否启用
      },
      //选项类型枚举
      typeOptions:[
        {value: '1',label:'单选框'},
        {value: '2',label:'复选框'},
        {value: '3',label:'输入框'}
      ],
      //是否必填枚举
      requiredOptions:[
        {value: '0', label:'否'},
        {value: '1', label: '是'}
      ],
      //是否启用枚举
      enableOptions:[
        {value: '0', label:'否'},
        {value: '1', label: '是'}
      ],
      //表格数据
      tableData:[
        // {
        //   optionTitle:'42',//选项标题
        //   optionType: '1',//选项类型
        //   isRequired: '1',//是否必填
        //   isEnable:'1',//是否启用
        //   order:'1',//填报顺序
        //   sourceList:[{value: '0', label:'否'},{value: '1', label:'是'}]
        // }
      ],
      //添加选项的窗口
      dialogAddVisible:false,
      formLabelWidth:'80px',
      //窗口类型
      modelType: 1,
      //窗口表单数据
      dialogForm:{
        optionTitle: '',//选项标题
        optionType: '1',//选项类型
        // isEnable:'',//是否启用
        isRequired: '0',//是否必填
        order: '1',//填报排序
        sourceList:[{value: '0',label:''}],//答案来源
      },
      //窗口校验规则
      dialogRules:{
        optionTitle:[{required:true,message:"选项标题不能为空", trigger:"blur" }],
        optionType:[{required:true,message:"请选择选项类型", trigger:"change" }],
        isRequired:[{required:true,message:"请选择是否必填", trigger:"change" }],
      }
    }
  },
  methods: {
    //初始化
    init(){
      this.getProblem()
    },
    //获取内容列表
    async getProblem(){
      const res = await this.$http.get("getProblemList?searchFrom=" + JSON.stringify(this.searchFrom))
      console.log(`获取的内容列表数据: ${JSON.stringify(res)}`)
      this.tableData = res.data.data
    },
    //搜索
    handleSearch(){
      console.log(this.searchFrom)
      this.getProblem()
    },
    //重置
    handleReset(){
      this.searchFrom.optionTitle = ''
      this.searchFrom.optionType = ''
      this.searchFrom.isRequired = ''
      this.searchFrom.isEnable = ''
      this.getProblem()
    },
    //添加选项前的准备
    showAddDialog(){
      this.dialogAddVisible= true
    },
    //增加一个新的答案
    addSourceList(){
      if(this.dialogForm.sourceList[this.dialogForm.sourceList.length - 1].label.trim() == ''){
        this.$message.error('请您填写完一项后再继续追加')
      }else{
        const number = (Number(this.dialogForm.sourceList[this.dialogForm.sourceList.length - 1].value) + 1).toString()
        let obj = {
          value: number,
          label: ''
        }
        this.dialogForm.sourceList.push(obj)
      }
    },
    //删除其中一个答案
    removeSourceList(index){
      this.dialogForm.sourceList.splice(index,1)
      this.$message.success('移除成功')
    },
    //编辑前的准备
    handleEdit(data){
      console.log(data)
      this.modelType = 2
      this.dialogForm._id = data._id
      this.dialogForm.optionTitle = data.optionTitle
      this.dialogForm.optionType = data.optionType
      // this.dialogForm.isEnable = data.isEnable
      this.dialogForm.order = data.order
      this.dialogForm.isRequired = data.isRequired
      this.dialogForm.sourceList = data.sourceList
      this.dialogAddVisible = true
      console.log(this.dialogForm)
    },
    //取消弹窗
    clearAddDialog(){
      this.modelType = 1
      this.dialogForm.optionTitle = ''
      this.dialogForm.optionType = '1'
      // this.dialogForm.isEnable = ''
      this.dialogForm.order = '1'
      this.dialogForm.isRequired = '0'
      this.dialogForm.sourceList = [{value: '0',label:''}]
      this.dialogAddVisible = false
    },
    //确认添加或修改问题
    addProblem(){
      this.$refs['dialogForm'].validate(async (valid) => {
        if (valid) {
          //判断是否需要用户自定义答案
          if(this.dialogForm.optionType != '3'){
            //判断答案是否为空
            if(this.dialogForm.sourceList[0].label == ''){
              this.$message.error("请输入至少一个自定义答案")
              return false
            }
          }
          //处理答案来源数据
          if(this.dialogForm.sourceList[this.dialogForm.sourceList.length - 1].label == ''){
            this.dialogForm.sourceList.pop()
          }
          //区分添加和编辑接口
          console.log(this.dialogForm)
          if(this.modelType == 1){
            const res = await this.$http.post("addProblem",this.dialogForm)
            console.log(`添加内容接口返回数据: ${JSON.stringify(res)}`)
            this.$message.success("添加成功")
          }else{
            const res = await this.$http.post("updateProblem",this.dialogForm)
            console.log(`添加内容接口返回数据: ${JSON.stringify(res)}`)
            this.$message.success("修改成功")
          }
          
          this.getProblem()
          // this.clearAddDialog()
          this.dialogAddVisible = false
        }
      });
    },
    //删除问题
    async handleDelete(data){
      console.log(data)
      const res = await this.$http.get("deleteProblem?id=" + data._id)
      console.log(`删除接口返回的数据:${JSON.stringify(res)}`)
      if(res.data.code == 200){
        this.$message.success("删除成功")
        this.getProblem()
      }
    },
    //处理启用
    async handleEnable(data){
      console.log(data)
      const res = await this.$http.get("getEnable?id=" + data._id + '&isEnable=' + data.isEnable)
      console.log(`删除接口返回的数据:${JSON.stringify(res)}`)
      if(res.data.code == 200){
        this.$message.success("更新成功")
        this.getProblem()
      } 
    },
  },
  created() {
    this.init()
  },
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
    margin-top: 10px;
    margin-bottom: 50px;
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