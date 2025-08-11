// examples/api-usage.js - API使用示例

const app = getApp();

// 示例页面
Page({
  data: {
    userInfo: null,
    questions: [],
    studyRecords: []
  },

  onLoad() {
    this.loadData();
  },

  // 加载数据示例
  async loadData() {
    try {
      // 显示加载
      app.showLoading('加载中...');

      // 1. 获取用户信息 - 超级简单！
      const userInfo = await app.api.userApi.getUserInfo();
      console.log('用户信息:', userInfo);

      // 2. 获取每日题目 - 一行代码搞定！
      const questions = await app.api.questionApi.getDailyQuestions(5);
      console.log('每日题目:', questions);

      // 3. 获取学习记录 - 轻松获取！
      const studyRecords = await app.api.studyApi.getStudyRecords({
        page: 1,
        limit: 10
      });
      console.log('学习记录:', studyRecords);

      // 更新页面数据
      this.setData({
        userInfo: userInfo.data,
        questions: questions.data,
        studyRecords: studyRecords.data
      });

      app.showSuccess('加载成功');

    } catch (error) {
      console.error('加载失败:', error);
      // 错误已经在request.js中自动处理了，会显示toast
    } finally {
      app.hideLoading();
    }
  },

  // 提交答案示例
  async submitAnswer(questionId, answer) {
    try {
      // 提交答案 - 简单直接！
      const result = await app.api.questionApi.submitAnswer({
        questionId,
        answer,
        timeSpent: 30
      });

      if (result.data.isCorrect) {
        app.showSuccess('回答正确！');
      } else {
        app.showError('回答错误');
        
        // 如果答错了，自动获取AI分析
        const analysis = await app.api.aiApi.analyzeWrongAnswer({
          questionId,
          userAnswer: answer,
          correctAnswer: result.data.correctAnswer
        });
        
        console.log('AI分析:', analysis.data.analysis);
      }

    } catch (error) {
      console.error('提交答案失败:', error);
    }
  },

  // OCR识别示例
  async recognizeImage() {
    try {
      // 选择图片
      const res = await this.chooseImage();
      const imagePath = res.tempFiles[0].tempFilePath;

      // 转换为base64
      const base64 = await this.imageToBase64(imagePath);

      // OCR识别 - 一步到位！
      const ocrResult = await app.api.ocrApi.recognizeImage(base64);
      
      console.log('识别结果:', ocrResult.data.originalText);
      app.showSuccess('识别成功');

      // 如果需要AI分析
      if (ocrResult.data.parsedQuestion) {
        const aiAnalysis = await app.api.aiApi.analyzeQuestion(
          ocrResult.data.parsedQuestion.question
        );
        console.log('AI分析:', aiAnalysis.data);
      }

    } catch (error) {
      console.error('识别失败:', error);
    }
  },

  // 学习数据统计示例
  async getStudyAnalytics() {
    try {
      // 获取学习分析 - 数据一目了然！
      const analytics = await app.api.analyticsApi.getStudyAnalytics({
        startDate: '2024-01-01',
        endDate: '2024-12-31'
      });

      console.log('学习分析:', analytics.data);

      // 获取知识点掌握情况
      const mastery = await app.api.analyticsApi.getKnowledgeMastery();
      console.log('知识点掌握:', mastery.data);

      // 获取学习趋势
      const trend = await app.api.analyticsApi.getStudyTrend(30);
      console.log('学习趋势:', trend.data);

    } catch (error) {
      console.error('获取分析数据失败:', error);
    }
  },

  // 错题本操作示例
  async manageWrongQuestions() {
    try {
      // 获取错题本 - 简单查询！
      const wrongQuestions = await app.api.studyApi.getWrongQuestions({
        page: 1,
        limit: 20,
        subject: '中级会计实务'
      });

      console.log('错题列表:', wrongQuestions.data);

      // 标记错题已掌握
      if (wrongQuestions.data.length > 0) {
        const firstWrongQuestion = wrongQuestions.data[0];
        await app.api.studyApi.markWrongQuestionMastered(firstWrongQuestion.id);
        app.showSuccess('已标记为掌握');
      }

    } catch (error) {
      console.error('错题本操作失败:', error);
    }
  },

  // 语音功能示例
  async useSpeechFeatures() {
    try {
      // 文字转语音 - 让题目开口说话！
      const ttsResult = await app.api.audioApi.textToSpeech(
        '这是一道关于会计基础的题目...',
        { voice: 'standard', speed: 1.0 }
      );

      // 播放语音
      if (ttsResult.data.audioUrl) {
        const audioContext = wx.createInnerAudioContext();
        audioContext.src = ttsResult.data.audioUrl;
        audioContext.play();
      }

    } catch (error) {
      console.error('语音功能失败:', error);
    }
  },

  // 工具函数
  chooseImage() {
    return new Promise((resolve, reject) => {
      wx.chooseMedia({
        count: 1,
        mediaType: ['image'],
        sourceType: ['album', 'camera'],
        success: resolve,
        fail: reject
      });
    });
  },

  imageToBase64(imagePath) {
    return new Promise((resolve, reject) => {
      wx.getFileSystemManager().readFile({
        filePath: imagePath,
        encoding: 'base64',
        success: (res) => resolve(res.data),
        fail: reject
      });
    });
  }
});

/*
=== API使用总结 ===

1. 用户相关：
   - app.api.userApi.getUserInfo() // 获取用户信息
   - app.api.userApi.updateUserInfo(data) // 更新用户信息
   - app.api.userApi.getStudyStats() // 获取学习统计

2. 题目相关：
   - app.api.questionApi.getDailyQuestions(5) // 获取每日题目
   - app.api.questionApi.submitAnswer(data) // 提交答案
   - app.api.questionApi.searchQuestions(params) // 搜索题目

3. OCR相关：
   - app.api.ocrApi.recognizeImage(base64) // 识别图片
   - app.api.ocrApi.batchRecognize(images) // 批量识别

4. AI相关：
   - app.api.aiApi.getExplanation(data) // 获取AI解释
   - app.api.aiApi.analyzeWrongAnswer(data) // 分析错误答案

5. 学习相关：
   - app.api.studyApi.getWrongQuestions(params) // 获取错题本
   - app.api.studyApi.addWrongQuestion(data) // 添加错题
   - app.api.studyApi.getStudyRecords(params) // 获取学习记录

6. 分析相关：
   - app.api.analyticsApi.getStudyAnalytics(params) // 获取学习分析
   - app.api.analyticsApi.getKnowledgeMastery() // 获取知识点掌握

7. 音频相关：
   - app.api.audioApi.textToSpeech(text, options) // 文字转语音
   - app.api.audioApi.speechToText(audioBase64) // 语音转文字

所有API都已经封装好错误处理，使用时只需要关注业务逻辑即可！
*/