const URL = '/upload';
const master = '/data-main';
const meta = '/metadata';
const API = {
  postprocess: {
    method: 'post',
    url: URL + '/issue/process'
  },

  postmodify: {
    method: 'post',
    url: URL + '/responsible/modify'
  },

  postpageCheckIssue: {
    method: 'post',
    url: URL + '/issue/pageCheckIssue'
  },

  gettimeaxis: {
    method: 'get',
    url: URL + '/result/timeaxis'
  },

  getmodel: {
    method: 'get',
    url: URL + '/result/model'
  },

  postruleTree: {
    method: 'get',
    url: URL + '/issue/ruleTree'
  },
  postissueadd: {
    method: 'post',
    url: URL + '/issue/add'
  },

  postlistResponsible: {
    method: 'post',
    url: URL + '/issue/listResponsible'
  },

  postlistJob: {
    method: 'post',
    url: URL + '/issue/listJob'
  },

  postlistPageIssue: {
    method: 'post',
    url: URL + '/issue/listPageIssue'
  },

  postlistPage: {
    method: 'post',
    url: URL + '/responsible/listPage'
  },

  listendirmodify: {
    method: 'post',
    url: URL + '/responsible/listendir/modify'
  },

  getListendirModel: {
    method: 'get',
    url: URL + '/responsible/listendir/model'
  },

  deleteresponsible: {
    method: 'delete',
    url: URL + '/responsible/del/'
  },

  /****************** 公共方法  ******************/
  // 查询字典表
  queryDict: {
    method: 'post',
    url: URL + '/common/dictList'
  },
  /****************** 日审分析  ******************/
  // 日审分析数据查询
  incrementAnalysis: {
    method: 'get',
    url: URL + '/analysis/incrementAnalysis'
  },
  // 日审分析核查结果详情
  incrementDetail: {
    method: 'post',
    url: URL + '/analysis/detail'
  },
  /****************** 上报数据情况  ******************/
  // 数据日进量统计
  rowReport: {
    method: 'post',
    url: URL + '/analysis/row/report'
  },
  /****************** 质量评估标准  ******************/
  // 事后规则查询
  queryAfter: {
    method: 'get',
    url: URL + '/standard/after/query'
  },

  //
  monthbatch: {
    method: 'get',
    url: URL + '/analysis/month/batch'
  },

  reportmonth: {
    method: 'get',
    url: URL + '/analysis/report/month'
  },
  // 事后规则评分标准
  getAfterStandard: {
    method: 'get',
    url: URL + '/standard/after/info'
  },
  // 保存事后规则评分标准
  modifyAfterStandard: {
    method: 'post',
    url: URL + '/standard/after/modify'
  },
  // 查询历史评分标准
  history: {
    method: 'get',
    url: URL + '/standard/after/history'
  },
  /****************** 治理任务  ******************/
  // 规则树
  ruleTree: {
    method: 'get',
    url: URL + '/management/rule/tree'
  },
  // 治理任务列表
  overview: {
    method: 'post',
    url: URL + '/management/overview'
  },
  // 监控规则配置-树
  model: {
    method: 'get',
    url: URL + '/management/model'
  },
  // 事后规则列表
  rulelist: {
    method: 'post',
    url: URL + '/management/rule/list'
  },

  // 查库
  dbs: {
    method: 'get',
    url: URL + '/common/dbs'
  },
  // 查表
  tables: {
    method: 'get',
    url: URL + '/common/tables'
  },

  reportrule: {
    method: 'get',
    url: URL + '/analysis/report/rule'
  },

  // 查字段
  fields: {
    method: 'get',
    url: URL + '/common/fields'
  },

  analysisreport: {
    method: 'post',
    url: URL + '/analysis/report'
  },

  daoChuZhiLiangBaobiao: {
    method: 'post',
    responseType: 'blob',
    url: URL + '/analysis/export'
  },
  // 更新规则状态：启用，停用
  modifyStatus: {
    method: 'get',
    url: URL + '/rule/status/modify'
  },
  // sql编辑页面，左侧规则列表
  ruleGroupTree: {
    method: 'get',
    url: URL + '/management/rule/group'
  },
  // 数据库类型码表
  dbSelect: {
    method: 'get',
    url: URL + '/common/dbs'
  },
  /****************** 质量曾删改查 ******************/
  // 查询源目规则
  querySourceTarget: {
    method: 'post',
    url: URL + '/rule/sourcetarget/query'
  },
  // 保存源目规则
  modifySourceTarget: {
    method: 'post',
    url: URL + '/rule/sourcetarget/modify'
  },
  // 查询主子关系规则
  queryMainDetail: {
    method: 'post',
    url: URL + '/rule/maindetail/query'
  },
  // 保存主子关系规则
  modifyMainDetail: {
    method: 'post',
    url: URL + '/rule/maindetail/modify'
  },
  // 查询非空规则
  queryNonEmpty: {
    method: 'post',
    url: URL + '/rule/nonempty/query'
  },
  // 保存非空规则
  modifyNonEmpty: {
    method: 'post',
    url: URL + '/rule/nonempty/modify'
  },
  // 查询绝对值规则
  queryAbs: {
    method: 'post',
    url: URL + '/rule/abs/query'
  },
  // 保存绝对值规则
  modifyAbs: {
    method: 'post',
    url: URL + '/rule/abs/modify'
  },
  // 查询枚举值规则
  queryEnum: {
    method: 'post',
    url: URL + '/rule/enum/query'
  },
  // 保存枚举
  modifyEnum: {
    method: 'post',
    url: URL + '/rule/enum/modify'
  },
  // 报告
  report: {
    method: 'get',
    url: URL + '/qualitymanagement/report'
  },
  // 查询字典表
  decode: {
    method: 'get',
    url: URL + '/common/decode'
  },

  ziDingYiQuJianJianCeApi: {
    method: 'post',
    url: URL + '/standard/job/query'
  },

  getJiGou: {
    method: 'get',
    url: URL + '/common/dict'
  },

  zhiXingQuJian: {
    method: 'post',
    url: URL + '/standard/job/create'
  },

  getoverview: {
    method: 'get',
    url: URL + '/result/overview2'
  },

  getdict: {
    method: 'get',
    url: URL + '/common/dict'
  },

  /****************** 问题稽查核对  ******************/
  // 知识库-规则树
  getKnowledgeTree: {
    method: 'get',
    url: URL + '/issue/knowledge/ruleTree'
  },
  // 知识库-列表
  postKnowledgeList: {
    method: 'post',
    url: URL + '/issue/knowledge/list'
  },
  // 反馈审核-提交知识库
  postKnowledge: {
    method: 'post',
    url: URL + '/issue/knowledge/commit'
  },

  /****************** login  ******************/
  // 登录
  loginByUsername: {
    method: 'post',
    url: '/auth/oauth/token'
  },
  // 刷新
  refreshToken: {
    method: 'post',
    url: '/auth/oauth/token'
  },
  // 获取用户
  getUserInfo: {
    method: 'get',
    url: '/admin/user/info'
  },
  // 登出
  logout: {
    method: 'delete',
    url: '/auth/token/logout'
  },

  /****************** menu  ******************/
  getMenu: {
    method: 'get',
    url: '/admin/menu'
    // params: {parentId: id},
  },
  fetchMenuTree: {
    method: 'get',
    url: '/admin/menu/tree'
    // params: {lazy: lazy, parentId: parentId}
  },
  addObj: {
    method: 'post',
    url: '/admin/menu'
    // data: obj
  },
  getObj: {
    method: 'get',
    url: '/admin/menu'
    //id
  },
  delObj: {
    method: 'delete',
    url: '/admin/menu'
    //id
  },
  putObj: {
    method: 'put',
    url: '/admin/menu'
    // data: obj
  },

  /****************** 报表 ******************/
  //日报
  reportDay: {
    method: 'get',
    url: URL + '/report/day',
    resAll: true //返回所有信息
  },
  // 日报汇总
  reportDaySummary: {
    method: 'get',
    url: URL + '/report/day/summary',
    resAll: true //返回所有信息
  },
  //月报
  reportMonth: {
    method: 'get',
    url: URL + '/report/month',
    resAll: true //返回所有信息
  },
  //月报图表
  reportMonthCharts: {
    method: 'get',
    url: URL + '/report/month/charts'
  },
  //质量评分
  reportScore: {
    method: 'get',
    url: URL + '/report/score',
    resAll: true //返回所有信息
  },
  //质量评估报告-菜单
  reportMenu: {
    method: 'get',
    url: URL + '/report/menu'
  },
  //质量评估报告-图表
  reportCharts: {
    method: 'post',
    url: URL + '/report/charts',
    serialize: true //参数序列化
  },
  //质量评估报告-详情
  reportResult: {
    method: 'post',
    url: URL + '/report/result',
    serialize: true
  },

  /****************** 模型分类  ******************/
  // 查询分类
  getBusinessTypeAll: {
    method: 'get',
    url: URL + '/model/category/all'
  },

  // 分页获取模型分类信息
  getBusinessType: {
    method: 'get',
    url: URL + '/model/category/page',
    resAll: true //返回所有信息
  },

  // 删除模型分类
  delBusinessType: {
    method: 'delete',
    url: URL + '/model/category/'
  },

  // 增加模型分类
  addBusinessType: {
    method: 'post',
    url: URL + '/model/category'
  },

  // 修改模型分类
  updateBusinessType: {
    method: 'put',
    url: URL + '/model/category'
  },

  // 添加业务类型和模型以及表的绑定
  bindBusinessType: {
    method: 'post',
    url: URL + '/category/bind',
    resAll: true //返回所有信息
  },

  // 删除业务类型和模型以及表的绑定
  delBindBusinessType: {
    method: 'delete',
    url: URL + '/category/bind/',
    resAll: true //返回所有信息
  },

  /****************** 问题稽查处理  ******************/
  // 查询
  getIssueQuery: {
    method: 'post',
    url: URL + '/issue/query'
  },

  // 核查详情
  getIssueResult: {
    method: 'get',
    url: URL + '/issue/result'
  },

  // 问题提交
  saveIssue: {
    method: 'post',
    url: URL + '/issue/save'
  },

  /****************** 主数据管理  ******************/
  // 分页获取字典信息
  getMainData: {
    method: 'get',
    url: master + '/mainData',
    resAll: true //返回所有信息
  },

  // 启用禁用状态修改
  updateState: {
    method: 'put',
    url: master + '/mainData/state/',
    resAll: true //返回所有信息
  },

  // 新增字典信息
  addDictionaryInfo: {
    method: 'post',
    url: master + '/mainData',
    resAll: true //返回所有信息
  },

  // 修改字典信息
  updateDictionaryInfo: {
    method: 'put',
    url: master + '/mainData',
    resAll: true //返回所有信息
  },

  // 删除字典信息
  delDictionaryInfo: {
    method: 'delete',
    url: master + '/mainData/',
    resAll: true //返回所有信息
  },

  // 分页查询明细
  getDetailInfo: {
    method: 'get',
    url: master + '/mainData/detail',
    resAll: true //返回所有信息
  },

  // 获取字典类别（下拉选）
  getMainDataType: {
    method: 'get',
    url: master + '/mainData/type',
    resAll: true //返回所有信息
  },

  // 获取医疗机构（下拉选）
  getAllOrgan: {
    method: 'get',
    url: master + '/extend/code/all',
    resAll: true //返回所有信息
  },

  // 新增明细
  addDetail: {
    method: 'post',
    url: master + '/mainData/detail',
    resAll: true //返回所有信息
  },

  // 修改明细
  updateDetail: {
    method: 'put',
    url: master + '/mainData/detail',
    resAll: true //返回所有信息
  },

  // 删除明细
  delDetail: {
    method: 'delete',
    url: master + '/mainData/detail/',
    resAll: true //返回所有信息
  },

  // 批量导入模板下载
  getFormwork: {
    method: 'get',
    url: master + '/mainData/detail/download'
  },

  // 批量导入明细数据
  uploadFile: {
    method: 'post',
    url: master + '/mainData/detail/import'
  },

  /****************** 元数据管理  ******************/
  // 库分页查询
  getSchema: {
    method: 'get',
    url: meta + '/schema/page'
  },
  // 测试连接
  putSchema: {
    method: 'put',
    url: meta + '/schema/',
    resAll: true //返回所有信息
  },
  // 保存
  postSchema: {
    method: 'post',
    url: meta + '/schema/'
  },
  // 删除
  deleteSchema: {
    method: 'delete',
    url: meta + '/schema/'
  },

  // 数据库类型下拉
  metadataDict: {
    method: 'get',
    url: meta + '/dict/'
  },

  // 目标库：表查询
  metaRemoteTable: {
    method: 'get',
    url: meta + '/remote/table/list'
  },

  // 目标库：列查询
  metaRemoteColumn: {
    method: 'get',
    url: meta + '/remote/column/list'
  },

  // 本地：表查询分页
  getMetaTable: {
    method: 'get',
    url: meta + '/table/page'
  },

  // 本地：修改表名
  putMetaTable: {
    method: 'post',
    url: meta + '/table/'
  },

  // 本地：删除表
  deleteMetaTable: {
    method: 'delete',
    url: meta + '/table/'
  },

  // 目标库：导入
  metaRemoteLoad: {
    method: 'post',
    url: meta + '/remote/load'
  },

  // 本地：表查询
  metaTableList: {
    method: 'get',
    url: meta + '/table/list'
  },

  // 本地：字段查询
  metaColumnList: {
    method: 'get',
    url: meta + '/column/list'
  },

  // 更新本地表字段
  postMetaColumn: {
    method: 'post',
    url: meta + '/column/'
  },

  // 元数据配置—模型结构—时间字段下拉
  getBusinessTimefield: {
    method: 'get',
    url: URL + '/system/meta/local/timefield/query',
    resAll: true //返回所有信息
  },

  // 元数据配置—更新业务时间字段
  updateBusinessTimefield: {
    method: 'post',
    url: URL + '/system/meta/local/datefield/modify',
    resAll: true //返回所有信息
  },

  /****************** 系统设置-机构维护  ******************/
  // 机构-查询分页
  getOrganization: {
    method: 'get',
    url: URL + '/system/organization',
    resAll: true
  },

  // 机构-查询所有
  getOrganizationAll: {
    method: 'get',
    url: URL + '/system/organization/all'
  },

  // 机构-新增
  addOrganization: {
    method: 'post',
    url: URL + '/system/organization'
  },

  // 机构-更新
  editOrganization: {
    method: 'post',
    url: URL + '/system/organization'
  },

  // 机构-删除
  delOrganization: {
    method: 'delete',
    url: URL + '/system/organization/'
  },

  /****************** 系统设置-角色管理  ******************/
  // 角色-查询分页
  getRole: {
    method: 'get',
    url: URL + '/role/list',
    resAll: true
  },

  // 角色-新增
  addRole: {
    method: 'post',
    url: URL + '/role/add'
  },

  // 角色-修改
  updateRole: {
    method: 'post',
    url: URL + '/role/update'
  },

  // 角色-删除
  delRole: {
    method: 'post',
    url: URL + '/role/delete'
  },

  // 角色-获取菜单权限
  getRoleMenu: {
    method: 'get',
    url: URL + '/role/menu'
  },

  // 角色-获取数据权限
  getRoleData: {
    method: 'get',
    url: URL + '/role/data'
  },

  // 角色-修改菜单权限内容
  putRoleMenu: {
    method: 'put',
    url: URL + '/role/edit/menu'
  },

  // 角色-修改数据权限内容
  putRoleData: {
    method: 'put',
    url: URL + '/role/edit/data'
  },

  /****************** 系统设置-责任人维护  ******************/
  // 责任人-分页
  getUser: {
    method: 'get',
    url: URL + '/user',
    resAll: true
  },

  // 责任人-新增
  addUser: {
    method: 'post',
    url: URL + '/user'
  },
  // 责任人-修改
  updateUser: {
    method: 'put',
    url: URL + '/user'
  },

  // 责任人-删除
  delUser: {
    method: 'delete',
    url: URL + '/user/'
  },

  // 邮件类型
  getEmailTypeList: {
    method: 'get',
    url: URL + '/user/email/type'
  },

  // 用户绑定机构
  postUserBuild: {
    method: 'post',
    url: URL + '/user/build'
  },

  // 开起-关闭日报汇总接收人
  putDayReportSummary: {
    method: 'put',
    url: URL + '/user/dayReportSummary/',
    serialize: true
  },

  // 元数据配置列表
  getSystemMetaList: {
    method: 'post',
    url: URL + '/system/meta/local/table/query',
    serialize: true,
    resAll: true
  },

  /****************** 系统设置-模型维护  ******************/
  // 模型-分页
  getModelPage: {
    method: 'get',
    url: URL + '/model/page',
    resAll: true
  },
  // 模型-分页
  putModel: {
    method: 'put',
    url: URL + '/model'
  },
  // 模型-设置业务时间类型字段
  setBusinessTimeField: {
    method: 'put',
    url: URL + '/model/setBusinessTimeField'
  },
  // 模型-设置医联体字段
  setHospitalField: {
    method: 'put',
    url: URL + '/model/setHospitalField'
  },

  // 模型-获取本地表
  getModelTables: {
    method: 'get',
    url: URL + '/model/tables'
  },

  /****************** 分类绑定表-列表查询  ******************/
  // 列表查询
  getCategoryBindPage: {
    method: 'get',
    url: URL + '/category/bind/page',
    resAll: true
  },
  // 表排序
  sortTable: {
    method: 'put',
    url: URL + '/category/bind/sort'
  },
  // 模型分类排序
  sortCategory: {
    method: 'post',
    url: URL + '/model/category/sort'
  },

  /****************** 核查任务  ******************/
  // 批次分页查询
  getBatchPage: {
    method: 'get',
    url: URL + '/job/batch/page',
    resAll: true
  },
  // 删除批次
  deleteBatch: {
    method: 'delete',
    url: URL + '/job/batch/'
  },

  // 批次分页查询
  getJobPage: {
    method: 'get',
    url: URL + '/job/page',
    resAll: true
  },
  // 批次详情分页查询
  getJobDetailPage: {
    method: 'get',
    url: URL + '/job/detail/page',
    resAll: true
  },
  // 创建核查任务
  createJob: {
    method: 'post',
    url: URL + '/job/new/create'
  },
  // 执行批次任务
  execBatch: {
    method: 'post',
    url: URL + '/job/exec/batch/'
  },
  // 执行核查任务
  execJob: {
    method: 'post',
    url: URL + '/job/exec/'
  },
  // 删除核查任务
  deleteJob: {
    method: 'delete',
    url: URL + '/job/'
  },

  /****************** 上报优化  ******************/
  // 报表接口
  getReportColumn: {
    method: 'get',
    url: URL + '/report/column',
    resAll: true
  },

};
export default API;
