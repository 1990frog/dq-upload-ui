<!--
 * @Author: your name
 * @Date: 2020-12-18 15:51:34
 * @LastEditTime: 2021-03-19 15:09:21
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \clin-ui\src\views\quality\LeftMenu.vue
-->
<template>
  <div class="quality-leftmenu">
    <h1 class="k-h1 xh-little-circle">选择报告</h1>

    <div class="search-warp mar-bottom-10">
      <el-input clearable placeholder="请输入内容" v-model="filterText" class="xh-dark-input xh-input-btn">
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
    </div>

    <div class="xh-tree report-tree">
      <el-tree :data="data" :props="defaultProps" highlight-current :default-expanded-keys="defaultExpandedKeys" ref="reportTree" node-key="table" :filter-node-method="filterNode"
        @node-click="handleNodeClick">
      </el-tree>
    </div>
  </div>
</template>

<script>
export default {
  name: 'qualityLeftMenu',
  data() {
    return {
      filterText: '',
      data: [],
      defaultExpandedKeys: [],
      defaultProps: {
        children: 'tables',
        label: 'label'
      }
    };
  },
  watch: {
    filterText(val) {
      this.$refs.reportTree.filter(val);
    },
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },

    handleNodeClick(data, node, self) {
      if (data.table && data.tableComment) {
        this.$emit('nodeClick', data);
        this.$router.push({ path: '/qualityOptimize', query: { model: data.model, table: data.table } });
      }
    },

    //获取左侧树菜单-父组件调用
    getReportMenu() {
      let that = this;
      this.$R.reportMenu().then((res) => {
        that.data = getEmTreeData(res);
        that.setCurrentMenu()
      });
    },

    //根据路由设置菜单高亮
    setCurrentMenu() {
      let that = this
      let res = this.data
      if (this.$route.query.model && this.$route.query.table) {
        //默认选中
        let model_index = -1;
        let category_index = -1;
        let table_index = -1;
        that.data.forEach((n, index1) => {
          if (this.$route.query.model === n.name) {
            model_index = index1;
          }
          if (model_index !== undefined) {
            n.tables.forEach((m, index2) => {
              m.tables.forEach((z, index3) => {
                if (z.table === this.$route.query.table) {
                  category_index = index2
                  table_index = index3;
                  return;
                }
              });
            });
          }
        });
        if (model_index < 0 || category_index < 0 || table_index < 0) {
          alert('质量报告导航没找到要高亮的菜单');
        } else {
          that.handleNodeClick({
            model: res[model_index].name,
            table: res[model_index].category[category_index].tables[table_index].table,
            tableComment: res[model_index].category[category_index].tables[table_index].tableComment
          });

          //高亮显示第一个
          that.$nextTick(() => {
            that.defaultExpandedKeys = [res[model_index].category[category_index].name + "_" + model_index + "_" + category_index]
            that.$refs.reportTree.setCurrentKey(res[model_index].category[category_index].tables[table_index].table);
          });
        }
      } else {
        let defaultData = {
          model: res[0].name,
          table: res[0]?.category[0]?.tables[0]?.table,
          tableComment: res[0]?.category[0]?.tables[0]?.tableComment
        }
        that.handleNodeClick(defaultData);

        //高亮显示第一个
        that.$nextTick(() => {
          that.defaultExpandedKeys = [res[0].category[0].name + "_0_0"]
          that.$refs.reportTree.setCurrentKey(defaultData.table);
        });
      }
    }
  },

  mounted() { }
};

// 请求的数据格式转换为element-ui 树需要的格式
function getEmTreeData(data) {
  data.forEach((item, index) => {
    item.tables = item.category
    item.table = item.name + "_" + index
    item.label = item.modelComment
    item.tables.forEach((jtem, jndex) => {
      jtem.table = jtem.name + "_" + index + "_" + jndex
      jtem.label = jtem.name
      jtem.tables.forEach(ztem => {
        ztem.name = ztem.tableComment
        ztem.label = ztem.tableComment
      });
    });
  });
  return data;
}
</script>

<style lang="scss" scoped>
.k-tree {
  padding: 0 10px;
}
.search-warp {
  padding: 0 10px;
}
.quality-leftmenu {
  width: 100%;
  height: 100%;
  background: #39436a;
}

.k-h1 {
  height: 34px;
  line-height: 34px;
  margin: 0;
  padding: 0;
  font-size: 12px;
  color: #fff;
}
.xh-tree {
  height: calc(100vh - 190px);
  overflow: auto;
}

::v-deep {
  .el-tree {
    overflow: auto;
  }
  .el-tree-node__content {
    align-self: baseline;
  }
}
</style>
