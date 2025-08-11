// pages/test/test.js - 接口测试页面
const app = getApp();

Page({
  data: {
    testResults: [],
    loading: false,
    token: '',
    userInfo: null
  },

  onLoad() {
    this.setData({
      token: wx.getStorageSync('token') || '未登录',
      userInfo: wx.getStorageSync('userInfo')
    });
  },

  // 测试认证接口
  async testAuth() {
    this.addTestResult('开始测试认证接口...');
    
    try {
      // 测试微信登录
      const loginResult = await app.api.authApi.wechatLogin({ code: 'mock' });
      this.addTestResult('✅ 微信登录接口测试成功', loginResult);
      
      if (loginResult && loginResult.data && loginResult.data.token) {
        wx.setStorageSync('token', loginResult.data.token);
        wx.setStorageSync('userInfo', loginResult.data.userInfo);
        this.setData({
          token: loginResult.data.token,
          userInfo: loginResult.data.userInfo
        });
      }
    } catch (error) {
      this.addTestResult('❌ 认证接口测试失败', error);
    }
  },

  // 测试用户接口
  async testUser() {
    if (!wx.getStorageSync('token')) {
      this.addTestResult('❌ 请先登录');
      return;
    }

    this.addTestResult('开始测试用户接口...');
    
    try {
      // 测试获取用户信息
      const userInfo = await app.api.userApi.getUserInfo();
      this.addTestResult('✅ 获取用户信息成功', userInfo);

      // 测试获取学习统计
      const stats = await app.api.userApi.getStudyStats();
      this.addTestResult('✅ 获取学习统计成功', stats);

    } catch (error) {
      this.addTestResult('❌ 用户接口测试失败', error);
    }
  },

  // 测试题目接口
  async testQuestions() {
    if (!wx.getStorageSync('token')) {
      this.addTestResult('❌ 请先登录');
      return;
    }

    this.addTestResult('开始测试题目接口...');
    
    try {
      // 测试获取每日题目
      const dailyQuestions = await app.api.questionApi.getDailyQuestions();
      this.addTestResult('✅ 获取每日题目成功', dailyQuestions);

      // 测试获取错题
      const wrongQuestions = await app.api.questionApi.getWrongQuestions();
      this.addTestResult('✅ 获取错题成功', wrongQuestions);

    } catch (error) {
      this.addTestResult('❌ 题目接口测试失败', error);
    }
  },

  // 测试学习接口
  async testStudy() {
    if (!wx.getStorageSync('token')) {
      this.addTestResult('❌ 请先登录');
      return;
    }

    this.addTestResult('开始测试学习接口...');
    
    try {
      // 测试获取学习记录
      const records = await app.api.studyApi.getStudyRecords();
      this.addTestResult('✅ 获取学习记录成功', records);

      // 测试获取今日状态
      const todayStatus = await app.api.studyApi.getTodayStatus();
      this.addTestResult('✅ 获取今日状态成功', todayStatus);

      // 测试获取学习计划
      const plans = await app.api.studyApi.getStudyPlans();
      this.addTestResult('✅ 获取学习计划成功', plans);

    } catch (error) {
      this.addTestResult('❌ 学习接口测试失败', error);
    }
  },

  // 测试提交答案
  async testSubmitAnswer() {
    if (!wx.getStorageSync('token')) {
      this.addTestResult('❌ 请先登录');
      return;
    }

    this.addTestResult('开始测试提交答案...');
    
    try {
      // 测试提交答案
      const result = await app.api.questionApi.submitAnswer({
        questionId: '1',
        userAnswer: 'A',
        isCorrect: true,
        timeSpent: 30
      });
      this.addTestResult('✅ 提交答案成功', result);

    } catch (error) {
      this.addTestResult('❌ 提交答案失败', error);
    }
  },

  // 测试添加错题
  async testAddWrongQuestion() {
    if (!wx.getStorageSync('token')) {
      this.addTestResult('❌ 请先登录');
      return;
    }

    this.addTestResult('开始测试添加错题...');
    
    try {
      const result = await app.api.studyApi.addWrongQuestion({
        questionId: '1',
        userAnswer: 'B',
        correctAnswer: 'A',
        explanation: '这是一道测试题目的解析'
      });
      this.addTestResult('✅ 添加错题成功', result);

    } catch (error) {
      this.addTestResult('❌ 添加错题失败', error);
    }
  },

  // 运行所有测试
  async runAllTests() {
    this.setData({ loading: true, testResults: [] });
    
    await this.testAuth();
    await this.sleep(1000);
    
    await this.testUser();
    await this.sleep(1000);
    
    await this.testQuestions();
    await this.sleep(1000);
    
    await this.testStudy();
    await this.sleep(1000);
    
    await this.testSubmitAnswer();
    await this.sleep(1000);
    
    await this.testAddWrongQuestion();
    
    this.setData({ loading: false });
    this.addTestResult('🎉 所有测试完成');
  },

  // 清空测试结果
  clearResults() {
    this.setData({ testResults: [] });
  },

  // 添加测试结果
  addTestResult(message, data = null) {
    const results = [...this.data.testResults];
    const timestamp = new Date().toLocaleTimeString();
    
    results.push({
      id: Date.now(),
      timestamp,
      message,
      data: data ? JSON.stringify(data, null, 2) : null
    });
    
    this.setData({ testResults: results });
    console.log(`[${timestamp}] ${message}`, data);
  },

  // 查看详细数据
  viewDetail(e) {
    const { index } = e.currentTarget.dataset;
    const result = this.data.testResults[index];
    
    if (result.data) {
      wx.showModal({
        title: '详细数据',
        content: result.data,
        showCancel: false,
        confirmText: '知道了'
      });
    }
  },

  // 复制结果
  copyResult(e) {
    const { index } = e.currentTarget.dataset;
    const result = this.data.testResults[index];
    
    const content = `${result.timestamp} - ${result.message}\n${result.data || ''}`;
    
    wx.setClipboardData({
      data: content,
      success: () => {
        app.showSuccess('已复制到剪贴板');
      }
    });
  },

  // 工具函数：延时
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  // 退出登录
  logout() {
    wx.removeStorageSync('token');
    wx.removeStorageSync('userInfo');
    this.setData({
      token: '未登录',
      userInfo: null
    });
    this.addTestResult('已退出登录');
  }
});