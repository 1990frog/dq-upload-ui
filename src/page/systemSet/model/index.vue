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
    <top-header
      class="mar-b-10"
      @onAdd="onAdd"
      @search="search"
      @showJianKongShuJu="showJianKongShuJu"
    ></top-header>
    <body-table ref="table" class="mar-b-10" @onEdit="onEdit"></body-table>

    <!-- 模型弹窗 -->
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

    <!-- 更新表字段 -->
    <el-dialog
      :close-on-click-modal="false"
      class="import"
      title="更新表字段"
      :visible.sync="visibleJianKongShuJu"
      width="50%"
      :before-close="closeJianKongShuJu"
    >
      <el-row :gutter="16">
        <el-col :span="8">
          <div class="left">
            <div class="header">
              <!-- <span class="txt"></span> -->
              <el-select
                v-model="model"
                placeholder="模型"
                size="mini"
                class="select-full"
                @change="getMetaTableList"
              >
                <el-option
                  v-for="item in modelList"
                  :key="item.code"
                  :label="item.value"
                  :value="item.code"
                ></el-option>
              </el-select>
              <!-- <el-input
                v-model="model"
                style="width:200px"
                placeholder="输入表名查询"
                clearable
                ><i
                  slot="suffix"
                  class="el-input__icon el-icon-search"
                  @click="getMetaTableList"
                ></i
              ></el-input> -->
            </div>
            <div>
              <ul class="ullist" v-if="metaTableList && metaTableList.length">
                <li
                  v-for="item in metaTableList"
                  :key="item.id"
                  :class="item.table === currentTable ? 'active' : ''"
                  @click="switchTable(item)"
                  :title="item.tableComment"
                >
                  <i class="el-icon-document"></i>{{ item.tableComment }}
                </li>
              </ul>
              <div v-else class="ullist nodata">暂无数据</div>
            </div>
          </div>
        </el-col>
        <el-col :span="16">
          <el-table
            :data="metaColumnList"
            border
            style="width: 100%"
            class="mar-b-10"
            height="370"
          >
            <el-table-column prop="field" label="字段名"></el-table-column>
            <el-table-column prop="fieldComment" label="字段中文名"></el-table-column>
            <el-table-column prop="type" label="字段类型"></el-table-column>
            <el-table-column label="业务时间" align="center">
              <template slot-scope="scope">
                <el-checkbox
                  true-label="1"
                  false-label="0"
                  v-model="scope.row.businessTimeField"
                  @change="changeBusiness(scope.row)"
                ></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column label="机构" align="center">
              <template slot-scope="scope">
                <el-checkbox
                  true-label="1"
                  false-label="0"
                  v-model="scope.row.hospitalField"
                  @change="changeHospital(scope.row)"
                ></el-checkbox>
              </template>
            </el-table-column>
            <!-- <el-table-column prop="value5" label="所属值域（元数据提供）"></el-table-column> -->
          </el-table>
        </el-col>
      </el-row>
      <div class="footer-btn">
        <!-- <el-button type="primary" @click="visibleJianKongShuJu = false">导入结构</el-button> -->
        <el-button type="default" @click="visibleJianKongShuJu = false"
          >关闭</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import TopHeader from './components/TopHeader.vue';
import BodyTable from './components/BodyTable';
import NewAdd from './components/NewAdd';

export default {
  name: 'model',
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
        model: '',
        modelComment: '',
        table: '',
        tableComment: '',
        field: '',
        fieldComment: '',
        type: ''
      },
      rules: {
        table: [{ required: true, message: '请输入表名', trigger: 'blur' }],
        tableComment: [
          { required: true, message: '请输入表中文名', trigger: 'blur' }
        ],
        field: [{ required: true, message: '请输入字段名', trigger: 'blur' }],
        fieldComment: [
          { required: true, message: '请输入字段中文名', trigger: 'blur' }
        ],
        type: [{ required: true, message: '请输入类型', trigger: 'blur' }]
      },
      row: {},
      visibleJianKongShuJu: false,
      currentTable: '',
      model: '',
      metaTableList: [],
      metaColumnList: [],
      modelList: [],
    };
  },

  computed: {
    DIALOGVISIBLE: {
      get() {
        return this.$store.state.moxingweihu.DIALOGVISIBLE;
      },
      set(val) {
        this.$store.commit('SET_DIALOGVISIBLE', val);
      }
    }
  },

  mounted() {
    this.getModelList();
  },

  methods: {
    handleClose() {
      this.onClear();
      this.DIALOGVISIBLE = false;
    },

    onEdit(row) {
      this.DIALOGVISIBLE = true;
      this.title = '修改模型';
      this.row = row;
    },

    onAdd() {
      this.organForm.id = '';
      this.title = '新增模型';
    },

    onClear() {
      this.$nextTick(() => {
        this.$refs.organForm1.$refs.organForm2.resetFields();
      });
    },

    onDialogOpen() {
      if (this.title === '修改模型') {
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
    },

    showJianKongShuJu() {
      this.getMetaTableList();
      this.visibleJianKongShuJu = true;
    },
    closeJianKongShuJu() {
      this.visibleJianKongShuJu = false;
    },
    getMetaTableList() {
      let data = {
        model: this.model,
        page: 1,
        size: 9999
      };
      this.$R.getModelTables(data).then((res) => {
        this.metaTableList = res;
        if (res?.length) {
          this.currentTable = res[0].table;
          this.getMetaColumnList();
        } else {
          this.currentTable = '';
          this.metaColumnList = [];
        }
      });
    },
    getMetaColumnList() {
      let data = {
        table: this.currentTable,
        page: 1,
        size: 9999
      };
      this.$R.getModelPage(data).then((res) => {
        this.metaColumnList = res.data;
      });
    },
    switchTable(item) {
      this.currentTable = item.table;
      this.getMetaColumnList();
    },
    changeBusiness(row) {
      let data = {
        id: row.id,
        model: row.model,
        table: row.table,
        state: row.businessTimeField
      };
      this.$R
        .setBusinessTimeField(data)
        .then((res) => {
          this.$message.success('保存成功');
          this.getMetaColumnList();
        })
        .catch((e) => {
          this.$message.error(e.msg);
        });
    },
    changeHospital(row) {
      let data = {
        id: row.id,
        model: row.model,
        table: row.table,
        state: row.hospitalField
      };
      this.$R
        .setHospitalField(data)
        .then((res) => {
          this.$message.success('保存成功');
          this.getMetaColumnList();
        })
        .catch((e) => {
          this.$message.error(e.msg);
        });
    },
    getModelList() {
      this.$R
        .queryDict({
          type: ['model']
        })
        .then((res) => {
          this.modelList = res.model;
          if (res?.model?.length) {
            this.model = res.model[0].code;
          }
        });
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/.import {
  .el-dialog__body {
    padding-top: 10px;
  }
  .left {
    border: 1px solid #ddd;
    .header {
      padding: 8px;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px dashed #ccc;
      .txt {
        padding: 8px;
      }
      .el-input__inner {
        border-radius: 30px;
      }
      .el-input .el-input__icon:hover {
        color: #333;
        cursor: pointer;
      }
    }
    .ullist {
      height: 320px;
      overflow-y: auto;
      li {
        cursor: pointer;
        height: 20px;
        line-height: 20px;
        padding: 6px 30px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        i {
          padding: 0 5px;
          color: #409eff;
        }
      }
      li.active {
        background-color: #ddd;
      }
    }
    .nodata {
      padding: 10px;
    }
  }
  .right {
    flex: 1;
    text-align: right;
  }
  .dialog-search {
    display: flex;
  }
}
.footer-btn {
  flex: 1;
  text-align: right;
}
</style>
