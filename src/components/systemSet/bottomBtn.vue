<template>
  <div slot="footer" class="dialogFooter" :class="placement">
    <el-button
      size="mini"
      v-for="item in btnList"
      :key="item.btnText"
      :type="item.type"
      @click="item.onClick"
    >
      {{item.btnText}}
    </el-button>
  </div>
</template>

<script>
export default {
  props: [
    'btnList','placement'
  ]
}
</script>

<style lang="scss">
.dialogFooter {
  height: 20px;
  margin-top: 30px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.right {
    justify-content: flex-end;
}
</style>