// apis/index.js - API接口统一管理
const request = require('../utils/request');

// 用户相关API
const userApi = {
  // 获取用户信息
  getUserInfo: () => request.get('/user/profile'),
  
  // 更新用户信息
  updateUserInfo: (data) => request.patch('/user/profile', data),
  
  // 获取学习统计
  getStudyStats: () => request.get('/user/stats'),
  
  // 更新学习时间
  updateStudyTime: (data) => request.post('/user/study-time', data),
  
  // 获取用户设置
  getUserSettings: () => request.get('/user/settings'),
  
  // 更新用户设置
  updateUserSettings: (data) => request.patch('/user/settings', data)
};

// 认证相关API
const authApi = {
  // 微信登录
  wechatLogin: (data) => request.post('/auth/wechat-login', data),
  
  // 普通登录
  normalLogin: (data) => request.post('/auth/login', data),
  
  // 用户注册
  register: (data) => request.post('/auth/register', data),
  
  // 刷新token
  refreshToken: () => request.post('/auth/refresh'),
  
  // 退出登录
  logout: () => request.post('/auth/logout')
};

// 题目相关API
const questionApi = {
  // 获取每日题目
  getDailyQuestions: () => request.get('/questions/daily'),
  
  // 获取错题
  getWrongQuestions: () => request.get('/questions/wrong'),
  
  // 获取高频错题
  getHighFrequencyWrongQuestions: () => request.get('/questions/high-frequency'),
  
  // 根据知识点获取题目
  getQuestionsByKnowledgePoint: (knowledgePointId) => 
    request.get(`/questions/by-knowledge-point/${knowledgePointId}`),
  
  // 提交答案
  submitAnswer: (data) => request.post('/questions/answer', data),
  
  // 获取题目分析
  getQuestionAnalysis: (questionId) => request.get(`/questions/analysis/${questionId}`),
  
  // 搜索题目
  searchQuestions: (params) => request.get('/questions/search', params)
};

// 学习相关API
const studyApi = {
  // 获取学习记录
  getStudyRecords: (params = {}) => request.get('/study/records', params),
  
  // 创建学习记录
  createStudyRecord: (data) => request.post('/study/record', data),
  
  // 获取错题本
  getWrongQuestions: (params = {}) => request.get('/study/wrong-questions', params),
  
  // 添加错题
  addWrongQuestion: (data) => request.post('/study/wrong-question', data),
  
  // 标记错题已掌握
  markWrongQuestionMastered: (id) => request.patch(`/study/wrong-question/${id}/mastered`),
  
  // 删除错题
  deleteWrongQuestion: (id) => request.delete(`/study/wrong-question/${id}`),
  
  // 获取学习计划
  getStudyPlans: () => request.get('/study/plans'),
  
  // 创建学习计划
  createStudyPlan: (data) => request.post('/study/plan', data),
  
  // 更新学习计划
  updateStudyPlan: (id, data) => request.patch(`/study/plan/${id}`, data),
  
  // 完成学习计划
  completeStudyPlan: (id) => request.post(`/study/plan/${id}/complete`),
  
  // 获取今日状态
  getTodayStatus: () => request.get('/study/today-status'),
  
  // 保存每日记录
  saveDailyRecord: (data) => request.post('/study/daily-record', data)
};

// OCR相关API
const ocrApi = {
  // 识别图片
  recognizeImage: (imageBase64) => request.post('/ocr/recognize', { 
    imageBase64,
    generateAnalysis: false 
  }),
  
  // 批量识别
  batchRecognize: (images) => request.post('/ocr/batch-recognize', { images }),
  
  // 获取识别历史
  getOcrHistory: (params = {}) => request.get('/ocr/history', params),
  
  // 删除识别记录
  deleteOcrRecord: (id) => request.delete(`/ocr/history/${id}`)
};

// AI相关API
const aiApi = {
  // 获取AI解释
  getExplanation: (data) => request.post('/ai/explanation', data),
  
  // 分析错误答案
  analyzeWrongAnswer: (data) => request.post('/ai/analyze-wrong-answer', data),
  
  // 生成学习建议
  getStudySuggestion: (data) => request.post('/ai/study-suggestion', data),
  
  // 分析题目
  analyzeQuestion: (content) => request.post('/ai/analyze-question', { content }),
  
  // 生成思维导图
  generateMindMap: (data) => request.post('/ai/mindmap', data)
};

// 知识点相关API
const knowledgeApi = {
  // 获取知识点列表
  getKnowledgePoints: (params = {}) => request.get('/knowledge/points', params),
  
  // 获取知识点详情
  getKnowledgeDetail: (id) => request.get(`/knowledge/${id}`),
  
  // 获取相关知识点
  getRelatedKnowledge: (id) => request.get(`/knowledge/${id}/related`),
  
  // 获取知识点进度
  getKnowledgeProgress: (id) => request.get(`/knowledge/${id}/progress`),
  
  // 更新学习进度
  updateProgress: (id, progress) => request.post(`/knowledge/${id}/progress`, { progress }),
  
  // 添加笔记
  addNote: (knowledgeId, content) => request.post(`/knowledge/${knowledgeId}/note`, { content }),
  
  // 获取笔记
  getNotes: (knowledgeId) => request.get(`/knowledge/${knowledgeId}/notes`),
  
  // 删除笔记
  deleteNote: (noteId) => request.delete(`/knowledge/note/${noteId}`)
};

// 考试相关API
const examApi = {
  // 获取考试列表
  getExams: (params = {}) => request.get('/exam/list', params),
  
  // 获取考试详情
  getExamDetail: (id) => request.get(`/exam/${id}`),
  
  // 开始考试
  startExam: (examId) => request.post(`/exam/${examId}/start`),
  
  // 提交考试
  submitExam: (examId, answers) => request.post(`/exam/${examId}/submit`, { answers }),
  
  // 获取考试结果
  getExamResult: (recordId) => request.get(`/exam/result/${recordId}`),
  
  // 获取考试历史
  getExamHistory: (params = {}) => request.get('/exam/history', params)
};

// 音频相关API
const audioApi = {
  // 文字转语音
  textToSpeech: (text, options = {}) => request.post('/audio/tts', { 
    text, 
    voice: options.voice || 'standard',
    speed: options.speed || 1.0
  }),
  
  // 语音转文字
  speechToText: (audioBase64) => request.post('/audio/stt', { audioBase64 })
};

// 数据分析API
const analyticsApi = {
  // 获取学习分析
  getStudyAnalytics: (params = {}) => request.get('/analytics/study', params),
  
  // 获取答题分析
  getAnswerAnalytics: (params = {}) => request.get('/analytics/answer', params),
  
  // 获取知识点掌握情况
  getKnowledgeMastery: () => request.get('/analytics/knowledge-mastery'),
  
  // 获取学习趋势
  getStudyTrend: (days = 30) => request.get('/analytics/study-trend', { days })
};

// 思维导图API
const mindmapApi = {
  // 获取思维导图
  getMindMap: (knowledgeId) => request.get(`/mindmap/${knowledgeId}`),
  
  // 生成思维导图
  generateMindMap: (data) => request.post('/mindmap/generate', data),
  
  // 保存思维导图
  saveMindMap: (data) => request.post('/mindmap/save', data)
};

// 微信相关API
const wechatApi = {
  // 获取微信配置
  getWechatConfig: (url) => request.get('/wechat/config', { url }),
  
  // 发送模板消息
  sendTemplateMessage: (data) => request.post('/wechat/template-message', data)
};

// 导出所有API
module.exports = {
  userApi,
  authApi,
  questionApi,
  ocrApi,
  aiApi,
  studyApi,
  knowledgeApi,
  examApi,
  audioApi,
  analyticsApi,
  mindmapApi,
  wechatApi,
  
  // 直接导出request实例，用于自定义请求
  request
};