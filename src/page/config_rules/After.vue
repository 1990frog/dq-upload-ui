<!-- 事后规则配置页面 -->
<template>
  <div class="page">
    <!-- 功能菜单区：搜索和新增按钮 -->
    <div class="nav">
      <div class="left">
        <div class="in-left">
          <el-input v-model="keyword" placeholder="请输入内容" class="k-input" size="mini"></el-input>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="getRuleList({ keyword: keyword })">搜索
          </el-button>
        </div>
        <!-- 选择医院 -->
        <div class="hospitalWarp">
          <el-select v-model="hospital" placeholder="请选择医院" size="mini" @change="getRuleList">
            <el-option v-for="item in hospitalList" :key="item.value" :label="item.value" :value="item.code"></el-option>
          </el-select>
        </div>
      </div>
      <div class="right">
        <el-button type="primary" icon="el-icon-message-solid" size="mini" @click="gaoJingDingYue">告警订阅
        </el-button>
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="addRule">新增
        </el-button>
      </div>
    </div>

    <!-- 表单数据 -->
    <div class="main-data">
      <div class="table-border--boxshow">
        <el-table :data="ruleList" @cell-mouse-enter="mouseenterTd" @cell-mouse-leave="mouseleaveTd">
          <el-table-column type="index" label="序" width="60"></el-table-column>
          <el-table-column prop="rule" label="规则名称" width="120"></el-table-column>
          <el-table-column prop="desc" label="备注" show-overflow-tooltip></el-table-column>
          <el-table-column prop="hospital" label="机构" show-overflow-tooltip></el-table-column>
          <!--                    <el-table-column prop="" label="自定义检测区间" width="240">-->
          <!--                        <template slot-scope="scope">-->
          <!--                            <span>{{ scope.row.fullStartTime | formatDate }}至{{ scope.row.fullEndTime | formatDate }}</span>-->
          <!--                        </template>-->
          <!--                    </el-table-column>-->

          <!--                    <el-table-column prop="" label="增量检测区间" width="180">-->
          <!--                        <template slot-scope="scope">-->
          <!--                            &lt;!&ndash; 1、status验证状态；2、hoverIncrementid验证当时鼠标滑到的行；3、非空、行数不可修改。 &ndash;&gt;-->
          <!--                            <div class="increment-warp" v-if="!scope.row.status && scope.row.id === hoverIncrementid ">-->
          <!--                                &lt;!&ndash; -->
          <!--                                <el-input-->
          <!--                                    size="mini"-->
          <!--                                    min="1"-->
          <!--                                    max="360"-->
          <!--                                    class="increment-section"-->
          <!--                                    type="number"-->
          <!--                                    v-model="scope.row.$index"-->
          <!--                                    -->
          <!--                                ></el-input> &ndash;&gt;-->
          <!--                                <el-input-number class="kyle-input-number" size="mini" v-model="scope.row.dateRange"-->
          <!--                                                 controls-position="right" :min="1" :max="10"></el-input-number>-->
          <!--                            </div>-->
          <!--                            <span v-else> 执行前 {{ scope.row.dateRange ? scope.row.dateRange : '&#45;&#45;' }} 天</span>-->
          <!--                        </template>-->
          <!--                    </el-table-column>-->
          <!--                    <el-table-column prop="principal" label="责任人" width="90"></el-table-column>-->
          <!--                    <el-table-column :formatter="formatDate" prop="createTime" label="创建时间"-->
          <!--                                     width="160"></el-table-column>-->
          <el-table-column prop="createTime" label="创建时间" width="160" />
          <el-table-column label="操作" width="100" fixed="right">
            <template slot-scope="scope">
              <!-- 编辑当前规则 -->
              <el-button size="mini" type="primary" icon="icon iconfont iconbianji" @click="modifyRule(scope.row.type, scope.row.id)"></el-button>
              <!--                            <el-button-->
              <!--                                size="mini"-->
              <!--                                type="danger"-->
              <!--                                icon="icon iconfont iconshanchu"-->
              <!--                                @click="handleDelete(scope.$index, scope.row)"-->
              <!--                            ></el-button>-->

              <!-- 发送提醒消息 -->
              <!-- <el-button
                                    size="mini"
                                    type="info"
                                    icon="icon iconfont iconxinxi"
                                    @click="dialogVisible = true"
                            ></el-button> -->
            </template>
          </el-table-column>

          <el-table-column prop="principal" label="状态" width="80" fixed="right">
            <template slot-scope="scope">
              <el-switch v-model="ruleList[scope.$index].status" active-color="#13ce66" inactive-color="#ff4949" :active-value="1" :inactive-value="0"
                @change="modifyStatus(ruleList[scope.$index].id, $event)"></el-switch>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 分页 -->
    <div class="data-fenye">
      <el-pagination hide-on-single-page @size-change="handleSizeChange" @current-change="handleCurrentChange" background :current-page.sync="pageNum" :page-size.sync="pageSize"
        layout="prev, pager, next, jumper" :total="total"></el-pagination>
    </div>

    <!-- =旧=告警设置 弹窗-->
    <div class="gaojing">
      <el-dialog title="核查告警" :visible.sync="dialogVisible" width="540px" custom-class="k-dialog">
        <div class="k-top">
          <div class="k-title">
            数据源：
            <span class="k-txt">DC数据源</span>
          </div>
          <div class="k-title">
            库表:
            <span class="k-txt">Zy_Sfdmk</span>
          </div>
          <div class="k-title">
            规则：
            <span class="k-txt">源目检测</span>
          </div>
        </div>

        <!-- 读取 -->
        <el-form :model="xinzengform" :inline="true">
          <el-form-item label="通知责任人" :label-width="formLabelWidth">
            <el-select v-model="xinzengform.shujuyuan" placeholder="责任人">
              <el-option label="张三" value="shanghai"></el-option>
              <el-option label="李四" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label :label-width="formLabelWidth">
            <el-input v-model="tel_email" placeholder="手机/邮件"></el-input>
          </el-form-item>
          <el-form-item label :label-width="formLabelWidth">
            <el-select v-model="xinzengform.chufs" placeholder="触发方式">
              <el-option label="短信" value="shanghai"></el-option>
              <el-option label="邮箱" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-button type="danger" icon="el-icon-delete"></el-button>
        </el-form>

        <!-- 写入 -->
        <el-form :model="xinzengform" :inline="true">
          <el-form-item label="通知责任人" :label-width="formLabelWidth">
            <el-select v-model="xinzengform.shujuyuan" placeholder="责任人">
              <el-option label="张三" value="shanghai"></el-option>
              <el-option label="李四" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label :label-width="formLabelWidth">
            <el-input v-model="tel_email" placeholder="手机/邮件"></el-input>
          </el-form-item>
          <el-form-item label :label-width="formLabelWidth">
            <el-select v-model="xinzengform.chufs" placeholder="触发方式">
              <el-option label="短信" value="shanghai"></el-option>
              <el-option label="邮箱" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-button type="primary" icon="el-icon-plus"></el-button>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary">确 定</el-button>
        </span>
      </el-dialog>
    </div>

    <!-- 新的-告警订阅 -->
    <el-dialog title="告警设置" :visible.sync="gaoJingDingYueDialog" width="840px" :before-close="closeGaoJing">
      <div class="gaojingshezhi-body" @click="hideGaoJingFaZhi">
        <div class="xh-header">
          <div class="left ">
            <span class="mar-r-20">数据源：{{model}}</span>
            <span>库表：{{table}}</span>
          </div>
          <div class="right">责任人：
            <el-select v-model="gaoJingZeRenRen" style="width:150px" placeholder="请选择责任人" size="mini" class="mar-r-20">
              <!-- <el-option label="李明" value="李明">
              </el-option>
              <el-option label="王红" value="王红">
              </el-option> -->
              <el-option
                v-for="item in zeRenRenList"
                :key="item.userId"
                :label="item.userName"
                :value="item.userId"
              >
              </el-option>
            </el-select>

            告警方式：
            <el-checkbox-group v-model="gaoJingFanShi">
              <el-checkbox label="短信"></el-checkbox>
              <el-checkbox label="邮件"></el-checkbox>
              <el-checkbox label="OA"></el-checkbox>
            </el-checkbox-group>
          </div>
        </div>

        <div class="gaojing-table mar-t-20 ">
          <el-table ref="gaojingtable" @cell-click='setGaoJingFaZhi' size='mini' :data="gaoJingTableData" border style="width: 100%">
            <el-table-column type="index" label="序号" width="90">
            </el-table-column>
            <el-table-column type="selection" label="" width="50">
            </el-table-column>
            <el-table-column prop="name" label="规则">
            </el-table-column>
            <el-table-column prop="address" label="告警阀值">

              <template slot-scope="scope">
                <span>{{ scope.row.fazhi[0] }} -- {{ scope.row.fazhi[1]  }}</span>
                <div class="block" v-show="gaoJingIndex === scope.$index">
                  <el-slider v-model="scope.row.fazhi" range show-stops :max="100">
                  </el-slider>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="address" label="级别">
              <template slot-scope="scope">
                <el-select v-model="scope.row.jibie" placeholder="请选择级别" size="mini">
                  <el-option label="告警" value="告警">
                  </el-option>
                  <el-option label="熔断" value="熔断">
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="gaoJingDingYueDialog = false">取 消</el-button>
        <el-button type="primary" @click="gaoJingDingYueDialog = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 弹窗配置规则 -->
    <div class="PeiZhiGuiZeWarp animate__animated" :class="showGuiZeBox.anims" v-show="showGuiZeBox.show">
      <div class="header">
        <div class="title">新增配置规则</div>
        <!--                <div class="title">新增配置规则({{model}}-{{table}})</div>-->
        <div class="close el-icon-close" @click="closePeiZi"></div>
      </div>

      <!-- 弹窗的配置规则视图，点击新增渲染 -->
      <div v-if="showConfigurationRules">
        <router-view></router-view>
      </div>
    </div>

    <div class="PeiZhiGuiZeWarpBg animate__animated" :class="showGuiZeBox.bganims" @click="closePeiZi" v-show="showGuiZeBox.show"></div>
  </div>
</template>
<script>
import { formatDate } from '../js/format.js';
import bus from '@/components/common/bus';

let isIncrementDayVal; // 保存滑入td之前的val值，滑离td时比较值是否修改，进行弹窗保存。
export default {
  // 注册组件
  components: {},
  data() {
    return {
      gaoJingZeRenRen: '',
      gaoJingDingYueDialog: false,
      gaoJingFanShi: [],
      gaoJingIndex: null,

      gaoJingTableData: [
        // { name: '源目检测', fazhi: [0, 10], jibie: '', id: 0 },
        { name: '非空检测', fazhi: [0, 10], jibie: '', id: 0 },
        { name: '绝对值检测', fazhi: [0, 10], jibie: '', id: 1 },
        { name: '枚举值检测', fazhi: [0, 10], jibie: '', id: 2 },
        { name: '波动率检测', fazhi: [0, 10], jibie: '', id: 3 },
      ],
      // 医联体下拉默认选中的值
      hospital: '',
      // 医联体码表
      hospitalList: [],
      // 表对应的规则列表
      ruleList: [],
      // 默认选中的规则
      rule: '',
      // 当前的库
      model: '',
      // 当前表
      table: '',
      // 查询关键字
      keyword: '',
      // 当前页码
      pageNum: 1,
      // 每页显示的条数
      pageSize: 20,
      // 数据量
      total: 0,

      hoverIncrementid: '',

      showConfigurationRules: false,
      TotalDetectionDate: '',
      // 告警设置--弹窗
      showGuiZeBox: {
        show: false,
        anims: 'animate__bounceInRight',
        bganims: 'animate__fadeIn'
      },
      dialogVisible: false,
      formLabelWidth: '90px',
      xinzengform: {
        name: '',
        chufs: ''
      },

      tel_email: '',
      zeRenRenList: []
    };
  },
  async created() {
    // 设置默认值
    this.model = this.$route.params.model;
    this.table = this.$route.params.table;
  },
  async mounted() {
    // 获取医联体码表
    await this.getHospitalDict();
    // 查询数据
    await this.getRuleList({
      model: this.model,
      table: this.table,
      hospital: this.hospital
    });

    //责任人列表
    this.getZeRenRen()
  },
  // 计算属性
  computed: {},

  // 侦听属性，点击 left menu 触发查询
  watch: {
    $route: function () {
      // 设置默认值
      this.model = this.$route.params.model;
      this.table = this.$route.params.table;
      // 查询
      this.getRuleList({
        model: this.model,
        table: this.table,
        hospital: this.hospital
      });
    }
  },
  // filters: {
  //     formatDate(value) {
  //         let date = new Date(value);
  //         return formatDate(date, 'yyyy-MM-dd');
  //     }
  // },
  methods: {
    setGaoJingFaZhi(row, column, cell, event) {

      var selectionIds = this.$refs.gaojingtable.selection.map(item => item.id)
      if (column.label === '告警阀值' && selectionIds.indexOf(row.id) > -1) {
        this.gaoJingIndex = row.id
      } else {
        this.gaoJingIndex = -1;
      }

    },
    hideGaoJingFaZhi(e) {
      // this.gaoJingIndex = -1; // 隐藏阀值
    },
    gaoJingDingYue() {
      this.gaoJingDingYueDialog = true;
    },
    closeGaoJing() {
      this.gaoJingDingYueDialog = false;
    },
    // /**
    //  * 格式化时间，毫秒数转换为日期格式
    //  */
    // formatDate(row, column, cellValue, index) {
    //     let data = new Date(cellValue);
    //     return formatDate(data, 'yyyy-MM-dd hh:mm:ss');
    // },

    /**
     * 医院码表
     */
    async getHospitalDict() {
      await this.$R
        .queryDict({
          type: ['hospital']
        })
        .then((res) => {
          this.hospitalList = res.hospital;
          res.hospital.forEach((n) => {
            // 设置默认选项
            if (n.selected === 1) {
              this.hospital = n.code;
            }
          });
        });
    },

    /**
     * 查询配置规则列表
     */
    getRuleList(param) {
      this.$R
        .rulelist({
          keyword: param.keyword,
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          model: this.model,
          table: this.table,
          hospital: this.hospital
        })
        .then((res) => {
          this.ruleList = res.list;
          this.pageNum = res.pageNum;
          this.pageCount = res.pageCount;
          this.total = res.total;
        });
    },

    /**
     * 新增规则
     */
    addRule() {
      // 默认弹窗组件不加载，新增时加载组件
      this.showConfigurationRules = true;

      // 未选中table新增，提示选表
      if (this.table === '') {
        this.$message({
          message: '请选择表',
          type: 'success'
        });
        return;
      }

      // 显示弹窗、执行动画
      this.showGuiZeBox.show = true;
      this.showGuiZeBox.bganims = 'animate__fadeIn';
      this.showGuiZeBox.anims = 'animate__bounceInRight';

      this.$router.push({
        path: '/dialog/Dialog',
        query: {
          url: encodeURIComponent(this.$route.path),
          model: this.$route.params.model,
          table: this.$route.params.table,
          hospital: this.hospital,
          type: 'abs'
        }
      });
    },

    /**
     * 编辑规则
     * @param rule 规则类型
     * @param id 规则id
     */
    modifyRule(rule, id) {
      // 加载组件
      this.showConfigurationRules = true;
      this.showGuiZeBox.show = true;
      this.showGuiZeBox.bganims = 'animate__fadeIn';
      this.showGuiZeBox.anims = 'animate__bounceInRight';

      // 查询参数
      let param = {
        url: encodeURIComponent(this.$route.path),
        id: id,
        model: this.model,
        table: this.table,
        hospital: this.hospital,
        type: rule
      };

      this.$router.push({
        path: '/dialog/Dialog',
        query: param
      });
    },

    // 当单元格 hover 进入时会触发该事件
    mouseenterTd(row, column, cell, event) {
      // 鼠标滑入增量检测区间，改变id的值进行显示修改时间
      if (column.label === '增量检测区间' && !row.status) {
        this.hoverIncrementid = row.id;
        isIncrementDayVal = row.dateRange || 1;
      }
    },

    // 当单元格 hover 退出时会触发该事件
    mouseleaveTd(row, column, cell, event) {
      if (column.label === '增量检测区间' && !row.status) {
        this.hoverIncrementid = '-1';

        if (isIncrementDayVal !== row.dateRange) {
          // 如果只进行了修改，弹窗提示用户是否保存
          // 弹窗提示用户是否保存修改
          this.$confirm('是否提交增量检测区间的修改?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              this.saveIncrementDay(row);

              this.$message({
                type: 'success',
                message: '保存成功'
              });
            })
            .catch(() => {
              // 用户点击了取消，把之前的值赋值回来
              row.dateRange = isIncrementDayVal;
              // 用户点击了取消操作
              // this.$message({
              //     type: 'info',
              //     message: '已取消删除'
              // });
            });
        }
      }
    },

    // 保存配置规则里的增量检测区间
    async saveIncrementDay(row) {
      await this.$R.incrementdaterange({
        dateRange: row.dateRange,
        endTime: row.endTime,
        id: row.id,
        instance: that.$route.params.instance,
        rule: row.name,
        startTime: row.startTime,
        status: row.status,
        table: that.$route.params.table,
        type: that.$route.params.type
      });
    },

    // 验证路由是否显示配置规则弹窗
    isShowDialog() {
      let path = this.$route.path;
      // 如果是弹窗则显示弹窗-临时
      if (path.indexOf('dialog')) {
        this.showGuiZeBox.show = true;
      }
    },

    // table表：删除
    handleDelete(index, row) {
      // // // console.log(index, row);
    },
    // 分页：pageSize 改变时会触发
    handleSizeChange(val) {
      // // // console.log(`每页 ${val} 条`);
    },
    // 分页：currentPage 改变时会触发
    handleCurrentChange(val) {
      // 请求数据，传递页面：val
      this.getRuleList({
        type: this.$route.params.type,
        table: this.$route.params.table,
        num: val
      });
    },
    // 用户点击上一页按钮改变当前页后触发
    // handlePrevChange(val) {
    //     // // // console.log(`handlePrevChange: ${val}`);
    // },

    // 用户点击下一页按钮改变当前页后触发
    // handleNextChange(val) {
    //     // // // console.log(`handleNextChange: ${val}`);
    // },

    // 关闭配置规则
    closePeiZi() {
      // 关闭弹窗时，删除dom，下次重新创建请求数据
      setTimeout(() => {
        this.showConfigurationRules = false;
        this.showGuiZeBox.show = false;
      }, 350);

      this.showGuiZeBox.anims = 'animate__fadeOutRightBig';
      this.showGuiZeBox.bganims = 'animate__fadeOut';
      console.log(this.$route)
      if(this.$route.query.url!="%2F")
        this.$router.push({ path: decodeURIComponent(this.$route.query.url) });
      else
        this.$router.push({ name: 'after', params: {} });
      //刷新左侧任务树
      bus.$emit("searchTree");
    },

    // 判断是否显示配置规则弹窗
    showPeiZhiBox(params) {
      if (params !== '') {
        this.showGuiZeBox.show = false;
        // 显示配置规则
        this.showGuiZeBox.anims = 'animate__bounceInRight';
      }
    },

    // 更新规则状态：启用、停用
    async modifyStatus(id, status) {
      console.log(this.hospital);
      let res = await this.$R.modifyStatus({
        id: id,
        status: status,
        hospital: this.hospital
      });
      // if(!res){return};
      this.$message({
        message: '修改成功',
        type: 'success'
      });
    },

    // 请求责任人列表
    getZeRenRen() {
      let params = {
        page: 1,
        size: 999
      }
      this.$R.getUser(params).then((res) => {
        this.zeRenRenList = res.data;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.gaojingshezhi-body {
  .xh-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .right {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
}
.total-detection-date {
  width: 100%;
}

.header {
  width: 100%;
  height: 36px;
  display: flex;
  justify-content: space-between;
  background: $title_BG1;
  color: $title_font1;
  align-items: center;
  padding: 0 10px;
}

.PeiZhiGuiZeWarp {
  position: fixed;
  z-index: 1001;
  bottom: 0;
  right: 0;
  width: 75%;
  min-width: 1000px;
  height: calc(100vh - 50px);
  background: #fff;
  overflow: auto;
}

.PeiZhiGuiZeWarpBg {
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;
}

div {
  box-sizing: border-box;
}

.nav {
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 10px;

  .left {
    display: flex;

    .k-input {
      margin-right: 10px;
    }
  }

  .el-button--primary {
    background: #36c;
    border: none;
  }
}

.main-data {
  width: 100%;
  padding: 0 10px 10px 10px;

  ::v-deep .el-table--small td {
    padding: 0;
    height: 30px;
  }

  ::v-deep .el-table--small th {
    padding: 0;
    height: 40px;
  }

  // ::v-deep .el-table tbody tr:hover > td {
  //     background-color: #c5e3ff !important;
  // }
  .el-button + .el-button {
    margin-left: 0;
  }

  .el-button--mini,
  .el-button--mini.is-round {
    padding: 0 5px;
  }

  .el-button--primary {
    font-size: 16px;
    background: none;
    border: none;
    color: #1890ff;
  }

  .el-button--danger {
    font-size: 16px;
    background: none;
    border: none;
    color: #eb6363;
  }

  .el-button--info {
    font-size: 16px;
    background: none;
    border: none;
    color: #fc8f37;
  }
}

.data-fenye {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  padding-right: 10px;

  ::v-deep .el-pagination.is-background .el-pager li:not(.disabled).active {
    background-color: #36c;
  }

  ::v-deep .el-pagination.is-background .btn-next,
  ::v-deep .el-pagination.is-background .btn-prev,
  ::v-deep .el-pagination.is-background .el-pager li {
    border-radius: 0;
  }
}

.k-top {
  display: flex;
  height: 36px;
  line-height: 36px;
  font-size: 12px;
  color: #666;
  justify-content: space-between;

  .k-txt {
    color: #36c;
  }
}

.gaojing {
  ::v-deep .k-dialog .el-dialog__body {
    padding-top: 0;
  }

  ::v-deep .el-form-item--small .el-form-item__content,
  ::v-deep .el-form-item--small .el-form-item__label {
    width: 110px;
  }

  ::v-deep .el-form--inline .el-form-item {
    padding-right: 2px;
  }
}

.nav {
  ::v-deep .iconfont {
    padding-right: 0px !important;
    margin-right: 0px !important;
  }

  ::v-deep .iconbianji {
    color: #1890ff !important;
  }

  ::v-deep .iconshanchu {
    color: #eb6363 !important;
  }

  ::v-deep .iconxinxi {
    color: #fc8f37 !important;
  }
}

div.hospitalWarp {
  width: 200px;
  margin-left: 10px;
}

div.in-left {
  display: flex;
}

.increment-warp {
  display: flex;
}
</style>
