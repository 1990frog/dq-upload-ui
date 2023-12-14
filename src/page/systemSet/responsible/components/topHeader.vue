<template>
  <div class="responsible-top">
    <div class="left">
      <el-input
        clearable
        placeholder="请输入责任人"
        v-model="keyword"
        size="mini"
        @keyup.enter.native="searchTable"
      />

      <el-button
        class="searchBtn"
        icon="el-icon-search"
        type="primary"
        size="mini"
        @click="searchTable"
        >查询</el-button>
    </div>

    <div class="right">
      <el-button type="primary" icon="el-icon-plus" size="mini" @click="newAdd">新增</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      keyword: ''
    }
  },

  methods: {
    searchTable () {
      this.$emit('getTableData', this.keyword)
    },

    newAdd () {
      this.$emit('onAdd')
    }
  }
}
</script>

<style lang="scss">
.responsible-top {
  display: flex;
  justify-content: space-between;
  .left {
    display: flex;
    .searchBtn {
      margin-left: 10px;
    }
    .input {
      width: 150px;
    }
  }
}
</style>