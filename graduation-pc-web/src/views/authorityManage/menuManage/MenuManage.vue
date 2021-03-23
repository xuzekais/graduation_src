<template>
  <div>
    <my-header title="菜单管理"></my-header>
    <h2>菜单关咯,呵呵呵</h2>
    <span>对吧!!</span>
  </div>
</template>
<script>
import MyHeader from '../../../components/MyHeader/MyHeader';
export default {
  name: 'MenuManage',
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
  // div{
  //   margin: 20px;
  //   border: 1px solid #000
  // }
</style>