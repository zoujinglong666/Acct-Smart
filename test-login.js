// 测试登录功能
const axios = require('axios');

async function testLogin() {
  try {
    console.log('🧪 开始测试微信登录...');
    
    const response = await axios.post('http://localhost:8123/api/auth/wechat-login', {
      code: 'test_code_123'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ 登录测试成功!');
    console.log('响应数据:', JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.log('❌ 登录测试失败:');
    if (error.response) {
      console.log('状态码:', error.response.status);
      console.log('错误信息:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.log('网络错误:', error.message);
    }
  }
}

testLogin();