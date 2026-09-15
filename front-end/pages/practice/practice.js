// pages/practice/practice.js - 刷题闭环（每日练习 / 章节练习 / 错题重练）
const app = getApp();

Page({
  data: {
    mode: 'daily',            // daily | chapter | wrong
    loading: true,
    // 章节列表
    knowledgePoints: [],
    selectedKnowledgeId: '',
    // 答题
    questions: [],
    currentIndex: 0,
    currentQuestion: null,
    selectedAnswer: '',
    result: null,             // 本题结果 {isCorrect, correctAnswer, explanation}
    correctCount: 0,
    startTime: null,
    timeUsed: 0,
    finished: false
  },

  onLoad(options) {
    const mode = options.mode || 'daily';
    this.setData({ mode });

    if (options.mode === 'chapter') {
      this.loadKnowledgePoints();
    } else if (options.mode === 'wrong') {
      this.loadWrongQuestions();
    } else {
      this.loadDailyQuestions();
    }
  },

  onUnload() {
    if (this.timer) clearInterval(this.timer);
  },

  // ============ 题目加载 ============

  // 每日练习
  async loadDailyQuestions() {
    try {
      app.showLoading('加载题目中...');
      const questions = await app.api.questionApi.getDailyQuestions();
      this.prepareQuestions(questions || []);
    } catch (error) {
      console.error('加载每日题目失败:', error);
      app.showToast('加载题目失败');
      this.setData({ loading: false });
    } finally {
      app.hideLoading();
    }
  },

  // 章节练习 - 加载知识点列表
  async loadKnowledgePoints() {
    try {
      app.showLoading('加载章节中...');
      const list = await app.api.knowledgeApi.getKnowledgePoints();
      this.setData({
        knowledgePoints: list || [],
        loading: false
      });
    } catch (error) {
      console.error('加载章节失败:', error);
      app.showToast('加载章节失败');
      this.setData({ loading: false });
    } finally {
      app.hideLoading();
    }
  },

  // 选择章节并加载题目
  async selectKnowledge(e) {
    const { id, title } = e.currentTarget.dataset;
    this.setData({ selectedKnowledgeId: id, loading: true });

    try {
      app.showLoading('加载题目中...');
      const questions = await app.api.questionApi.getQuestionsByKnowledgePoint(id);
      if (!questions || questions.length === 0) {
        app.showToast('该章节暂无题目');
        this.setData({ loading: false });
        return;
      }
      this.prepareQuestions(questions);
    } catch (error) {
      console.error('加载章节题目失败:', error);
      app.showToast('加载题目失败');
      this.setData({ loading: false });
    } finally {
      app.hideLoading();
    }
  },

  // 错题重练 - 从错题本取题
  async loadWrongQuestions() {
    try {
      app.showLoading('加载错题中...');
      const res = await app.api.studyApi.getWrongQuestions();
      const wrongList = (res && res.data) || [];

      if (wrongList.length === 0) {
        app.showToast('暂无错题');
        this.setData({ loading: false });
        return;
      }

      // 组装题目（取错题里关联的题目信息）
      const questions = wrongList
        .filter(item => item.question)
        .map(item => ({
          id: item.questionId,
          content: item.question.content,
          type: item.question.type,
          options: this.parseOptions(item.question.options || []),
          difficulty: item.question.difficulty,
          explanation: item.explanation || item.question.explanation,
          correctAnswer: item.correctAnswer || item.question.correctAnswer
        }));

      this.prepareQuestions(questions);
    } catch (error) {
      console.error('加载错题失败:', error);
      app.showToast('加载错题失败');
      this.setData({ loading: false });
    } finally {
      app.hideLoading();
    }
  },

  // 统一题目格式
  prepareQuestions(questions) {
    const formatted = (questions || []).map(q => ({
      id: q.id,
      content: q.content,
      type: q.type,
      options: this.parseOptions(q.options || []),
      difficulty: q.difficulty,
      knowledgePoint: q.knowledgePoint || null
    }));

    this.setData({
      questions: formatted,
      currentIndex: 0,
      currentQuestion: formatted[0] || null,
      selectedAnswer: '',
      result: null,
      correctCount: 0,
      startTime: Date.now(),
      timeUsed: 0,
      finished: false,
      loading: false
    });

    this.startTimer();
  },

  // 解析选项：['A. 相关性', 'B. 重要性'] -> [{key:'A', text:'相关性'}]
  parseOptions(options) {
    if (!Array.isArray(options)) return [];

    const parsed = options.map(opt => {
      const match = String(opt).match(/^([A-Za-z])[.．、:：]\s*(.*)$/);
      if (match) {
        return { key: match[1], text: match[2] };
      }
      return { key: '', text: String(opt) };
    });

    // 判断题：无选项时给出 正确/错误
    if (parsed.length === 0) {
      return [
        { key: '正确', text: '正确' },
        { key: '错误', text: '错误' }
      ];
    }
    return parsed;
  },

  // ============ 答题交互 ============

  startTimer() {
    if (this.timer) clearInterval(this.timer);
    this.timer = setInterval(() => {
      this.setData({ timeUsed: Math.floor((Date.now() - this.data.startTime) / 1000) });
    }, 1000);
  },

  // 选择答案
  selectAnswer(e) {
    const { key } = e.currentTarget.dataset;
    this.setData({ selectedAnswer: key });
  },

  // 提交本题（后端判分并自动收错题）
  async submitAnswer() {
    const { currentQuestion, selectedAnswer } = this.data;

    if (!selectedAnswer) {
      app.showToast('请先选择答案');
      return;
    }

    try {
      const res = await app.api.questionApi.submitAnswer({
        questionId: String(currentQuestion.id),
        userAnswer: selectedAnswer,
        timeSpent: this.data.timeUsed
      });

      this.setData({
        result: {
          isCorrect: res.isCorrect,
          correctAnswer: res.correctAnswer || currentQuestion.correctAnswer,
          explanation: res.explanation || currentQuestion.explanation
        },
        correctCount: this.data.correctCount + (res.isCorrect ? 1 : 0)
      });
    } catch (error) {
      console.error('提交答案失败:', error);
      app.showToast('提交失败，请重试');
    }
  },

  // 下一题
  nextQuestion() {
    const { currentIndex, questions } = this.data;
    if (currentIndex < questions.length - 1) {
      this.setData({
        currentIndex: currentIndex + 1,
        currentQuestion: questions[currentIndex + 1],
        selectedAnswer: '',
        result: null,
        startTime: Date.now(),
        timeUsed: 0
      });
    } else {
      this.finishPractice();
    }
  },

  // 完成练习
  finishPractice() {
    if (this.timer) clearInterval(this.timer);

    this.setData({ finished: true });
  },

  // 返回章节选择（仅章节练习模式）
  async backToChapter() {
    if (this.timer) clearInterval(this.timer);
    this.setData({
      questions: [],
      currentIndex: 0,
      currentQuestion: null,
      selectedAnswer: '',
      result: null,
      correctCount: 0,
      finished: false,
      loading: true
    });
    await this.loadKnowledgePoints();
  },

  // 重新练习
  restart() {
    this.setData({
      currentIndex: 0,
      currentQuestion: this.data.questions[0],
      selectedAnswer: '',
      result: null,
      correctCount: 0,
      startTime: Date.now(),
      timeUsed: 0,
      finished: false
    });
    this.startTimer();
  },

  // 返回首页
  goHome() {
    wx.switchTab({ url: '/pages/index/index' });
  },

  // 去错题本
  goWrongBook() {
    wx.switchTab({ url: '/pages/wrong/wrong' });
  },

  // ============ 展示辅助 ============

  getTypeName(type) {
    return { single: '单选题', multiple: '多选题', judge: '判断题', calculation: '计算题' }[type] || '选择题';
  },

  getDifficultyText(difficulty) {
    return { easy: '简单', medium: '中等', hard: '困难' }[difficulty] || '中等';
  },

  getAnswerText(key) {
    if (!key) return '';
    const q = this.data.currentQuestion;
    if (!q) return key;
    const opt = q.options.find(o => o.key === key);
    return opt ? `${opt.key}. ${opt.text}` : key;
  },

  formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  },

  onShareAppMessage() {
    return {
      title: '我在AI中级会计助手刷题，快来一起学习吧！',
      path: '/pages/index/index'
    };
  }
});
