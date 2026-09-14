// pages/login/login.js
const app = getApp();

Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    hasUserInfo: false,
    userInfo: {},
    loading: false,
    loginMethods: [
      { id: 'wechat', name: '微信快速登录', icon: '💬', desc: '使用微信账号一键登录' },
    ],
    showPhoneLogin: false,
    phoneNumber: '',
    verifyCode: '',
    countdown: 0,
    countdownTimer: null
  },

  onLoad() {
    // 检查是否已经登录
    this.checkLoginStatus();
  },

  onUnload() {
    this.clearCountdown();
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

  // 选择登录方式
  selectLoginMethod(e) {
    const { method } = e.currentTarget.dataset;
    
    switch (method) {
      case 'wechat':
        this.wechatLogin();
        break;
    }
  },

  // 微信登录 - 调用后端真实接口
  async wechatLogin() {
    if (this.data.loading) return;
    this.setData({ loading: true });

    try {
      // 获取微信登录code
      const loginResult = await this.wxLogin();
      
      console.log('微信登录code:', loginResult);

      if (!loginResult || !loginResult.code) {
        app.showToast('获取微信登录凭证失败');
        this.setData({ loading: false });
        return;
      }

      // 调用后端登录接口
      const res = await app.api.authApi.wechatLogin({ code: loginResult.code });
      if (!res || res.code !== 0) {
        console.log('后端登录接口返回结果错误',res);
        throw Error('调用后台登录接口失败');
      }

      // 检查响应格式
      if (res.code === 0 ) {
        // 登录成功
        app.showSuccess(res.message || '登录成功');
        const token = res.data.token;
        const user = res.data.userInfo || res.data.user || {};



        // 保存登录信息
        wx.setStorageSync('token', token);
        wx.setStorageSync('userInfo', user);

        // 更新全局数据
        app.globalData.userInfo = user;

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
        this.setData({ loading: false });
      }
    } catch (error) {
      console.error('微信登录失败:', error);
      app.showToast('登录失败，请稍后重试');
      this.setData({ loading: false });
    }
  },

  // 获取用户信息
  getUserProfile() {
    return new Promise((resolve) => {
      wx.getUserProfile({
        desc: '用于完善用户资料',
        success: (res) => {
          resolve(res);
        },
        fail: (error) => {
          console.error('获取用户信息失败:', error);
          app.showToast('需要授权才能登录');
          resolve(null);
        }
      });
    });
  },

  // 微信登录
  wxLogin() {
    return new Promise((resolve) => {
      wx.login({
        success: (res) => {
          if (res.code) {
            resolve({ code: res.code });
          } else {
            console.error('获取登录凭证失败:', res.errMsg);
            resolve(null);
          }
        },
        fail: (error) => {
          console.error('微信登录失败:', error);
          resolve(null);
        }
      });
    });
  },

  // 手机号输入
  onPhoneInput(e) {
    this.setData({
      phoneNumber: e.detail.value
    });
  },

  // 验证码输入
  onCodeInput(e) {
    this.setData({
      verifyCode: e.detail.value
    });
  },

  // 发送验证码
  async sendVerifyCode() {
    const { phoneNumber, countdown } = this.data;
    
    if (countdown > 0) return;
    
    if (!phoneNumber) {
      app.showToast('请输入手机号');
      return;
    }
    
    if (!/^1[3-9]\d{9}$/.test(phoneNumber)) {
      app.showToast('请输入正确的手机号');
      return;
    }

    try {
      // 模拟发送验证码
      app.showSuccess('验证码已发送');
      
      // 开始倒计时
      this.startCountdown();
      
    } catch (error) {
      console.error('发送验证码失败:', error);
      app.showToast('发送失败，请重试');
    }
  },

  // 开始倒计时
  startCountdown() {
    this.setData({ countdown: 60 });
    
    this.data.countdownTimer = setInterval(() => {
      const countdown = this.data.countdown - 1;
      this.setData({ countdown });
      
      if (countdown <= 0) {
        this.clearCountdown();
      }
    }, 1000);
  },

  // 清除倒计时
  clearCountdown() {
    if (this.data.countdownTimer) {
      clearInterval(this.data.countdownTimer);
      this.setData({ 
        countdownTimer: null,
        countdown: 0 
      });
    }
  },

  // 手机号登录
  async phoneLogin() {
    const { phoneNumber, verifyCode, loading } = this.data;
    
    if (loading) return;
    
    if (!phoneNumber) {
      app.showToast('请输入手机号');
      return;
    }
    
    if (!verifyCode) {
      app.showToast('请输入验证码');
      return;
    }
    
    if (!/^1[3-9]\d{9}$/.test(phoneNumber)) {
      app.showToast('请输入正确的手机号');
      return;
    }

    this.setData({ loading: true });

    try {
      // 模拟验证码验证
      if (verifyCode !== '123456') {
        app.showToast('验证码错误');
        this.setData({ loading: false });
        return;
      }

      // 模拟登录成功
      const mockUserInfo = {
        id: Date.now(),
        nickname: `用户${phoneNumber.slice(-4)}`,
        avatar: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iNDAiIGZpbGw9IiNFNUU3RUIiLz4KPGNpcmNsZSBjeD0iNDAiIGN5PSIzMiIgcj0iMTIiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTIwIDY4QzIwIDU2IDI4IDQ4IDQwIDQ4UzYwIDU2IDYwIDY4IiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPgo=',
        phone: phoneNumber,
        loginTime: new Date().toISOString()
      };

      const mockToken = 'mock_token_phone_' + Date.now();

      // 保存登录信息
      wx.setStorageSync('token', mockToken);
      wx.setStorageSync('userInfo', mockUserInfo);
      
      // 更新全局数据
      app.globalData.userInfo = mockUserInfo;

      app.showSuccess('登录成功');
      
      setTimeout(() => {
        this.navigateBack();
      }, 1500);

    } catch (error) {
      console.error('手机号登录失败:', error);
      app.showToast('登录失败，请重试');
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



  // 用户协议
  viewUserAgreement() {
    wx.navigateTo({
      url: '/pages/agreement/agreement?type=user'
    });
  },

  // 隐私政策
  viewPrivacyPolicy() {
    wx.navigateTo({
      url: '/pages/agreement/agreement?type=privacy'
    });
  },

  // 获取手机号（微信授权）
  getPhoneNumber(e) {
    if (e.detail.errMsg === 'getPhoneNumber:ok') {
      // 这里可以获取到加密的手机号信息
      console.log('获取手机号成功:', e.detail);
      // 实际项目中需要发送到后端解密
      app.showSuccess('手机号获取成功');
    } else {
      console.log('获取手机号失败:', e.detail.errMsg);
    }
  },

  // 跳转到普通登录页面
  goToNormalLogin() {
    wx.navigateTo({
      url: '/pages/normal-login/normal-login'
    });
  }
});
