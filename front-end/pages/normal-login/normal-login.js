// pages/normal-login/normal-login.js
const app = getApp();

Page({
  data: {
    username: '',
    password: '',
    loading: false,
    showPassword: false
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
      // 已登录，返回上一页或首页
      this.navigateBack();
    }
  },

  // 用户名输入
  onUsernameInput(e) {
    this.setData({
      username: e.detail.value
    });
  },

  // 密码输入
  onPasswordInput(e) {
    this.setData({
      password: e.detail.value
    });
  },

  // 切换密码显示/隐藏
  togglePasswordVisibility() {
    this.setData({
      showPassword: !this.data.showPassword
    });
  },

  // 普通登录
  async normalLogin() {
    const { username, password, loading } = this.data;
    
    if (loading) return;
    
    if (!username.trim()) {
      app.showToast('请输入用户名');
      return;
    }
    
    if (!password.trim()) {
      app.showToast('请输入密码');
      return;
    }


    try {
      // 调用后端普通登录接口
      this.setData({ loading: true });
      const res = await app.api.authApi.normalLogin({
        username: username.trim(),
        password: password.trim()
      });
      console.log('res:', res)

      console.log('普通登录接口返回:', res);

      if (res && res.code === 0) {
        // 登录成功
        const token = res.data.token;
        const userInfo = res.data.userInfo;

        // 保存登录信息
        wx.setStorageSync('token', token);
        wx.setStorageSync('userInfo', userInfo);

        // 更新全局数据
        app.globalData.userInfo = userInfo;

        app.showSuccess(res.message || '登录成功');

        setTimeout(() => {
          // 强制跳转到首页
          wx.switchTab({
            url: '/pages/index/index',
            fail: () => {
              // 如果switchTab失败，使用reLaunch
              wx.reLaunch({
                url: '/pages/index/index'
              });
            }
          });
        }, 800);
      } else {
        // 登录失败
        app.showToast(res.message || '登录失败');
      }
    } catch (error) {
      console.error('普通登录失败:', error);
      app.showToast('登录失败，请稍后重试');
    } finally {
      this.setData({ loading: false });
    }
  },

  // 返回上一页或首页
  navigateBack() {
    const pages = getCurrentPages();
    if (pages.length > 1) {
      wx.navigateBack();
    } else {
      wx.switchTab({
        url: '/pages/index/index'
      });
    }
  },

  // 返回微信登录页面
  goToWechatLogin() {
    wx.navigateBack();
  },


  // 跳转到注册页面
  goToRegister() {
    wx.navigateTo({
      url: '/pages/register/register'
    });
  }
});