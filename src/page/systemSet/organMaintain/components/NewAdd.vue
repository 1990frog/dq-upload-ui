<!--
 * @Author: your name
 * @Date: 2021-03-08 13:27:33
 * @LastEditTime: 2021-03-08 16:16:59
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \clibrain-data-quality-v2.5\src\page\jigouweihu\components\newAdd.vue
-->
<template>
  <div>
    <el-form
      :model="organForm"
      :rules="rules"
      ref="organForm2"
      label-width="80px"
    >
      <el-form-item label="机构名称" prop="organizationName">
        <el-input v-model="organForm.organizationName"></el-input>
      </el-form-item>
      <el-form-item label="机构编码" prop="organizationCode">
        <el-input v-model="organForm.organizationCode"></el-input>
      </el-form-item>
    </el-form>

    <div class="bottomBtn">
      <el-button type="warning" @click="onClear()">清空</el-button>
      <el-button type="info" @click="onCancel()">取消</el-button>
      <el-button type="primary" @click="onSure()">确定</el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: ['organForm', 'rules'],

  data() {
    return {};
  },

  methods: {
    onClear() {
      this.$emit('onClear');
    },

    onCancel() {
      this.$emit('handleClose');
    },

    onSure() {
      this.$refs.organForm2.validate((valid) => {
        if (valid) {
          let data = {
            id: this.organForm.id,
            organizationCode: this.organForm.organizationCode,
            organizationName: this.organForm.organizationName
          };
          if (data.id) {
            this.$R.editOrganization(data).then((res) => {
              this.$message.success('更新成功!');
              this.$emit('handleSure');
            });
          } else {
            this.$R.addOrganization(data).then((res) => {
              this.$message.success('新增成功!');
              this.$emit('handleSure');
            });
          }
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.bottomBtn {
  margin-top: 40px;
  display: flex;
  justify-content: space-around;
}
.el-form {
  padding-right: 20px !important;
}
</style>
