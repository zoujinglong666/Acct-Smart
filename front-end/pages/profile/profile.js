// pages/profile/profile.js
const app = getApp();

Page({
  data: {
    userInfo: null,
    studyStats: {
      totalStudyTime: 0,
      continuousStudyDays: 0,
      totalQuestions: 0,
      correctRate: 0,
      rank: 0,
      points: 0
    },
    achievements: [],
    settings: {
      studyReminder: true,
      soundEnabled: true,
      nightMode: false,
      autoSave: true
    },
    menuItems: [
      { id: 'study-record', name: '学习记录', icon: '📊', desc: '查看详细学习数据' },
      { id: 'wrong-book', name: '错题本', icon: '❌', desc: '复习错题，巩固知识' },
      { id: 'favorites', name: '收藏夹', icon: '⭐', desc: '收藏的题目和知识点' },
      { id: 'achievements', name: '成就中心', icon: '🏆', desc: '查看学习成就' },
      { id: 'study-plan', name: '学习计划', icon: '📅', desc: '制定和管理学习计划' },
      { id: 'settings', name: '设置', icon: '⚙️', desc: '个性化设置' }
    ],
    showLoginModal: false,
    loading: true
  },

  onLoad() {
    this.loadUserData();
  },

  onShow() {
    this.loadUserData();
  },

  // 加载用户数据
  async loadUserData() {
    this.setData({ loading: true });

    try {
      // 检查登录状态
      const token = wx.getStorageSync('token');
      const userInfo = wx.getStorageSync('userInfo');

      if (token && userInfo) {
        this.setData({ userInfo });
        await this.loadStudyStats();
        await this.loadAchievements();
        await this.loadSettings();
      } else {
        // 未登录状态，显示默认信息
        this.setData({
          userInfo: null,
          studyStats: {
            totalStudyTime: 0,
            continuousStudyDays: 0,
            totalQuestions: 0,
            correctRate: 0,
            rank: 0,
            points: 0
          }
        });
      }
    } catch (error) {
      console.error('加载用户数据失败:', error);
    } finally {
      this.setData({ loading: false });
    }
  },

  // 加载学习统计
  async loadStudyStats() {
    try {
      // 尝试调用后端接口
      if (app.api && app.api.userApi && wx.getStorageSync('token')) {
        try {
          const result = await app.api.userApi.getStudyStats();
          console.log('用户统计接口返回:', result);
          
          if (result) {
            this.setData({ studyStats: result });
            return;
          }
        } catch (apiError) {
          console.error('调用后端统计接口失败:', apiError);
        }
      }
      
      // 使用模拟数据作为后备
      const mockStats = {
        totalStudyTime: 1250, // 分钟
        continuousStudyDays: 15,
        totalQuestions: 486,
        correctRate: 78,
        rank: 156,
        points: 2340
      };

      this.setData({ studyStats: mockStats });
    } catch (error) {
      console.error('加载学习统计失败:', error);
    }
  },

  // 加载成就数据
  async loadAchievements() {
    try {
      // 模拟成就数据
      const mockAchievements = [
        { id: 1, name: '初学者', desc: '完成首次学习', icon: '🌱', unlocked: true },
        { id: 2, name: '坚持者', desc: '连续学习7天', icon: '💪', unlocked: true },
        { id: 3, name: '学霸', desc: '正确率达到90%', icon: '🎓', unlocked: false },
        { id: 4, name: '刷题王', desc: '完成1000道题', icon: '👑', unlocked: false }
      ];

      this.setData({ achievements: mockAchievements });
    } catch (error) {
      console.error('加载成就失败:', error);
    }
  },

  // 加载设置
  async loadSettings() {
    try {
      const settings = wx.getStorageSync('userSettings') || this.data.settings;
      this.setData({ settings });
    } catch (error) {
      console.error('加载设置失败:', error);
    }
  },

  // 点击头像或登录
  handleAvatarTap() {
    if (!this.data.userInfo) {
      this.showLogin();
    } else {
      this.editProfile();
    }
  },

  // 显示登录
  showLogin() {
    wx.navigateTo({
      url: '/pages/login/login'
    });
  },

  // 编辑个人资料
  editProfile() {
    wx.showModal({
      title: '编辑昵称',
      editable: true,
      placeholderText: this.data.userInfo.nickname || '',
      success: (res) => {
        if (res.confirm && res.content) {
          this.updateNickname(res.content);
        }
      }
    });
  },

  // 更新昵称
  async updateNickname(nickname) {
    try {
      // 尝试调用后端接口更新用户信息
      if (app.api && app.api.userApi && wx.getStorageSync('token')) {
        try {
          const result = await app.api.userApi.updateUserInfo({ nickname });
          console.log('更新用户信息接口返回:', result);
          
          if (result) {
            // 更新本地数据
            const userInfo = { ...this.data.userInfo, nickname };
            this.setData({ userInfo });
            wx.setStorageSync('userInfo', userInfo);
            app.globalData.userInfo = userInfo;
            app.showSuccess('昵称更新成功');
            return;
          }
        } catch (apiError) {
          console.error('调用后端更新接口失败:', apiError);
          app.showToast('网络异常，更新失败');
          return;
        }
      }
      
      // 如果没有后端接口，只更新本地数据
      const userInfo = { ...this.data.userInfo, nickname };
      this.setData({ userInfo });
      wx.setStorageSync('userInfo', userInfo);
      app.globalData.userInfo = userInfo;
      app.showSuccess('昵称更新成功');
    } catch (error) {
      console.error('更新昵称失败:', error);
      app.showToast('更新失败');
    }
  },

  // 菜单项点击
  handleMenuTap(e) {
    const { id } = e.currentTarget.dataset;
    
    switch (id) {
      case 'study-record':
        this.goToStudyRecord();
        break;
      case 'wrong-book':
        wx.switchTab({ url: '/pages/wrong/wrong' });
        break;
      case 'favorites':
        this.goToFavorites();
        break;
      case 'achievements':
        this.goToAchievements();
        break;
      case 'study-plan':
        this.goToStudyPlan();
        break;
      case 'settings':
        this.goToSettings();
        break;
    }
  },

  // 跳转到学习记录
  goToStudyRecord() {
    if (!this.data.userInfo) {
      this.showLogin();
      return;
    }
    
    wx.navigateTo({
      url: '/pages/study-record/study-record'
    });
  },

  // 跳转到收藏夹
  goToFavorites() {
    if (!this.data.userInfo) {
      this.showLogin();
      return;
    }
    
    wx.navigateTo({
      url: '/pages/favorites/favorites'
    });
  },

  // 跳转到成就中心
  goToAchievements() {
    wx.navigateTo({
      url: `/pages/achievements/achievements?data=${encodeURIComponent(JSON.stringify(this.data.achievements))}`
    });
  },

  // 跳转到学习计划
  goToStudyPlan() {
    if (!this.data.userInfo) {
      this.showLogin();
      return;
    }
    
    wx.switchTab({ url: '/pages/plan/plan' });
  },

  // 跳转到设置
  goToSettings() {
    wx.navigateTo({
      url: '/pages/settings/settings'
    });
  },

  // 签到
  async checkIn() {
    if (!this.data.userInfo) {
      this.showLogin();
      return;
    }

    try {
      // 检查今日是否已签到
      const today = new Date().toDateString();
      const lastCheckIn = wx.getStorageSync('lastCheckIn');
      
      if (lastCheckIn === today) {
        app.showToast('今日已签到');
        return;
      }

      // 模拟签到奖励
      const rewards = {
        points: Math.floor(Math.random() * 50) + 10,
        continuousDays: this.data.studyStats.continuousStudyDays + 1
      };

      // 更新数据
      const newStats = {
        ...this.data.studyStats,
        points: this.data.studyStats.points + rewards.points,
        continuousStudyDays: rewards.continuousDays
      };

      this.setData({ studyStats: newStats });
      wx.setStorageSync('lastCheckIn', today);

      wx.showModal({
        title: '签到成功',
        content: `获得${rewards.points}积分，连续签到${rewards.continuousDays}天！`,
        showCancel: false,
        confirmText: '太棒了'
      });
    } catch (error) {
      console.error('签到失败:', error);
      app.showToast('签到失败');
    }
  },

  // 查看排行榜
  viewRanking() {
    wx.navigateTo({
      url: '/pages/ranking/ranking'
    });
  },

  // 分享应用
  shareApp() {
    return {
      title: 'AI中级会计助手 - 智能学习，轻松过考',
      path: '/pages/index/index',
      imageUrl: '/images/share.png'
    };
  },

  // 联系客服
  contactService() {
    wx.showModal({
      title: '联系客服',
      content: '如有问题，请添加微信客服：AI-Accounting',
      showCancel: true,
      cancelText: '取消',
      confirmText: '复制微信号',
      success: (res) => {
        if (res.confirm) {
          wx.setClipboardData({
            data: 'AI-Accounting',
            success: () => {
              app.showSuccess('微信号已复制');
            }
          });
        }
      }
    });
  },

  // 关于我们
  aboutUs() {
    wx.navigateTo({
      url: '/pages/about/about'
    });
  },

  // 退出登录
  logout() {
    if (!this.data.userInfo) return;

    wx.showModal({
      title: '确认退出',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          // 清除登录信息
          wx.removeStorageSync('token');
          wx.removeStorageSync('userInfo');
          
          // 重置数据
          this.setData({
            userInfo: null,
            studyStats: {
              totalStudyTime: 0,
              continuousStudyDays: 0,
              totalQuestions: 0,
              correctRate: 0,
              rank: 0,
              points: 0
            },
            achievements: []
          });

          app.showSuccess('已退出登录');
        }
      }
    });
  },

  // 格式化学习时间
  formatStudyTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}小时${mins}分钟`;
    } else {
      return `${mins}分钟`;
    }
  },

  // 获取等级信息
  getLevelInfo() {
    const points = this.data.studyStats.points;
    let level = 1;
    let levelName = '初学者';
    
    if (points >= 5000) {
      level = 5;
      levelName = '大师';
    } else if (points >= 3000) {
      level = 4;
      levelName = '专家';
    } else if (points >= 1500) {
      level = 3;
      levelName = '熟练者';
    } else if (points >= 500) {
      level = 2;
      levelName = '进阶者';
    }
    
    return { level, levelName };
  },

  // 分享个人成就
  onShareAppMessage() {
    const { level, levelName } = this.getLevelInfo();
    const stats = this.data.studyStats;
    
    return {
      title: `我在AI中级会计助手已达到${levelName}等级，连续学习${stats.continuousStudyDays}天！`,
      path: '/pages/index/index',
      imageUrl: '/images/share-profile.png'
    };
  }
});