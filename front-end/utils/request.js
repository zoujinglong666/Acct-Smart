// utils/request.js - 微信请求封装
const app = getApp();

class Request {
  constructor() {
    this.baseURL = 'http://localhost:8123/api'; // 配置你的API域名
    this.timeout = 10000;
    this.header = {
      'Content-Type': 'application/json'
    };
  }

  // 设置基础URL
  setBaseURL(url) {
    this.baseURL = url;
    return this;
  }

  // 设置请求头
  setHeader(header) {
    this.header = { ...this.header, ...header };
    return this;
  }

  // 设置token
  setToken(token) {
    this.header['Authorization'] = `Bearer ${token}`;
    return this;
  }

  // 通用请求方法
  request(options) {
    return new Promise((resolve, reject) => {
      // 获取token
      const token = wx.getStorageSync('token');
      if (token) {
        this.setToken(token);
      }

      // 完整URL
      const url = options.url.startsWith('http') ? options.url : `${this.baseURL}${options.url}`;

      wx.request({
        url,
        method: options.method || 'GET',
        data: options.data || {},
        header: { ...this.header, ...options.header },
        timeout: options.timeout || this.timeout,
        success: (res) => {
          // 统一处理响应
          if (res.statusCode === 200 || res.statusCode === 201) {
            if (res.data.success !== false) {
              resolve(res.data);
            } else {
              // 业务错误
              this.handleError(res.data);
              reject(res.data);
            }
          } else if (res.statusCode === 401) {
            // token过期，重新登录
            this.handleUnauthorized();
            reject(res.data);
          } else {
            // HTTP错误
            this.handleHttpError(res);
            reject(res);
          }
        },
        fail: (error) => {
          this.handleNetworkError(error);
          reject(error);
        }
      });
    });
  }

  // GET请求
  get(url, data = {}, options = {}) {
    return this.request({
      url,
      method: 'GET',
      data,
      ...options
    });
  }

  // POST请求
  post(url, data = {}, options = {}) {
    return this.request({
      url,
      method: 'POST',
      data,
      ...options
    });
  }

  // PUT请求
  put(url, data = {}, options = {}) {
    return this.request({
      url,
      method: 'PUT',
      data,
      ...options
    });
  }

  // DELETE请求
  delete(url, data = {}, options = {}) {
    return this.request({
      url,
      method: 'DELETE',
      data,
      ...options
    });
  }

  // 文件上传
  upload(url, filePath, name = 'file', formData = {}) {
    return new Promise((resolve, reject) => {
      const token = wx.getStorageSync('token');
      const header = { ...this.header };
      if (token) {
        header['Authorization'] = `Bearer ${token}`;
      }

      wx.uploadFile({
        url: url.startsWith('http') ? url : `${this.baseURL}${url}`,
        filePath,
        name,
        formData,
        header,
        success: (res) => {
          try {
            const data = JSON.parse(res.data);
            if ((res.statusCode === 200 || res.statusCode === 201) && data.success !== false) {
              resolve(data);
            } else {
              this.handleError(data);
              reject(data);
            }
          } catch (e) {
            reject({ message: '响应数据格式错误' });
          }
        },
        fail: (error) => {
          this.handleNetworkError(error);
          reject(error);
        }
      });
    });
  }

  // 处理业务错误
  handleError(error) {
    const message = error.message || '请求失败';
    wx.showToast({
      title: message,
      icon: 'none',
      duration: 2000
    });
  }

  // 处理HTTP错误
  handleHttpError(res) {
    let message = '网络错误';
    switch (res.statusCode) {
      case 400:
        message = '请求参数错误';
        break;
      case 401:
        message = '未授权访问';
        break;
      case 403:
        message = '禁止访问';
        break;
      case 404:
        message = '请求地址不存在';
        break;
      case 500:
        message = '服务器内部错误';
        break;
      default:
        message = `请求失败(${res.statusCode})`;
    }

    wx.showToast({
      title: message,
      icon: 'none',
      duration: 2000
    });
  }

  // 处理网络错误
  handleNetworkError(error) {
    let message = '网络连接失败';
    if (error.errMsg) {
      if (error.errMsg.includes('timeout')) {
        message = '请求超时';
      } else if (error.errMsg.includes('fail')) {
        message = '网络连接失败';
      }
    }

    wx.showToast({
      title: message,
      icon: 'none',
      duration: 2000
    });
  }

  // 处理未授权
  handleUnauthorized() {
    wx.removeStorageSync('token');
    wx.removeStorageSync('userInfo');
    
    wx.showModal({
      title: '登录过期',
      content: '登录状态已过期，请重新登录',
      showCancel: false,
      success: () => {
        wx.reLaunch({
          url: '/pages/login/login'
        });
      }
    });
  }
}

// 创建实例
const request = new Request();

// 导出
module.exports = request;