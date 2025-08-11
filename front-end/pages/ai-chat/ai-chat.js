// pages/ai-chat/ai-chat.js
const app = getApp();

Page({
  data: {
    messages: [],
    inputText: '',
    isTyping: false,
    quickQuestions: [
      '资产负债表怎么编制？',
      '借贷记账法的原理是什么？',
      '固定资产折旧方法有哪些？',
      '收入确认的条件是什么？',
      '现金流量表的编制方法？',
      '会计分录怎么写？'
    ],
    showQuickQuestions: true,
    chatHistory: [],
    currentSessionId: null
  },

  onLoad() {
    this.initChat();
    this.loadChatHistory();
  },

  // 初始化聊天
  initChat() {
    const welcomeMessage = {
      id: Date.now(),
      type: 'ai',
      content: '你好！我是AI中级会计助手 🤖\n\n我可以帮你解答中级会计相关的问题，包括：\n• 会计基础知识\n• 财务报表编制\n• 会计分录处理\n• 考试重点难点\n• 实务操作指导\n\n请随时向我提问！',
      timestamp: new Date().toLocaleTimeString(),
      avatar: '🤖'
    };

    this.setData({
      messages: [welcomeMessage],
      currentSessionId: Date.now().toString()
    });
  },

  // 加载聊天历史
  async loadChatHistory() {
    try {
      const history = wx.getStorageSync('chatHistory') || [];
      this.setData({ chatHistory: history.slice(0, 10) }); // 只显示最近10条
    } catch (error) {
      console.error('加载聊天历史失败:', error);
    }
  },

  // 保存聊天历史
  saveChatHistory() {
    try {
      const { messages, currentSessionId } = this.data;
      if (messages.length <= 1) return; // 只有欢迎消息时不保存

      const session = {
        id: currentSessionId,
        title: this.generateSessionTitle(),
        lastMessage: messages[messages.length - 1].content,
        timestamp: new Date().toLocaleString(),
        messageCount: messages.length - 1 // 不计算欢迎消息
      };

      let history = wx.getStorageSync('chatHistory') || [];
      
      // 更新或添加会话
      const existingIndex = history.findIndex(h => h.id === currentSessionId);
      if (existingIndex >= 0) {
        history[existingIndex] = session;
      } else {
        history.unshift(session);
      }

      // 只保留最近20个会话
      history = history.slice(0, 20);
      
      wx.setStorageSync('chatHistory', history);
      wx.setStorageSync(`chat_${currentSessionId}`, messages);
      
      this.setData({ chatHistory: history.slice(0, 10) });
    } catch (error) {
      console.error('保存聊天历史失败:', error);
    }
  },

  // 生成会话标题
  generateSessionTitle() {
    const { messages } = this.data;
    const userMessages = messages.filter(m => m.type === 'user');
    
    if (userMessages.length > 0) {
      const firstQuestion = userMessages[0].content;
      return firstQuestion.length > 15 ? firstQuestion.substring(0, 15) + '...' : firstQuestion;
    }
    
    return '新的对话';
  },

  // 输入框内容变化
  onInputChange(e) {
    this.setData({
      inputText: e.detail.value,
      showQuickQuestions: !e.detail.value.trim()
    });
  },

  // 发送消息
  async sendMessage(content = null) {
    const text = content || this.data.inputText.trim();
    if (!text) return;

    // 添加用户消息
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString(),
      avatar: '👤'
    };

    const messages = [...this.data.messages, userMessage];
    this.setData({
      messages,
      inputText: '',
      isTyping: true,
      showQuickQuestions: false
    });

    // 滚动到底部
    this.scrollToBottom();

    try {
      // 模拟AI回复
      const aiResponse = await this.getAIResponse(text);
      
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: aiResponse,
        timestamp: new Date().toLocaleTimeString(),
        avatar: '🤖'
      };

      this.setData({
        messages: [...messages, aiMessage],
        isTyping: false
      });

      // 保存聊天历史
      this.saveChatHistory();
      
      // 滚动到底部
      setTimeout(() => {
        this.scrollToBottom();
      }, 100);

    } catch (error) {
      console.error('获取AI回复失败:', error);
      
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: '抱歉，我现在无法回答您的问题。请稍后再试，或者您可以：\n\n• 检查网络连接\n• 重新表述问题\n• 查看相关学习资料\n\n如果问题持续存在，请联系客服。',
        timestamp: new Date().toLocaleTimeString(),
        avatar: '🤖',
        isError: true
      };

      this.setData({
        messages: [...messages, errorMessage],
        isTyping: false
      });
    }
  },

  // 获取AI回复（模拟）
  async getAIResponse(question) {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    // 根据问题关键词返回相应回答
    const responses = {
      '资产负债表': `资产负债表的编制要点：

📊 **基本结构**
• 资产 = 负债 + 所有者权益
• 左边列示资产项目
• 右边列示负债和所有者权益项目

📋 **编制步骤**
1. 收集期末各账户余额
2. 进行必要的调整分录
3. 按照报表格式填列各项目
4. 核对借贷平衡关系

⚠️ **注意事项**
• 应收账款要扣除坏账准备
• 固定资产要扣除累计折旧
• 存货按成本与可变现净值孰低计量

需要我详细解释某个具体项目的填列方法吗？`,

      '借贷记账法': `借贷记账法是复式记账法的一种：

🔄 **基本原理**
• 以"借"、"贷"作为记账符号
• 每笔经济业务都要在两个或两个以上账户中登记
• 借方发生额 = 贷方发生额

📝 **记账规则**
• 资产增加记借方，减少记贷方
• 负债增加记贷方，减少记借方  
• 所有者权益增加记贷方，减少记借方
• 收入增加记贷方，费用增加记借方

💡 **记忆口诀**
"借增贷减是资产，权益和它正相反
成本费用借方增，收入利润贷方增"

你想了解具体的会计分录编制方法吗？`,

      '固定资产': `固定资产折旧方法主要有：

📈 **年限平均法（直线法）**
• 公式：年折旧额 = (原价 - 残值) ÷ 使用年限
• 特点：每年折旧额相等
• 适用：使用情况较为均衡的固定资产

📊 **工作量法**
• 公式：单位工作量折旧额 = (原价 - 残值) ÷ 预计总工作量
• 特点：按实际工作量计提折旧
• 适用：主要以工作量为标准的固定资产

📉 **双倍余额递减法**
• 年折旧率 = 2 ÷ 预计使用年限 × 100%
• 特点：前期折旧多，后期折旧少
• 适用：技术进步较快的固定资产

🔢 **年数总和法**
• 年折旧率 = 尚可使用年数 ÷ 预计使用年数总和
• 特点：逐年递减折旧
• 适用：早期使用效率高的资产

需要我举个具体的计算例子吗？`,

      '收入确认': `收入确认需要满足以下条件：

✅ **确认条件（新收入准则）**
1. 识别与客户订立的合同
2. 识别合同中的单项履约义务
3. 确定交易价格
4. 将交易价格分摊至各单项履约义务
5. 履行履约义务时确认收入

⏰ **确认时点**
• 在某一时点履行：商品控制权转移时
• 在某一时段内履行：按履约进度确认

📋 **具体判断标准**
• 企业已将商品所有权上的主要风险和报酬转移
• 企业既没有保留通常与所有权相联系的继续管理权
• 收入的金额能够可靠地计量
• 相关的经济利益很可能流入企业
• 相关的已发生或将发生的成本能够可靠地计量

💡 **实务要点**
不同行业的收入确认时点可能不同，需要结合具体业务特点判断。

你想了解某个特定行业的收入确认吗？`,

      '现金流量表': `现金流量表编制方法：

💰 **三大活动分类**
1. **经营活动现金流量**
   - 销售商品、提供劳务收到的现金
   - 购买商品、接受劳务支付的现金
   - 支付给职工以及为职工支付的现金

2. **投资活动现金流量**
   - 收回投资收到的现金
   - 处置固定资产收到的现金
   - 购建固定资产支付的现金

3. **筹资活动现金流量**
   - 吸收投资收到的现金
   - 取得借款收到的现金
   - 偿还债务支付的现金

🔧 **编制方法**
• **直接法**：直接列示经营活动的现金收支项目
• **间接法**：以净利润为起点调整得出经营活动现金流量

📊 **编制要点**
• 现金包括库存现金、银行存款、其他货币资金
• 现金等价物：期限短、流动性强、易转换、价值变动风险小

需要我详细说明直接法和间接法的具体操作吗？`,

      '会计分录': `会计分录的编制方法：

📝 **基本格式**
借：科目名称    金额
    贷：科目名称    金额

🔍 **编制步骤**
1. 分析经济业务内容
2. 确定涉及的会计科目
3. 判断各科目的增减变化
4. 根据借贷记账法规则确定借贷方向
5. 确定借贷金额并检查是否平衡

💡 **常见分录类型**

**简单分录**（一借一贷）
借：银行存款    10000
    贷：主营业务收入    10000

**复合分录**（一借多贷或多借一贷）
借：原材料    8000
    应交税费-应交增值税(进项税额)    1040
    贷：银行存款    9040

⚠️ **注意事项**
• 借贷必须相等
• 科目使用要准确
• 金额计算要正确
• 摘要要简明扼要

你想练习某种具体业务的会计分录吗？`
    };

    // 查找匹配的关键词
    for (const [keyword, response] of Object.entries(responses)) {
      if (question.includes(keyword)) {
        return response;
      }
    }

    // 默认回复
    return `感谢您的提问！

关于"${question}"这个问题，我建议您：

📚 **学习建议**
• 查看相关章节的知识点详解
• 做一些相关的练习题加深理解
• 结合实际案例进行分析

🔍 **进一步学习**
您可以在学习模块中找到相关内容，或者：
• 重新表述问题，我会尽力帮助您
• 提供更具体的问题场景
• 询问某个具体的计算步骤

💡 **常见问题**
您也可以问我关于：
• 会计基础概念
• 财务报表编制
• 会计分录处理
• 考试重点难点

请随时向我提问！`;
  },

  // 点击快捷问题
  selectQuickQuestion(e) {
    const { question } = e.currentTarget.dataset;
    this.sendMessage(question);
  },

  // 滚动到底部
  scrollToBottom() {
    wx.createSelectorQuery()
      .select('#messageList')
      .boundingClientRect((rect) => {
        if (rect) {
          wx.pageScrollTo({
            scrollTop: rect.bottom,
            duration: 300
          });
        }
      })
      .exec();
  },

  // 复制消息
  copyMessage(e) {
    const { content } = e.currentTarget.dataset;
    wx.setClipboardData({
      data: content,
      success: () => {
        app.showSuccess('已复制到剪贴板');
      }
    });
  },

  // 重新发送
  resendMessage(e) {
    const { content } = e.currentTarget.dataset;
    this.sendMessage(content);
  },

  // 清空聊天
  clearChat() {
    wx.showModal({
      title: '清空聊天',
      content: '确定要清空当前聊天记录吗？',
      success: (res) => {
        if (res.confirm) {
          this.initChat();
          app.showSuccess('聊天记录已清空');
        }
      }
    });
  },

  // 查看聊天历史
  viewChatHistory(e) {
    const { id } = e.currentTarget.dataset;
    
    try {
      const messages = wx.getStorageSync(`chat_${id}`);
      if (messages && messages.length > 0) {
        this.setData({
          messages,
          currentSessionId: id,
          showQuickQuestions: false
        });
        
        setTimeout(() => {
          this.scrollToBottom();
        }, 100);
      }
    } catch (error) {
      console.error('加载聊天记录失败:', error);
      app.showToast('加载失败');
    }
  },

  // 删除聊天历史
  deleteChatHistory(e) {
    const { id } = e.currentTarget.dataset;
    
    wx.showModal({
      title: '删除聊天',
      content: '确定要删除这个聊天记录吗？',
      success: (res) => {
        if (res.confirm) {
          try {
            let history = wx.getStorageSync('chatHistory') || [];
            history = history.filter(h => h.id !== id);
            
            wx.setStorageSync('chatHistory', history);
            wx.removeStorageSync(`chat_${id}`);
            
            this.setData({ chatHistory: history.slice(0, 10) });
            app.showSuccess('删除成功');
          } catch (error) {
            console.error('删除失败:', error);
            app.showToast('删除失败');
          }
        }
      }
    });
  },

  // 新建聊天
  newChat() {
    this.initChat();
    this.setData({ showQuickQuestions: true });
  },

  // 分享
  onShareAppMessage() {
    return {
      title: 'AI中级会计助手 - 智能答疑，学习无忧',
      path: '/pages/ai-chat/ai-chat',
      imageUrl: '/images/share-ai.png'
    };
  }
});