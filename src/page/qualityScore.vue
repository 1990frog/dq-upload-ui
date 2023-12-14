<template>
  <div class="page-content">
    <header class="page-header">
      <el-form ref="search" :inline="true" :model="search" label-width="90px">
        <el-form-item>
          <el-select v-model="search.hospital" placeholder="选择机构" size="mini">
            <el-option v-for="item in hospitalList" :key="item.id" :label="item.value" :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select filterable size="mini" v-model="search.model" placeholder="选择上报类型" @change="changeModel">
            <el-option v-for="item in modelList" :key="item.code" :label="item.value" :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select filterable clearable size="mini" v-model="search.table" placeholder="选择表">
            <el-option v-for="item in tableList" :key="item.table" :label="item.tableComment" :value="item.table">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker v-model="search.day" style="width:193px" size="mini" type="date" placeholder="选择日期" value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="">
          <el-input-number v-model="search.minScore" clearable size="mini" placeholder="最低分" style="width:120px" :controls="false"></el-input-number> -
          <el-input-number v-model="search.maxScore" clearable size="mini" placeholder="最高分" style="width:120px" :controls="false"></el-input-number>
        </el-form-item>
        <el-form-item>
          <el-select filterable clearable size="mini" v-model="search.source" placeholder="选择规则">
            <el-option v-for="item in ruleList" :key="item.code" :label="item.value" :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="queryReport" type="primary" class="chaxunshuju mar-left-10" icon="el-icon-search" size="mini">
            查询
          </el-button>
          <el-button type="warning" size="mini" icon="el-icon-refresh-left" @click="resetSearch">
            重置
          </el-button>
          <!-- <el-button type="primary" size="mini" icon="el-icon-upload2" @click="daoChuTableData">
            导出
          </el-button> -->
        </el-form-item>
      </el-form>
    </header>

    <div>
      <el-table ref="scoreTable" :data="scoreTableData" row-key="id" border :expand-row-keys="expandRowKeys" :tree-props="{children: 'fields', hasChildren: 'hasChildren'}"
        @cell-click="cellClick">
        <el-table-column prop="tableComment" show-overflow-tooltip label="表名">
        </el-table-column>
        <el-table-column prop="ruleName" label="规则类型">
        </el-table-column>
        <el-table-column prop="field" label="字段">
        </el-table-column>
        <el-table-column prop="unsatisfied" label="错误量">
        </el-table-column>
        <el-table-column prop="total" label="总量">
        </el-table-column>
        <el-table-column prop="score" label="得分">
        </el-table-column>
        <!-- <el-table-column prop="address" label="查看">
          <template slot-scope="scope">
            <el-link type="primary" v-if="!scope.row.parent">详情</el-link>
          </template>
        </el-table-column> -->
      </el-table>
    </div>

    <div class="mar-t-20">
      <el-pagination @current-change="changePageTableData" @size-change="handleSizeChange" background layout="total, prev, pager, next, jumper, sizes" :total="total" :current-page="current">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import { formatDate } from './js/format.js';
export default {
  name: 'qualityScore',
  data() {
    return {
      search: {
        hospital: "",
        model: "",
        table: "",
        day: formatDate(new Date(), 'yyyy-MM-dd'),
        minScore: undefined,
        maxScore: undefined,
        source: ""
      },
      ruleList: [],
      modelList: [],
      tableList: [],
      hospitalList: [],
      scoreTableData: [],
      total: 0,
      current: 1,
      pageSize: 10,
      expandRowKeys: []
    };
  },
  created() { },
  mounted() {
    this.getDictList();
  },
  computed: {},
  methods: {
    getDictList() {
      this.$R
        .queryDict({
          type: ['hospital', 'model', 'rule']
        })
        .then((res) => {
          this.ruleList = res.rule;
          this.modelList = res.model;
          this.hospitalList = res.hospital;
          if (res.hospital && res.hospital.length)
            this.search.hospital = res.hospital[0].code
          if (res.model && res.model.length) {
            this.search.model = res.model[0].code
            this.getTableList()
          }

          this.getTableData();
        });
    },
    getTableList() {
      let data = {
        model: this.search.model,
      }
      this.$R.tables(data).then((res) => {
        this.tableList = res;
      });
    },
    changeModel() {
      this.search.table = ""
      this.getTableList()
    },
    daoChuTableData() {
      // var that = this;
      // axios({
      //   method: 'post',
      //   url: `/clinbrain/api/compare/analysis/export?businessTime=${this.riQiVal}&model=${this.db}&hospital=${this.hospital}&tb=${this.shuJuBiaoVal}&type=${this.leiXingVal}`,
      //   data: {},
      //   responseType: 'blob' // 加上这个是重点
      // }).then((res) => {
      //   downloadFile(res);
      // });

      // function downloadFile(res) {
      //   try {
      //     let url = window.URL.createObjectURL(new Blob([res.data]));
      //     let link = document.createElement('a');
      //     let fileName = decodeURIComponent(
      //       res.headers['content-disposition'].split('filename=')[1]
      //     );
      //     link.style.display = 'none';
      //     link.href = url;
      //     link.setAttribute('download', fileName);
      //     document.body.appendChild(link);
      //     link.click();
      //     URL.revokeObjectURL(link.href);
      //     document.body.removeChild(link);
      //     that.msgSuccess('导出成功');
      //   } catch (error) {
      //     alert('导出失败');
      //     console.log(error);
      //   }
      // }
    },
    queryReport() {
      this.getTableData();
    },
    changePageTableData(page) {
      this.current = page
      this.getTableData();
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.getTableData();
    },
    getTableData() {
      let data = {
        size: this.pageSize,
        page: this.current,
        hospital: this.search.hospital,
        model: this.search.model,
        table: this.search.table || null,
        day: this.search.day,
        minScore: this.search.minScore,
        maxScore: this.search.maxScore,
        source: this.search.source || null
      }
      let that = this;
      this.$R.reportScore(data).then((res) => {
        //拼接id，否则页面报错
        let expandRowKeys = ""
        res.data.forEach((item, index) => {
          item.id = item.tableName + "_" + index
          if (item.fields && item.fields.length) {
            item.fields.forEach((jtem, jndex) => {
              jtem.id = item.id + "_" + jndex
              jtem.tableComment = jtem.fieldComment
            })
            if (!expandRowKeys)
              expandRowKeys = item.id
          }
        });
        that.scoreTableData = res.data;
        that.total = res.pagination ? res.pagination.totalRow : 0;

        that.expandRowKeys = [expandRowKeys]
      });
    },
    resetSearch() {
      this.search = {
        hospital: this.hospitalList && this.hospitalList.length ? this.hospitalList[0].code : "",
        model: this.modelList && this.modelList.length ? this.modelList[0].code : "",
        table: "",
        day: formatDate(new Date(), 'yyyy-MM-dd'),
        minScore: undefined,
        maxScore: undefined,
        source: ""
      }
    },
    cellClick(row, column, cell, event) {
      if (column.label == "表名")
        this.$refs.scoreTable.toggleRowExpansion(row);
    }
  },
  watch: {}
};
</script>

<style lang="scss" scoped>
.page-content {
  background: #fff;
  color: #555;
  padding: 10px 10px 30px;
}

.page-header {
  .el-form-item {
    margin-bottom: 10px;
  }
}
</style>
