<template>
  <div class="roleDialog">
    <!-- 角色弹窗 -->
    <el-dialog
      :visible="isShowRoleDialog"
      :close-on-click-modal="false"
      :title="roleDialogTitle"
      @open="onDialogOpen"
      @close="onCancle"
      width="30%"
    >
      <div class="formContent">
        <el-form
          :model="roleForm"
          ref="roleForm"
          :rules="rules"
          label-width="100px"
          size="mini"
        >
          <el-form-item prop="roleName" label="角色：">
            <el-input v-model="roleForm.roleName" clearable />
          </el-form-item>
          <el-form-item prop="roleDesc" label="备注：">
            <el-input
              type="textarea"
              :rows="2"
              clearable
              placeholder="请输入备注"
              v-model="roleForm.roleDesc"
            />
          </el-form-item>
        </el-form>
      </div>

      <!-- 弹框底部 -->
      <dialogFooter :btnList="btnList" />
    </el-dialog>
  </div>
</template>

<script>
import dialogFooter from '@/components/systemSet/bottomBtn';
export default {
  components: {
    dialogFooter
  },

  props: ['isShowRoleDialog', 'roleDialogTitle', 'row'],

  data() {
    return {
      roleForm: {
        roleId: '',
        roleName: '',
        roleDesc: ''
      },
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleDesc: [{ required: true, message: '请输入备注', trigger: 'blur' }]
      },
      btnList: [
        {
          type: 'warning',
          btnText: '清 空',
          onClick: this.onClear
        },
        {
          type: 'info',
          btnText: '取 消',
          onClick: this.onCancle
        },
        {
          type: 'primary',
          btnText: '确 定',
          onClick: this.onSure
        }
      ]
    };
  },

  methods: {
    onDialogOpen() {
      this.roleForm.roleId = '';
      if (this.roleDialogTitle === '修改角色') {
        this.$nextTick(() => {
          this.roleForm = JSON.parse(JSON.stringify(this.row));
        });
      }
    },

    onClear() {
      this.$nextTick(() => {
        this.$refs.roleForm.resetFields();
      });
    },

    onCancle() {
      this.onClear();
      this.$emit('onCancel');
    },

    onSure() {
      this.$refs.roleForm.validate((valid) => {
        if (!valid) return;
        let params = {
          roleId: this.roleForm.roleId,
          roleName: this.roleForm.roleName,
          roleDesc: this.roleForm.roleDesc
        };
        // 新增
        if (!this.roleForm.roleId) {
          this.$R.addRole(params).then((res) => {
            this.$message.success('新增成功！');
            this.onCancle();
            this.$emit('handleSure');
          });
        } else {
          // 修改
          this.$R.updateRole(params).then((res) => {
            this.$message.success('修改成功！');
            this.onCancle();
            this.$emit('handleSure');
          });
        }
      });
    }
  }
};
</script>

<style lang="scss">
.roleDialog {
  .formContent {
    margin: 0 20px 40px 0;
  }
}
</style>
