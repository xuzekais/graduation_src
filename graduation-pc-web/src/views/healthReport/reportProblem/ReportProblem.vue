<template>
  <div>
    <my-header title="上报问题配置管理"></my-header>

    <h2>我是上报问题,哈哈哈</h2>
    <span>对吧!!</span>
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
      model: {}
    }
  },
  methods: {
    
  }
}
</script>

<style lang="scss" scoped>

</style>