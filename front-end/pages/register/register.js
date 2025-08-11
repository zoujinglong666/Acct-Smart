// pages/register/register.js
const app = getApp();

Page({
  data: {
    username: '',
    password: '',
    confirmPassword: '',
    nickname: '',
    loading: false,
    showPassword: false,
    showConfirmPassword: false
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

  // 确认密码输入
  onConfirmPasswordInput(e) {
    this.setData({
      confirmPassword: e.detail.value
    });
  },

  // 昵称输入
  onNicknameInput(e) {
    this.setData({
      nickname: e.detail.value
    });
  },

  // 切换密码显示/隐藏
  togglePasswordVisibility() {
    this.setData({
      showPassword: !this.data.showPassword
    });
  },

  // 切换确认密码显示/隐藏
  toggleConfirmPasswordVisibility() {
    this.setData({
      showConfirmPassword: !this.data.showConfirmPassword
    });
  },

  // 验证输入
  validateInput() {
    const { username, password, confirmPassword } = this.data;
    
    if (!username.trim()) {
      app.showToast('请输入用户名');
      return false;
    }
    
    if (username.trim().length < 3) {
      app.showToast('用户名至少3个字符');
      return false;
    }
    
    if (!password.trim()) {
      app.showToast('请输入密码');
      return false;
    }
    
    if (password.trim().length < 6) {
      app.showToast('密码至少6个字符');
      return false;
    }
    
    if (!confirmPassword.trim()) {
      app.showToast('请确认密码');
      return false;
    }
    
    if (password !== confirmPassword) {
      app.showToast('两次输入的密码不一致');
      return false;
    }
    
    return true;
  },

  // 用户注册
  async register() {
    const { username, password, nickname, loading } = this.data;
    
    if (loading) return;
    
    if (!this.validateInput()) return;

    this.setData({ loading: true });

    try {
      // 调用后端注册接口
      const res = await app.api.authApi.register({ 
        username: username.trim(), 
        password: password.trim(),
        nickname: nickname.trim() || username.trim()
      });

      console.log('注册接口返回:', res);

      if (res && res.code === 0) {
        // 注册成功
        const token = res.data.token;
        const userInfo = res.data.userInfo;

        // 保存登录信息
        wx.setStorageSync('token', token);
        wx.setStorageSync('userInfo', userInfo);

        // 更新全局数据
        app.globalData.userInfo = userInfo;

        app.showSuccess(res.message || '注册成功');
        
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
        // 注册失败
        app.showToast(res.message || '注册失败');
      }
    } catch (error) {
      console.error('注册失败:', error);
      app.showToast('注册失败，请稍后重试');
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

  // 跳转到登录页面
  goToLogin() {
    wx.navigateTo({
      url: '/pages/normal-login/normal-login'
    });
  }
});