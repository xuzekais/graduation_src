<template>
  <div>
    <my-header title="上报记录管理"></my-header>
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
            <el-form-item label="人员名字" prop="nickeName">
              <el-input 
                v-model="searchFrom.nickeName"
                clearable
                placeholder="请输入人员名字">
              </el-input>
            </el-form-item>

            <!-- <el-form-item label="组织名字" prop="departmentName">
              <el-input 
                v-model="searchFrom.departmentName"
                clearable
                placeholder="请输入组织名字">
              </el-input>
            </el-form-item> -->


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
          <el-button type="primary" @click="showAddDialog">新增上报</el-button>
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
    <el-dialog title="新增人员上报" 
               :visible.sync="dialogAddVisible"
               class="add-dialog"
               @closed="clearAddDialog">
      <el-form :model="dialogForm" :rules="dialogRules"  ref="dialogForm" >
        <el-row>
          <el-col :span="15">
            <el-form-item label="待上报人员" :label-width="formLabelWidth" prop="userName">
              <el-autocomplete
                class="inline-input"
                v-model="dialogForm.nickName"
                :fetch-suggestions="querySearch"
                value-key="nickName"
                :disabled="isReport"
                placeholder="请选择人员"
                highlight-first-item
                @select="handleSelect">
              </el-autocomplete>
            </el-form-item>
          </el-col>
          <el-button style="margin-left:20px;" type="primary" @click="handleReport">开始上报</el-button>
        </el-row>
        
        <div v-if="isReport" style="margin-top:10px;">
          <el-divider >上报内容</el-divider>
          <el-form-item label="是否去过风险地区" label-width="150px" prop="isGoDanger">
            <el-select 
              v-model="dialogForm.isGoDanger" 
              placeholder="请选择是否去过风险地区">
              <el-option :key="0" label="否" value="否"></el-option>
              <el-option :key="1" label="是" value="是"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否打过疫苗" label-width="150px" prop="isVaccine">
            <el-select 
              v-model="dialogForm.isVaccine" 
              placeholder="请选择是否打过疫苗">
              <el-option :key="0" label="否" value="否"></el-option>
              <el-option :key="1" label="是" value="是"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否接触过疑似患者" label-width="150px" prop="isEngage">
            <el-select 
              v-model="dialogForm.isEngage" 
              placeholder="请选择是否接触过疑似患者">
              <el-option :key="0" label="否" value="否"></el-option>
              <el-option :key="1" label="是" value="是"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="人员状态" label-width="150px" prop="peopleStatus">
            <el-select 
              v-model="dialogForm.peopleStatus"
              placeholder="请选择人员状态">
              <el-option :key="0" label="在家办公" value="在家办公"></el-option>
              <el-option :key="1" label="在司办公" value="在司办公"></el-option>
              <el-option :key="2" label="已退休" value="已退休"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item 
            v-for="(item,index) in problemList" 
            :key="index"
            label-width="150px"
            :label="item.optionTitle"
            :required="!isRequired">
              <!-- 动态渲染单选下拉框 -->
              <div v-if="item.optionType == 1">
                <el-select 
                  v-model="dialogForm.exAnswerList[index]" 
                  placeholder="请选择答案(单选)">
                  <el-option
                    v-for="hitem in item.sourceList"
                    :key="hitem.value"
                    :label="hitem.label"
                    :value="hitem.label">
                  </el-option>
                </el-select>
              </div>
              <!-- 动态渲染多选下拉框 -->
              <div v-if="item.optionType == 2">
                <el-select 
                  v-model="dialogForm.exAnswerList[index]" 
                  multiple
                  placeholder="请选择答案(多选)">
                  <el-option
                    v-for="hitem in item.sourceList"
                    :key="hitem.value"
                    :label="hitem.label"
                    :value="hitem.label">
                  </el-option>
                </el-select>
              </div>
              <!-- 动态渲染输入框 -->
              <div v-if="item.optionType == 3">
                <el-input 
                  v-model="dialogForm.exAnswerList[index]"
                  clearable
                  placeholder="请输入答案">
                </el-input>
              </div>
          </el-form-item>  
        </div>
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
  name: 'ReportRecord',
  components:{
    MyHeader
  },
  data() {
    return {
      searchFrom:{
        nickeName: '',//人员名字
        departmentName: '',//组织名字
        isgohight:'',//是否去过中高风险地区
      },
      //控制弹窗的显示
      dialogAddVisible:false,
      formLabelWidth: '100px',
      //弹窗的表单
      dialogForm:{
        nickName:'',//用户名
        userName:'',//用户ID
        isGoDanger:'',//是否去过风险地区
        isVaccine:'',//是否打过疫苗
        isEngage:'',//是否接触过疑似患者
        peopleStatus:'',//人员状态
        exAnswerList:[],//额外的答案信息
      },
      //弹窗的校验规则
      dialogRules:{
        isGoDanger:[{ required: true, message: '请选择是否去过风险地区', trigger: 'blur' }],
        isVaccine:[{ required: true, message: '请选择是否打过疫苗', trigger: 'blur' }],
        isEngage:[{ required: true, message: '请选择是否接触过疑似患者', trigger: 'blur' }],
        peopleStatus:[{ required: true, message: '请选择人员状态', trigger: 'blur' }],

      },
      //人员列表信息
      userList:[
      ],
      //当前否在申报
      isReport: false,
      //问题列表
      problemList:[
        {optionTitle:'是否有发烧等症状',optionType:'1',isRequired:1,sourceList:[{value:'0',label:'否'},{value:'1',label:'是'}],isBuilt:'0'},
        {optionTitle:'清明假期是否有出省行为',optionType:'1',isRequired:1,sourceList:[{value:'0',label:'否'},{value:'1',label:'是'}],isBuilt:'0'},
        {optionTitle:'如果舍友是废狗怎么办',optionType:'2',isRequired:1,sourceList:[{value:'0',label:'打爆他'},{value:'1',label:'喂他吃屎'},{value:'2',label:'叼他妈'},{value:'3',label:'叼臭他'}],isBuilt:'0'},
        {optionTitle:'舍友只会约炮怎么办',optionType:'3',isRequired:1,sourceList:[{value:'0',label:'否'},{value:'1',label:'是'}],isBuilt:'0'},
      ],
    }
  },
  methods: {
    //初始化
    init(){
      this.getUserList()
      this.getProblemList()
    },
    //获取问题列表
    async getProblemList(){
      // const res = await this.$http.get("")
      // console.log(`问题列表${res}`)
      // this.problemList = res.data.data
    },
    //获取人员列表信息
    async getUserList(){
      const res = await this.$http.get("getUser?searchFrom=" + JSON.stringify({}))
      console.log(`人员列表${res}`)
      this.userList = res.data.data
    },
    //返回人员选择输入建议列表
    querySearch(queryString, cb){
      console.log(queryString)
      let restaurants = this.userList;
      let results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
        // 调用 callback 返回建议列表的数据
      console.log(results)
      cb(results);
    },
    //过滤人员输入信息
    createFilter(queryString) {
      return (restaurant) => {
        console.log(restaurant)
        return (restaurant.nickName.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    //选择人员
    handleSelect(item) {
      console.log(item);
      this.dialogForm.userName = item.userName
    },
    //展示上报内容
    handleReport(){
      if(!this.dialogForm.userName){
        this.$message.error('请选中一个人员');
      }else{
        this.isReport = true
      }
    },
    //新增申报前的准备
    showAddDialog(){
      this.dialogAddVisible = true
    },
    //清空申报的信息
    clearAddDialog(){
      this.isReport = false
      this.dialogForm.nickName = ''
      this.dialogForm.userName = ''
      this.dialogForm.isGoDanger = ''
      this.dialogForm.isVaccine = ''
      this.dialogForm.isEngage = ''
      this.dialogForm.peopleStatus = ''
      this.dialogForm.exAnswerList = []
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
  .el-divider{
    margin-bottom: 20px;
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