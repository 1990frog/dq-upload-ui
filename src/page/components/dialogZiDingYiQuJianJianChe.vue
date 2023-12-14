script<!--
 * @Author: your name
 * @Date: 2021-01-20 15:57:41
 * @LastEditTime: 2021-01-22 13:47:25
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \clibrain-data-quality-v2.5\src\page\components\dialogZiDingYiQuJianJianChe.vue
-->
<template>
  <div>
    <div class="header mar-b-10 mar-t-10">
      <div class="left-btns">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-select
              v-model="jiGouVal"
              placeholder="机构"
              @change="getTableData"
            >
              <el-option
                v-for="item in jiGouList"
                :key="item.id"
                :label="item.value"
                :value="item.code"
              >
              </el-option> </el-select
          ></el-col>
          <el-col :span="12">
            <el-select
              v-model="ShuJuYuanVal"
              placeholder="数据源"
              class="select-full"
              @change="getTableData"
            >
              <el-option
                v-for="item in shuJuYuanList"
                :key="item.id"
                :label="item.value"
                :value="item.code"
              >
              </el-option> </el-select
          ></el-col>
        </el-row>
      </div>

      <div class="right-btns">
        <el-date-picker
          value-format="yyyy-MM-dd"
          v-model="daterange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </div>
    </div>
    <el-row class="mar-b-10">
      <el-col :span="12"
        ><el-select
          v-model="guiZeVal"
          multiple
          placeholder="请选择规则检测"
          class="select-full"
        >
          <el-option
            v-for="item in guiZeJianCheList"
            :key="item.id"
            :label="item.value"
            :value="item.code"
          >
          </el-option> </el-select
      ></el-col>
    </el-row>
    <div class="body mar-b-10">
      <el-table
        :data="tableData"
        border
        stripe
        style="width: 100%"
        height="300"
      >
        <el-table-column label="执行" width="50">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.isEnable"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column type="index" label="序" width="50"> </el-table-column>
        <el-table-column prop="table" label="目标表"> </el-table-column>
        <el-table-column prop="model" label="所属源"> </el-table-column>
        <el-table-column prop="hospital" label="机构名称"> </el-table-column>
        <el-table-column prop="rowCount" label="记录数"> </el-table-column>
      </el-table>
    </div>

    <div class="k-footer">
      <el-pagination
        class="fenye-box"
        background
        :pager-count="7"
        :page-size="100"
        layout="total, prev, pager, next, jumper "
        :total="tableDataTotal"
        @current-change="changePage"
      >
      </el-pagination>

      <div class="btn-box mar-t-20 pad-b-20">
        <el-button type="primary" plain @click="closeDialog">取消</el-button>

        <el-button type="primary" @click="zhiXing">执行</el-button>
      </div>
    </div>
  </div>
</template>

<script>
var tableDataAll = [], // 保存选择的全部数据
  oldPageNum = 1; // 保存旧的页面数，用来更新tableDataAll中的数据

export default {
  name: "ZhiDingYiQuJianJianCeDialog",

  data() {
    return {
      daterange: null,
      guiZeVal: null,
      ShuJuYuanVal: null,
      jiGouVal: null,
      tableDataTotal: 0,
      jiGouList: [],
      shuJuYuanList: [],
      guiZeJianCheList: [],
      tableData: [],
    };
  },

  methods: {
    getTableData() {
      this.ziDingYiQuJianJianCeApi();
    },

    changePage(val) {
      // 切换分页更新全部数据的状态，并返回分页的100条数据
      this.tableData = tableDataMethods.updateTableDataAll(val, this.tableData);
    },

    // bnt-执行-
    zhiXing() {
      // 更新当前页的数据到大的对象中
      tableDataMethods.updateTableDataAll(oldPageNum, this.tableData);

      // 获取全部选择的table的表名，执行使用
      var tableDataAllNameList = [];
      tableDataAll.forEach((item) => {
        if (item.isEnable) {
          tableDataAllNameList.push(item.table);
        }
      });

      // 执行操作
      try {
        this.zhiXingQuJian({
          endTime: this.daterange[1],
          hospital: this.jiGouVal,
          model: this.ShuJuYuanVal,
          rules: this.guiZeVal,
          startTime: this.daterange[0],
          tables: tableDataAllNameList,
        });
      } catch (error) {
        this.msgBox("请选择执行区间和规则。");
        console.log('请选择规则检测和时间区间 :>> ', error);
      }
    },

    // 请求机构数据
    getJIGou() {
      this.$R
        .getJiGou({
          keyword: "",
          type: "hospital",
        })
        .then((data) => {
          try {
            this.jiGouList = data;

            this.jiGouVal = data[0].code; // 设置默认的值
          } catch (error) {
            this.msgBox("请求机构数据错误", error);
          }
        });
    },

    getShuJuYuan() {
      this.$R
        .queryDict({
          type: ["hospital", "model", "rule"],
        })
        .then((data) => {
          // 设置下拉数据
          this.jiGouList = data.hospital;
          this.shuJuYuanList = data.model;
          this.guiZeJianCheList = data.rule;

          // 设置初始值
          this.jiGouVal = data.hospital[0].code;
          this.ShuJuYuanVal = data.model[0].code;
          this.guiZeVal = [];

          // 请求table数据
          this.ziDingYiQuJianJianCeApi();
        });
    },

    ziDingYiQuJianJianCeApi() {
      let that = this;
      this.$R
        .ziDingYiQuJianJianCeApi({
          hospital: this.jiGouVal,
          model: this.ShuJuYuanVal,
        })
        .then((data) => {
          that.tableDataTotal = data.total;
          //   保留全部的数据，添加isEnable是否选中
          tableDataAll = data.list;

          tableDataAll.forEach((item) => {
            item.isEnable = true;
          });

          // 默认显示前100条
          that.tableData = tableDataAll.slice(0, 100);
        });
    },
    // 执行
    zhiXingQuJian(obj) {
      let that = this;
      this.$R.zhiXingQuJian(obj).then((data) => {
        that.msgSuccess("执行成功");
        this.$emit("zhi-xing", "111"); // 传值父组件，关闭
      });
    },

    closeDialog(){
      this.$emit("zhi-xing", "111");
    }
  },

  mounted() {
    this.getShuJuYuan();
  },

  watch: {},
};

// table数据的操作
var tableDataMethods = {
  /**
   * @description: 获取当前100条数据更新到全部数据的状态
   * @param {*} nums 页码
   * @param {*} tableData 当前100条数据
   * @return {*}
   */
  updateTableDataAll(nums, tableData) {
    tableDataAll.splice((oldPageNum - 1) * 100, 100, ...tableData);
    oldPageNum = nums;
    return tableDataAll.slice((nums - 1) * 100, nums * 100);
  },
};
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: space-between;
  .left-btns {
    width: 50%;
  }
}
::v-deep .el-input__inner {
  background: none;
  border: 1px solid #e4e7ea;
}
.k-footer {
  display: flex;
  flex-direction: column;
  .btn-box,
  .fenye-box {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
