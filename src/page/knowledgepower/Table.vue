<!--
 * @Author: your name
 * @Date: 2021-03-01 17:53:11
 * @LastEditTime: 2021-03-11 18:21:37
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \clibrain-data-quality-v2.5\src\page\QuestionExamine\table.vue
-->
<template>
  <div>
    <div class="qe-top mar-b-10">
      <!-- <el-select class="select-w " v-model="search.type" placeholder="请选择" size="mini">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select> -->

      <el-input class="select-w " v-model="search.filter" placeholder="请输入内容" size="mini" clearable></el-input>
      <el-button type="primary" icon="el-icon-search" size="mini" @click="searchKnowledgeList" clearable>查询</el-button>

    </div>

    <el-table size="mini" :data="tableData" border style="width: 100%">
      <el-table-column type="index" label="编号"> </el-table-column>
      <el-table-column prop="resName" label="责任人"> </el-table-column>
      <el-table-column prop="ruleName" label="触发规则"> </el-table-column>
      <el-table-column prop="model" label="数据源"> </el-table-column>
      <el-table-column prop="tableEn" label="监控表"> </el-table-column>
      <el-table-column prop="jobStartTime" label="触发时间"> </el-table-column>
      <el-table-column prop="processTime" label="处理时间"> </el-table-column>
      <el-table-column prop="caozuo" label="操作">
        <template slot-scope="scope">
          <i class="el-icon-view xh-icon-btns-primary" @click="showDetail(scope.row)"></i>
        </template>
      </el-table-column>
    </el-table>

    <div class="qe-bottom">
      <!-- <el-pagination background layout="prev, pager, next" :total="total">
      </el-pagination> -->
      <!-- 
      <div class="qe-btns">
        <el-button type="success" icon="el-icon-check" @click="tongGuo"
          >通过</el-button
        >
        <el-button type="danger" icon="el-icon-check" @click="buTongGuo"
          >不通过</el-button
        >
        <el-button type="primary" icon="el-icon-check">提交知识库</el-button>
      </div> -->
    </div>
  </div>
</template>

<script>
import { countBy } from 'xe-utils';
var selectionAll = [];
export default {
  data() {
    return {
      tableData: [],
      total: 0,
      search: {
        type: "",
        filter: "",
        ruleCode: ""
      },
      options: [
        { label: "全部", value: 1 },
        { label: "告警", value: 2 },
        { label: "阻塞", value: 3 },
      ],
    };
  },

  props: {
    isTable: {
      type: Boolean,
      default: true
    }
  },

  methods: {
    showDetail(data) {
      this.$emit("changeIsTable", false, data)
    },
    postKnowledgeList(ruleCode) {
      this.search.ruleCode = ruleCode
      postKnowledgeList(this, this.search);
    },
    searchKnowledgeList() {
      postKnowledgeList(this, this.search);
    },
  },

  mounted() {
    this.postKnowledgeList();
  }
};

// 请求table数据
function postKnowledgeList(vm, param = {}) {
  vm.$R.postKnowledgeList(param).then((res) => {
    vm.tableData = res;
    // vm.total = res.total;
  });
}
</script>

<style lang="scss" scoped>
.qe-top {
  display: flex;
  .select-w {
    width: 150px;
    margin-right: 20px;
  }
}
.qe-bottom {
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
}
</style>
