<template>
  <div class="roleRight">
    <!-- 右边顶部 -->
    <div class="rightHeader">
      <span class="title">
        权限配置
        <span v-if="roleName !== ''">{{ `（${roleName}）` }}</span>
      </span>
    </div>

    <!-- 右边菜单树 -->
    <div class="menuTree menuTabs">
      <el-tabs
        type="card"
        class="menuTreeTab"
        v-model="activeName"
        @tab-click="handleTabClick"
      >
        <el-tab-pane
          v-for="item in tabList"
          :key="item.name"
          :label="item.label"
          :name="item.name"
        >
          <el-tree
            ref="tree"
            default-expand-all
            highlight-current
            node-key="_id"
            :data="treeData"
            :props="defaultProps"
            :default-checked-keys="checkedIdArr"
            show-checkbox
            @check="handleCheck"
          >
            <span class="treeNodeContent" slot-scope="{ node }">
              <i :class="node.data.icon" />
              <span>{{ node.data.name }}</span>
            </span>
          </el-tree>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { LinkReshapingTool } from 'gojs';
export default {
  data() {
    return {
      roleName: '',
      activeName: '1',
      tabList: [
        {
          name: '1',
          label: '菜单权限'
        },
        {
          name: '2',
          label: '数据权限'
        }
        // {
        //   name: '3',
        //   label: '数据源权限'
        // }
      ],
      defaultProps: {
        children: 'child',
        label: 'label'
      },
      treeData: [],
      checkedIdArr: [],
      row: {}
    };
  },

  methods: {
    async getTreeData() {
      let res;
      if (this.activeName === '1') {
        res = await this.$R.getRoleMenu({ roleId: this.row.roleId });
        this.handleMenu(res);
      } else {
        res = await this.$R.getRoleData({ roleId: this.row.roleId });
        this.handleData(res);
      }

      this.treeData = res;
      this.checkedIdArr = this.getCheckedIds(this.treeData);
      this.$refs.tree[this.activeName - 1].setCheckedKeys(
        this.getCheckedIds(this.treeData),
        true
      );
    },

    //迭代处理数据
    handleMenu(res) {
      res.forEach((element) => {
        element._id = element.menuId;
        if (element?.child?.length) this.handleMenu(element.child);
      });
    },

    handleData(res) {
      res.forEach((element) => {
        element.name = element.organizationName;
        element._id = element.organizationCode;
        if (element?.child?.length) this.handleData(element.child);
      });
    },

    handleRowClick(row) {
      this.row = row;
      this.getTreeData();
    },

    handleTabClick() {
      this.getTreeData();
    },

    // 获取所有勾选上的节点的id
    getCheckedIds(data) {
      let childArr = [];
      data.forEach((item) => {
        if (item.hasPermission) childArr.push(item._id);
        if (item.child?.length)
          childArr.push(...this.getCheckedIds(item.child));
      });
      return childArr;
    },

    handleCheck(data, obj) {
      if (this.activeName === '1') {
        let params = {
          roleId: this.row.roleId,
          permissions: obj.checkedKeys.concat(obj.halfCheckedKeys)
        };
        this.$R.putRoleMenu(params).then((res) => {
          this.$message.success('修改成功！');
        });
      } else {
        let params = {
          roleId: this.row.roleId,
          codes: obj.checkedKeys.concat(obj.halfCheckedKeys)
        };
        this.$R.putRoleData(params).then((res) => {
          this.$message.success('修改成功！');
        });
      }
    }
  }
};
</script>

<style lang="scss">
.roleRight {
  width: 40%;
  .rightHeader {
    height: 28px;
    display: flex;
    align-items: center;
    .title::before {
      content: '';
      width: 10px;
      height: 10px;
      display: inline-block;
      background: #21aced;
      border-radius: 100%;
      margin-right: 5px;
    }
  }
  .menuTree {
    width: 100%;
    height: calc(100% - 48px);
    margin-top: 10px;
    border: solid 1px #0b02051f;
  }
  .menuTabs {
    .el-tabs--card > .el-tabs__header .el-tabs__nav {
      border: 0;
    }
    .el-tabs--card > .el-tabs__header .el-tabs__item {
      border-top: 0;
      border-right: 0;
      border-left: 0;
    }
    .el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
      border-bottom: 1px solid #409eff;
    }
    .el-tabs__item {
      font-size: 12px;
      height: 30px;
      line-height: 30px;
    }
  }
}
</style>
