<!--
 * @Author: your name
 * @Date: 2021-03-08 13:26:26
 * @LastEditTime: 2021-03-08 16:17:46
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \clibrain-data-quality-v2.5\src\page\jigouweihu\components\TopHeader.vue
-->

<template>
  <div class="organMaintain-top">
    <div class="left">
      <el-input
        clearable
        placeholder="请输入机构名称 / 编码"
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
        >查询</el-button
      >
    </div>
    <div class="right">
      <el-button type="primary" icon="el-icon-plus" size="mini" @click="newAdd"
        >新增</el-button
      >
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },

  computed: {
    keyword: {
      get() {
        return this.$store.state.jigouweihu.keyword;
      },
      set(val) {
        this.$store.commit('SET_KEYWORD', val);
      }
    }
  },

  methods: {
    searchTable() {
      this.$emit('search');
    },

    newAdd() {
      this.$store.commit('SET_DIALOGVISIBLE', true);
      this.$emit('onAdd');
    }
  }
};
</script>

<style lang="scss" scoped>
.organMaintain-top {
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
