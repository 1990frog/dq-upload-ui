<template>
  <div class="dialogForm">
    <!-- 表单内容 -->
    <el-form
      :rules="rules"
      ref="form2"
      :model="form"
      label-width="100px"
      size="mini"
    >
      <el-form-item prop="userName" label="责任人：">
        <el-input clearable v-model="form.userName" />
      </el-form-item>
      <el-form-item prop="password" label="密码：">
        <el-input clearable v-model="form.password" show-password />
      </el-form-item>
      <el-form-item label="联系手机：">
        <el-input clearable v-model="form.phone" />
      </el-form-item>
      <el-form-item prop="email" label="Email：">
        <el-input clearable v-model="form.email" />
      </el-form-item>
      <el-form-item label="角色：">
        <el-select
          multiple
          v-model="form.roles"
          size="mini"
          placeholder="请选择"
        >
          <el-option
            v-for="item in roleList"
            :key="item.roleId"
            :label="item.roleName"
            :value="item.roleId"
          />
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: ['form', 'rules', 'title', 'roleList', 'row'],

  methods: {}
};
</script>

<style lang="scss"></style>
