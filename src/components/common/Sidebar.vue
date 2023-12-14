<template>
  <div class="sidebar xh-left-menu">
    <!-- 折叠按钮 -->
    <div class="collapse-btn" @click="collapseChage">
      <div v-if="!collapse" class="font-white">
        <i class="el-icon-s-fold"></i>全部菜单
      </div>
      <i v-else class="el-icon-s-unfold"></i>
    </div>

    <el-menu class="sidebar-el-menu kyle" :default-active="onRoutes" :collapse="collapse" background-color="#262f52" text-color="#FFFFFF" active-text-color="#1890FF" unique-opened
      router>
      <template v-for="item in items">
        <template v-if="item.subs">
          <el-submenu :index="item.index" :key="item.index">
            <template slot="title">
              <i :class="item.icon" class="icon iconfont "></i>
              <span slot="title">{{ item.title }}</span>
            </template>

            <template v-for="subItem in item.subs">
              <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                <template slot="title">{{ subItem.title }} </template>

                <el-menu-item v-for="(threeItem, i) in subItem.subs" :key="i" :index="threeItem.index">{{ threeItem.title }}
                </el-menu-item>
              </el-submenu>

              <el-menu-item v-else :index="subItem.index" :key="subItem.index">{{ subItem.title }}
              </el-menu-item>
            </template>
          </el-submenu>
        </template>

        <template v-else>
          <el-menu-item :index="item.index" :key="item.index">
            <i :class="item.icon" class="icon iconfont "></i>
            <span slot="title">{{ item.title }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
import bus from "../common/bus";
export default {
  data() {
    return {
      collapse: false,
      items: [
        {
          icon: "iconzhiliangfenxi",
          index: "1",
          title: "质量分析",
          subs: [
            {
              index: "/dailyReport",
              title: "统计日报",
            },
            {
              index: "/dailySummaryReport",
              title: "日报汇总",
            },
            {
              index: "/monthReport",
              title: "统计月报",
            },
            {
              index: "/qualityScore",
              title: "质量评分",
            },
            {
              index: "/qualityReport",
              title: "质量评估报告",
            },
            {
              index: "/qualityOptimize",
              title: "上报优化",
            }
          ],
        },
        {
          icon: "iconguizeguanli",
          index: "/qualityrule",
          title: "治理任务",
        },
        {
          icon: "iconpinggu",
          index: "/questionfeedback",
          title: "异常问题稽查",
        },
        // {
        //   icon: "iconzljcgl",
        //   index: "/masterData",
        //   title: "主数据管理",
        // },
        // {
        //   icon: "iconshujuku",
        //   index: "/metaData",
        //   title: "元数据管理",
        // },
        {
          icon: "iconjurassic_log",
          index: "/journal",
          title: "日志",
        },
        {
          icon: "iconxitongshezhi",
          index: "3",
          title: "系统设置",
          subs: [
            {
              index: "/systemSet/task",
              title: "执行任务",
            },
            {
              index: "/systemSet/organMaintain",
              title: "机构维护",
            },
            {
              index: "/systemSet/model",
              title: "模型维护",
            },
            // {
            //   index: "/systemSet/roleManage",
            //   title: "角色管理",
            // },
            {
              index: "/systemSet/responsible",
              title: "责任人管理",
            },
            // {
            //   index: "/systemSet/matchPublicRule",
            //   title: "匹配公版规则",
            // }
          ]
        },
      ],
    };
  },
  computed: {
    // 根据路由高亮显示对应的菜单
    onRoutes() {
      return this.$route.path;
    },
  },
  methods: {
    // 侧边栏折叠
    collapseChage() {
      this.collapse = !this.collapse;
      bus.$emit("collapse", this.collapse);
    },
  },
  created() {
    // 通过 Event Bus 进行组件间通信，来折叠侧边栏
    bus.$on("collapse", (msg) => {
      this.collapse = msg;
      bus.$emit("collapse-content", msg);
    });
  },
};
</script>

<style lang="scss" scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 50px;
  bottom: 0;
  overflow-y: scroll;
  .collapse-btn {
    line-height: 50px;
    padding-left: 20px;
    overflow: hidden;
    box-sizing: border-box;
    font-size: 14px;
    .el-icon-s-fold {
      margin-right: 20px;
      font-size: 18px;
    }
    .el-icon-s-unfold {
      margin-right: 20px;
    }
  }
  .sidebar-el-menu {
    background-color: rgb(38, 47, 82) !important;
  }
}
.sidebar::-webkit-scrollbar {
  width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
  width: 210px;
}
.sidebar > ul {
  height: calc(100% - 50px);
}
</style>
