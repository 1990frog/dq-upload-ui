<template>
  <div class="responsibleMain">
    <topHeader @onAdd="onAdd" @getTableData="getTableData" />

    <!-- 表格 -->
    <responsibletable
      :tableData="tableData"
      @onEdit="onEdit"
      @onRelation="onRelation"
      @getTableData="getTableData"
    />

    <!-- 分页 -->
    <div class="fenye mar-t-10">
      <el-pagination
        :current-page="currentPage"
        :total="total"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        background
        layout="total, prev, pager, next, jumper, sizes"
      >
      </el-pagination>
    </div>

    <!-- 弹窗 -->
    <el-dialog
      :title="title"
      :visible="isShowDialog"
      :close-on-click-modal="false"
      :before-close="onCancle"
      @open="onOpen"
      @close="onCancle"
      width="30%"
      top="1vh"
      class="dialogBox systemSetDialog"
    >
      <dialogForm
        ref="form1"
        :form="form"
        :rules="rules"
        :title="title"
        :roleList="roleList"
        :row="row"
      />
      <!-- 弹框底部 -->
      <dialogFooter :btnList="btnList" />
    </el-dialog>

    <!-- 弹窗-关联机构 -->
    <el-dialog
      title="关联机构"
      :visible="isShowRelation"
      :close-on-click-modal="false"
      :before-close="onRelationCancle"
      @close="onRelationCancle"
      width="40%"
      top="1vh"
      class="dialogBox systemSetDialog"
    >
      <dialogRelation
        ref="relation"
        :row="row"
        :organizationList="organizationList"
        :emailTypeList="emailTypeList"
      />
      <!-- 弹框底部 -->
      <dialogFooter :btnList="relationBtnList" :placement="'right'" />
    </el-dialog>
  </div>
</template>

<script>
import { isEmail, isMobile } from '@/util/validate';
import topHeader from './components/topHeader.vue';
import responsibletable from './components/responsibletable.vue';
import dialogForm from './components/dialogForm.vue';
import dialogRelation from './components/dialogRelation.vue';
import dialogFooter from '@/components/systemSet/bottomBtn.vue';
export default {
  name: 'responsible',
  components: {
    topHeader,
    responsibletable,
    dialogForm,
    dialogFooter,
    dialogRelation
  },

  data() {
    let checkPhone = (rule, value, cb) => {
      if (!isMobile(value)) {
        cb(this.$message.error('请输入正确的手机号！'));
      } else {
        cb();
      }
    };
    let checkEmail = (rule, value, cb) => {
      if (!isEmail(value)) {
        cb(this.$message.error('请输入正确的Email！'));
      } else {
        cb();
      }
    };
    return {
      title: '',
      isShowDialog: false,
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
      ],
      relationBtnList: [
        {
          type: 'info',
          btnText: '取 消',
          onClick: this.onRelationCancle
        },
        {
          type: 'primary',
          btnText: '确 定',
          onClick: this.onRelationSure
        }
      ],
      tableData: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      row: {},
      form: {
        id: '',
        userId: '',
        userName: '', // 责任人
        password: '', // 密码
        organizationCode: '', // 机构编码
        organizationName: '', // 机构名称
        phone: '', // 联系手机
        email: '', // email
        roles: [], // email
        roleInfos: [], // 角色
        emailType: '' //  邮件权限
      },
      rules: {
        userName: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        organizationCode: [
          { required: true, message: '请选择机构', trigger: 'change' }
        ],
        phone: [
          { required: true, message: '请输入联系手机', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入email', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        roles: [{ required: true, message: '请选择角色', trigger: 'change' }]
      },
      roleList: [],
      organizationList: [],
      emailTypeList: [],
      isShowRelation: false
    };
  },

  mounted() {
    this.getTableData();
    this.getRoleList();
    this.getOrganizationList();
    this.getEmailTypeList();
  },

  methods: {
    getRoleList() {
      let params = {
        pageNo: 1,
        pageSize: 999
      };
      this.$R.getRole(params).then((res) => {
        this.roleList = res.data;
      });
    },
    getOrganizationList() {
      this.$R.getOrganizationAll({}).then((res) => {
        this.organizationList = res;
      });
    },
    getEmailTypeList() {
      this.$R.getEmailTypeList({}).then((res) => {
        this.emailTypeList = res;
      });
    },

    getTableData(keyword) {
      let params = {
        keyword: keyword || '',
        page: this.currentPage,
        size: this.pageSize
      };
      this.$R.getUser(params).then((res) => {
        this.tableData = res.data;
        this.total = res.pagination?.totalRow;
      });
    },

    onAdd() {
      this.isShowDialog = true;
      this.title = '新增责任人';
      this.form.userId = '';
      this.form.id = '';
    },

    onEdit(row) {
      this.isShowDialog = true;
      this.title = '修改责任人';
      this.row = row;
      this.row.roles = row.roleInfos?.map((t) => t.roleId);
    },

    onRelation(row) {
      this.isShowRelation = true;
      this.row = row;
      this.row.builds = this.row.builds || [];
    },

    onCancle() {
      this.onClear();
      this.isShowDialog = false;
    },

    onRelationCancle() {
      this.isShowRelation = false;
    },

    onCancle() {
      this.onClear();
      this.isShowDialog = false;
    },

    onClear() {
      this.$nextTick(() => {
        this.$refs.form1.$refs.form2.resetFields();
      });
    },

    onOpen() {
      if (this.title === '修改责任人') {
        this.$nextTick(() => {
          let row = JSON.parse(JSON.stringify(this.row));
          this.form = {
            ...row
          };
        });
      }
    },

    onSure() {
      this.$refs.form1.$refs.form2.validate((valid) => {
        if (!valid) return;
        let roleInfos = [];
        this.form.roles?.forEach((element) => {
          let role = this.roleList.find((t) => t.roleId == element);
          roleInfos.push({ roleId: role?.roleId, roleName: role?.roleName });
        });
        let params = {
          id: this.form.id,
          userId: this.form.userId,
          userName: this.form.userName,
          password: this.form.password,
          organizationCode: this.form.organizationCode,
          phone: this.form.phone,
          email: this.form.email,
          roleInfos: roleInfos,
          emailType: this.form.emailType
        };
        if (params.userId) {
          this.$R.updateUser(params).then((res) => {
            this.$message.success('更新成功!');
            this.onCancle();
            this.getTableData();
          });
        } else {
          this.$R.addUser(params).then((res) => {
            this.$message.success('新增成功!');
            this.onCancle();
            this.getTableData();
          });
        }
      });
    },

    onRelationSure() {
      let params = {
        id: this.row.id,
        userId: this.row.userId,
        codeTypeVO: this.row.builds
      };
      this.$R.postUserBuild(params).then((res) => {
        this.isShowRelation = false;
        this.$message.success('关联成功!');
        this.onRelationCancle();
        this.getTableData();
      });
    },

    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.getTableData();
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.getTableData();
    }
  }
};
</script>

<style lang="scss">
.responsibleMain {
  padding: 10px;
}
</style>
