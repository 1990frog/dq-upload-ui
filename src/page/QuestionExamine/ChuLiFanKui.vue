<!--
 * @Author: your name
 * @Date: 2021-03-01 16:42:22
 * @LastEditTime: 2021-03-09 17:44:49
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \clibrain-data-quality-v2.5\src\page\QuestionFeedback\fanKuan.vue
-->
<template>
  <div>
    <el-form ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
          <span>处理反馈</span>
        </div>
        <div class="qa-body">

          <div class="wentizuobiao-box box">
            <el-form-item label="问题坐标：" prop="stage">
              <ul v-if="TYPELISTALL">
                <el-radio-group v-model="ROWDATA.stage">
                  <li class="mar-r-20" v-for="(item, index) in TYPELISTALL.issue_stage" :key="index">
                    <div class="xian"></div>
                    <div class="item">
                      <el-radio :label="item.code">{{ item.value }}</el-radio>
                    </div>
                  </li>
                </el-radio-group>
              </ul>
            </el-form-item>
          </div>

          <div class="box">
            <el-form-item label="处理方法：" prop="processMethod">
              <div class="box-body" v-if="TYPELISTALL">
                <el-select size="mini" v-model="ROWDATA.processMethod" placeholder="请选择处理方法">
                  <el-option v-for="(item, index) in TYPELISTALL.process_method" :label="item.value" :value="item.code" :key="index">
                  </el-option>
                </el-select>
              </div>
            </el-form-item>
          </div>

          <div class="box mb18">
            <div class="title">备注：</div>
            <div class="box-body">
              <el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="ROWDATA.processDesc">
              </el-input>
            </div>
          </div>

          <div class="box" v-if="ROWDATA.img">
            <div class="title">图片：</div>
            <div class="box-body">
              <div>
                <viewer :image='imgHost+"/compare/image/"+ROWDATA.img'>
                  <img :src='imgHost+"/compare/image/"+ROWDATA.img' class="thumb" alt="not found" />
                </viewer>
              </div>
            </div>
          </div>

        </div>
      </el-card>
      <div class="btn-box mar-t-10 mar-b-20">
        <el-button type="primary" size="mini" @click="handleClose">确认</el-button>
      </div>

    </el-form>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { locat } from 'xe-utils';
export default {
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      chuLIFanFaVal: '',
      beiZhuVal: '',
      imgHost: location.origin
    };
  },
  computed: {
    ...mapState({
      TYPELISTALL: (state) => state.wentifankui.TYPELISTALL,
      ROWDATA: (state) => state.fankuishenghe.FANKUIROWDATA
    }),
  },
  methods: {
    handleClose() {
      this.$store.commit('SET_SHOWJILU', false);
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.btn-box {
  display: flex;
  justify-content: flex-end;
}
.box {
  display: flex;
  line-height: 30px;
  .title {
    width: 100px;
  }
}

.mb18 {
  margin-bottom: 18px;
}

.wentizuobiao-ul {
  display: flex;
  width: 100%;
  justify-content: space-between;
  li {
    display: flex;
    align-items: center;
  }
  li:nth-last-child() {
    font-size: 22px;
    &::after {
      content: '111';
      width: 20px;
      height: 1px;
      background: #fff;
    }
  }
}

.el-radio-group li {
  display: inline-block;
}
.box-body {
  flex-grow: 1;
}
.thumb {
  width: 100px;
}
</style>
