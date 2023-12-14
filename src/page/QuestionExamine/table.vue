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
    <el-table size="mini" :data="tableData" border style="width: 100%" @selection-change="changeTable">
      <el-table-column prop="date" label="选择" type="selection">
      </el-table-column>
      <el-table-column type="index" label="编号"> </el-table-column>
      <el-table-column prop="resName" label="责任人"> </el-table-column>
      <el-table-column prop="ruleName" label="触发规则"> </el-table-column>
      <el-table-column prop="model" label="数据源"> </el-table-column>
      <el-table-column prop="tableEn" label="监控表"> </el-table-column>
      <el-table-column prop="jobStartTime" label="触发时间"> </el-table-column>
      <el-table-column prop="processTime" label="处理时间"> </el-table-column>
      <el-table-column prop="caozuo" label="操作记录">
        <template slot-scope="scope">
          <i class="el-icon-view   xh-icon-btns-primary" @click="showJiLuShuJu(scope.row)"></i>
        </template>
      </el-table-column>
    </el-table>

    <div class="qe-bottom">
      <el-pagination background layout="prev, pager, next" :total="total" @current-change="changeFenYe">
      </el-pagination>

      <div class="qe-btns">
        <el-button type="success" icon="el-icon-check" @click="tongGuo">通过</el-button>
        <el-button type="danger" icon="el-icon-check" @click="buTongGuo">不通过</el-button>
        <el-button type="primary" icon="el-icon-check" @click="showKNOWLEDGE">提交知识库</el-button>
      </div>
    </div>
  </div>
</template>

<script>
var selectionAll = [];
import { mapMutations } from 'vuex';
export default {
  data() {
    return {
      tableData: [{}],
      total: 0
    };
  },

  methods: {
    ...mapMutations({
      SET_FANKUIROWDATA: 'SET_FANKUIROWDATA',
      SET_SELECTION: 'SET_SELECTION',
    }),
    postprocess() {
      postprocess(this, {
        processStatus: '1',
        selection: selectionAll
      });
    },
    tongGuo() {
      postprocess(this, {
        processStatus: '1',
        selection: selectionAll
      });
    },
    buTongGuo() {
      postprocess(this, {
        processStatus: '2',
        selection: selectionAll
      });
    },
    showJiLuShuJu(row) {
      this.$store.commit('SET_SHOWJILU', true);
      this.SET_FANKUIROWDATA(row);
    },
    showKNOWLEDGE() {
      if (Array.isArray(selectionAll) && selectionAll.length > 0) {
        if (selectionAll.length > 1) {
          this.msgWarning('提交知识库只能单个提交！');
          return false;
        }
        this.SET_SELECTION(selectionAll[0]);
        this.$store.commit('SET_SHOWKNOWLEDGE', true);
      } else {
        this.msgWarning('请选择数据');
      }
    },
    postpageCheckIssue(param) {
      postpageCheckIssue(this, param);
    },

    changeTable(selection) {
      selectionAll = selection;
    },

    changeFenYe(num) {
      var param = {
        filter: this.$store.state.wentifankui.FANKUISHENHEVAL,
        ruleCode: this.$store.state.wentifankui.RULECODE,
        pageNum: num,
        pageSize: 10
      };
      postpageCheckIssue(this, param);
    },
  },

  mounted() {
    this.postpageCheckIssue({
      pageNum: 0,
      pageSize: 10
    });
  }
};

// 请求table数据
function postpageCheckIssue(vm, param = {}) {
  vm.$R.postpageCheckIssue(param).then((res) => {
    vm.tableData = res.list;
    vm.total = res.total;
  });
}

// 提交通过/不通过
function postprocess(vm, params) {
  if (Array.isArray(params.selection) && params.selection.length > 0) {
    // 更改 processStatus 值："1"  //通过 ；"2" //不通过
    if (params.processStatus == '1') {
      params.selection.forEach((element) => {
        element.processStatus = '1';
      });
    }
    if (params.processStatus == '2') {
      params.selection.forEach((element) => {
        element.processStatus = '2';
      });
    }
    vm.$R.postprocess(params.selection).then((res) => {
      vm.msgSuccess('审核成功!');
      res;
    });
  } else {
    vm.msgWarning('请选择数据');
  }
}
</script>

<style lang="scss" scoped>
.qe-bottom {
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
}
</style>
