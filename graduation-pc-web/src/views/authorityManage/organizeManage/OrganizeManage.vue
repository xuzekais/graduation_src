<template>
  <div>
    <!-- 头部标题 -->
    <my-header title="组织管理"></my-header>
    <!-- 主体内容 -->
    <section class="content">
      <!-- 功能区 -->
      <section class="content-operation">
        <el-row>
          <el-button type="primary">添加子部门</el-button>
          <el-button >添加一级部门</el-button>
          <el-button type="danger">批量删除</el-button>
          <el-button >刷新</el-button>
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
                
                <el-row class="searchInput">
                  <el-input
                    placeholder="输入部门并搜索"
                    suffix-icon="el-icon-search"
                    v-model="input1">
                  </el-input>
                </el-row>
                
                <!-- 组织树 -->
                <el-row>

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
              <div>
                <el-form ref="departmentForm" :model="departmentForm" label-width="80px">
                  <el-form-item label="部门名称" required="">
                    <el-input v-model="departmentForm.departmentName"></el-input>
                  </el-form-item>
                  <!-- <el-form-item label="部门级别">
                    <el-select v-model="form.region" placeholder="请选择活动区域">
                      <el-option label="区域一" value="shanghai"></el-option>
                      <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="活动时间">
                    <el-col :span="11">
                      <el-date-picker type="date" placeholder="选择日期" v-model="form.date1" style="width: 100%;"></el-date-picker>
                    </el-col>
                    <el-col class="line" :span="2">-</el-col>
                    <el-col :span="11">
                      <el-time-picker placeholder="选择时间" v-model="form.date2" style="width: 100%;"></el-time-picker>
                    </el-col>
                  </el-form-item>
                  <el-form-item label="即时配送">
                    <el-switch v-model="form.delivery"></el-switch>
                  </el-form-item>
                  <el-form-item label="活动性质">
                    <el-checkbox-group v-model="form.type">
                      <el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
                      <el-checkbox label="地推活动" name="type"></el-checkbox>
                      <el-checkbox label="线下主题活动" name="type"></el-checkbox>
                      <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
                    </el-checkbox-group>
                  </el-form-item>
                  <el-form-item label="特殊资源">
                    <el-radio-group v-model="form.resource">
                      <el-radio label="线上品牌商赞助"></el-radio>
                      <el-radio label="线下场地免费"></el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="活动形式">
                    <el-input type="textarea" v-model="form.desc"></el-input>
                  </el-form-item> -->
                  <el-form-item>
                    <el-button type="primary" @click="onSubmit">修改并保存</el-button>
                    <el-button>重置</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </section>
    </section>
  </div>
</template>
<script>
import MyHeader from '../../../components/MyHeader/MyHeader';
export default {
  name: 'OrganizeManage',
  components:{
    MyHeader
  },
  data() {
    return {
      //当前选中部门文本
      currentDepart:'11111',
      // 组织表单数据
      departmentForm:{
        departmentName:'',//部门名称

      },
    }
  },
  methods: {
    
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
</style>