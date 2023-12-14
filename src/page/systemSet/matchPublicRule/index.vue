<template>
  <div class="matchPublicRule">
    <matchLeft />
    <matchRight />
  </div>
</template>

<script>
import matchLeft from './components/left.vue'
import matchRight from './components/right.vue'
export default {
  components: {
    matchLeft,
    matchRight
  },

  data () {
    return {

    }
  }
}
</script>

<style lang="scss">
.matchPublicRule {
  width: 100%;
  height: 100%;
  background-color: #424a6c;
  display: flex;
  overflow: hidden;
}
</style>