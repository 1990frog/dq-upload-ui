<template>
  <div class="matchLeft">
    <div class="top">
      <div class="title">公版规则库</div>
      <div class="matchSearch">
        <el-input
          placeholder="请输入规则库名称"
          type="mini"
          v-model="ruleName"
          class="searchClass"
        >
          <el-button slot="append" icon="el-icon-search" @click="onSearch"></el-button>
        </el-input>
      </div>
    </div>

    <!-- 列表 -->
    <div class="ruleList">
      <div
        v-for="(item, index) in ruleList"
        :key="index" class="ruleItem"
        :class="{ruleActive: isActive === index}"
        @click="handleItemClick(index)"
      >
        {{item.label}}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      isActive: '',
      ruleList: [
        {
          label: 'dbo.CDR',
          value: 'dbo.CDR'
        },
        {
          label: 'dbo.OID_Category',
          value: 'dbo.OID_Category'
        },
        {
          label: 'dbo.Term',
          value: 'dbo.Term'
        },
        {
          label: 'dbo.TermRequest',
          value: 'dbo.TermRequest'
        },
        {
          label: 'dbo.test',
          value: 'dbo.test'
        },
        {
          label: 'dbo.值域',
          value: 'dbo.值域'
        }
      ],
      ruleName: ''
    }
  },

  methods: {
    handleItemClick (index) {
      this.isActive = index
    },

    onSearch () {

    }
  }
}
</script>

<style lang="scss">
.matchLeft {
  width: 300px;
  height: 100%;
  padding-top: 5px;
  overflow-y: auto;
  .top {
    padding-left: 10px;
    color: #fff;
    height: 28px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .matchSearch {
      margin-right: 10px;
      .searchClass {
        .el-input__inner {
          width: 130px;
          height: 24px;
          &::placeholder {
            font-size: 12px;
          }
        }
      }
    }
  }
  .title::before {
    content: '';
    width: 10px;
    height: 10px;
    display: inline-block;
    background: #21aced;
    border-radius: 100%;
    margin-right: 5px;
  }
  .ruleList {
    width: 100%;
  }
  .ruleItem {
    cursor: pointer;
    padding-left: 30px;
    color: #fff;
    height: 28px;
    line-height: 28px;
  }
  .ruleActive {
    background: #4d5679;
  }
}
</style>