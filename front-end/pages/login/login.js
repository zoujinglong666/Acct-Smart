// pages/login/login.js
const app = getApp();

Page({
  data: {
    loading: false
  },

  onLoad() {
    // 检查是否已经登录
    this.checkLoginStatus();
  },

  // 检查登录状态
  checkLoginStatus() {
    const token = wx.getStorageSync('token');
    const userInfo = wx.getStorageSync('userInfo');
    if (token && userInfo) {
      this.navigateBack();
    }
  },

  // 微信登录 - 调用后端真实接口
  async wechatLogin() {
    if (this.data.loading) return;
    this.setData({ loading: true });

    try {
      // 获取微信登录code
      const loginResult = await this.wxLogin();

      if (!loginResult || !loginResult.code) {
        app.showToast('获取微信登录凭证失败');
        this.setData({ loading: false });
        return;
      }

      await this.doLogin({ code: loginResult.code });
    } catch (error) {
      console.error('微信登录失败:', error);
      app.showToast('登录失败，请稍后重试');
      this.setData({ loading: false });
    }
  },

  // 游客模式（模拟登录，无需微信凭证即可体验完整闭环）
  async guestLogin() {
    if (this.data.loading) return;
    this.setData({ loading: true });

    try {
      await this.doLogin({ code: 'mock' });
    } catch (error) {
      console.error('游客登录失败:', error);
      app.showToast('登录失败，请稍后重试');
      this.setData({ loading: false });
    }
  },

  // 统一登录流程
  async doLogin(loginData) {
    const res = await app.api.authApi.wechatLogin(loginData);

    if (!res || res.code !== 0) {
      throw new Error('登录失败');
    }

    const token = res.data.token;
    const user = res.data.userInfo || res.data.user || {};

    // 保存登录信息
    wx.setStorageSync('token', token);
    wx.setStorageSync('userInfo', user);

    // 更新全局数据
    app.globalData.userInfo = user;

    app.showSuccess(res.message || '登录成功');
    setTimeout(() => {
      wx.switchTab({
        url: '/pages/index/index',
        fail: () => {
          wx.reLaunch({ url: '/pages/index/index' });
        }
      });
    }, 800);
  },

  // 微信登录
  wxLogin() {
    return new Promise((resolve) => {
      wx.login({
        success: (res) => {
          if (res.code) {
            resolve({ code: res.code });
          } else {
            resolve(null);
          }
        },
        fail: () => resolve(null)
      });
    });
  },

  // 返回上一页或首页
  navigateBack() {
    const pages = getCurrentPages();
    if (pages.length > 1) {
      wx.navigateBack();
    } else {
      wx.switchTab({ url: '/pages/index/index' });
    }
  }
});
