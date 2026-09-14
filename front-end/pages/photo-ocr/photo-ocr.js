// pages/photo-ocr/photo-ocr.js
const app = getApp();

Page({
  data: {
    step: 1, // 1: 拍照选择, 2: 识别结果, 3: AI解析
    batchMode: false,
    imageUrl: '',
    batchImages: [],
    recognizedText: '',
    parsedQuestion: null,
    analysis: '',
    loading: false,
    batchResults: []
  },

  onLoad(options) {
    // 初始化页面
  },

  // 切换批量模式
  toggleBatchMode() {
    this.setData({
      batchMode: !this.data.batchMode,
      imageUrl: '',
      batchImages: [],
      step: 1
    });
  },

  // 选择图片
  chooseImage() {
    const { batchMode } = this.data;
    
    wx.chooseImage({
      count: batchMode ? 9 : 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        if (batchMode) {
          this.setData({
            batchImages: [...this.data.batchImages, ...res.tempFilePaths]
          });
          
          if (this.data.batchImages.length > 0) {
            this.recognizeBatchImages();
          }
        } else {
          this.setData({
            imageUrl: res.tempFilePaths[0]
          });
        }
      },
      fail: (error) => {
        console.error('选择图片失败:', error);
        app.showToast('选择图片失败');
      }
    });
  },

  // 识别单张图片
  async recognizeImage() {
    if (!this.data.imageUrl) {
      app.showToast('请先选择图片');
      return;
    }

    this.setData({ loading: true });

    try {
      // 模拟OCR识别
      const recognizedText = this.simulateOCR();
      const parsedQuestion = this.parseQuestion(recognizedText);

      this.setData({
        recognizedText,
        parsedQuestion,
        step: 2,
        loading: false
      });

    } catch (error) {
      console.error('识别失败:', error);
      app.showToast('识别失败，请重试');
      this.setData({ loading: false });
    }
  },

  // 批量识别图片
  async recognizeBatchImages() {
    this.setData({ loading: true });

    try {
      const results = [];
      
      for (let i = 0; i < this.data.batchImages.length; i++) {
        try {
          const recognizedText = this.simulateOCR();
          const parsedQuestion = this.parseQuestion(recognizedText);
          
          results.push({
            success: true,
            data: {
              recognizedText,
              parsedQuestion
            }
          });
        } catch (error) {
          results.push({
            success: false,
            message: '识别失败'
          });
        }
      }

      this.setData({
        batchResults: results,
        step: 2,
        loading: false
      });

    } catch (error) {
      console.error('批量识别失败:', error);
      app.showToast('批量识别失败');
      this.setData({ loading: false });
    }
  },

  // 模拟OCR识别
  simulateOCR() {
    const mockTexts = [
      '下列关于资产负债表的说法，正确的是？\nA. 反映企业某一特定日期的财务状况\nB. 反映企业某一期间的经营成果\nC. 反映企业某一期间的现金流量\nD. 反映企业的盈利能力',
      '企业购入材料一批，货款10000元，增值税1300元，运费500元，装卸费200元，该批材料的入账价值为（）元\nA. 10000\nB. 10500\nC. 10700\nD. 11800',
      '下列各项中，应计入管理费用的是（）\nA. 生产车间管理人员工资\nB. 行政管理部门办公费\nC. 专设销售机构固定资产折旧费\nD. 生产工人工资'
    ];
    
    return mockTexts[Math.floor(Math.random() * mockTexts.length)];
  },

  // 解析题目
  parseQuestion(text) {
    const lines = text.split('\n').filter(line => line.trim());
    
    if (lines.length === 0) {
      return null;
    }

    const question = lines[0];
    const options = [];
    let type = 'choice';

    // 解析选项
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (/^[A-D]\./.test(line)) {
        const key = line.charAt(0);
        const text = line.substring(3).trim();
        options.push({ key, text });
      }
    }

    // 判断题目类型
    if (options.length === 0) {
      type = 'text';
    } else if (options.length === 2) {
      type = 'judge';
    }

    return {
      question,
      options,
      type
    };
  },

  // 编辑识别文本
  editRecognizedText(e) {
    const recognizedText = e.detail.value;
    const parsedQuestion = this.parseQuestion(recognizedText);
    
    this.setData({
      recognizedText,
      parsedQuestion
    });
  },

  // 生成AI解析
  async generateAnalysis() {
    if (!this.data.parsedQuestion) {
      app.showToast('请先识别题目');
      return;
    }

    this.setData({ loading: true });

    try {
      // 模拟AI分析
      const analysis = this.simulateAIAnalysis(this.data.parsedQuestion);
      
      this.setData({
        analysis,
        step: 3,
        loading: false
      });

    } catch (error) {
      console.error('生成解析失败:', error);
      app.showToast('生成解析失败');
      this.setData({ loading: false });
    }
  },

  // 模拟AI分析
  simulateAIAnalysis(question) {
    const analyses = [
      `这是一道关于财务报表的基础题目。\n\n**正确答案：A**\n\n**解析：**\n资产负债表是反映企业在某一特定日期（如月末、季末、年末）全部资产、负债和所有者权益情况的会计报表。它是静态报表，反映的是某一时点的财务状况。\n\n**知识点：**\n- 资产负债表的定义和作用\n- 财务报表的分类\n\n**学习建议：**\n需要掌握三大财务报表的区别和作用。`,
      
      `这是一道关于存货计价的计算题。\n\n**正确答案：C**\n\n**解析：**\n材料的入账价值 = 购买价款 + 运费 + 装卸费\n= 10000 + 500 + 200 = 10700元\n\n注意：增值税为进项税额，可以抵扣，不计入材料成本。\n\n**知识点：**\n- 存货的初始计量\n- 增值税的处理\n\n**学习建议：**\n要区分哪些费用计入存货成本，哪些不计入。`,
      
      `这是一道关于费用分类的题目。\n\n**正确答案：B**\n\n**解析：**\n行政管理部门办公费属于管理费用。\n\nA项：生产车间管理人员工资计入制造费用\nC项：专设销售机构固定资产折旧费计入销售费用\nD项：生产工人工资计入生产成本\n\n**知识点：**\n- 期间费用的分类\n- 管理费用的核算内容\n\n**学习建议：**\n要熟练掌握各项费用的归属和核算方法。`
    ];
    
    return analyses[Math.floor(Math.random() * analyses.length)];
  },

  // 查看批量结果详情
  viewBatchResult(e) {
    const { index } = e.currentTarget.dataset;
    const result = this.data.batchResults[index];
    
    if (result.success) {
      this.setData({
        recognizedText: result.data.recognizedText,
        parsedQuestion: result.data.parsedQuestion,
        batchMode: false,
        step: 2
      });
    } else {
      app.showToast(result.message);
    }
  },

  // 重新拍照
  retakePhoto() {
    this.setData({
      step: 1,
      imageUrl: '',
      batchImages: [],
      recognizedText: '',
      parsedQuestion: null,
      analysis: '',
      batchResults: []
    });
  },

  // 保存题目
  async saveQuestion() {
    if (!this.data.parsedQuestion) {
      app.showToast('没有可保存的题目');
      return;
    }

    try {
      // 保存到本地存储
      const savedQuestions = wx.getStorageSync('ocrQuestions') || [];
      const newQuestion = {
        id: Date.now(),
        question: this.data.parsedQuestion,
        recognizedText: this.data.recognizedText,
        analysis: this.data.analysis,
        imageUrl: this.data.imageUrl,
        createTime: new Date().toISOString()
      };
      
      savedQuestions.push(newQuestion);
      wx.setStorageSync('ocrQuestions', savedQuestions);
      
      app.showToast('保存成功');
      
      // 询问是否继续识别
      wx.showModal({
        title: '保存成功',
        content: '题目已保存，是否继续识别新题目？',
        confirmText: '继续',
        cancelText: '返回',
        success: (res) => {
          if (res.confirm) {
            this.retakePhoto();
          } else {
            wx.navigateBack();
          }
        }
      });

    } catch (error) {
      console.error('保存失败:', error);
      app.showToast('保存失败');
    }
  },

  // 分享
  onShareAppMessage() {
    return {
      title: 'AI拍照识题 - 智能识别，快速解答',
      path: '/pages/photo-ocr/photo-ocr',
      imageUrl: '/images/share-ocr.png'
    };
  }
});