<template>
  <div class="systemSet roleLeft xh-from xh-card-none">
    <!-- 左边顶部 -->
    <div class="left-header">
      <span class="title">
        角色管理
      </span>

      <div class="left-header-right">
        <el-input
          v-model="keyword"
          clearable
          placeholder="请输入关键字查询"
          size="mini"
          class="kwInput"
        />

        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="onSearch"
          >查询</el-button
        >

        <el-button type="primary" icon="el-icon-plus" size="mini" @click="onAdd"
          >新增</el-button
        >
      </div>
    </div>

    <div class="left-bottom">
      <!-- 左边表格 -->
      <el-table
        ref="roleTable"
        :data="tableData"
        highlight-current-row
        stripe
        style="width: 100%"
        size="mini"
        @row-click="handleRowClick"
      >
        <el-table-column type="index" label="序号" width="50" />
        <el-table-column prop="roleName" label="角色" />
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column prop="roleDesc" label="备注">
          <template slot-scope="scope">
            <div>{{ scope.row.roleDesc || '--' }}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80">
          <template slot-scope="scope">
            <div class="iconColumn">
              <el-tooltip effect="dark" content="编辑" placement="top">
                <img
                  src="@/assets/img/edit.png"
                  class="editIcon"
                  @click.stop="onEdit(scope.row)"
                />
              </el-tooltip>
              <el-tooltip effect="dark" content="删除" placement="top">
                <img
                  src="@/assets/img/delete.png"
                  class="deleteIcon"
                  @click.stop="onDelete(scope.row)"
                />
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="fenye mar-t-10">
        <el-pagination
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          :current-page="currentPage"
          :total="total"
          background=""
          layout="total, prev, pager, next, jumper, sizes"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      keyword: '',
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      roleList: [],
      row: {}
    };
  },

  mounted() {
    this.getTableData();
  },

  methods: {
    onSearch() {
      this.getTableData();
    },

    onAdd() {
      this.$emit('onAdd');
    },

    handleRowClick(row) {
      this.$emit('handleRowClick', row);
    },

    getTableData() {
      let params = {
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        keyword: this.keyword
      };
      this.$R.getRole(params).then((res) => {
        this.tableData = res.data;
        this.total = res.pagination?.totalRow;

        // 初始化第一行数据
        if (res?.data?.length) {
          this.$refs.roleTable.setCurrentRow(res.data[0]);
          this.$emit('handleRowClick', res.data[0]);
        }
      });
    },

    onEdit(row) {
      this.$emit('onEdit', row);
    },

    onCancel() {
      this.isShowUserDialog = false;
    },

    onDelete(row) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$R.delRole(row).then((res) => {
          this.$message.success('删除成功!');
          this.getTableData();
        });
      });
    },

    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.getTableData();
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.getTableData();
    },
  }
};
</script>

<style lang="scss" scoped>
.roleLeft {
  width: 60%;
  height: calc(100% - 48px);
  .left-header {
    height: 28px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .title::before {
      content: '';
      width: 10px;
      height: 10px;
      display: inline-block;
      background: #21aced;
      border-radius: 100%;
      margin-right: 5px;
    }
    .left-header-right {
      display: flex;
      .kwInput {
        margin-right: 10px;
      }
    }
  }
  .left-bottom {
    width: 100%;
    height: 100%;
    margin-top: 10px;
    border: 1px solid #0b02051f;
  }
  /deep/.el-table__body tr.current-row > td {
    background-color: #a3caf8 !important;
  }
}
</style>
