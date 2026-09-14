// pages/profile/profile.js - 我的（用户信息 / 学习统计 / 错题本入口）
const app = getApp();

Page({
  data: {
    userInfo: null,
    studyStats: {
      totalStudyTime: 0,
      continuousStudyDays: 0,
      totalQuestions: 0,
      correctRate: 0
    },
    loading: true
  },

  onShow() {
    this.loadUserData();
  },

  // 加载用户数据
  async loadUserData() {
    this.setData({ loading: true });

    try {
      const token = wx.getStorageSync('token');
      const userInfo = wx.getStorageSync('userInfo');

      if (token && userInfo) {
        this.setData({ userInfo });
        await this.loadStudyStats();
      } else {
        this.setData({ userInfo: null });
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
      const stats = await app.api.userApi.getStudyStats();
      this.setData({ studyStats: stats || this.data.studyStats });
    } catch (error) {
      console.error('加载学习统计失败:', error);
    }
  },

  // 点击头像：未登录去登录，已登录改昵称
  handleAvatarTap() {
    if (!this.data.userInfo) {
      wx.navigateTo({ url: '/pages/login/login' });
    } else {
      this.editNickname();
    }
  },

  // 编辑昵称
  editNickname() {
    wx.showModal({
      title: '编辑昵称',
      editable: true,
      placeholderText: this.data.userInfo.nickname || '',
      success: async (res) => {
        if (!res.confirm || !res.content) return;

        try {
          await app.api.userApi.updateUserInfo({ nickname: res.content });
          const userInfo = { ...this.data.userInfo, nickname: res.content };
          this.setData({ userInfo });
          wx.setStorageSync('userInfo', userInfo);
          app.globalData.userInfo = userInfo;
          app.showSuccess('昵称更新成功');
        } catch (error) {
          console.error('更新昵称失败:', error);
          app.showToast('更新失败');
        }
      }
    });
  },

  // 错题本
  goWrongBook() {
    wx.switchTab({ url: '/pages/wrong/wrong' });
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
            success: () => app.showSuccess('微信号已复制')
          });
        }
      }
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
          wx.removeStorageSync('token');
          wx.removeStorageSync('userInfo');

          this.setData({
            userInfo: null,
            studyStats: {
              totalStudyTime: 0,
              continuousStudyDays: 0,
              totalQuestions: 0,
              correctRate: 0
            }
          });

          app.globalData.userInfo = null;
          app.showSuccess('已退出登录');
        }
      }
    });
  },

  // 格式化学习时间
  formatStudyTime(minutes) {
    const m = minutes || 0;
    const hours = Math.floor(m / 60);
    const mins = m % 60;
    return hours > 0 ? `${hours}小时${mins}分钟` : `${mins}分钟`;
  },

  // 分享
  onShareAppMessage() {
    return {
      title: 'AI中级会计助手 - 智能学习，轻松过考',
      path: '/pages/index/index'
    };
  }
});
