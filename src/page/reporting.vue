<!--*名称:上报数据情况-->
<template>
  <div class="page-shangbaoshuju">
    <!-- 功能菜单区 -->
    <header class="ShangBaoShuJuHeader">
      <div class="JiGou">
        <span class="title">机构：</span>
        <el-select
          v-model="hospital"
          placeholder="请选择机构"
          size="mini"
          clearable
        >
          <el-option
            v-for="(item, index) in hospitalList"
            :key="index"
            :label="item.value"
            :value="item.code"
          ></el-option>
        </el-select>
      </div>
      <div class="JiGou">
        <span class="title">类型：</span>
        <el-select
          v-model="leiXingVal"
          placeholder="请选择类型"
          size="mini"
          clearable
        >
          <el-option
            v-for="(item, index) in leiXingList"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="JiGou">
        <span class="title">数据源：</span>
        <el-select
          v-model="db"
          placeholder="请选择数据源"
          size="mini"
          clearable
          @change="getShuJuBiaoList"
        >
          <el-option
            v-for="(item, index) in dbs"
            :key="index"
            :label="item.model"
            :value="item.model"
          ></el-option>
        </el-select>
      </div>

      <div class="JiGou">
        <span class="title">数据表：</span>
        <el-select
          v-model="shuJuBiaoVal"
          placeholder="请选择数据表"
          size="mini"
          clearable
        >
          <el-option
            v-for="(item, index) in shuJuBiaoList"
            :key="index"
            :label="item.tableComment"
            :value="item.table"
          ></el-option>
        </el-select>
      </div>

      <div class="riqi">
        <span class="title">日期：</span>
        <el-date-picker
          v-model="riQiVal"
          type="date"
          placeholder="选择日期"
          value-format="yyyy-MM-dd"
        >
        </el-date-picker>
        <el-button
          @click="queryReport"
          type="primary"
          class="chaxunshuju"
          icon="el-icon-search"
          size="mini"
          >查询
        </el-button>

        <el-button
          type="primary"
          size="mini"
          icon="el-icon-search"
          @click="daoChuTableData"
        >
          导出
        </el-button>
      </div>
    </header>

    <div class="rule-warp">
      <el-button
        :type="guiZheVal === item.code ? 'primary' : ''"
        v-for="(item, index) in guiZheList"
        :key="index"
        @click="setGuiZeTableData(item)"
      >
        {{ item.value }}
      </el-button>
    </div>
    <!-- 数据表单 -->
    <div class="table-warp">
      <el-table
        :data="guiZheTableData"
        :key="guiZheVal"
        border
        style="width: 100%"
      >
        <el-table-column type="index" width="50" label="序"> </el-table-column>
        <el-table-column
          v-for="(item, index) in guiZheTable[guiZheVal]"
          :key="index"
          :prop="item.prop"
          :label="item.label"
        >
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="fenye">
      <el-pagination
        @current-change="changePageTableData"
        background
        layout="total, prev, pager, next, jumper"
        :total="paginationTotal"
      >
      </el-pagination>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
export default {
  name: 'zhiliangpinggubaobiao',
  data() {
    let vue = this;

    // 图表数据
    this.chartSettings = {
      area: true
    };
    this.colors = ['#1890ff'];
    this.vChartGrid = {
      top: '25px',
      left: '15px',
      bottom: '20px'
    };

    return {
      paginationTotal: 0,
      guiZheTableData: [],
      // 规则数据表头的规则
      guiZheTable: {
        // 绝对值检测
        abs: [
          { prop: 'model', label: '模型' },
          { prop: 'table', label: '表名' },
          { prop: 'tbCN', label: '中文表名' },
          { prop: 'hospitalname', label: '医联体' },
          { prop: 'score', label: '分数' },
          { prop: 'field', label: '绝对值字段' },
          { prop: 'total', label: '数据总量' },
          { prop: 'detection', label: '检测记录数' },
          { prop: 'satisfied', label: '满足条件记录数' },
          { prop: 'unsatisfied', label: '不满足条件记录数' }
        ],
        // 枚举值检测
        enum: [
          { label: '表名', prop: 'table' },
          { label: '中文表名', prop: 'tbCN' },
          { label: '医联体', prop: 'hospitalname' },
          { label: '分数', prop: 'score' },
          { label: '枚举值字段', prop: 'field' },
          { label: '数据总量', prop: 'total' },
          { label: '检测记录数', prop: 'detection' },
          { label: '满足条件记录数', prop: 'satisfied' },
          { label: '不满足条件记录数', prop: 'unsatisfied' }
        ],
        // 主子关系检测
        main_detail: [
          { label: '模型', prop: 'model' },
          { label: '表名', prop: 'table' },
          { label: '中文表名', prop: 'tbCN' },
          { label: '医联体', prop: 'hospitalname' },
          { label: '分数', prop: 'score' },
          { label: '子表数据量', prop: 'total' },
          { label: '匹配数据量', prop: 'match' }
        ],
        // 非空检测
        non_empty: [
          { label: '模型', prop: 'model' },
          { label: '表名', prop: 'table' },
          { label: '中文表名', prop: 'tbCN' },
          { label: '医联体', prop: 'hospitalname' },
          { label: '分数', prop: 'score' },
          { label: '核查字段数', prop: 'check_field_count' },

          {
            label: '填充率在0~20%的字段数',
            prop: 'fill_rate_0_2_fields_number'
          },
          {
            label: '填充率在20~40%的字段数',
            prop: 'fill_rate_2_4_fields_number'
          },
          {
            label: '填充率在40~60%的字段数',
            prop: 'fill_rate_4_6_fields_number'
          },
          {
            label: '填充率在60~80%的字段数',
            prop: 'fill_rate_6_8_fields_number'
          },
          {
            label: '填充率在80~100%的字段数',
            prop: 'fill_rate_8_10_fields_number'
          }
        ],
        // 行数检测
        row: [
          { label: '模型', prop: 'model' },
          { label: '表名', prop: 'table' },
          { label: '中文表名', prop: 'tbCN' },
          { label: '医联体', prop: 'hospitalname' },
          { label: '行数', prop: 'total' }
        ],
        // source_target
        source_target: [
          { label: '模型', prop: 'model' },
          { label: '表名', prop: 'table' },
          { label: '中文表名', prop: 'tbCN' },
          { label: '医联体', prop: 'hospitalname' },
          { label: '分数', prop: 'score' },
          { label: '目标表数据总量', prop: 'target_total' },
          { label: '目标表差异量', prop: 'target_more' },
          { label: '源表数据总量', prop: 'source_total' },
          { label: '源表差异量', prop: 'source_more' }
        ]
      },
      shuJuBiaoList: [],
      shuJuBiaoVal: '',
      guiZheList: [],
      guiZheVal: '',
      leiXingVal: '',
      riQiVal: '',
      leiXingList: [
        { label: '全量', value: 0 },
        { label: '增量', value: 1 },
        { label: 'ETL任务', value: 2 },
        { label: '月报', value: 3 }
      ],
      // 机构
      hospital: '',
      // 模型
      db: '',
      // 时间类型
      dateType: 'day',
      // 业务时间
      businessTime: '',
      dateTypeShow: true,
      // 机构码表
      hospitalList: [],
      // 模型码表
      dbs: [],
      // 日期类型
      dateOptions: [
        { value: 'day', label: '按日选择' },
        { value: 'year', label: '按年选择' }
      ],
      // 上报表格数据
      tableMeta: {
        header: [],
        headerDay: ['表名', '中文表名'],
        headerYear: [
          '表名',
          '中文表名',
          '一月',
          '二月',
          '三月',
          '四月',
          '五月',
          '六月',
          '七月',
          '八月',
          '九月',
          '十月',
          '十一月',
          '十二月'
        ],
        tableData: [],
        total: 20,
        size: 20,
        num: 1
      },
      /* 图表数据 */
      chartData: {
        columns: ['日期', '上报数据'],
        rows: []
      }
    };
  },
  // 创建元素前
  created() {
    this.queryHospital();
    this.queryDbs();
    this.initTable();
  },
  // 创建元素后
  mounted() {
    // this.queryReport();

    this.getGuiZheList(); // 获取规则list
  },
  // 计算属性
  computed: {},
  // 方法
  methods: {
    changePageTableData(val) {
      let that = this;
      this.getTableData({
        rule: this.guiZheVal,
        pageSize: 10,
        pageNum: val,
        businessTime: that.businessTime,
        hospital: that.hospital,
        model: that.db,
        tb: that.shuJuBiaoVal,
        type: that.leiXingVal
      });
    },

    getShuJuBiaoList() {
      this.shuJuBiaoVal = null;
      this.getTableDataList();
    },

    daoChuTableData() {
      var that = this;
      axios({
        method: 'post',
        url: `/clinbrain/api/compare/analysis/export?businessTime=${this.riQiVal}&model=${this.db}&hospital=${this.hospital}&tb=${this.shuJuBiaoVal}&type=${this.leiXingVal}`,
        data: {},
        responseType: 'blob' // 加上这个是重点
      }).then((res) => {
        downloadFile(res);
      });

      function downloadFile(res) {
        try {
          let url = window.URL.createObjectURL(new Blob([res.data]));
          let link = document.createElement('a');
          let fileName = decodeURIComponent(
            res.headers['content-disposition'].split('filename=')[1]
          );
          link.style.display = 'none';
          link.href = url;
          link.setAttribute('download', fileName);
          document.body.appendChild(link);
          link.click();
          URL.revokeObjectURL(link.href);
          document.body.removeChild(link);
          that.msgSuccess('导出成功');
        } catch (error) {
          alert('导出失败');
          console.log(error);
        }
      }
    },
    getTableData(obj) {
      let that = this;
      this.$R.analysisreport(obj).then((res) => {
        that.guiZheTableData = res.list;
        that.paginationTotal = res.total;
      });
    },
    setGuiZeTableData(item) {
      let that = this;
      this.guiZheVal = item.code;
      this.getTableData({
        rule: item.code,
        pageSize: 10,
        businessTime: that.riQiVal,
        hospital: that.hospital,
        model: that.db,
        tb: that.shuJuBiaoVal,
        type: that.leiXingVal
      });
    },
    getGuiZheList(obj = null) {
      let that = this;
      this.$R.reportrule(obj).then((res) => {
        try {
          that.guiZheList = res;
          that.guiZheVal = res[0].code;
          that.getTableData({
            rule: res[0].code,
            pageSize: 10,
            pageNum: 1,
            model: that.db,
            hospital: that.hospital,
            tb: that.shuJuBiaoVal,
            type: that.leiXingVal,
            businessTime: that.riQiVal
          });
        } catch (error) {
          console.log('获取规则数据失败 :>> ', error);
          that.guiZheTableData = [];
        }
      });
    },
    getTableDataList() {
      this.$R
        .tables({
          model: this.db
        })
        .then((data) => {
          this.shuJuBiaoList = data;
          //   this.shuJuBiaoVal = data[0].tableComment;
        });
    },
    /**
     * 医院码表
     */
    async queryHospital() {
      await this.$R
        .queryDict({
          type: ['hospital']
        })
        .then((res) => {
          this.hospitalList = res.hospital;
          res.hospital.forEach((n) => {
            // 设置默认选项
            if (n.selected === 1) {
              //   this.hospital = n.code;
            }
          });
        });
    },
    /**
     * 模型码表
     */
    queryDbs() {
      this.$R.dbSelect().then((data) => {
        this.dbs = data;
        if (data !== undefined) {
          //   this.db = data[0].model;
          this.getTableDataList();
        }
      });
    },
    /**
     * 查询数据量
     */
    queryReport() {
      this.getGuiZheList({
        businessTime: this.riQiVal,
        model: this.db,
        hospital: this.hospital,
        pageNum: 1,
        pageSize: 10,
        tb: this.shuJuBiaoVal,
        type: this.leiXingVal
      });
    },
    /**
     * 时间类型
     */
    initTable() {
      this.dateTypeShow = this.dateType === 'day';
      // day
      if (this.dateTypeShow) {
        this.tableMeta.header = this.tableMeta.headerDay;
        for (var i = 6; i >= 0; i--) {
          var dateTime = new Date(this.businessTime);
          dateTime.setDate(dateTime.getDate() - i);
          this.tableMeta.header.push(dateTime.toLocaleDateString());
        }
      } else {
        this.tableMeta.header = this.tableMeta.headerYear;
      }
    },

    sizeChange(e) {
      this.shangbaodata.size = e;
      let that = this;
      this.getdataVolume({
        date: that.pickerdate,
        num: 1,
        hospitalCode: that.jiGou.jiGouVal,
        type: that.RiQiTypeval
      });
    },

    // 切换页码
    currentChange(e) {
      let that = this;
      this.getdataVolume({
        date: that.pickerdate,
        num: e,
        hospitalCode: that.jiGou.jiGouVal,
        type: that.RiQiTypeval
      });
    },

    /* 显示图表数据 */
    showEcharts(scope) {
      console.log(scope);
      /* 对图表数据进行数据处理 */
      let index = scope.$index;
      let newRows = [];
      if (this.shangbaodata.header.length === 8) {
        // 显示的7天数据
        for (let i = 0; i < this.shangbaodata.header.length; i++) {
          if (this.shangbaodata.header[i] !== '表名') {
            newRows[i - 1] = {};
            newRows[i - 1]['日期'] = this.shangbaodata.header[i];
            newRows[i - 1]['上报数据'] = scope.row['date' + i];
          }
        }

        this.chartData.rows = newRows;
      } else {
        // 显示的12月的数据
        for (let i = 0; i < this.shangbaodata.header.length; i++) {
          if (this.shangbaodata.header[i] !== '表名') {
            newRows[i - 1] = {};
            newRows[i - 1]['日期'] = this.shangbaodata.header[i];
            newRows[i - 1]['上报数据'] = scope.row[this.shangbaodata.header[i]];
          }
        }
        this.chartData.rows = newRows;
      }

      /* 对显示图表层进行处理 */
      this.tubiaoshow = true;
      if (index < 6) {
        // 前5个，像下加
        this.tubiaostyle = {
          top: index * 30 + 30 + 'px'
        };
        this.sanjiaostyle = {
          top: index * 30 + 40 + 'px'
        };
      } else {
        // 后面的像上加
        this.tubiaostyle = {
          top: 4 * 30 + 40 + 'px'
        };
        this.sanjiaostyle = {
          top: index * 30 + 40 + 'px'
        };
      }
    },

    /* 隐藏图表 */
    tubiaohide() {
      this.tubiaoshow = false;
    }
  },
  // 侦听属性
  watch: {}
};
</script>

<style lang="scss" scoped>
.page-shangbaoshuju {
  background: #fff;
  width: 100%;
  height: 100%;
  color: #555;
}

.ShangBaoShuJuHeader {
  display: flex;
  width: 100%;
  height: 50px;
  flex-direction: row;
  align-items: center;
  padding: 0 10px;
  box-sizing: border-box;
  .JiGou {
    margin-right: 20px;
  }
}

.shangbaoshuju-table {
  position: relative;
  padding: 0 10px;
  background: #fff;

  .table-box-shadow {
    box-shadow: 0 0px 10px rgba(0, 0, 0, 0.1);
  }

  .tubiao {
    padding-top: 40px;
    width: 640px;
    height: 280px;
    position: absolute;
    z-index: 1000;
    top: 0;
    right: 140px;
    background: #fff;
    border-radius: 4px;
    border: 1px solid #ddd;
    overflow: hidden;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

    .tubiao-title {
      position: absolute;
      top: 20px;
      left: 20px;
      font-size: 14px;
      color: #666;
    }
  }
}

.fenye {
  width: 100%;
  display: flex;
  background: #fff;
  padding-top: 10px;
  padding-bottom: 40px;
  justify-content: flex-start;
  align-items: center;
  padding-right: 10px;
  box-sizing: border-box;

  ::v-deep .el-button--default {
    border-radius: 0;
    margin-left: 10px;
    border: 1px solid #c4c6cf !important;
  }
}

.bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
}

.sanjiao {
  position: absolute;
  top: 0;
  right: 10px;
  width: 30px;
  height: 30px;
  background: #fff;
  transform: rotate(45deg); /*顺时针旋转90°*/
  border: 1px solid #ddd;
}

.sanjiao-warp {
  z-index: 10000;
  position: absolute;
  right: 122px;
  top: 50px;
  width: 20px;
  height: 30px;
  overflow: hidden;
}

.riqi {
  display: flex;
  align-items: center;

  .selectDate {
    width: 110px;
    margin-right: 10px;
  }

  ::v-deep .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 200px;
    margin-right: 10px;
  }
}

::v-deep span.iconqushi {
  color: #36c !important;
}

::v-deep .el-icon-arrow-left:before {
  content: '\e6de' !important;
}
::v-deep .el-icon-arrow-right:before {
  content: '\e6e0';
}

.rule-warp {
  padding: 10px;
}
.table-warp {
  padding: 0 10px 10px 10px;
  background: #fff;
}
</style>
