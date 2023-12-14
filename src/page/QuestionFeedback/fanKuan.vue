<!--
 * @Author: your name
 * @Date: 2021-03-01 16:42:22
 * @LastEditTime: 2021-03-12 15:06:48
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \clibrain-data-quality-v2.5\src\page\QuestionFeedback\fanKuan.vue
-->
<template>
  <div>
    <el-form ref="ruleForm" label-width="100px">
      <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
          <span>处理反馈</span>
        </div>
        <div class="qa-body">

          <div class="box mb18">
            <div class="box-body">
              <el-input type="textarea" :rows="6" placeholder="请输入内容" v-model="ROWDATA&&ROWDATA.processDesc">
              </el-input>
            </div>
          </div>

          <el-upload ref="upload" :key="ROWDATA&&ROWDATA.id" :file-list="fileList" :action="action" multiple list-type="picture-card" :on-preview="handlePictureCardPreview"
            :on-success="handleSuccess" :on-remove="handleRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>

          <div>{{processDesc}}</div>

        </div>
      </el-card>

      <div class="btn-box mar-t-10">
        <el-button type="primary" icon="el-icon-upload2" size="mini" @click="saveChuLiFanKui">提交</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import bus from '@/components/common/bus';

export default {
  data() {
    return {
      action: location.origin + "/clinbrain/api/upload/issue/file/upload",
      dialogImageUrl: '',
      dialogVisible: false,
      fileList: [],
      images: [],
      processDesc: "",
      imgHost: location.origin + "/upload/image/",
      ROWDATA: null,
    };
  },
  computed: {
    // ROWDATA: function () {
    //   let ROWDATA = this.$store.state.wentifankui.ROWDATA
    //   let fileList = []
    //   if (ROWDATA && ROWDATA.images)
    //     fileList = ROWDATA.images.map(element => element = { url: this.imgHost + element });
    //   this.fileList = fileList
    //   this.images = fileList
    //   return ROWDATA;
    // },
  },
  mounted() {

    //此处不用计算属性原因：保存时更新ROWDATA.images会重新计算改变fileList，造成闪烁
    bus.$off('fankui');
    bus.$on('fankui', (data) => {
      this.ROWDATA = data
      let fileList = []
      if (data && data.images)
        fileList = data.images.map(element => element = { url: this.imgHost + element });
      this.fileList = fileList
      this.images = fileList
    });
  },
  methods: {
    handleRemove(file, fileList) {
      this.images = fileList
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleSuccess(res, file, fileList) {
      this.images = fileList
    },
    saveChuLiFanKui() {
      if (!this.ROWDATA.processDesc) {
        this.msgWarning('请输入内容');
        return false;
      }
      let images = this.images.map(item => item.response && item.response.data || item.url.replace(this.imgHost, ""))
      if (images.length == 0) {
        this.msgWarning('请先上传图片');
        return false;
      }
      //更新ROWDATA中images
      this.ROWDATA.images = images

      let data = {
        id: this.ROWDATA.id,
        processDesc: this.ROWDATA.processDesc,
        images: images,
        processMethod: 0,
        stage: 0
      }
      this.$R.saveIssue(data).then((res) => {
        this.msgSuccess('保存成功');
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.btn-box {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 60px;
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
.box-body {
  flex-grow: 1;
}
</style>
