/*
 * @Author: your name
 * @Date: 2021-03-08 16:01:36
 * @LastEditTime: 2021-03-08 16:16:22
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \clibrain-data-quality-v2.5\src\store\modules\moxingweihu.js
 */
const moxingweihu = {
  state: {
    DIALOGVISIBLE: false,
    keyword: '',
    search: {}
  },

  mutations: {
    SET_DIALOGVISIBLE(state, val) {
      state.DIALOGVISIBLE = val;
    },
    SET_KEYWORD(state, val) {
      state.keyword = val;
    },
    SET_SEARCH(state, val) {
      state.search = val;
    }
  }
};

export default moxingweihu;
