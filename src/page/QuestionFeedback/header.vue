<!--
 * @Author: your name
 * @Date: 2021-03-01 15:52:57
 * @LastEditTime: 2021-03-10 18:19:26
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \clibrain-data-quality-v2.5\src\page\QuestionFeedback\header.vue
-->

<template>
  <div>
    <el-form :inline="true" :model="SOUSHUOALL" class="demo-form-inline" label-width="90px">
      <el-form-item label="问题编号：">
        <el-input v-model="SOUSHUOALL.id" clearable placeholder="问题编号" size="mini"></el-input>
      </el-form-item>
      <el-form-item label="机构：">
        <el-select filterable size="mini" v-model="SOUSHUOALL.hospital" placeholder="选择机构">
          <el-option v-for="item in hospitalList" :key="item.code" :label="item.value" :value="item.code">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="上报类型：">
        <el-select filterable size="mini" v-model="SOUSHUOALL.model" placeholder="选择上报类型" @change="changeModel">
          <el-option v-for="item in modelList" :key="item.code" :label="item.value" :value="item.code">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="表名：">
        <el-select filterable clearable size="mini" v-model="SOUSHUOALL.table" placeholder="选择表">
          <el-option v-for="item in tableList" :key="item.table" :label="item.tableComment" :value="item.table">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="规则：">
        <el-select filterable clearable size="mini" v-model="SOUSHUOALL.rule" placeholder="选择规则">
          <el-option v-for="item in ruleList" :key="item.code" :label="item.value" :value="item.code">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="时间类型：">
        <el-select v-model="SOUSHUOALL.dateType" clearable placeholder="请选择" size="mini">
          <el-option label="业务时间" value="1"></el-option>
          <el-option label="上报时间" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="日期：">
        <el-date-picker key="date" ref="date" size="mini" style="width:193px" @focus="focus" v-model="SOUSHUOALL.businessTime" v-if="SOUSHUOALL.timeType=='day'" type="date"
          placeholder="选择日期" :picker-options="pickerOptions" value-format="yyyy-MM-dd">
        </el-date-picker>
        <el-date-picker key="month" ref="month" size="mini" style="width:193px" v-model="SOUSHUOALL.businessTime" v-if="SOUSHUOALL.timeType=='month'" type="month"
          placeholder="选择月份" :picker-options="pickerOptions" value-format="yyyy-MM">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="责任人：">
        <el-select filterable size="mini" v-model="SOUSHUOALL.user" placeholder="责任人" clearable>
          <el-option v-for="item in responsibleList" :key="item.userId" :label="item.userName" :value="item.userId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" icon="el-icon-search" @click="chaXun">
          查询
        </el-button>

        <el-button size="mini" type="warning" icon="el-icon-refresh-left" @click="chongZhi">
          重置
        </el-button>

        <el-button size="mini" type="primary" icon="el-icon-upload2" disabled>
          导出
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  data() {
    let that = this
    return {
      ruleList: [],
      modelList: [],
      tableList: [],
      responsibleList: [],
      hospitalList: [],
      pickerOptions: {
        shortcuts: [{
          text: '天',
          onClick(picker) {
            that.SOUSHUOALL.businessTime = ""
            that.SOUSHUOALL.timeType = "day"
            that.$refs.month&&that.$refs.month.handleClose();
            that.$nextTick(() => {
              that.$refs.date.focus();
              that.$nextTick(() => {
                let dom = document.getElementsByClassName('el-picker-panel__shortcut')
                dom[0] ? dom[0].style.color = "#409EFF" : ""
                dom[1] ? dom[1].style.color = "#606266" : ""
              })
            })
          }
        }, {
          text: '月',
          onClick(picker) {
            that.SOUSHUOALL.businessTime = ""
            that.SOUSHUOALL.timeType = "month"
            that.$refs.date&&that.$refs.date.handleClose();
            that.$nextTick(() => {
              that.$refs.month.focus();
              that.$nextTick(() => {
                let dom = document.getElementsByClassName('el-picker-panel__shortcut')
                dom[0] ? dom[0].style.color = "#606266" : ""
                dom[1] ? dom[1].style.color = "#409EFF" : ""
              })
            })
          }
        }]
      },
    };
  },

  computed: {
    SOUSHUOALL: {
      get() {
        return this.$store.state.wentifankui.SOUSHUOALL;
      },
      set(val) {
        this.$store.commit('SET_SOUSHUOALL', val);
      }
    }
  },
  mounted() {
    this.getDictList();
    this.getResponsibleList();
  },
  methods: {
    ...mapMutations([
      'SET_TYPELISTALL' //also supports payload `this.nameOfMutation(amount)`
    ]),
    focus() {
      this.$nextTick(() => {
        document.getElementsByClassName('el-picker-panel__shortcut')[0].style.color = "#409EFF"
      })
    },
    chaXun() {
      this.$emit('chaXun');
    },
    getDictList() {
      this.$R.queryDict({
        type: ['hospital', 'model', 'rule']
      }).then((res) => {
        this.ruleList = res.rule;
        this.modelList = res.model;
        this.hospitalList = res.hospital;
        if (res.hospital && res.hospital.length)
          this.SOUSHUOALL.hospital = res.hospital[0].code
        if (res.model && res.model.length) {
          this.SOUSHUOALL.model = res.model[0].code
          this.getTableList()
        }
        this.SET_TYPELISTALL(res);
        this.$emit('chaXun');
      });
    },
    getTableList() {
      let data = {
        model: this.SOUSHUOALL.model
      }
      this.$R.tables(data).then((res) => {
        this.tableList = res;
      });
    },
    changeModel() {
      this.SOUSHUOALL.table = ""
      this.getTableList()
    },
    getResponsibleList() {
      let params = {
        page: 1,
        size: 999
      }
      this.$R.getUser(params).then((res) => {
        this.responsibleList = res.data;
      });
    },
    chongZhi() {
      let timeType = this.SOUSHUOALL.timeType
      this.SOUSHUOALL = {
        id: '',
        hospital: this.hospitalList && this.hospitalList.length ? this.hospitalList[0].code : "",
        model: this.modelList && this.modelList.length ? this.modelList[0].code : "",
        table: '',
        rule: '',
        dateType: "",
        timeType: timeType,
        businessTime: "",
        user: ''
      };
    }
  }
};
</script>