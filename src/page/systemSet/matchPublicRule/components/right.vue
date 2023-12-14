<template>
  <div class="matchRight">
    <div class="top">
      <div class="topLeft">
        <el-input
          clearable
          placeholder="请输入关键字"
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

      <div class="topRight">
        <el-button type="warning" size="mini" @click="onMatch">匹配</el-button>
        <el-button type="primary" size="mini" @click="onImport">导入</el-button>
      </div>
    </div>

    <!-- 表格部分 -->
      <div class="systemSet tableHighlight">
        <el-card
          shadow="hover"
          class="mar-t-10"
          body-style="border: 1px solid #EBEEF5"
        >
          <el-table stripe size="mini" :data="tableData" style="width: 100%">
            <el-table-column type="index" label="序" width="50" />
            <el-table-column prop="name" label="表名" />
            <el-table-column prop="name2" label="表中文名" />
            <el-table-column prop="ruleNo" label="规则数" />
            <el-table-column prop="ruleDesc" label="规则描述" />
          </el-table>
        </el-card>

        <div class="fenye mar-t-10">
          <el-pagination
            :current-page="currentPage"
            :page-size="pageSize"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            background
            layout="total, sizes, prev, pager, next, jumper"
          >
          </el-pagination>
        </div>
      </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      keyword: '',
      tableData: [],
      total: 0,
      currentPage: 1,
      pageSize: 10
    }
  },

  methods: {
    searchTable () {

    },

    onMatch () {
      // 参考元数据管理-元数据配置-匹配公版规则
    },

    onImport () {
      
    },

    handleSizeChange (pageSize) {
      this.pageSize = pageSize
      // todo
    },

    handleCurrentChange (currentPage) {
      this.currentPage = currentPage
      // todo
    }
  }
}
</script>

<style lang="scss">
.matchRight {
  width: calc(100% - 300px);
  height: 100%;
  background: #fff;
  padding: 10px;
  overflow: auto;
  .top {
    display: flex;
    justify-content: space-between;
    .topLeft {
      display: flex;
      .searchBtn {
        margin-left: 10px;
      }
    }
  }
}
</style>