// pages/practice/practice.js
const app = getApp();

Page({
  data: {
    practiceMode: 'daily', // daily, chapter, exam, wrong
    questions: [],
    currentIndex: 0,
    currentQuestion: null,
    userAnswers: {},
    timeLeft: 0,
    timer: null,
    isSubmitted: false,
    showResult: false,
    practiceResult: null,
    loading: true,
    practiceTypes: [
      { id: 'daily', name: '每日练习', desc: '精选5道题目', icon: '📅' },
      { id: 'chapter', name: '章节练习', desc: '按章节分类练习', icon: '📚' },
      { id: 'exam', name: '模拟考试', desc: '完整考试体验', icon: '📝' },
      { id: 'wrong', name: '错题练习', desc: '针对性练习', icon: '❌' }
    ],
    chapters: [
      { id: 1, name: '第一章 总论', questionCount: 45 },
      { id: 2, name: '第二章 存货', questionCount: 38 },
      { id: 3, name: '第三章 固定资产', questionCount: 52 },
      { id: 4, name: '第四章 投资性房地产', questionCount: 28 },
      { id: 5, name: '第五章 长期股权投资', questionCount: 41 }
    ],
    selectedChapter: null,
    practiceSettings: {
      questionCount: 10,
      timeLimit: 30, // 分钟
      showAnswer: true,
      randomOrder: true
    }
  },

  onLoad(options) {
    if (options.mode) {
      this.setData({ practiceMode: options.mode });
    }
    if (options.sessionId) {
      this.loadPracticeSession(options.sessionId);
    } else {
      this.setData({ loading: false });
    }
  },

  onUnload() {
    this.clearTimer();
  },

  // 加载练习会话
  async loadPracticeSession(sessionId) {
    try {
      // 模拟加载练习会话数据
      const mockSession = {
        id: sessionId,
        questions: this.generateMockQuestions(10),
        timeLimit: 30,
        startTime: Date.now()
      };

      this.setData({
        questions: mockSession.questions,
        currentQuestion: mockSession.questions[0],
        timeLeft: mockSession.timeLimit * 60,
        loading: false
      });

      this.startTimer();
    } catch (error) {
      console.error('加载练习会话失败:', error);
      this.setData({ loading: false });
      app.showToast('加载失败');
    }
  },

  // 生成模拟题目
  generateMockQuestions(count) {
    const questions = [];
    const types = ['single', 'multiple'];
    const difficulties = ['easy', 'medium', 'hard'];
    
    for (let i = 0; i < count; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
      
      questions.push({
        id: i + 1,
        type: type,
        difficulty: difficulty,
        content: `这是第${i + 1}道${type === 'single' ? '单选' : '多选'}题目，难度为${difficulty}。请根据会计准则选择正确答案。`,
        options: [
          { key: 'A', text: '选项A：这是一个选项' },
          { key: 'B', text: '选项B：这是另一个选项' },
          { key: 'C', text: '选项C：这是第三个选项' },
          { key: 'D', text: '选项D：这是第四个选项' }
        ],
        correctAnswer: type === 'single' ? 'A' : ['A', 'B'],
        explanation: '这是题目的详细解析，解释了为什么选择这个答案。',
        chapter: `第${Math.floor(i / 2) + 1}章`,
        points: difficulty === 'easy' ? 2 : difficulty === 'medium' ? 3 : 5
      });
    }
    
    return questions;
  },

  // 选择练习类型
  selectPracticeType(e) {
    const { type } = e.currentTarget.dataset;
    this.setData({ practiceMode: type });

    if (type === 'daily') {
      this.startDailyPractice();
    } else if (type === 'chapter') {
      // 显示章节选择
      return;
    } else if (type === 'exam') {
      this.startExamPractice();
    } else if (type === 'wrong') {
      this.startWrongPractice();
    }
  },

  // 选择章节
  selectChapter(e) {
    const { chapter } = e.currentTarget.dataset;
    this.setData({ selectedChapter: chapter });
  },

  // 开始章节练习
  startChapterPractice() {
    if (!this.data.selectedChapter) {
      app.showToast('请选择章节');
      return;
    }

    const questions = this.generateMockQuestions(this.data.practiceSettings.questionCount);
    this.startPractice(questions);
  },

  // 开始每日练习
  startDailyPractice() {
    const questions = this.generateMockQuestions(5);
    this.startPractice(questions);
  },

  // 开始考试练习
  startExamPractice() {
    const questions = this.generateMockQuestions(20);
    this.startPractice(questions, 60); // 60分钟
  },

  // 开始错题练习
  startWrongPractice() {
    const questions = this.generateMockQuestions(8);
    this.startPractice(questions);
  },

  // 开始练习
  startPractice(questions, timeLimit = 30) {
    this.setData({
      questions: questions,
      currentIndex: 0,
      currentQuestion: questions[0],
      userAnswers: {},
      timeLeft: timeLimit * 60,
      isSubmitted: false,
      showResult: false
    });

    this.startTimer();
  },

  // 开始计时
  startTimer() {
    this.clearTimer();
    this.data.timer = setInterval(() => {
      const timeLeft = this.data.timeLeft - 1;
      this.setData({ timeLeft });

      if (timeLeft <= 0) {
        this.submitPractice();
      }
    }, 1000);
  },

  // 清除计时器
  clearTimer() {
    if (this.data.timer) {
      clearInterval(this.data.timer);
      this.setData({ timer: null });
    }
  },

  // 选择答案
  selectAnswer(e) {
    const { option } = e.currentTarget.dataset;
    const { currentIndex, currentQuestion, userAnswers } = this.data;

    if (currentQuestion.type === 'single') {
      userAnswers[currentIndex] = option;
    } else {
      // 多选题
      if (!userAnswers[currentIndex]) {
        userAnswers[currentIndex] = [];
      }
      const answers = userAnswers[currentIndex];
      const index = answers.indexOf(option);
      
      if (index > -1) {
        answers.splice(index, 1);
      } else {
        answers.push(option);
      }
    }

    this.setData({ userAnswers });
  },

  // 上一题
  prevQuestion() {
    const { currentIndex, questions } = this.data;
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      this.setData({
        currentIndex: newIndex,
        currentQuestion: questions[newIndex]
      });
    }
  },

  // 下一题
  nextQuestion() {
    const { currentIndex, questions } = this.data;
    if (currentIndex < questions.length - 1) {
      const newIndex = currentIndex + 1;
      this.setData({
        currentIndex: newIndex,
        currentQuestion: questions[newIndex]
      });
    }
  },

  // 跳转到指定题目
  goToQuestion(e) {
    const { index } = e.currentTarget.dataset;
    const { questions } = this.data;
    
    this.setData({
      currentIndex: index,
      currentQuestion: questions[index]
    });
  },

  // 提交练习
  async submitPractice() {
    this.clearTimer();

    const { questions, userAnswers } = this.data;
    let correctCount = 0;
    let totalPoints = 0;
    let earnedPoints = 0;

    // 计算结果
    questions.forEach((question, index) => {
      const userAnswer = userAnswers[index];
      const isCorrect = this.checkAnswer(question, userAnswer);
      
      totalPoints += question.points;
      if (isCorrect) {
        correctCount++;
        earnedPoints += question.points;
      }
    });

    const result = {
      totalQuestions: questions.length,
      correctCount: correctCount,
      wrongCount: questions.length - correctCount,
      accuracy: Math.round((correctCount / questions.length) * 100),
      totalPoints: totalPoints,
      earnedPoints: earnedPoints,
      timeUsed: (this.data.practiceSettings.timeLimit * 60) - this.data.timeLeft,
      completedAt: new Date().toISOString()
    };

    // 保存练习记录
    try {
      await this.savePracticeRecord(result);
    } catch (error) {
      console.error('保存练习记录失败:', error);
    }

    this.setData({
      isSubmitted: true,
      showResult: true,
      practiceResult: result
    });
  },

  // 检查答案是否正确
  checkAnswer(question, userAnswer) {
    if (!userAnswer) return false;

    if (question.type === 'single') {
      return userAnswer === question.correctAnswer;
    } else {
      // 多选题
      if (!Array.isArray(userAnswer) || !Array.isArray(question.correctAnswer)) {
        return false;
      }
      
      if (userAnswer.length !== question.correctAnswer.length) {
        return false;
      }
      
      return userAnswer.sort().join('') === question.correctAnswer.sort().join('');
    }
  },

  // 保存练习记录
  async savePracticeRecord(result) {
    try {
      // 模拟保存到本地存储
      const records = wx.getStorageSync('practiceRecords') || [];
      records.unshift({
        id: Date.now(),
        mode: this.data.practiceMode,
        result: result,
        questions: this.data.questions,
        userAnswers: this.data.userAnswers,
        createdAt: new Date().toISOString()
      });
      
      // 只保留最近50条记录
      if (records.length > 50) {
        records.splice(50);
      }
      
      wx.setStorageSync('practiceRecords', records);
      console.log('练习记录保存成功');
    } catch (error) {
      console.error('保存练习记录失败:', error);
    }
  },

  // 查看答案解析
  viewExplanation(e) {
    const { index } = e.currentTarget.dataset;
    const question = this.data.questions[index];
    
    wx.showModal({
      title: '答案解析',
      content: question.explanation,
      showCancel: false,
      confirmText: '知道了'
    });
  },

  // 重新练习
  restartPractice() {
    this.setData({
      currentIndex: 0,
      currentQuestion: this.data.questions[0],
      userAnswers: {},
      timeLeft: this.data.practiceSettings.timeLimit * 60,
      isSubmitted: false,
      showResult: false,
      practiceResult: null
    });

    this.startTimer();
  },

  // 返回首页
  goHome() {
    wx.switchTab({
      url: '/pages/index/index'
    });
  },

  // 查看详细结果
  viewDetailResult() {
    const { practiceResult, questions, userAnswers } = this.data;
    
    wx.navigateTo({
      url: `/pages/practice-result/practice-result?data=${encodeURIComponent(JSON.stringify({
        result: practiceResult,
        questions: questions,
        userAnswers: userAnswers
      }))}`
    });
  },

  // 格式化时间
  formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  },

  // 获取用户答案显示
  getUserAnswerText(questionIndex) {
    const userAnswer = this.data.userAnswers[questionIndex];
    if (!userAnswer) return '未作答';
    
    if (Array.isArray(userAnswer)) {
      return userAnswer.join(', ');
    }
    return userAnswer;
  },

  // 检查题目是否已作答
  isQuestionAnswered(questionIndex) {
    const userAnswer = this.data.userAnswers[questionIndex];
    if (Array.isArray(userAnswer)) {
      return userAnswer.length > 0;
    }
    return !!userAnswer;
  }
});