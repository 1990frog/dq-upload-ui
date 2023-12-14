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
        placeholder="请输入模型名称"
        v-model="search.modelComment"
        size="mini"
        class="mar-r-10"
        @keyup.enter.native="searchTable"
      />
      <el-input
        clearable
        placeholder="请输入表名称"
        v-model="search.tableComment"
        size="mini"
        class="mar-r-10"
        @keyup.enter.native="searchTable"
      />
      <el-input
        clearable
        placeholder="请输入字段名称"
        v-model="search.fieldComment"
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
      <el-button type="primary" icon="el-icon-refresh" size="mini" @click="showJianKongShuJu"
              >更新表字段</el-button
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
    search: {
      get() {
        return this.$store.state.moxingweihu.search;
      },
      set(val) {
        this.$store.commit('SET_SEARCH', val);
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
    },
    showJianKongShuJu(){
      this.$emit('showJianKongShuJu');
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
