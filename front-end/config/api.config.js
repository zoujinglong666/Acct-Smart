// config/api.config.js - API配置
const config = {
  // 开发环境
  development: {
    baseURL: 'http://10.9.17.94:8123/api',
    timeout: 10000,
    enableLog: true
  },
  
  // 测试环境
  testing: {
    baseURL: 'https://test-api.your-domain.com/api',
    timeout: 15000,
    enableLog: true
  },
  
  // 生产环境
  production: {
    baseURL: 'https://api.your-domain.com/api',
    timeout: 10000,
    enableLog: false
  }
};

// 获取当前环境配置
function getCurrentConfig() {
  // 微信小程序环境判断
  // 可以根据实际需要修改判断逻辑
  try {
    const accountInfo = wx.getAccountInfoSync();
    const envVersion = accountInfo.miniProgram.envVersion;
    
    // envVersion: 'develop' | 'trial' | 'release'
    switch (envVersion) {
      case 'develop':
        return config.development;
      case 'trial':
        return config.testing;
      case 'release':
        return config.production;
      default:
        return config.development;
    }
  } catch (error) {
    console.warn('获取环境信息失败，使用开发环境配置', error);
    return config.development;
  }
}

module.exports = {
  config,
  getCurrentConfig
};