// apis/index.js - API接口统一管理（最小 MVP 闭环版）
const request = require('../utils/request');

// 认证相关API
const authApi = {
  // 微信登录（code 传 'mock' 时为模拟登录，便于本地开发）
  wechatLogin: (data) => request.post('/auth/wechat-login', data),

  // 普通登录
  normalLogin: (data) => request.post('/auth/login', data),

  // 用户注册
  register: (data) => request.post('/auth/register', data)
};

// 用户相关API
const userApi = {
  // 获取用户信息
  getUserInfo: () => request.get('/user/profile'),

  // 更新用户信息
  updateUserInfo: (data) => request.patch('/user/profile', data),

  // 获取学习统计
  getStudyStats: () => request.get('/user/stats'),

  // 更新学习时间
  updateStudyTime: (data) => request.post('/user/study-time', data)
};

// 题目相关API
const questionApi = {
  // 获取每日题目
  getDailyQuestions: () => request.get('/questions/daily'),

  // 根据知识点获取题目（章节练习）
  getQuestionsByKnowledgePoint: (knowledgePointId) =>
    request.get(`/questions/by-knowledge-point/${knowledgePointId}`),

  // 提交答案
  submitAnswer: (data) => request.post('/questions/answer', data),

  // 获取题目分析
  getQuestionAnalysis: (questionId) => request.get(`/questions/analysis/${questionId}`),

  // 搜索题目
  searchQuestions: (params) => request.get('/questions/search', params)
};

// 学习相关API（答题流水 + 错题本）
const studyApi = {
  // 获取学习记录
  getStudyRecords: (params = {}) => request.get('/study/records', params),

  // 获取错题本
  getWrongQuestions: (params = {}) => request.get('/study/wrong-questions', params),

  // 添加错题
  addWrongQuestion: (data) => request.post('/study/wrong-question', data),

  // 标记错题已掌握
  markWrongQuestionMastered: (id) => request.patch(`/study/wrong-question/${id}/mastered`),

  // 删除错题
  deleteWrongQuestion: (id) => request.delete(`/study/wrong-question/${id}`),

  // 获取今日学习状态
  getTodayStatus: () => request.get('/study/today-status')
};

// 知识点相关API（章节练习）
const knowledgeApi = {
  // 获取知识点列表
  getKnowledgePoints: (params = {}) => request.get('/knowledge', params),

  // 获取知识点详情
  getKnowledgeDetail: (id) => request.get(`/knowledge/${id}`),

  // 获取知识点树形结构
  getKnowledgeTree: () => request.get('/knowledge/tree/structure'),

  // 获取知识点下的题目
  getQuestionsByKnowledgePoint: (id) => request.get(`/knowledge/${id}/questions`)
};

// 导出所有API
module.exports = {
  authApi,
  userApi,
  questionApi,
  studyApi,
  knowledgeApi,

  // 直接导出request实例，用于自定义请求
  request
};
