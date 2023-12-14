<!--
 * @Author: your name
 * @Date: 2021-03-08 13:27:17
 * @LastEditTime: 2021-03-09 18:17:13
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \clibrain-data-quality-v2.5\src\page\jigouweihu\components\BodyTable.vue
-->
<template>
  <div class="systemSet tableHighlight">
    <el-card
      shadow="hover"
      class="mar-t-10"
      body-style="border: 1px solid #EBEEF5"
    >
      <el-table stripe size="mini" :data="tableData" style="width: 100%">
        <el-table-column type="index" label="序" width="180" />
        <el-table-column prop="organizationName" label="机构名称" />
        <el-table-column prop="organizationCode" label="机构编码" />
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="编辑" placement="top">
              <img
                src="@/assets/img/edit.png"
                class="editIcon"
                @click="onEdit(scope.row)"
              />
            </el-tooltip>
            <el-tooltip effect="dark" content="删除" placement="top">
              <img
                src="@/assets/img/delete.png"
                class="deleteIcon"
                @click="onDelete(scope.row)"
              />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <div class="fenye mar-t-10">
      <el-pagination
        :current-page="currentPage"
        @size-change="handleSizeChange"
        :total="total"
        @current-change="handleCurrentChange"
        background
        layout="total, prev, pager, next, jumper, sizes"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  data() {
    return {
      tableData: [],
      total: 0,
      currentPage: 1,
      pageSize: 10
    };
  },

  computed: {
    ...mapState({
      keyword: (state) => state.jigouweihu.keyword
    })
  },

  mounted() {
    this.queryHospital();
  },
  methods: {
    //医院列表
    async queryHospital() {
      let data = {
        keyword: this.keyword,
        page: this.currentPage,
        size: this.pageSize
      };
      await this.$R.getOrganization(data).then((res) => {
        this.tableData = res.data;
        this.total = res.pagination?.totalRow;
      });
    },
    onEdit(row) {
      this.$emit('onEdit', row);
    },

    onDelete(row) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$R.delOrganization({}, row.organizationCode).then((res) => {
          this.$message.success('删除成功!');
          this.queryHospital();
        });
      });
    },

    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.queryHospital();
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.queryHospital();
    },
  }
};
</script>

<style lang="scss"></style>
