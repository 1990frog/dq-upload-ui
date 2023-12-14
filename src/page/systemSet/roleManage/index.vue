<template>
  <div class="roleManage">
    <roleLeft
      ref="left"
      class="roleLeft"
      @onAdd="onAdd"
      @onEdit="onEdit"
      @handleRowClick="handleRowClick"
    />

    <roleRight ref="right" />

    <roleDialog
      :isShowRoleDialog="isShowRoleDialog"
      :roleDialogTitle="roleDialogTitle"
      :row="row"
      @onCancel="onCancel"
      @handleSure="handleSure"
    />
  </div>
</template>

<script>
import roleLeft from './components/left.vue';
import roleRight from './components/right.vue';
import roleDialog from './components/roleDialog.vue';
export default {
  name: 'roleManage',
  components: {
    roleLeft,
    roleRight,
    roleDialog
  },

  data() {
    return {
      isShowRoleDialog: false,
      roleDialogTitle: '',
      row: {}
    };
  },

  methods: {
    onAdd() {
      this.isShowRoleDialog = true;
      this.roleDialogTitle = '新增角色';
    },

    onCancel() {
      this.isShowRoleDialog = false;
    },

    onEdit(row) {
      this.roleDialogTitle = '修改角色';
      this.isShowRoleDialog = true;
      this.row = row;
    },

    handleRowClick(row) {
      this.$refs.right.handleRowClick(row);
    },

    handleSure() {
      this.$refs.left.getTableData();
    }
  }
};
</script>

<style lang="scss">
.roleManage {
  background: #fafbff;
  height: calc(100vh - 126px);
  padding: 10px;
  display: flex;
  .roleLeft {
    margin-right: 10px;
  }
}
</style>
