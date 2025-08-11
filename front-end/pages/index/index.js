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
    todayTasks: [],
    recentKnowledge: [],
    loading: true
  },

  onLoad() {
    this.checkLogin();
  },

  onShow() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo
      });
      this.loadData();
    } else {
      // 如果没有用户信息，先显示默认数据，避免空白页面
      this.setData({
        loading: false,
        userInfo: {
          nickname: '微信用户',
          avatar: '/images/default-avatar.png'
        }
      });
    }
  },

  // 检查登录状态
  checkLogin() {
    const token = wx.getStorageSync('token');
    const userInfo = wx.getStorageSync('userInfo');
    
    if (token && userInfo) {
      // 有登录信息，设置全局数据
      app.globalData.userInfo = userInfo;
      this.setData({
        userInfo: userInfo,
        loading: false
      });
      this.loadData();
    } else {
      // 没有登录信息，显示默认状态，不强制跳转
      this.setData({
        loading: false,
        userInfo: {
          nickname: '微信用户',
          avatar: '/images/default-avatar.png'
        },
        // 显示默认的学习数据
        studyStats: {
          totalStudyTime: 0,
          continuousStudyDays: 0,
          todayQuestions: 0,
          correctRate: 0
        },
        todayTasks: [
          { id: 1, title: '开始学习之旅', type: 'knowledge', progress: 0 },
          { id: 2, title: '完成首次练习', type: 'practice', progress: 0 }
        ],
        recentKnowledge: []
      });
    }
  },

  // 加载数据
  async loadData() {
    try {
      app.showLoading('加载中...');
      
      // 并行加载数据
      const [statsRes, tasksRes, knowledgeRes] = await Promise.all([
        this.loadStudyStats(),
        this.loadTodayTasks(),
        this.loadRecentKnowledge()
      ]);
      
      this.setData({
        studyStats: statsRes,
        todayTasks: tasksRes,
        recentKnowledge: knowledgeRes,
        loading: false
      });
      
    } catch (error) {
      console.error('加载数据失败:', error);
      app.showToast('加载失败，请重试');
      this.setData({ loading: false });
    } finally {
      app.hideLoading();
    }
  },

  // 加载学习统计 - 使用新的API
  async loadStudyStats() {
    try {
      // 检查API是否可用和是否已登录
      if (!app.api || !app.api.userApi || !wx.getStorageSync('token')) {
        return this.getDefaultStudyStats();
      }
      const result = await app.api.userApi.getStudyStats();
      console.log('学习统计接口返回:', result);
      return result || this.getDefaultStudyStats();
    } catch (error) {
      console.error('加载学习统计失败:', error);
      return this.getDefaultStudyStats();
    }
  },

  // 加载今日任务 - 暂时使用默认数据
  async loadTodayTasks() {
    try {
      // 暂时返回默认任务，后续可以添加对应的后端接口
      return this.getDefaultTasks();
    } catch (error) {
      console.error('加载今日任务失败:', error);
      return this.getDefaultTasks();
    }
  },

  // 加载最近学习的知识点 - 暂时使用默认数据
  async loadRecentKnowledge() {
    try {
      // 暂时返回默认知识点，后续可以添加对应的后端接口
      return this.getDefaultKnowledge();
    } catch (error) {
      console.error('加载最近知识点失败:', error);
      return this.getDefaultKnowledge();
    }
  },

  // 获取默认学习统计
  getDefaultStudyStats() {
    return {
      totalStudyTime: 0,
      continuousStudyDays: 0,
      todayQuestions: 0,
      correctRate: 0
    };
  },

  // 获取默认任务
  getDefaultTasks() {
    return [
      { id: 1, title: '学习会计基础', type: 'knowledge', progress: 0 },
      { id: 2, title: '完成练习题', type: 'practice', progress: 0 },
      { id: 3, title: '复习错题', type: 'review', progress: 0 }
    ];
  },

  // 获取默认知识点
  getDefaultKnowledge() {
    return [
      { id: 1, title: '资产负债表', chapter: '第一章', difficulty: 'medium' },
      { id: 2, title: '利润表', chapter: '第二章', difficulty: 'easy' },
      { id: 3, title: '现金流量表', chapter: '第三章', difficulty: 'hard' }
    ];
  },

  // 开始学习
  startStudy() {
    wx.navigateTo({
      url: '/pages/study/study'
    });
  },

  // 开始练习
  startPractice() {
    wx.navigateTo({
      url: '/pages/practice/practice'
    });
  },

  // 查看学习计划
  viewPlan() {
    wx.navigateTo({
      url: '/pages/plan/plan'
    });
  },

  // AI聊天
  aiChat() {
    wx.navigateTo({
      url: '/pages/ai-chat/ai-chat'
    });
  },

  // 签到功能
  signIn() {
    wx.showToast({
      title: '签到成功！',
      icon: 'success',
      duration: 2000
    });
  },

  // 头像加载失败处理
  onAvatarError() {
    this.setData({
      'userInfo.avatar': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iNDAiIGZpbGw9IiNFNUU3RUIiLz4KPGNpcmNsZSBjeD0iNDAiIGN5PSIzMiIgcj0iMTIiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTIwIDY4QzIwIDU2IDI4IDQ4IDQwIDQ4UzYwIDU2IDYwIDY4IiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPgo='
    });
  },

  // 查看知识点详情
  viewKnowledge(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/knowledge/knowledge?id=${id}`
    });
  },

  // 完成任务
  completeTask(e) {
    const { id, type } = e.currentTarget.dataset;
    
    switch (type) {
      case 'knowledge':
        wx.navigateTo({
          url: '/pages/study/study'
        });
        break;
      case 'practice':
        wx.navigateTo({
          url: '/pages/practice/practice'
        });
        break;
      case 'review':
        wx.navigateTo({
          url: '/pages/wrong/wrong'
        });
        break;
    }
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.loadData().finally(() => {
      wx.stopPullDownRefresh();
    });
  },

  // 分享
  onShareAppMessage() {
    return {
      title: 'AI中级会计助手 - 智能学习，轻松过考',
      path: '/pages/index/index',
      imageUrl: '/images/share.png'
    };
  }
});