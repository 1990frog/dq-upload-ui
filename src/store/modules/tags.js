import { getStore, setStore } from '@/util/store'
import { diff } from '@/util/util'
import website from '@/const/website'
import bus from '@/components/common/bus';

const isFirstPage = website.isFirstPage
const tagWel = website.fistPage
const tagObj = {
  label: '', // 标题名称
  value: '', // 标题的路径
  params: '', // 标题的路径参数
  query: '', // 标题的参数
  group: [] // 分组
}

// 处理首个标签
function setFistTag (list) {
  bus.$emit('tags', list)
  if (list.length == 1) {
    list[0].close = false
  } else {
    list.forEach(ele => {
      if (ele.value === tagWel.value && isFirstPage === false) {
        ele.close = false
      } else {
        ele.close = true
      }
    })
  }
}

const navs = {
  state: {
    tagList: getStore({ name: 'tagList' }) || [],
    tag: getStore({ name: 'tag' }) || tagObj,
    tagWel: tagWel
  },
  actions: {},
  mutations: {
    ADD_TAG: (state, action) => {
      state.tag = action
      setStore({ name: 'tag', content: state.tag, type: 'session' })
      if (state.tagList.some(ele => diff(ele.path, action.path))) {
        //存在更新fullPath
        let tag = state.tagList.find(ele => diff(ele.path, action.path))
        tag.value = action.value
        bus.$emit('tags', state.tagList)
        return
      }
      //after监控规则配置不新增tag
      if(!action.path.startsWith("/after/") && action.label!=="after" && !action.path.startsWith("/dialog/"))
        state.tagList.push(action)
      setFistTag(state.tagList)
      setStore({ name: 'tagList', content: state.tagList, type: 'session' })
    },
    DEL_TAG: (state, action) => {
      state.tagList = state.tagList.filter(item => {
        return !diff(item.path, action.path)
      })
      setFistTag(state.tagList)
      setStore({ name: 'tagList', content: state.tagList, type: 'session' })
    },
    DEL_ALL_TAG: (state) => {
      state.tagList = [state.tagWel]
      setStore({ name: 'tagList', content: state.tagList, type: 'session' })
    },
    DEL_TAG_OTHER: (state) => {
      state.tagList = state.tagList.filter(item => {
        if (item.value === state.tag.value) {
          return true;
        } else if (!website.isFirstPage && item.value === website.fistPage.value) {
          return true;
        }
      })
      setFistTag(state.tagList)
      setStore({ name: 'tagList', content: state.tagList, type: 'session' })
    }
  }
}
export default navs
