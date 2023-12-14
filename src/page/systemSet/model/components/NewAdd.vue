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
      label-width="100px"
    >
      <el-form-item label="模型编码">
        <el-input v-model="organForm.model" disabled></el-input>
      </el-form-item>
      <el-form-item label="模型名称">
        <el-input v-model="organForm.modelComment" disabled></el-input>
      </el-form-item>
      <el-form-item label="表名" prop="table">
        <el-input v-model="organForm.table"></el-input>
      </el-form-item>
      <el-form-item label="表中文名" prop="tableComment">
        <el-input v-model="organForm.tableComment"></el-input>
      </el-form-item>
      <el-form-item label="字段名" prop="field">
        <el-input v-model="organForm.field"></el-input>
      </el-form-item>
      <el-form-item label="字段中文名" prop="fieldComment">
        <el-input v-model="organForm.fieldComment"></el-input>
      </el-form-item>
      <el-form-item label="字段类型" prop="type">
        <el-input v-model="organForm.type"></el-input>
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
            table: this.organForm.table,
            tableComment: this.organForm.tableComment,
            tableComment: this.organForm.tableComment,
            field: this.organForm.field,
            fieldComment: this.organForm.fieldComment,
            type: this.organForm.type
          };
          if (data.id) {
            this.$R.putModel(data).then((res) => {
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
