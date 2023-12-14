<!--
 * @Author: your name
 * @Date: 2021-03-08 13:23:00
 * @LastEditTime: 2021-03-09 18:25:45
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \clibrain-data-quality-v2.5\src\page\jigouweihui\index.vue
-->
<template>
  <div class="jigouweihui pad-10">
    <top-header class="mar-b-10" @onAdd="onAdd" @search="search"></top-header>
    <body-table ref="table" class="mar-b-10" @onEdit="onEdit"></body-table>

    <!-- 机构弹窗 -->
    <el-dialog
      :title="title"
      :visible.sync="DIALOGVISIBLE"
      width="30%"
      :before-close="handleClose"
      @open="onDialogOpen"
    >
      <new-add
        ref="organForm1"
        :organForm="organForm"
        :rules="rules"
        @onClear="onClear"
        @handleClose="handleClose"
        @handleSure="handleSure"
      />
    </el-dialog>
  </div>
</template>

<script>
import TopHeader from './components/TopHeader.vue';
import BodyTable from './components/BodyTable';
import NewAdd from './components/NewAdd';

export default {
  name: 'organMaintain',
  components: {
    TopHeader,
    BodyTable,
    NewAdd
  },

  data() {
    return {
      title: '',
      organForm: {
        id: '',
        organizationName: '',
        organizationCode: ''
      },
      rules: {
        organizationName: [
          { required: true, message: '请输入机构名称', trigger: 'blur' }
        ],
        organizationCode: [
          { required: true, message: '请输入机构编码', trigger: 'blur' }
        ]
      },
      row: {}
    };
  },

  computed: {
    DIALOGVISIBLE: {
      get() {
        return this.$store.state.jigouweihu.DIALOGVISIBLE;
      },
      set(val) {
        this.$store.commit('SET_DIALOGVISIBLE', val);
      }
    }
  },

  methods: {
    handleClose() {
      this.onClear();
      this.DIALOGVISIBLE = false;
    },

    onEdit(row) {
      this.DIALOGVISIBLE = true;
      this.title = '修改机构';
      this.row = row;
    },

    onAdd() {
      this.organForm.id = '';
      this.title = '新增机构';
    },

    onClear() {
      this.$nextTick(() => {
        this.$refs.organForm1.$refs.organForm2.resetFields();
      });
    },

    onDialogOpen() {
      if (this.title === '修改机构') {
        this.$nextTick(() => {
          this.organForm = JSON.parse(JSON.stringify(this.row));
        });
      }
    },

    search() {
      this.$refs.table.queryHospital();
    },

    handleSure() {
      this.handleClose();
      this.$refs.table.queryHospital();
    }
  }
};
</script>

<style lang="scss" scoped></style>
