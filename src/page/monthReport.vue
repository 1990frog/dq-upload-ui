<template>
  <div class="page-content">
    <header class="page-header">
      <el-form :inline="true" :model="search" label-width="90px">
        <el-form-item>
          <span>上报类型：</span>
          <el-select filterable size="mini" v-model="search.model" placeholder="选择上报类型" @change="queryReport">
            <el-option v-for="item in modelList" :key="item.code" :label="item.value" :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <span>机构：</span>
          <el-select v-model="search.hospital" placeholder="请选择" size="mini" @change="queryReport">
            <el-option v-for="item in hospitalList" :key="item.id" :label="item.value" :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <span>日期：</span>
          <el-date-picker v-model="search.month" size="mini" type="month" value-format="yyyy-MM" :clearable="false" placeholder="选择月份" @change="queryReport">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <span>时间类型：</span>
          <el-select v-model="search.jobType" placeholder="请选择" size="mini" @change="queryReport">
            <el-option label="业务时间" value="1"></el-option>
            <el-option label="上报时间" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="queryReport" type="primary" class="chaxunshuju" icon="el-icon-search" size="mini">
            查询
          </el-button>
          <el-button type="warning" size="mini" icon="el-icon-upload2" @click="daoChuTableData" :loading="loading">
            导出
          </el-button>
        </el-form-item>
      </el-form>
    </header>

    <div>
      <el-table :data="monthTableData" border style="width: 100%">
        <el-table-column type="index" width="50" label="序号" fixed="left"> </el-table-column>
        <el-table-column prop="tableComment" show-overflow-tooltip width="180" label="表名" fixed="left"></el-table-column>
        <el-table-column v-for="item in records" width="100" :key="item" :label="item" v-if="records.length">
          <template slot-scope="scope">
            {{getTotal(scope.row.records,item)}}
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <el-popover placement="left" :width="charts?600:200" trigger="click" @show="showPopover(scope.row)">
              <div class="mychart" v-if="curTableName==scope.row.tableName&&charts"></div>
              <div v-else>暂时数据</div>
              <a class="el-icon-s-data echart-a" slot="reference"></a>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="mar-t-20">
      <el-pagination @current-change="changePageTableData" @size-change="handleSizeChange" background layout="total, prev, pager, next, jumper, sizes" :total="total" :current-page="current">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
import { formatDate } from './js/format.js';
var myChart;
export default {
  name: 'monthReport',
  data() {
    return {
      search: {
        model: "",
        hospital: "",
        jobType: "1",
        month: formatDate(new Date(), 'yyyy-MM')
      },
      hospitalList: [],
      total: 0,
      current: 1,
      pageSize: 10,
      monthTableData: [],

      chartData: {
        columns: ["日期", "波动率"],
        rows: [
          { 日期: "1号", 波动率: 500000, 下单用户: 1093, 下单率: 0.32 },
          { 日期: "2号", 波动率: 520000, 下单用户: 3230, 下单率: 0.26 },
          { 日期: "3号", 波动率: 510000, 下单用户: 2623, 下单率: 0.76 },
          { 日期: "4号", 波动率: 480000, 下单用户: 1423, 下单率: 0.49 },
          { 日期: "5号", 波动率: 490000, 下单用户: 3492, 下单率: 0.323 },
          { 日期: "6号", 波动率: 530000, 下单用户: 4293, 下单率: 0.78 },
          { 日期: "7号", 波动率: 440000, 下单用户: 4293, 下单率: 0.78 },
          { 日期: "8号", 波动率: 420000, 下单用户: 4293, 下单率: 0.78 },
          { 日期: "9号", 波动率: 530000, 下单用户: 4293, 下单率: 0.78 },
          { 日期: "10号", 波动率: 560000, 下单用户: 4293, 下单率: 0.78 },
          { 日期: "11号", 波动率: 570000, 下单用户: 4293, 下单率: 0.78 },
          { 日期: "12号", 波动率: 580000, 下单用户: 4293, 下单率: 0.78 },
        ]
      },
      curTableName: "",
      records: [],
      charts: [],
      modelList: [],
      loading: false
    };
  },
  created() {
    this.queryHospital();
  },
  mounted() {
    // window.addEventListener('resize', function () {
    //   setTimeout(() => {
    //     myChart.resize();
    //   }, 500);
    // });
  },
  methods: {
    showPopover(row) {
      this.curTableName = row.tableName
      let that = this
      this.$nextTick(() => {
        that.getEchartData(row);
      });
    },
    changePageTableData(page) {
      this.current = page
      this.getTableData();
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.getTableData();
    },
    //导出
    daoChuTableData() {
      var that = this;
      this.loading = true
      axios({
        method: 'get',
        url: `/clinbrain/api/upload/report/execl?dateType=${this.search.jobType}&model=${this.search.model}&hospitalCode=${this.search.hospital}&month=${this.search.month}`,
        data: {},
        responseType: 'blob' // 加上这个是重点
      }).then((res) => {
        downloadFile(res);
      }).finally(() => {
        this.loading = false
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
    getTableData() {
      let data = {
        size: this.pageSize,
        page: this.current,
        model: this.search.model,
        hospital: this.search.hospital,
        month: this.search.month,
        jobType: this.search.jobType,
      }
      let that = this;
      this.$R.reportMonth(data).then((res) => {
        that.monthTableData = res.data;
        that.total = res.pagination ? res.pagination.totalRow : 0;

        let records = []
        res.data.forEach(element => {
          if (element.records)
            records.push(...element.records.map(item => item.dateTime))
        });
        this.records = [...new Set(records)].sort()

      });
    },
    //医院列表
    async queryHospital() {
      await this.$R
        .queryDict({
          type: ['hospital','model']
        })
        .then((res) => {
          this.hospitalList = res.hospital;
          if (res.hospital && res.hospital.length)
            this.search.hospital = res.hospital[0].code
          this.modelList = res.model;
          if (res.model && res.model.length)
            this.search.model = res.model[0].code
          this.getTableData();
        });
    },
    queryReport() {
      this.getTableData();
    },
    //获取月报图表数据
    getEchartData(row) {
      let data = {
        hospital: this.search.hospital,
        month: this.search.month,
        jobType: this.search.jobType,
        table: row.tableName
      }
      this.$R.reportMonthCharts(data).then((res) => {
        this.charts = res
        this.showEcharts(res)
      });
    },
    // 创建ETL质量评估图表
    showEcharts(res) {
      let dateTimes = res.map(item => item.dateTime).sort()
      let currentTotals = []
      let lastTotals = []
      dateTimes.forEach(element => {
        let chart = res.find(item => item.dateTime == element)
        if (chart) {
          currentTotals.push(chart.currentTotal || 0)
          lastTotals.push(chart.lastTotal || 0)
        }
      });
      let dom = document.getElementsByClassName('mychart')
      myChart = this.$echarts.init(dom[2]);
      let option = {
        backgroundColor: '#fff',
        title: {
          text: '上报数据波动率检测',
          textStyle: {
            align: 'left',
            color: '#666',
            fontSize: 14,
          },
          top: '0',
          left: 'left',
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
            textStyle: {
              color: "#fff"
            }

          },
        },
        grid: {
          top: '12%',
          left: '12%',
          right: '6%',
          bottom: '8%',
          // containLabel: true
        },
        xAxis: [{
          type: 'category',
          axisLine: {
            show: true
          },
          splitArea: {
            // show: true,
            color: '#666',
            lineStyle: {
              color: '#666'
            },
          },
          axisLabel: {
            color: '#666'
          },
          splitLine: {
            show: false
          },
          boundaryGap: false,
          data: dateTimes,

        }],

        yAxis: [{
          type: 'value',
          min: 0,
          // max: 70000,
          splitNumber: 5,
          splitLine: {
            show: true,
            lineStyle: {
              color: 'rgba(0,0,0,0.1)'
            }
          },
          axisLine: {
            show: true,
          },
          axisLabel: {
            show: true,
            margin: 10,
            textStyle: {
              color: '#666',

            },
          },
          axisTick: {
            show: false,
          },
        }],
        series: [{
          name: '目标值',
          type: 'line',
          smooth: true,
          symbolSize: 0,
          itemStyle: {
            color: "red",
          },
          tooltip: {
            show: true
          },
          data: lastTotals
        },
        {
          name: '波动率',
          type: 'line',
          smooth: true,
          showAllSymbol: true,
          symbol: 'circle',
          symbolSize: 10,
          lineStyle: {
            normal: {
              color: "#1890FF",

            },
          },
          itemStyle: {
            color: "#1890FF",

          },
          tooltip: {
            show: true
          },
          areaStyle: {
            normal: {
              color: '#A3D3FF'
            }
          },
          data: currentTotals
        },
        ]
      };

      myChart.setOption(option);
    },
    getTotal(records, dateTime) {
      let record = records && records.find(jtem => jtem.dateTime == dateTime)
      return record ? record.total : "0"
    }
  },
};
</script>

<style lang="scss" scoped>
.page-content {
  background: #fff;
  color: #555;
  padding: 10px 10px 30px;

  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    width: 8px;
  }
}

.page-header {
  .el-form-item {
    margin-bottom: 10px;
  }
}

.echart-a {
  font-size: 16px;
  cursor: pointer;
}

.mychart {
  width: 100%;
  height: 400px;
}
</style>
