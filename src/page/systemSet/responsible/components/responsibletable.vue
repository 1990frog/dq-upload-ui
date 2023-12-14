<template>
  <div class="systemSet tableHighlight">
    <el-card
      shadow="hover"
      class="mar-t-10"
      body-style="border: 1px solid #EBEEF5"
    >
      <el-table stripe size="mini" :data="tableData" style="width: 100%">
        <el-table-column type="index" label="序" width="50" />
        <el-table-column prop="userName" label="责任人" />
        <el-table-column prop="role" label="角色">
          <template slot-scope="scope">
            {{
              scope.row.roleInfos &&
                scope.row.roleInfos.map((t) => t.roleName).join('、')
            }}
          </template>
        </el-table-column>
        <el-table-column prop="organizationName" label="所属机构">
          <template slot-scope="scope">
            {{
              scope.row.builds &&
                Array.from(new Set(scope.row.builds.map((t) => t.organizationName))).join('、')
            }}
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="联系手机" />
        <el-table-column prop="email" label="电子邮件" />
        <el-table-column prop="state" label="汇总接收人">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.dayReportSummary"
              :active-value="true"
              :inactive-value="false"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="setState(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="emailTypeName" label="邮件权限">
          <template slot-scope="scope">
            {{
              scope.row.builds &&
                Array.from(new Set(scope.row.builds.map((t) => t.emailTypeName))).join('、')
            }}
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" />
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
            <el-tooltip effect="dark" content="关联机构" placement="top">
              <img
                src="@/assets/img/relation.png"
                class="relationIcon"
                @click="onRelation(scope.row)"
              />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  props: ['tableData'],

  data() {
    return {};
  },

  methods: {
    onEdit(row) {
      this.$emit('onEdit', row);
    },
    onRelation(row) {
      this.$emit('onRelation', row);
    },

    onDelete(row) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$R
          .delUser({}, row.userId)
          .then((res) => {
            this.$message.success('删除成功！');
            this.$emit('getTableData');
          })
          .catch((e) => {
            this.$message.error(e.message);
          });
      });
    },

    // 开启-关闭日报汇总接收人
    setState(row) {
      let params = {
        userId: row.userId,
        state: row.dayReportSummary
      };
      this.$R.putDayReportSummary(params, row.userId).then((res) => {
        this.$message.success('修改成功！');
        this.$emit('getTableData');
      });
    }
  }
};
</script>

<style></style>
