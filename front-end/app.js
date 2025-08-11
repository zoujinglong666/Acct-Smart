// app.js
const apis = require('./apis/index');
const { getCurrentConfig } = require('./config/api.config');

App({
  onLaunch() {
    // 初始化API配置
    this.initApiConfig();
    
    // 检查登录状态
    this.checkLoginStatus();
    
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || [];
    logs.unshift(Date.now());
    wx.setStorageSync('logs', logs);
  },

  // 初始化API配置
  initApiConfig() {
    try {
      const config = getCurrentConfig();
      if (apis && apis.request && typeof apis.request.setBaseURL === 'function') {
        apis.request.setBaseURL(config.baseURL);
      }
      
      // 设置全局配置
      this.globalData.apiConfig = config;
      console.log('API配置初始化成功:', config);
    } catch (error) {
      console.error('API配置初始化失败:', error);
      // 设置默认配置
      this.globalData.apiConfig = {
        baseURL: 'http://10.9.17.94:8123/api',
        timeout: 10000,
        enableLog: true
      };
    }
  },

  // 检查登录状态
  async checkLoginStatus() {
    const token = wx.getStorageSync('token');
    const userInfo = wx.getStorageSync('userInfo');
    
    if (token && userInfo) {
      // 先使用本地存储的用户信息
      this.globalData.userInfo = userInfo;
      
      // 然后尝试更新用户信息
      try {
        if (apis && apis.userApi && typeof apis.userApi.getUserInfo === 'function') {
          const result = await apis.userApi.getUserInfo();
          if (result && result.data) {
            this.globalData.userInfo = result.data;
            wx.setStorageSync('userInfo', result.data);
          }
        }
      } catch (error) {
        console.log('获取用户信息失败，使用本地缓存:', error);
        // 不清除token，继续使用本地缓存的用户信息
      }
    }
  },

  // 全局数据
  globalData: {
    userInfo: null,
    apiConfig: null
  },

  // 便捷方法 - 显示加载
  showLoading(title = '加载中...') {
    wx.showLoading({
      title,
      mask: true
    });
  },

  // 便捷方法 - 隐藏加载
  hideLoading() {
    wx.hideLoading();
  },

  // 便捷方法 - 显示提示
  showToast(title, icon = 'none', duration = 2000) {
    wx.showToast({
      title,
      icon,
      duration
    });
  },

  // 便捷方法 - 显示成功提示
  showSuccess(title, duration = 2000) {
    this.showToast(title, 'success', duration);
  },

  // 便捷方法 - 显示错误提示
  showError(title, duration = 2000) {
    this.showToast(title, 'error', duration);
  },

  // API快捷访问
  get api() {
    return apis;
  }
});