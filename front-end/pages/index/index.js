// pages/index/index.js
const app = getApp();

Page({
  data: {
    userInfo: null,
    studyStats: {
      totalStudyTime: 0,
      continuousStudyDays: 0,
      todayQuestions: 0,
      correctRate: 0
    },
    loading: true
  },

  onShow() {
    this.checkLogin();
  },

  // 检查登录状态
  checkLogin() {
    const token = wx.getStorageSync('token');
    const userInfo = wx.getStorageSync('userInfo');

    if (token && userInfo) {
      app.globalData.userInfo = userInfo;
      this.setData({ userInfo, loading: false });
      this.loadData();
    } else {
      this.setData({
        loading: false,
        userInfo: { nickname: '微信用户', avatar: '/images/default-avatar.png' },
        studyStats: {
          totalStudyTime: 0,
          continuousStudyDays: 0,
          todayQuestions: 0,
          correctRate: 0
        }
      });
    }
  },

  // 加载数据
  async loadData() {
    try {
      app.showLoading('加载中...');

      const stats = await this.loadStudyStats();

      this.setData({ studyStats: stats, loading: false });
    } catch (error) {
      console.error('加载数据失败:', error);
      app.showToast('加载失败，请重试');
      this.setData({ loading: false });
    } finally {
      app.hideLoading();
    }
  },

  // 加载学习统计（用户累计统计 + 今日答题数）
  async loadStudyStats() {
    const defaultStats = {
      totalStudyTime: 0,
      continuousStudyDays: 0,
      todayQuestions: 0,
      correctRate: 0
    };

    try {
      const stats = await app.api.userApi.getStudyStats();
      let todayQuestions = 0;

      try {
        const todayRes = await app.api.studyApi.getTodayStatus();
        if (todayRes && todayRes.data) {
          todayQuestions = todayRes.data.todayQuestions || 0;
        }
      } catch (e) {
        console.log('获取今日状态失败:', e);
      }

      return Object.assign(defaultStats, stats || {}, { todayQuestions });
    } catch (error) {
      console.error('加载学习统计失败:', error);
      return defaultStats;
    }
  },

  // 每日练习
  startDailyPractice() {
    wx.navigateTo({
      url: '/pages/practice/practice?mode=daily'
    });
  },

  // 章节练习
  startChapterPractice() {
    wx.navigateTo({
      url: '/pages/practice/practice?mode=chapter'
    });
  },

  // 错题本
  goWrongBook() {
    wx.switchTab({
      url: '/pages/wrong/wrong'
    });
  },

  // 头像加载失败处理
  onAvatarError() {
    this.setData({
      'userInfo.avatar': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iNDAiIGZpbGw9IiNFNUU3RUIiLz4KPGNpcmNsZSBjeD0iNDAiIGN5PSIzMiIgcj0iMTIiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTIwIDY4QzIwIDU2IDI4IDQ4IDQwIDQ4UzYwIDU2IDYwIDY4IiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPgo='
    });
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.checkLogin();
    wx.stopPullDownRefresh();
  },

  // 分享
  onShareAppMessage() {
    return {
      title: 'AI中级会计助手 - 智能学习，轻松过考',
      path: '/pages/index/index'
    };
  }
});
