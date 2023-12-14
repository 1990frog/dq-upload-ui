<!-- 上报优化 -->
<template>
  <div class="page zlbg-body-bg">
    <!-- 左边导航 -->
    <div class="left-box">
      <leftmenu @nodeClick="nodeClick" ref="leftmenu"></leftmenu>
    </div>

    <div class="right-box">
      <!-- 顶部按钮组 -->
      <div class="r-header">
        <div class="left">
          <div class="search mar-b-10 padding-0 k-drak">
            <el-select v-model="hospitalCode" placeholder="请选择" @change="changeDateType" size="mini" class="mar-r-10">
              <el-option v-for="item in hospitalListData" :key="item.id" :label="item.value" :value="item.code">
              </el-option>
            </el-select>
            <!-- 
            <el-input placeholder="请输入关键字查询" class="mar-left-10" size="mini" style="width:200px"></el-input> -->
            <el-select v-model="dateType" placeholder="请选择" size="mini" @change="changeDateType">
              <el-option label="业务时间" value="1"></el-option>
              <el-option label="上报时间" value="2"></el-option>
            </el-select>
          </div>
        </div>
        <div class="right">
          <el-link icon="icon el-icon-refresh icon-shauxin" :underline="false">刷新</el-link>
          <el-link icon="icon el-icon-upload2 icon-daochu" :underline="false">导出</el-link>
          <el-link icon="icon el-icon-back icon-fanhui" v-show="isFromRule" :underline="false" @click="backRule">返回</el-link>
        </div>
      </div>

      <!-- 主内容区 -->
      <div class="zlbg-right-box-bg chart-bg" v-if="hasCharts">
        <div class="chart-box">
          <div class="title title-etl">
            {{tableInfo ? tableInfo.tableComment || '' : ''}}
            <span></span>
          </div>
          <div id="etlchart"></div>
        </div>
      </div>
      <div v-else class="kongshuju mar-b-10">空数据</div>

      <!-- 表格详细信息 -->
      <div class="zlbg-right-box-bg mar-top-20 k-from-dark pad-10" v-if="chartsData.length">
        <div class="in-table xh-dark-warp">
          <el-table :data="chartsData" border>
            <el-table-column type="index" label="序" width="50"></el-table-column>
            <el-table-column prop="keyField" label="主键"></el-table-column>
            <!-- <el-table-column prop="扩展列1" label="扩展列1"></el-table-column> -->
            <!-- <el-table-column prop="field" label="扩展列1"></el-table-column> -->
            <el-table-column v-for="item in columns" :key="item.column" :label="item.columnComment">
              <template slot-scope="scope">
                {{getColumnValue(scope.row, item)}}
              </template>
            </el-table-column>
            <el-table-column prop="desc" label="质量问题">
              <template slot-scope="scope">
                <span class="rule-name">【{{scope.row.ruleType}}】</span>{{scope.row.desc}}
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="核查时间"></el-table-column>
          </el-table>
        </div>

        <div class="mar-t-20 text-right">
          <el-pagination @current-change="changePageTableData" background layout="total, prev, pager, next, jumper" :total="total" :current-page="current">
          </el-pagination>
        </div>
      </div>
      <div v-else class="kongshuju">空数据</div>
    </div>
  </div>
</template>

<script>
var myChart;

// 引用左边导航组件模板
import leftmenu from './components/LeftMenuOptimize.vue';
import Template from './components/template.vue';
import { formatDate } from './js/format.js';
export default {
  name: 'qualityOptimize',
  components: {
    leftmenu,
    Template
  },
  computed: {
    isFromRule() {
      return this.$store.state.common.isFromRule;
    }
  },
  data() {
    return {
      hospitalCode: null,
      hospitalListData: [],
      activeName: ['1', '2'],
      chartsData: [],
      tableInfo: null,

      dateType: "1",
      hasCharts: false,
      businessTime: "",
      total: 0,
      current: 1,
      columns: []
    };
  },
  mounted() {
    this.queryHospital()
    this.initData();
  },
  methods: {
    changeDateType() {
      this.getReportCharts(this.tableInfo);
    },

    initData() {
      this.$refs.leftmenu.getReportMenu();
    },

    nodeClick(node) {
      this.tableInfo = node
      this.getReportCharts(node);
    },

    //报告图表
    getReportCharts(node) {
      this.hasCharts = false
      var that = this;
      let data = {
        dateType: this.dateType.toString(),
        model: node.model,
        table: node.table,
        hospital: this.hospitalCode
      }
      this.$R.reportCharts(data).then((res) => {
        if (res && res.xaxis && res.xaxis.length) {
          that.businessTime = res.xaxis[0]
          that.hasCharts = true
          that.$nextTick(() => {
            that.createEcharts(res);
          });
          that.getReportResult(node)
        }
      });
    },

    //报告详情
    getReportResult(node) {
      var that = this;
      let data = {
        model: node.model,
        table: node.table,
        page: this.current,
        size: 20,
        startTime: this.businessTime,
        endTime: formatDate(new Date(new Date(this.businessTime).getTime() + 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
        keys:''
      }
      this.$R.getReportColumn(data).then((res) => {
        if (res) {
          this.columns = []

          res.data.forEach(element => {
            if(element?.columnDescVOS){
              element.columnDescVOS.forEach(t => {
                if(!this.columns.find(c => c.column === t.column)){
                  this.columns.push(t)
                }
              })
            }
          });

          that.chartsData = res.data
          that.total = res?.pagination?.totalRow
        }
      });
    },

    // 创建ETL质量评估图表
    createEcharts(data) {

      var params = {}
      params.legendData = []
      params.series = []
      params.xAxisData = data.xaxis

      let rules = [{ title: "非空检测", scores: "nonEmptyScores" }, { title: "波动率检测", scores: "rowScores" }, { title: "枚举值检测", scores: "enumScores" }, { title: "绝对值检测", scores: "absScores" }]
      rules.forEach((element, index) => {
        index > 9 ? index = index - 9 : index
        params.legendData.push({ name: element.title, textStyle: { color: chartColors.seriesColors[index].line } })
        params.series.push({
          name: element.title,
          type: 'line',
          smooth: true,
          symbolSize: 8,
          // symbol: 'circle',
          itemStyle: {
            color: chartColors.seriesColors[index].line,
            // borderColor: "#fff",
            // borderWidth: 2,
            // shadowColor: 'rgba(0, 0, 0, .3)',
            // shadowBlur: 0,
            // shadowOffsetY: 2,
            // shadowOffsetX: 2,
          },
          areaStyle: {
            color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: chartColors.seriesColors[index].top
            }, {
              offset: 1,
              color: chartColors.seriesColors[index].bottom
            }])
          },
          data: data[element.scores],
          barWidth: '30%',
          hoverAnimation: false,
          silent: true
        })
      })
      this.setChart(chartConfig(params, this))
    },

    setChart(option) {
      let that = this
      var chartDom = document.getElementById('etlchart')

      myChart = this.$echarts.init(chartDom)

      option && myChart.setOption(option)

      //点击x轴线
      myChart.getZr().on('click', params => {
        const pointInPixel = [params.offsetX, params.offsetY]
        if (myChart.containPixel('grid', pointInPixel)) {
          const xIndex = myChart.convertFromPixel({ seriesIndex: 0 }, [params.offsetX, params.offsetY])[0]
          that.businessTime = option.xAxis[0].data[xIndex]
          myChart.resize();
          that.getReportResult(that.tableInfo);
        }
      })

      //点击x轴坐标
      myChart.on('click', 'xAxis.category', function (params, node) {
        that.businessTime = params.value
        myChart.resize();
        that.getReportResult(that.tableInfo);
      });

      // 图表div改变，重构echarts
      $('#etlchart').resize(function () {
        myChart.resize()
      })
    },

    backRule() {
      this.$router.push({ path: '/qualityrule' })
    },

    async queryHospital() {
      await this.$R
        .queryDict({
          type: ['hospital']
        })
        .then((res) => {
          this.hospitalListData = res.hospital;
          if (res?.hospital?.length)
            this.hospitalCode = res.hospital[0].code
        });
    },

    changePageTableData(page) {
      this.current = page
      this.getReportResult(this.tableInfo);
    },
    getColumnValue(row, item){
      return row.columnDescVOS.find(t => t.column === item.column)?.value
    }
  },
};

// 图表的颜色参数
let chartColors = {
  seriesColors: [
    { top: 'rgba(74,145,247,0.5)', bottom: 'rgba(74,145,247,0.01)', line: '#4a92f7' },
    { top: 'rgba(121,249,177,0.5)', bottom: 'rgba(121,249,177,0.01)', line: '#78faaf' },
    { top: 'rgba(250,222,96,0.5)', bottom: 'rgba(250,222,96,0.01)', line: '#f9dc5f' },
    { top: 'rgba(236,108,117,0.5)', bottom: 'rgba(236,108,117,0.01)', line: '#ee6b76' },
    { top: 'rgba(97,217,250,0.5)', bottom: 'rgba(97,217,250,0.01)', line: '#61d9f9' },
    { top: 'rgba(87,192,144,0.5)', bottom: 'rgba(87,192,144,0.01)', line: '#59bf91' },
    { top: 'rgba(239,136,67,0.5)', bottom: 'rgba(239,136,67,0.01)', line: '#f08844' },
    { top: 'rgba(141,72,227,0.5)', bottom: 'rgba(141,72,227,0.01)', line: '#8c47e2' },
    { top: 'rgba(223,121,248,0.5)', bottom: 'rgba(223,121,248,0.01)', line: '#dc79f8' }
  ]
}

function chartConfig(config, vm) {
  var option = {
    backgroundColor: '#283259',
    color: ['#f0c725', '#16f892'],
    title: {
      left: 'center',
      text: config.title,
      textStyle: {
        color: '#FFFFFF',
        fontSize: '14'
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      confine: true
    },
    legend: {
      x: '50%',
      top: '2%',
      textStyle: {
        color: 'inherit',
        fontSize: 14
      },
      inactiveColor: '#90979c',
      data: config.legendData
    },
    grid: {
      left: '6%',
      right: '4%',
      top: '20%',
      bottom: '15%',
      containLabel: true
    },
    toolbox: {
      show: true,
      orient: 'vertical',
      x: 'right',
      y: 'center'
    },
    xAxis: [{
      type: 'category',
      triggerEvent: true,
      axisLine: {
        show: true
      },
      splitArea: {
        // show: true,
        color: '#f00',
        lineStyle: {
          color: '#f00'
        },
      },
      axisLabel: {
        color: function (value, index) {
          return value == vm.businessTime ? '#21aced' : '#fff';
        },
        margin: 20,
        clickable: true,
      },
      splitLine: {
        show: false
      },
      boundaryGap: false,
      data: config.xAxisData,

    }],
    yAxis: [
      {
        type: 'value',
        name: '(分数)',
        nameTextStyle: {
          color: '#c1cadf',
          align: 'right',
          lineHeight: 10
        },
        axisLine: {
          lineStyle: {
            color: '#c1cadf'
          }
        },
        axisLabel: {
          interval: 0,
          color: '#c1cadf'
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: ['#fff'],
            opacity: 0.06
          }
        }
      }
    ],
    dataZoom: [{
      show: true,
      height: 25,
      xAxisIndex: [0],
      bottom: 10,

      "start": 0,
      "end": 20,
      handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
      handleSize: '110%',
      handleStyle: {
        color: "#5B3AAE",
      },
      textStyle: {
        color: "rgba(204,187,225,0.5)",
      },
      fillerColor: "rgba(67,55,160,0.4)",
      borderColor: "rgba(204,187,225,0.5)",

    }, {
      type: "inside",
      show: true,
      height: 15,
      start: 1,
      end: 35
    }],

    series: config.series
  }

  return option
}
</script>

<style lang="scss" scoped>
::v-deep .el-icon-arrow-left,
::v-deep .el-icon-arrow-right {
  color: #fff;
}
html {
  font-size: 12px;
}
div {
  box-sizing: border-box;
}
.page {
  display: flex;
  flex-flow: row;
  height: 100%;
  min-height: 540px;
  .left-box {
    width: 250px;
    height: 100%;
  }
  .right-box {
    flex: 1;
    height: 100%;
    padding: 10px;
    overflow: auto;
    padding-bottom: 40px;
    background: #424a6c;
    .r-header {
      width: 100%;
      height: 40px;
      display: flex;
      justify-content: space-between;
    }
    .r-box {
      overflow: auto;
      height: calc(100vh - 150px);
      // min-height: 456px;
    }
    &::v-deep .el-row {
      height: 100%;
    }
    &::v-deep .el-col {
      height: 100%;
    }
    .right {
      &::v-deep .el-link.el-link--default {
        color: #ededed;
      }
      &::v-deep .el-link.el-link--default:hover {
        color: #21aced;
      }
      &::v-deep .icon-shauxin {
        color: #deb73b !important;
        margin-left: 15px;
      }
      &::v-deep .icon-daochu {
        color: #2bcb5c !important;
        margin-left: 15px;
      }
      &::v-deep .icon-fanhui {
        color: #2370c3 !important;
        margin-left: 15px;
      }
    }
  }
}

/* title 标题带圆圈 */
.title {
  font-size: 12px;
  padding-left: 22px;
  position: relative;
  box-sizing: border-box;
  height: 40px;
  line-height: 40px;
  span::after {
    content: '';
    width: 8px;
    height: 8px;
    background: #21aced;
    overflow: hidden;
    position: absolute;
    left: 10px;
    top: 16px;
    border-radius: 100%;
  }
}
.search {
  padding: 0 10px;
  &.padding-0 {
    padding-left: 0;
  }
}
.zlbg-right-box-bg {
  background-color: #283259;
  border: 1px solid #0e183f;
  border-radius: 5px;
}
.chart-bg {
  padding: 10px;
}
// 图标样色
.chart-box {
  width: 100%;
  position: relative;
  box-sizing: border-box;
  .title-etl {
    color: #fff;
    font-size: 14px;
    position: absolute;
    left: 0px;
    top: 0px;
    z-index: 1;
  }
}
#etlchart {
  width: 100%;
  height: 400px;
}
.kongshuju {
  width: 100%;
  color: #e6e6e6;
  height: 300px;
  background: #283259;
  border: 1px solid #0e183f;
  display: flex;
  justify-content: center;
  align-items: center;
}
.zlbg-body-bg {
  height: 100%;
  overflow: hidden;
}

.fenshutxt {
  color: #eda721;
}

::v-deep .el-icon-arrow-left:before {
  content: '\e6de';
}
::v-deep .el-icon-arrow-right:before {
  content: '\e6e0';
}

::v-deep .k-from-dark .el-table th {
  color: #d0d1d6;
}

::v-deep .k-from-dark .el-table th {
  background: #474e6d !important;
}
.text-right {
  text-align: right;
}
.rule-name {
  font-weight: 600;
  color: red;
}
</style>
