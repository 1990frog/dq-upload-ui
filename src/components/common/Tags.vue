<template>
  <div class="avue-tags" v-if="showTag">
    <!-- tag盒子 -->
    <div v-if="contextmenuFlag" class="avue-tags__contentmenu" :style="{ left: contentmenuX + 'px', top: contentmenuY + 'px' }">
      <div class="item" @click="closeOthersTags">关闭其他</div>
      <div class="item" @click="closeAllTags">关闭全部</div>
    </div>
    <div class="avue-tags__box xh-tabls" :class="{ 'avue-tags__box--close': !website.isFirstPage }">
      <el-tabs v-model="active" type="card" @contextmenu.native="handleContextmenu" :closable="tagLen !== 1" @tab-click="openTag" @edit="menuTag"
        :class="{ dashboard: isDashboardPage }">
        <el-tab-pane :key="item.value" v-for="item in tagList" :label="item.label" :name="item.path">
        </el-tab-pane>
      </el-tabs>
      <!-- <el-dropdown class="avue-tags__menu">
        <el-button type="primary"
                   >
          更多
          <i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="closeOthersTags">关闭其他</el-dropdown-item>
          <el-dropdown-item @click.native="closeAllTags">关闭全部</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown> -->
    </div>
  </div>
</template>
<script>
import { mapGetters, mapState } from "vuex";
export default {
  name: "tags",
  data() {
    return {
      active: "",
      contentmenuX: "",
      contentmenuY: "",
      contextmenuFlag: false,
      isDashboardPage: true
    };
  },
  created() { },
  mounted() {
    this.setActive();

    // 日审分析页面，设置深色tag
    if (
      this.$route.path === '/dashboard' ||
      this.$route.path === '/overviews' ||
      this.$route.path === '/qualityReport'
    ) {
      this.isDashboardPage = true;
    } else {
      this.isDashboardPage = false;
    }
  },
  watch: {
    tag() {
      this.setActive();
    },
    contextmenuFlag(contextmenuShow) {
      // 只在右键菜单显示的时候监听鼠标点击事件
      if (contextmenuShow) {
        window.addEventListener("mousedown", this.watchContextmenu);
      }
    },
    $route(newValue, oldValue) {
      this.setTags(newValue);
      // 日审分析页面，设置深色tag qualityReport
      if (
        newValue.path === '/dashboard' ||
        newValue.path === '/overviews' ||
        newValue.path === '/qualityReport'
      ) {
        this.isDashboardPage = true;
      } else {
        this.isDashboardPage = false;
      }
    }
  },
  computed: {
    ...mapGetters(["tagWel", "tagList", "tag", "website"]),
    ...mapState({
      showTag: state => state.common.showTag
    }),
    tagLen() {
      return this.tagList.length || 0;
    }
  },
  methods: {
    watchContextmenu(e) {
      if (!this.$el.contains(e.target)) {
        this.contextmenuFlag = false;
        window.removeEventListener("mousedown", this.watchContextmenu);
      }
    },
    handleContextmenu(event) {
      let target = event.target;
      // 解决 https://github.com/d2-projects/d2-admin/issues/54
      let flag = false;
      if (target.className.indexOf("el-tabs__item") > -1) flag = true;
      else if (target.parentNode.className.indexOf("el-tabs__item") > -1) {
        target = target.parentNode;
        flag = true;
      }
      if (flag) {
        event.preventDefault();
        event.stopPropagation();
        this.contentmenuX = event.clientX;
        this.contentmenuY = event.clientY;
        this.tagName = target.getAttribute("aria-controls").slice(5);
        this.contextmenuFlag = true;
      }
    },
    //激活当前选项
    setActive() {
      this.active = this.tag.path;
    },
    menuTag(value, action) {
      if (action === "remove") {
        let { tag, key } = this.findTag(value);
        this.$store.commit("DEL_TAG", tag);
        if (tag.path === this.tag.path) {
          tag = this.tagList[key === 0 ? key : key - 1]; //如果关闭本标签让前推一个
          this.openTag(tag);
        }
      }
    },
    openTag(item) {
      let tag;
      if (item.name) {
        tag = this.findTag(item.name).tag;
      } else {
        tag = item;
      }

      this.$router.push({
        path: tag.path,
        query: tag.query
      });
    },
    closeOthersTags() {
      this.contextmenuFlag = false;
      this.$store.commit("DEL_TAG_OTHER");
    },
    findTag(value) {
      let tag, key;
      this.tagList.map((item, index) => {
        if (item.path === value) {
          tag = item;
          key = index;
        }
      });
      return { tag: tag, key: key };
    },
    closeAllTags() {
      this.contextmenuFlag = false;
      this.$store.commit("DEL_ALL_TAG");
      this.$router.push({
        path: this.$router.$avueRouter.getPath({
          src: this.tagWel.value
        }),
        query: this.tagWel.query
      });
    },
    // 设置标签
    setTags(to) {
      const value = to.fullPath
      let label = to.meta.title || to.name
      const path = to.path
      this.$store.commit('ADD_TAG', {
        label: label,
        value: value,
        path: path,
        params: to.params,
        query: to.query,
        group: to.path
      })
    },
  }
};
</script>
