// pages/study/study.js
const app = getApp();

Page({
  data: {
    studyStats: {
      todayStudyTime: 0,
      weekStudyTime: 0,
      totalStudyTime: 0,
      continuousDays: 0,
      completedQuestions: 0,
      accuracy: 0
    },
    studyPlan: null,
    recentRecords: [],
    knowledgeProgress: [],
    loading: true,
    currentStreak: 0,
    weeklyGoal: 300, // 每周目标学习时间（分钟）
    dailyGoal: 60,   // 每日目标学习时间（分钟）
    achievements: []
  },

  onLoad() {
    this.loadStudyData();
  },

  onShow() {
    this.loadStudyData();
  },

  // 加载学习数据 - 调用后端接口
  async loadStudyData() {
    this.setData({ loading: true });

    try {
      // 尝试调用后端接口
      if (app.api && app.api.studyApi && wx.getStorageSync('token')) {
        try {
          // 并行加载数据
          const [recordsResult, plansResult, todayResult] = await Promise.all([
            app.api.studyApi.getStudyRecords(),
            app.api.studyApi.getStudyPlans(),
            app.api.studyApi.getTodayStatus()
          ]);

          console.log('学习数据接口返回:', { recordsResult, plansResult, todayResult });

          // 处理学习记录
          const recentRecords = recordsResult?.data || [];
          
          // 处理学习计划
          const studyPlans = plansResult?.data || [];
          const currentPlan = studyPlans.find(plan => plan.status === 'active');
          
          // 处理今日状态
          const todayStatus = todayResult?.data || {};

          // 计算学习统计
          const studyStats = this.calculateStudyStats(recentRecords, todayStatus);

          this.setData({
            studyStats,
            studyPlan: currentPlan,
            recentRecords,
            knowledgeProgress: this.getMockStudyData().knowledgeProgress, // 暂时使用模拟数据
            achievements: this.getMockStudyData().achievements, // 暂时使用模拟数据
            loading: false
          });

          this.calculateStreak();
          return;
        } catch (apiError) {
          console.error('调用后端学习接口失败:', apiError);
        }
      }

      // 使用模拟数据作为后备
      const mockData = this.getMockStudyData();
      
      this.setData({
        studyStats: mockData.studyStats,
        studyPlan: mockData.studyPlan,
        recentRecords: mockData.recentRecords,
        knowledgeProgress: mockData.knowledgeProgress,
        achievements: mockData.achievements,
        loading: false
      });

      // 计算连续学习天数
      this.calculateStreak();

    } catch (error) {
      console.error('加载学习数据失败:', error);
      this.setData({ loading: false });
      app.showToast('加载数据失败');
    }
  },

  // 计算学习统计
  calculateStudyStats(records, todayStatus) {
    const totalStudyTime = records.reduce((sum, record) => sum + (record.studyTime || 0), 0);
    const totalQuestions = records.reduce((sum, record) => sum + (record.completedQuestions || 0), 0);
    const avgAccuracy = records.length > 0 
      ? Math.round(records.reduce((sum, record) => sum + (record.accuracy || 0), 0) / records.length)
      : 0;

    // 计算本周学习时间
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekRecords = records.filter(record => new Date(record.studyDate) > weekAgo);
    const weekStudyTime = weekRecords.reduce((sum, record) => sum + (record.studyTime || 0), 0);

    return {
      todayStudyTime: todayStatus.todayStudyTime || 0,
      weekStudyTime,
      totalStudyTime,
      continuousDays: this.calculateContinuousDays(records),
      completedQuestions: totalQuestions,
      accuracy: avgAccuracy
    };
  },

  // 计算连续学习天数
  calculateContinuousDays(records) {
    if (!records || records.length === 0) return 0;

    let continuousDays = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < records.length; i++) {
      const recordDate = new Date(records[i].studyDate);
      recordDate.setHours(0, 0, 0, 0);
      
      const diffDays = Math.floor((today - recordDate) / (1000 * 60 * 60 * 24));
      
      if (diffDays === i) {
        continuousDays++;
      } else {
        break;
      }
    }

    return continuousDays;
  },

  // 获取模拟学习数据
  getMockStudyData() {
    return {
      studyStats: {
        todayStudyTime: 45,
        weekStudyTime: 180,
        totalStudyTime: 1200,
        continuousDays: 7,
        completedQuestions: 156,
        accuracy: 78
      },
      studyPlan: {
        id: 1,
        name: '中级会计实务强化计划',
        progress: 65,
        totalDays: 90,
        completedDays: 58
      },
      recentRecords: [
        {
          id: 1,
          date: new Date().toISOString().split('T')[0],
          studyTime: 45,
          completedQuestions: 12,
          accuracy: 83,
          subjects: ['会计实务']
        },
        {
          id: 2,
          date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
          studyTime: 60,
          completedQuestions: 15,
          accuracy: 75,
          subjects: ['经济法']
        },
        {
          id: 3,
          date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
          studyTime: 30,
          completedQuestions: 8,
          accuracy: 88,
          subjects: ['财务管理']
        }
      ],
      knowledgeProgress: [
        {
          id: 1,
          name: '资产负债表',
          progress: 85,
          chapter: '第一章',
          difficulty: 'medium'
        },
        {
          id: 2,
          name: '利润表',
          progress: 92,
          chapter: '第二章',
          difficulty: 'easy'
        },
        {
          id: 3,
          name: '现金流量表',
          progress: 45,
          chapter: '第三章',
          difficulty: 'hard'
        }
      ],
      achievements: [
        {
          id: 1,
          name: '连续学习7天',
          description: '坚持每天学习，养成良好习惯',
          unlocked: true,
          date: new Date().toISOString().split('T')[0]
        },
        {
          id: 2,
          name: '答题达人',
          description: '累计完成100道题目',
          unlocked: true,
          date: new Date(Date.now() - 86400000).toISOString().split('T')[0]
        }
      ]
    };
  },

  // 计算连续学习天数
  calculateStreak() {
    const records = this.data.recentRecords;
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < records.length; i++) {
      const recordDate = new Date(records[i].date);
      const diffDays = Math.floor((today - recordDate) / (1000 * 60 * 60 * 24));
      
      if (diffDays === i) {
        streak++;
      } else {
        break;
      }
    }

    this.setData({ currentStreak: streak });
  },

  // 开始学习计划 - 使用模拟逻辑
  async startStudyPlan() {
    if (!this.data.studyPlan) {
      // 显示提示创建学习计划
      wx.showModal({
        title: '提示',
        content: '您还没有学习计划，是否创建新的学习计划？',
        success: (res) => {
          if (res.confirm) {
            app.showToast('学习计划功能开发中...');
          }
        }
      });
      return;
    }

    // 模拟开始学习
    wx.showModal({
      title: '开始学习',
      content: `准备开始今日的学习计划：${this.data.studyPlan.name}`,
      success: (res) => {
        if (res.confirm) {
          app.showToast('学习功能开发中...');
        }
      }
    });
  },

  // 查看学习统计 - 使用模拟数据
  async viewDetailStats() {
    const mockStats = {
      monthlyStats: {
        totalStudyTime: 1200,
        totalQuestions: 156,
        accuracy: 78,
        studyDays: 25,
        averageDaily: 48
      },
      weeklyTrend: [
        { week: '第1周', studyTime: 280, questions: 35 },
        { week: '第2周', studyTime: 320, questions: 42 },
        { week: '第3周', studyTime: 300, questions: 38 },
        { week: '第4周', studyTime: 300, questions: 41 }
      ]
    };

    wx.showModal({
      title: '学习统计',
      content: `本月学习统计：\n学习时长：${Math.floor(mockStats.monthlyStats.totalStudyTime / 60)}小时${mockStats.monthlyStats.totalStudyTime % 60}分钟\n完成题目：${mockStats.monthlyStats.totalQuestions}题\n正确率：${mockStats.monthlyStats.accuracy}%\n学习天数：${mockStats.monthlyStats.studyDays}天`,
      showCancel: false
    });
  },

  // 查看错题本
  viewWrongQuestions() {
    wx.navigateTo({
      url: '/pages/wrong/wrong'
    });
  },

  // 查看知识点进度
  viewKnowledgeProgress(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/knowledge-detail/knowledge-detail?id=${id}`
    });
  },

  // 设置学习提醒 - 使用模拟逻辑
  async setStudyReminder() {
    wx.showModal({
      title: '设置学习提醒',
      content: '是否开启每日20:00的学习提醒？',
      success: (res) => {
        if (res.confirm) {
          // 模拟设置成功
          app.showSuccess('学习提醒设置成功');
          // 实际项目中这里应该调用真实的API
        }
      }
    });
  },

  // 查看学习记录详情
  viewRecordDetail(e) {
    const { index } = e.currentTarget.dataset;
    const record = this.data.recentRecords[index];
    
    wx.navigateTo({
      url: `/pages/record-detail/record-detail?id=${record.id}`
    });
  },

  // 分享学习成果 - 使用新的API
  async shareStudyResult() {
    try {
      // 由于API中没有generateShareData方法，直接返回分享数据
      return {
        title: `我已连续学习${this.data.currentStreak}天，累计学习${Math.floor(this.data.studyStats.totalStudyTime / 60)}小时！`,
        path: '/pages/study/study',
        imageUrl: '/images/share-study.png'
      };
    } catch (error) {
      console.error('生成分享数据失败:', error);
      return {
        title: '一起来学习中级会计吧！',
        path: '/pages/study/study'
      };
    }
  },

  // 打卡学习 - 使用模拟逻辑
  async checkInStudy() {
    // 模拟打卡成功
    app.showSuccess('打卡成功！');
    
    // 更新本地数据
    const updatedStats = {
      ...this.data.studyStats,
      todayStudyTime: this.data.studyStats.todayStudyTime + 30,
      totalStudyTime: this.data.studyStats.totalStudyTime + 30
    };
    
    this.setData({
      studyStats: updatedStats
    });
  },

  // 查看成就
  viewAchievements() {
    wx.navigateTo({
      url: `/pages/achievements/achievements?data=${encodeURIComponent(JSON.stringify(this.data.achievements))}`
    });
  },

  // 导出学习报告 - 使用模拟数据
  async exportStudyReport() {
    try {
      app.showLoading('生成报告中...');
      
      // 模拟生成报告
      setTimeout(() => {
        const stats = this.data.studyStats;
        const summary = `学习报告摘要：\n本月学习时长：${Math.floor(stats.totalStudyTime / 60)}小时${stats.totalStudyTime % 60}分钟\n完成题目：${stats.completedQuestions}题\n正确率：${stats.accuracy}%\n连续学习：${stats.continuousDays}天`;
        
        app.hideLoading();
        wx.showModal({
          title: '学习报告',
          content: summary,
          showCancel: false,
          success: () => {
            app.showSuccess('报告已生成');
          }
        });
      }, 1000);
    } catch (error) {
      console.error('导出报告失败:', error);
      app.showToast('导出失败');
      app.hideLoading();
    }
  },

  // 语音播报学习统计 - 使用新的API
  async speakStats() {
    const stats = this.data.studyStats;
    const content = `您今天已学习${Math.floor(stats.todayStudyTime / 60)}小时${stats.todayStudyTime % 60}分钟，本周累计学习${Math.floor(stats.weekStudyTime / 60)}小时，已连续学习${this.data.currentStreak}天，总正确率${stats.accuracy}%。`;

    try {
      const ttsResult = await app.api.audioApi.textToSpeech(content, {
        voice: 'standard',
        speed: 1.0
      });

      if (ttsResult.data?.audioUrl) {
        const audioContext = wx.createInnerAudioContext();
        audioContext.src = ttsResult.data.audioUrl;
        audioContext.play();
      }
    } catch (error) {
      console.error('语音播报失败:', error);
      app.showToast('播报失败');
    }
  },

  // 设置学习目标 - 使用新的API
  async setStudyGoal() {
    wx.showModal({
      title: '设置学习目标',
      content: '请输入每日学习目标（分钟）',
      editable: true,
      placeholderText: this.data.dailyGoal.toString(),
      success: async (res) => {
        if (res.confirm && res.content) {
          const goal = parseInt(res.content);
          if (goal > 0) {
            // 模拟设置目标成功
            this.setData({ dailyGoal: goal });
            app.showSuccess('目标设置成功');
          }
        }
      }
    });
  },

  // 格式化时间显示
  formatTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}小时${mins}分钟`;
    } else {
      return `${mins}分钟`;
    }
  },

  // 获取进度百分比
  getProgressPercent(current, total) {
    if (total === 0) return 0;
    return Math.min(Math.round((current / total) * 100), 100);
  },

  // 分享
  onShareAppMessage() {
    return this.shareStudyResult();
  }
});