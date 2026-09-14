// pages/daily-questions/daily-questions.js
const app = getApp();

Page({
  data: {
    questions: [],
    currentIndex: 0,
    selectedAnswer: '',
    showResult: false,
    showExplanation: false,
    score: 0,
    answers: [],
    loading: true,
    timeLeft: 300, // 5分钟
    timer: null,
    startTime: null,
    totalTime: 300
  },

  onLoad() {
    // 将formatTime方法添加到data中，供WXML调用
    this.setData({
      formatTime: this.formatTime
    });
    this.loadQuestions();
  },

  onUnload() {
    // 清除定时器
    if (this.data.timer) {
      clearInterval(this.data.timer);
    }
  },

  // 格式化时间显示
  formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  },

  // 加载题目
  async loadQuestions() {
    try {
      app.showLoading('加载题目中...');
      
      // 检查是否有API和token
      if (app.api && app.api.questionApi && wx.getStorageSync('token')) {
        try {
          const res = await app.api.questionApi.getDailyQuestions();
          console.log('后端每日题目接口返回:', res);
          
          if (res && res.length > 0) {
            this.setData({
              questions: res.map((item) => ({
                id: item.id,
                title: item.content,
                options: item.options || ['A. 选项A', 'B. 选项B', 'C. 选项C', 'D. 选项D'],
                correctAnswer: item.correctAnswer,
                explanation: item.explanation,
                difficulty: item.difficulty,
                chapter: item.chapter || '未分类'
              })),
              loading: false,
              timeLeft: this.data.totalTime,
              startTime: Date.now()
            });
            this.startTimer();
            return;
          }
        } catch (apiError) {
          console.error('调用后端接口失败:', apiError);
          app.showToast('网络异常，使用离线题目');
        }
      }
      
      // 使用默认题目
      this.loadDefaultQuestions();
      
    } catch (error) {
      console.error('加载题目失败:', error);
      app.showToast('加载失败，使用离线题目');
      this.loadDefaultQuestions();
    } finally {
      app.hideLoading();
    }
  },

  // 加载默认题目
  loadDefaultQuestions() {
    const defaultQuestions = [
      {
        id: 1,
        title: '下列各项中，属于会计信息质量要求的是（）',
        options: ['A. 实质重于形式', 'B. 权责发生制', 'C. 历史成本', 'D. 货币计量'],
        correctAnswer: 'A',
        explanation: '实质重于形式是会计信息质量要求之一，要求企业应当按照交易或事项的经济实质进行会计确认、计量和报告。',
        difficulty: 'easy',
        chapter: '第一章 会计概述'
      },
      {
        id: 2,
        title: '企业购入材料一批，货款10000元，增值税1300元，运费500元，装卸费200元，该批材料的入账价值为（）元',
        options: ['A. 10000', 'B. 10500', 'C. 10700', 'D. 11800'],
        correctAnswer: 'C',
        explanation: '材料的入账价值=购买价款+运费+装卸费=10000+500+200=10700元。增值税为进项税额，可以抵扣，不计入材料成本。',
        difficulty: 'medium',
        chapter: '第二章 资产'
      },
      {
        id: 3,
        title: '下列各项中，应计入管理费用的是（）',
        options: ['A. 生产车间管理人员工资', 'B. 行政管理部门办公费', 'C. 专设销售机构固定资产折旧费', 'D. 生产工人工资'],
        correctAnswer: 'B',
        explanation: '行政管理部门办公费属于管理费用。A项计入制造费用，C项计入销售费用，D项计入生产成本。',
        difficulty: 'medium',
        chapter: '第三章 负债'
      },
      {
        id: 4,
        title: '某企业年初未分配利润为借方余额20000元，本年实现净利润80000元，提取盈余公积8000元，向投资者分配利润30000元，则年末未分配利润为（）元',
        options: ['A. 22000', 'B. 42000', 'C. 50000', 'D. 88000'],
        correctAnswer: 'A',
        explanation: '年末未分配利润=年初未分配利润+本年净利润-提取盈余公积-分配利润=-20000+80000-8000-30000=22000元',
        difficulty: 'hard',
        chapter: '第四章 所有者权益'
      },
      {
        id: 5,
        title: '下列各项中，不影响营业利润的是（）',
        options: ['A. 资产减值损失', 'B. 公允价值变动收益', 'C. 投资收益', 'D. 营业外收入'],
        correctAnswer: 'D',
        explanation: '营业外收入不影响营业利润，它影响的是利润总额。营业利润=营业收入-营业成本-税金及附加-销售费用-管理费用-财务费用-资产减值损失+公允价值变动收益+投资收益',
        difficulty: 'medium',
        chapter: '第五章 收入、费用和利润'
      }
    ];

    this.setData({
      questions: defaultQuestions,
      loading: false,
      timeLeft: this.data.totalTime,
      startTime: Date.now()
    });

    this.startTimer();
  },

  // 开始计时
  startTimer() {
    this.data.timer = setInterval(() => {
      const timeLeft = this.data.timeLeft - 1;
      this.setData({ timeLeft });

      if (timeLeft <= 0) {
        clearInterval(this.data.timer);
        this.timeUp();
      }
    }, 1000);
  },

  // 时间到
  timeUp() {
    wx.showModal({
      title: '时间到',
      content: '答题时间已结束，系统将自动提交',
      showCancel: false,
      success: () => {
        this.showFinalResult();
      }
    });
  },

  // 选择答案
  selectAnswer(e) {
    const { answer } = e.currentTarget.dataset;
    this.setData({
      selectedAnswer: answer
    });
  },

  // 提交答案
  async submitAnswer() {
    if (!this.data.selectedAnswer) {
      app.showToast('请选择答案');
      return;
    }

    const currentQuestion = this.data.questions[this.data.currentIndex];
    const isCorrect = this.data.selectedAnswer === currentQuestion.correctAnswer;
    const timeSpent = Math.floor((Date.now() - this.data.startTime) / 1000);
    
    // 记录答案
    const newAnswers = [...this.data.answers];
    newAnswers[this.data.currentIndex] = {
      questionId: currentQuestion.id,
      selectedAnswer: this.data.selectedAnswer,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect: isCorrect,
      explanation: currentQuestion.explanation
    };

    this.setData({
      answers: newAnswers,
      score: isCorrect ? this.data.score + 1 : this.data.score,
      showResult: true
    });

    // 提交答案到后端
    try {
      if (app.api && app.api.questionApi && wx.getStorageSync('token')) {
        await app.api.questionApi.submitAnswer({
          questionId: currentQuestion.id.toString(),
          userAnswer: this.data.selectedAnswer,
          isCorrect: isCorrect,
          timeSpent: timeSpent
        });
        console.log('答案提交成功');
      }
    } catch (error) {
      console.error('提交答案到后端失败:', error);
      // 不影响前端流程，继续执行
    }

    // 如果答错了，自动添加到错题本
    if (!isCorrect) {
      this.addToWrongBook(currentQuestion);
    }
  },

  // 添加到错题本
  async addToWrongBook(question) {
    try {
      // 尝试调用后端接口添加错题
      if (app.api && app.api.studyApi && wx.getStorageSync('token')) {
        try {
          await app.api.studyApi.addWrongQuestion({
            questionId: question.id.toString(),
            userAnswer: this.data.selectedAnswer,
            correctAnswer: question.correctAnswer,
            explanation: question.explanation
          });
          console.log('错题已添加到后端');
          return;
        } catch (apiError) {
          console.error('调用后端添加错题接口失败:', apiError);
        }
      }

      // 后备方案：保存到本地存储
      const wrongQuestions = wx.getStorageSync('wrongQuestions') || [];
      const wrongQuestion = {
        id: Date.now(),
        questionId: question.id,
        question: {
          content: question.title,
          options: question.options,
          correctAnswer: question.correctAnswer,
          explanation: question.explanation
        },
        userAnswer: this.data.selectedAnswer,
        wrongCount: 1,
        isSolved: false,
        difficulty: question.difficulty,
        chapter: question.chapter,
        createTime: new Date().toISOString(),
        lastWrongTime: new Date().toISOString()
      };
      
      wrongQuestions.push(wrongQuestion);
      wx.setStorageSync('wrongQuestions', wrongQuestions);
      console.log('错题已保存到本地');
    } catch (error) {
      console.error('加入错题本失败:', error);
    }
  },

  // 查看解析
  toggleExplanation() {
    this.setData({
      showExplanation: !this.data.showExplanation
    });
  },

  // 下一题
  nextQuestion() {
    if (this.data.currentIndex < this.data.questions.length - 1) {
      this.setData({
        currentIndex: this.data.currentIndex + 1,
        selectedAnswer: '',
        showResult: false,
        showExplanation: false
      });
    } else {
      // 完成所有题目
      this.showFinalResult();
    }
  },

  // 上一题
  prevQuestion() {
    if (this.data.currentIndex > 0) {
      this.setData({
        currentIndex: this.data.currentIndex - 1,
        selectedAnswer: this.data.answers[this.data.currentIndex - 1]?.selectedAnswer || '',
        showResult: !!this.data.answers[this.data.currentIndex - 1],
        showExplanation: false
      });
    }
  },

  // 显示最终结果
  async showFinalResult() {
    // 清除定时器
    if (this.data.timer) {
      clearInterval(this.data.timer);
    }

    const { score, questions, totalTime, timeLeft } = this.data;
    const percentage = Math.round((score / questions.length) * 100);
    const usedTime = totalTime - timeLeft;
    
    let level = '';
    if (percentage >= 90) level = '优秀';
    else if (percentage >= 80) level = '良好';
    else if (percentage >= 70) level = '中等';
    else if (percentage >= 60) level = '及格';
    else level = '不及格';

    // 保存学习记录
    try {
      const studyRecord = {
        type: 'daily_questions',
        date: new Date().toISOString(),
        score: score,
        total: questions.length,
        accuracy: percentage,
        duration: usedTime,
        level: level
      };
      
      const studyRecords = wx.getStorageSync('studyRecords') || [];
      studyRecords.push(studyRecord);
      wx.setStorageSync('studyRecords', studyRecords);
    } catch (error) {
      console.error('保存学习记录失败:', error);
    }

    wx.showModal({
      title: '答题完成',
      content: `得分：${score}/${questions.length} (${percentage}%)\n等级：${level}\n用时：${this.formatTime(usedTime)}`,
      confirmText: '查看解析',
      cancelText: '返回首页',
      success: (res) => {
        if (res.confirm) {
          this.viewAnalysis();
        } else {
          wx.switchTab({
            url: '/pages/index/index'
          });
        }
      }
    });
  },

  // 查看解析
  viewAnalysis() {
    // 显示所有题目的解析
    let analysisContent = '';
    this.data.questions.forEach((question, index) => {
      const answer = this.data.answers[index];
      const isCorrect = answer ? answer.isCorrect : false;
      analysisContent += `第${index + 1}题：${isCorrect ? '✓' : '✗'}\n`;
      analysisContent += `${question.explanation}\n\n`;
    });

    wx.showModal({
      title: '题目解析',
      content: analysisContent,
      showCancel: false,
      confirmText: '知道了'
    });
  },

  // 重新开始
  restart() {
    if (this.data.timer) {
      clearInterval(this.data.timer);
    }
    
    this.setData({
      currentIndex: 0,
      selectedAnswer: '',
      showResult: false,
      showExplanation: false,
      score: 0,
      answers: [],
      timeLeft: this.data.totalTime,
      startTime: Date.now()
    });
    
    this.startTimer();
  },

  // 暂停/继续
  togglePause() {
    if (this.data.timer) {
      clearInterval(this.data.timer);
      this.setData({ timer: null });
      app.showToast('已暂停');
    } else {
      this.startTimer();
      app.showToast('继续答题');
    }
  },

  // 语音播报
  async speakQuestion() {
    const currentQuestion = this.data.questions[this.data.currentIndex];
    if (!currentQuestion) return;

    const content = `题目：${currentQuestion.title}。选项：${currentQuestion.options.join('。')}`;

    try {
      app.showLoading('准备播报...');
      
      // 使用模拟的语音播报
      if (app.mockDataManager) {
        const ttsResult = await app.mockDataManager.textToSpeech(content);
        if (ttsResult.success) {
          app.showToast('播报完成');
        }
      } else {
        app.showToast('语音播报功能暂不可用');
      }
    } catch (error) {
      console.error('语音播报失败:', error);
      app.showToast('播报失败');
    } finally {
      app.hideLoading();
    }
  },

  // 分享
  onShareAppMessage() {
    return {
      title: `我在AI中级会计助手答题得了${this.data.score}分，快来挑战吧！`,
      path: '/pages/daily-questions/daily-questions',
      imageUrl: '/images/share-questions.png'
    };
  }
});