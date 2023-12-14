<template>
  <div class="page-content">
    <header class="page-header">
      <el-form :inline="true" :model="search" class="demo-form-inline" label-width="90px">
        <el-form-item>
          <span>上报类型：</span>
          <el-select filterable size="mini" v-model="model" placeholder="选择上报类型" @change="changeModel">
            <el-option v-for="item in modelList" :key="item.code" :label="item.value" :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <span>时间类型：</span>
          <el-select v-model="search.jobType" placeholder="请选择" size="mini" @change="queryReport">
            <el-option label="业务时间" value="1"></el-option>
            <el-option label="上报时间" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <span>日期：</span>
          <el-date-picker v-model="search.day" size="mini" type="date" value-format="yyyy-MM-dd" placeholder="请选择日期" @change="queryReport">
          </el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button @click="queryReport" type="primary" class="chaxunshuju" icon="el-icon-search" size="mini">
            查询
          </el-button>

          <!-- <el-button type="primary" size="mini" icon="el-icon-upload2" @click="daoChuTableData">
            导出
          </el-button> -->
        </el-form-item>
      </el-form>
    </header>

    <div class="mar-b-10">
      <el-button :type="search.categoryId === item.id ? 'primary' : ''" v-for="(item, index) in categoryList" :key="index" @click="changeBusiness(item)">
        {{ item.name }}
      </el-button>
    </div>
    <div>
      <el-table :data="dayTableData" border style="width: 100%">
        <el-table-column type="index" width="50" label="序号" fixed="left"> </el-table-column>
        <el-table-column prop="value" width="150" label="机构名称" fixed="left"></el-table-column>
        <el-table-column v-for="item in records" :key="item.tableName" :label="item.tableComment" v-if="records.length>0">
          <template slot-scope="scope">
            {{scope.row.records.find(jtem=>jtem.tableName==item.tableName).total}}
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
import { formatDate } from './js/format.js';
export default {
  name: 'dailyReport',
  data() {
    return {
      model: "",
      search: {
        categoryId: "",
        jobType: "1",
        day: formatDate(new Date(new Date().getTime() - 24 * 60 * 60 * 1000), 'yyyy-MM-dd')
      },
      total: 0,
      current: 1,
      pageSize: 10,
      dayTableData: [],
      records: [],
      categoryList: [],
      modelList: []
    };
  },
  created() {
    this.getDictList();
  },
  methods: {
    getDictList() {
      this.$R
        .queryDict({
          type: ['model']
        })
        .then((res) => {
          this.modelList = res.model;
          if (res.model && res.model.length) {
            this.model = res.model[0].code
            this.getBusinessTypeAll()
          }
        });
    },
    changeModel() {
      this.search.categoryId = ""
      this.getBusinessTypeAll();
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
      // var that = this;
      // axios({
      //   method: 'post',
      //   url: `/clinbrain/api/compare/analysis/export?businessTime=${this.riQiVal}&model=${this.db}&hospital=${this.hospital}&tb=${this.shuJuBiaoVal}&type=${this.leiXingVal}`,
      //   data: {},
      //   responseType: 'blob' // 加上这个是重点
      // }).then((res) => {
      //   downloadFile(res);
      // });

      // function downloadFile(res) {
      //   try {
      //     let url = window.URL.createObjectURL(new Blob([res.data]));
      //     let link = document.createElement('a');
      //     let fileName = decodeURIComponent(
      //       res.headers['content-disposition'].split('filename=')[1]
      //     );
      //     link.style.display = 'none';
      //     link.href = url;
      //     link.setAttribute('download', fileName);
      //     document.body.appendChild(link);
      //     link.click();
      //     URL.revokeObjectURL(link.href);
      //     document.body.removeChild(link);
      //     that.msgSuccess('导出成功');
      //   } catch (error) {
      //     alert('导出失败');
      //     console.log(error);
      //   }
      // }
    },
    getTableData() {
      let data = {
        size: this.pageSize,
        page: this.current,
        model: this.model,
        categoryId: this.search.categoryId,
        day: this.search.day,
        jobType: this.search.jobType,
      }
      let that = this;
      this.$R.reportDay(data).then((res) => {
        that.dayTableData = res.data;
        if (res.data && res.data.length > 0 && res.data[0].records && res.data[0].records.length > 0)
          that.records = res.data[0].records
        else
          that.records = []
        that.total = res.pagination ? res.pagination.totalRow : 0;
      });
    },
    //业务列表
    async getBusinessTypeAll() {
      let data = {
        model: this.model
      }
      await this.$R.getBusinessTypeAll(data).then((res) => {
        this.categoryList = res;
        if (res && res.length)
          this.search.categoryId = res[0].id
        this.getTableData();
      });
    },
    queryReport() {
      this.getTableData();
    },
    changeBusiness(item) {
      this.search.categoryId = item.id;
      this.getTableData();
    }
  }
};
</script>

<style lang="scss" scoped>
.page-content {
  background: #fff;
  color: #555;
  padding: 10px 10px 30px;
}

.page-header {
  .el-form-item {
    margin-bottom: 10px;
  }
}
</style>
