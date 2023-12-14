<template>
  <div class="page">
    <div class="header">
      <div class="left">
        <el-select
          v-model="search.hospitalCode"
          placeholder="选择机构"
          size="mini"
          class="mar-r-10"
          clearable
          @change="querySearch"
        >
          <el-option
            v-for="item in hospitalList"
            :key="item.code"
            :label="item.value"
            :value="item.code"
          ></el-option>
        </el-select>
        <el-select
          filterable
          size="mini"
          class="mar-r-10"
          v-model="search.model"
          placeholder="选择上报类型"
          @change="querySearch"
        >
          <el-option
            v-for="item in modelList"
            :key="item.code"
            :label="item.value"
            :value="item.code"
          >
          </el-option>
        </el-select>
        <el-select
          v-model="search.runStatus"
          size="mini"
          class="mar-r-10"
          placeholder="状态"
          @change="querySearch"
        >
          <el-option
            v-for="(item, index) in statusList"
            :key="index"
            :label="item.name"
            :value="item.code"
          ></el-option>
        </el-select>
        <el-date-picker
          v-model="daterange"
          type="daterange"
          range-separator="至"
          size="mini"
          class="mar-r-10"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          @change="querySearch"
        >
        </el-date-picker>
        <!-- <el-input
          class="mar-r-10"
          v-model="search.keyword"
          style="width:200px"
          clearable
          placeholder="关键字"
          size="mini"
        ></el-input> -->
        <el-button
          type="primary"
          size="mini"
          icon="el-icon-search"
          @click="querySearch"
        >
          查询
        </el-button>
      </div>
      <div class="right">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="showJobDialog"
          >新增任务</el-button
        >
      </div>
    </div>

    <div class="qa-body">
      <el-row :gutter="20">
        <el-col :span="10" class="systemSet">
          <el-table
            ref="taskTable"
            stripe
            size="mini"
            :data="tableData"
            border
            style="width: 100%"
            @row-click="rowClick"
            highlight-current-row
          >
            <el-table-column prop="id" label="批次号" width="60">
            </el-table-column>
            <el-table-column prop="hospitalCode" label="机构" width="160">
            </el-table-column>
            <el-table-column prop="model" label="数据源"> </el-table-column>
            <el-table-column prop="dateRange" label="核查区间" width="170">
              <template slot-scope="scope">
                {{
                  (scope.row.startTime&&scope.row.startTime.split(' ')[0]) +
                          '~' +
                          (scope.row.endTime&&scope.row.endTime.split(' ')[0])
                }}
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态">
              <template slot-scope="scope">
                <span
                  :class="scope.row.runStatus ? 'txt-succes' : 'txt-error'"
                  >{{ scope.row.runStatus ? '已执行' : '未执行' }}</span
                >
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <div class="btn-group" v-if="!scope.row.runStatus">
                  <el-tooltip effect="dark" content="执行" placement="top">
                    <img
                      src="@/assets/img/exec.png"
                      class="execIcon"
                      @click.stop="execBatch(scope.row)"
                    />
                  </el-tooltip>
                  <el-tooltip effect="dark" content="删除" placement="top">
                    <img
                      src="@/assets/img/delete.png"
                      class="deleteIcon"
                      @click.stop="deleteBatch(scope.row)"
                    />
                  </el-tooltip>
                </div>
              </template>
            </el-table-column>
          </el-table>

          <div class="mar-t-10 mar-b-10">
            <el-pagination
              @current-change="changeFenYe"
              @size-change="handleSizeChange"
              class="qa-pagination"
              background
              layout="prev, pager, next, sizes"
              :total="total"
              :current-page="current"
            >
            </el-pagination>
          </div>
        </el-col>
        <el-col :span="14" class="systemSet">
          <el-card class="box-card" shadow="never">
            <div slot="header" class="clearfix">
              <span>任务</span>
            </div>
            <div class="box-card">
              <div v-if="jobData && jobData.length">
                <el-table
                  ref="detailTable"
                  stripe
                  size="mini"
                  :data="jobData"
                  border
                  style="width: 100%"
                  row-key="id"
                  lazy
                  :load="load"
                  :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
                  @row-click="getOpenDetail"
                >
                  <el-table-column prop="id" label="序号" width="110"></el-table-column>
                  <el-table-column prop="desc" label="描述">
                  </el-table-column>
                  <el-table-column prop="status" label="状态" width="100">
                    <template slot-scope="scope">
                      <span
                        :class="scope.row.runStatus ? 'txt-succes' : 'txt-error'"
                        >{{ scope.row.runStatus ? '已执行' : '未执行' }}</span
                      >
                    </template>
                  </el-table-column>
                  <el-table-column prop="status" label="执行时间" width="170">
                    <template slot-scope="scope">
                      {{
                        (scope.row.startTime&&scope.row.startTime.split(' ')[0]) +
                          '~' +
                          (scope.row.endTime&&scope.row.endTime.split(' ')[0])
                      }}
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="100">
                    <template slot-scope="scope" v-if="scope.row.hasChildren&&!scope.row.runStatus">
                      <div class="btn-group">
                        <el-tooltip effect="dark" content="执行" placement="top">
                          <img
                            src="@/assets/img/exec.png"
                            class="execIcon"
                            @click.stop="execJob(scope.row)"
                          />
                        </el-tooltip>
                        <el-tooltip effect="dark" content="删除" placement="top">
                          <img
                            src="@/assets/img/delete.png"
                            class="deleteIcon"
                            @click.stop="deleteJob(scope.row)"
                          />
                        </el-tooltip>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>

                <div class="mar-t-10">
                  <el-pagination
                    @current-change="changeDetailFenYe"
                    @size-change="handleDetailSizeChange"
                    class="qa-pagination"
                    background
                    layout="prev, pager, next, sizes"
                    :total="detailTotal"
                    :current-page="detailCurrent"
                  >
                  </el-pagination>
                </div>
              </div>
              <div v-else>暂无数据</div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <el-dialog
      :close-on-click-modal="false"
      title="新增任务"
      :visible.sync="dialogJob"
      width="30%"
    >
      <el-form
        :model="addJobForm"
        :rules="addJobRules"
        ref="addJobForm"
        label-width="100px"
      >
        <el-form-item label="上报类型" prop="model">
          <el-select
            v-model="addJobForm.model"
            placeholder="选择上报类型"
            class="select-full"
          >
            <el-option
              v-for="item in modelList"
              :key="item.code"
              :label="item.value"
              :value="item.code"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="时间类型" prop="dateType">
          <el-select
            v-model="addJobForm.dateType"
            placeholder="请选择"
            class="select-full"
            @change="changeDateType"
          >
            <el-option label="业务时间" :value="1"></el-option>
            <el-option label="上报时间" :value="2"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="机构">
          <el-select
            v-model="addJobForm.hospitalCodes"
            multiple
            placeholder="请选择机构"
            class="select-full"
          >
            <el-option
              v-for="item in hospitalList"
              :key="item.code"
              :label="item.value"
              :value="item.code"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="规则">
          <el-select
            v-model="addJobForm.ruleTypes"
            multiple
            placeholder="请选择规则检测"
            class="select-full"
            :disabled="disabled"
          >
            <el-option
              v-for="item in ruleList"
              :key="item.code"
              :label="item.value"
              :value="item.code"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="开始时间" prop="startTime">
          <el-date-picker
            v-model="addJobForm.startTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择日期"
            class="select-full"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker
            v-model="addJobForm.endTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择日期"
            class="select-full"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div class="footer-btn">
        <el-button @click="dialogJob = false">取消</el-button>
        <el-button type="primary" @click="createJob">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>import R from "@/api/request"

export default {
  name: 'task',
  data() {
    return {
      search: {
        hospitalCode: '',
        model: '',
        runStatus: '',
        startTime: '',
        endTime: '',
        // keyword: ''
      },
      hospitalList: [],
      modelList: [],
      statusList: [
        { code: 0, name: '未执行' },
        { code: 1, name: '已执行' }
      ],
      ruleList: [],
      daterange: [],
      tableData: [],
      total: 0,
      current: 1,
      pageSize: 10,
      jobData: [],
      detailTotal: 0,
      detailCurrent: 1,
      detailPageSize: 10,
      curRow: {},
      dialogJob: false,
      addJobForm: {
        dateType: '',
        model: '',
        startTime: '',
        endTime: '',
        hospitalCodes: [],
        ruleTypes: []
      },
      addJobRules: {
        dateType: [
          { required: true, message: '请选择时间类型', trigger: 'change' }
        ],
        model: [
          { required: true, message: '请选择上报类型', trigger: 'change' }
        ],
        startTime: [
          { required: true, message: '请选择开始时间', trigger: 'change' }
        ],
        endTime: [
          { required: true, message: '请选择结束时间', trigger: 'change' }
        ]
      },
      disabled: false
    };
  },
  async mounted() {
    await this.queryDict();
    await this.getTableData();
  },
  methods: {
    async queryDict() {
      await this.$R
        .queryDict({
          type: ['hospital', 'model', 'rule']
        })
        .then((res) => {
          this.ruleList = res.rule;
          this.modelList = res.model;
          this.hospitalList = res.hospital;
          this.search.model = res.model[0]?.code;
        });
    },
    rowClick(row) {
      this.curRow = row;
      this.detailCurrent = 1;
      this.getJobInfo();
    },
    changeFenYe(current) {
      this.current = current;
      this.getTableData();
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.getTableData();
    },
    changeDetailFenYe(current) {
      this.detailCurrent = current;
      this.getJobInfo();
    },
    handleDetailSizeChange(pageSize) {
      this.detailPageSize = pageSize;
      this.getJobInfo();
    },
    querySearch() {
      this.getTableData();
    },
    async getTableData() {
      let that = this;
      let startTime = '';
      let endTime = '';
      if (this.daterange && this.daterange.length) {
        startTime = this.daterange[0];
        endTime = this.daterange[1];
      }
      let data = {
        page: this.current,
        size: this.pageSize,
        // keyword: this.search.keyword,
        hospitalCode: this.search.hospitalCode || null,
        model: this.search.model || null,
        runStatus: this.search.runStatus || null,
        startTime: startTime || null,
        endTime: endTime || null
      };
      try {
        await this.$R.getBatchPage(data).then((res) => {
          this.total = res.pagination?.totalRow;
          that.tableData = res.data;

          // 初始化第一行数据
          if (res.data?.length) {
            this.curRow = res.data[0];
            this.$refs.taskTable.setCurrentRow(res.data[0]);
            this.detailCurrent = 1;
            this.getJobInfo();
          }
        });
      } catch (error) {
        console.log(error);
      }
    },
    getJobInfo() {
      let data = {
        batchId: this.curRow.id,
        page: this.detailCurrent,
        size: this.detailPageSize
      };
      this.$R.getJobPage(data).then((res) => {
        res.data.forEach(element => {
          element.hasChildren = true
        });
        this.jobData = res.data;
        this.detailTotal = res.pagination.totalRow;
      });
    },
    showJobDialog() {
      this.dialogJob = true;
      this.disabled = false;
      this.$nextTick(() => {
        this.$refs.addJobForm.resetFields();
      });
    },
    //执行批次
    execBatch(row) {
      this.$R.execBatch({}, row.id).then((res) => {
        this.getTableData();
        this.$message({
          message: '执行成功',
          type: 'success'
        });
      });
    },
    // 删除批次
    deleteBatch(row) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$R.deleteBatch({}, row.id).then((res) => {
          this.getTableData();
          this.$message({
            message: '删除成功',
            type: 'success'
          });
        });
      });
    },
    //执行任务
    execJob(row) {
      this.$R.execJob({}, row.id).then((res) => {
        this.getJobInfo();
        this.$message({
          message: '执行成功',
          type: 'success'
        });
      });
    },
    // 删除任务
    deleteJob(row) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$R.deleteJob({}, row.id).then((res) => {
          this.getJobInfo();
          this.$message({
            message: '删除成功',
            type: 'success'
          });
        });
      });
    },
    // 选择上报时间-只能选择行数检测
    changeDateType() {
      if (this.addJobForm.dateType === 2) {
        this.disabled = true;
        this.addJobForm.ruleTypes = ['row'];
      } else {
        this.disabled = false;
        this.addJobForm.ruleTypes = [];
      }
    },
    // 添加任务
    createJob() {
      this.$refs.addJobForm.validate((valid) => {
        if (valid) {
          this.$R.createJob(this.addJobForm).then((res) => {
            this.getTableData();
            this.dialogJob = false;
            this.$message({
              message: '添加成功',
              type: 'success'
            });
          });
        }
      });
    },

    load(tree, treeNode, resolve) {
      let data = {
        mainId: tree.id,
        page: 0,
        size: 999
      };
      this.$R.getJobDetailPage(data).then((res) => {
        res.data.forEach(element => {
          element.runStatus = element.status
        });
        resolve(res.data)
      });
    },
    getOpenDetail(row, column, event){
      if (row.hasChildren)
        event.currentTarget.querySelector('.el-table__expand-icon').click();
    },
  }
};
</script>

<style lang="scss" scoped>
.page {
  background: #fff;
  height: 100%;
  padding: 0 10px;

  /deep/ .el-tabs__header {
    margin: 0;
  }

  /deep/.el-table__body tr.current-row > td {
    background-color: #a3caf8 !important;
  }

  .header {
    display: flex;
    height: 50px;
    justify-content: space-between;
    align-items: center;

    .left {
      display: flex;
      justify-content: flex-start;
      align-items: center;

      .x-input {
        width: 200px;
      }
    }
  }

  .item-box {
    border-bottom: 1px dashed #ccc;
    padding: 10px 0;
  }
  .desc {
    text-indent: 2em;
  }

  /deep/.box-card .el-card__body {
    max-height: 454px;
    overflow-y: auto;
  }
  .btn-group {
    display: table-cell;
    vertical-align: middle;
    height: 26px;
    line-height: normal;
  }
  .footer-btn {
    text-align: right;
  }
  /deep/ .el-table__row {
    cursor: pointer;
  }
}
</style>
