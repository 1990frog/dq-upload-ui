<template>
  <div class="systemSet">
    <div class="btn-box">
      <el-button
        type="primary"
        icon="el-icon-plus"
        class="text-right"
        size="mini"
        @click="onAdd"
        >新增</el-button
      >
    </div>
    <el-card
      shadow="hover"
      class="mar-t-10"
      body-style="border: 1px solid #EBEEF5"
    >
      <el-table stripe size="mini" :data="row.builds" style="width: 100%">
        <el-table-column type="index" label="序" width="50" />
        <el-table-column prop="userName" label="责任人">
          <template>
            {{ row.userName }}
          </template>
        </el-table-column>
        <el-table-column prop="role" label="机构">
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.organizationCode"
              size="mini"
              placeholder="请选择"
            >
              <el-option
                v-for="item in organizationList"
                :key="item.organizationCode"
                :label="item.organizationName"
                :value="item.organizationCode"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="role" label="邮件权限">
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.emailType"
              size="mini"
              placeholder="请选择"
            >
              <el-option
                v-for="item in emailTypeList"
                :key="item.type"
                :label="item.typeName"
                :value="item.type"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <img
              src="@/assets/img/delete.png"
              class="ml0 deleteIcon"
              @click="onDelete(scope.row)"
            />
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  props: ['row', 'organizationList', 'emailTypeList'],

  methods: {
    onAdd() {
      this.row.builds.push({
        emailType: '',
        emailTypeName: '',
        organizationCode: '',
        organizationName: '',
        userId: this.row.userId
      });
    },
    onDelete(index) {
      this.row.builds.splice(index, 1);
    }
  }
};
</script>

<style lang="scss">
.btn-box {
  flex: 1;
  text-align: right;
}
.ml0 {
  margin-left: 0!important;
}
</style>
