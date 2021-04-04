<template>
  <div>
    <my-header title="消息通知"></my-header>

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
            <el-form-item label="标题" prop="title">
              <el-input 
                v-model="searchFrom.title"
                clearable
                placeholder="请输入标题">
              </el-input>
            </el-form-item>

            <el-form-item label="消息类型" prop="noticeType">
              <el-select v-model="searchFrom.noticeType" placeholder="请选择消息类型">
                <el-option
                  v-for="item in noticeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="发送状态" prop="sendSataus">
              <el-select v-model="searchFrom.sendSataus" placeholder="请选择发送状态">
                <el-option
                  v-for="item in sendOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-row>

          <!-- <el-row>
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
          </el-row> -->
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
          <el-button type="primary" @click="showAddDialog">新增消息</el-button>
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
            prop="title"
            label="标题"
            width="180">
          </el-table-column>
          <el-table-column
            prop="noticeType"
            label="消息类型"
            width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.noticeType == '1' ? '文本通知' : '上报通知' }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="sendSataus"
            label="发送状态"
            width="100">
            <template slot-scope="scope">
              <el-tag 
                :type="scope.row.sendSataus == '1' ? 'danger': ''"
                size="medium">
                {{ scope.row.sendSataus == '1' ? '未发送' : '已发送' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="content"
            :formatter="handleDate"
            label="内容">
          </el-table-column>
          <el-table-column
            prop="creatTime"
            :formatter="handleDate"
            label="创建时间">
          </el-table-column>
          <el-table-column
            prop="sendTime"
            :formatter="handleDate"
            label="发送时间">
          </el-table-column>
          <el-table-column
            label="操作"
            width="200">
            <template slot-scope="scope">
              <el-button 
                @click="handleSend(scope.row)" 
                type="text" 
                size="small"
                style="color:#e6a23c;"
                v-if="scope.row.noticeType == '2' ? (scope.row.sendSataus == '2' ? false : true):true">
                发送
              </el-button>
              <el-button 
                @click="handleEdit(scope.row)" 
                type="text" 
                size="small"
                :disabled="scope.row.noticeType == '2' ? (scope.row.sendSataus == '2' ? true : false):false">
                {{scope.row.noticeType == '2' ? (scope.row.sendSataus == '2' ? '不可编辑' : '编辑'):'编辑'}}
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
    <el-dialog :title="this.modelType == 0 ? '新增消息' : '编辑消息'" 
               :visible.sync="dialogAddVisible"
               class="add-dialog"
               @closed="clearAddDialog">
      <el-form :model="dialogForm" :rules="dialogRules"  ref="dialogForm" >

        <el-form-item label="标题" :label-width="formLabelWidth" prop="title">
          <el-input 
            v-model="dialogForm.title" 
            placeholder="请输入标题"
            maxlength="20"
            show-word-limit>
          </el-input>
        </el-form-item>

        <el-form-item label="消息类型" :label-width="formLabelWidth" prop="noticeType">
          <el-select v-model="dialogForm.noticeType" placeholder="请选择消息类型">
            <el-option
              v-for="item in noticeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="可见部门" :label-width="formLabelWidth" prop="noticeType">
          <el-cascader
            v-model="dialogForm.toparty"
            :props="deparmentProps"
            clearable
            placeholder="请选择可见部门">
          </el-cascader>
        </el-form-item>
        
        <el-form-item label="内容" :label-width="formLabelWidth" prop="noticeType">
          <el-input
            v-model="dialogForm.content"
            type="textarea"
            placeholder="请输入内容"
            maxlength="100"
            show-word-limit>
          </el-input>
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
export default {
  name: 'InfoNotice',
  components:{
    MyHeader
  },
  data() {
    let that = this
    return {
      searchFrom:{
        title: '',//标题
        noticeType:'',//消息类型
        sendSataus:'',//发送状态
      },
      //消息类型枚举
      noticeOptions:[
        {label: '文本通知',value:'1'},
        {label: "上报通知",value:'2'}
      ],
      //发送状态枚举
      sendOptions:[
        {label: "未发送",value: "1"},
        {label: "已发送",value: "2"}
      ],
      //表格数据
      tableData:[
        {
          title:'20200402通知',
          noticeType: "1",
          sendSataus: "1",
          content:'很长很晨晨很长很晨晨很长很晨晨很长很晨晨很长很晨晨很长很晨晨很长很晨晨很长很晨晨很长很晨晨很长很晨晨很长很晨晨很长很晨晨很长很晨晨很长很晨晨很长很晨晨'
        },
        {
          title:'20200402通知',
          noticeType: "2",
          sendSataus: "2",
          content:"contentcontentcontentcontentcontentcontentcontentcontentcontentcontent"
        },
        {
          title:'20200402通知',
          noticeType: "1",
          sendSataus: "2",
          content:'很长很晨晨很长很晨晨很长很晨晨很长很晨晨很长很晨晨很长很晨晨很长很晨晨很长很晨晨很长很晨晨很长很晨晨很长很晨晨很长很晨晨很长很晨晨很长很晨晨很长很晨晨'
        },
        {
          title:'20200402通知',
          noticeType: "2",
          sendSataus: "1",
          content:'很长很晨晨很长很晨晨很长很晨晨很长很晨晨很长很晨晨很长很晨晨很长很晨晨很长很晨晨很长很晨晨很长很晨晨很长很晨晨很长很晨晨很长很晨晨很长很晨晨很长很晨晨'
        },
      ],
      //是否展示弹窗
      dialogAddVisible: false,
      formLabelWidth: '80px',
      //弹窗类型
      modelTyoe: 0,
      //弹窗数据
      dialogForm:{
        title:'',//标题
        noticeType: '1',//消息类型
        toparty:[],///选中的可见部门
        content: '',//内容
      },
      //弹窗表单校验规则
      dialogRules:{
        title: [{required:true,message:"标题不能为空", trigger:"blur" }],
        noticeType: [{required:true,message:"消息类型不能为空", trigger:"blur" }],
        toparty: [{required:true,message:"可见部门不能为空", trigger:"change" }],
        content: [{required:true,message:"内容不能为空", trigger:"change" }],
      },
      //加载部门下拉框
      deparmentProps:{
        lazy: true,
        async lazyLoad (node,resolve){
          console.log(node)
          if(node.level == 0){
            const res = await that.$http.get("getInitialDepatment")
            console.log(`初始父级部门：${JSON.stringify(res)}`)
            resolve(res.data.data)
          }else{
            const res = await that.$http.get("getSubsDepartment?id=" + node.data.id)
            console.log(`子级部门：${JSON.stringify(res)}`)
            resolve(res.data.data)
          }
        },
        leaf: 'isLeaf',
        value: 'id',
        multiple: true,
        checkStrictly: true,
        emitPath:false
      }
    }
  },
  methods: {
    //初始化
    init(){
      
    },
    //清空弹窗内的内容
    clearAddDialog(){
      this.dialogForm.title = ''
      this.dialogForm.noticeType = '1'
      this.dialogForm.content =''
      this.dialogForm.toparty =  []
      this.dialogAddVisible = false
    },
    //新增消息前的准备
    showAddDialog(){
      this.dialogAddVisible =true
    },
    
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