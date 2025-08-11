// pages/exam/exam.js
const app = getApp();

Page({
  data: {
    examList: [],
    currentExam: null,
    examHistory: [],
    loading: true,
    selectedTab: 'available', // available, history, mock
    mockExams: [],
    examStats: {
      totalExams: 0,
      passedExams: 0,
      averageScore: 0,
      bestScore: 0
    }
  },

  onLoad() {
    this.loadExamData();
  },

  onShow() {
    this.loadExamData();
  },

  // 加载考试数据
  async loadExamData() {
    this.setData({ loading: true });

    try {
      // 使用模拟数据
      const mockExamList = [
        {
          id: '1',
          title: '中级会计实务 - 第一章测试',
          description: '资产负债表相关知识点测试',
          questionCount: 20,
          timeLimit: 60,
          difficulty: 'medium',
          subject: 'intermediate_accounting',
          type: 'chapter',
          status: 'available',
          passScore: 60,
          tags: ['资产负债表', '会计要素']
        },
        {
          id: '2',
          title: '财务管理 - 综合练习',
          description: '财务管理基础知识综合测试',
          questionCount: 30,
          timeLimit: 90,
          difficulty: 'hard',
          subject: 'financial_management',
          type: 'comprehensive',
          status: 'available',
          passScore: 70,
          tags: ['财务分析', '投资决策']
        },
        {
          id: '3',
          title: '经济法 - 模拟考试',
          description: '经济法全真模拟考试',
          questionCount: 50,
          timeLimit: 120,
          difficulty: 'hard',
          subject: 'economic_law',
          type: 'mock',
          status: 'available',
          passScore: 60,
          tags: ['公司法', '合同法', '税法']
        }
      ];

      const mockExamHistory = [
        {
          id: 'h1',
          examId: '1',
          examTitle: '中级会计实务 - 第一章测试',
          score: 85,
          totalScore: 100,
          passed: true,
          completedAt: '2024-01-10 14:30:00',
          timeUsed: 45,
          timeLimit: 60,
          correctCount: 17,
          totalCount: 20,
          accuracy: 85
        },
        {
          id: 'h2',
          examId: '2',
          examTitle: '财务管理 - 综合练习',
          score: 72,
          totalScore: 100,
          passed: true,
          completedAt: '2024-01-08 16:20:00',
          timeUsed: 85,
          timeLimit: 90,
          correctCount: 22,
          totalCount: 30,
          accuracy: 73
        }
      ];

      const mockStats = {
        totalExams: 5,
        passedExams: 4,
        averageScore: 78,
        bestScore: 92
      };

      this.setData({
        examList: mockExamList,
        examHistory: mockExamHistory,
        examStats: mockStats,
        loading: false
      });

    } catch (error) {
      console.error('加载考试数据失败:', error);
      this.setData({ loading: false });
      app.showToast('加载失败');
    }
  },

  // 切换标签页
  switchTab(e) {
    const { tab } = e.currentTarget.dataset;
    this.setData({ selectedTab: tab });
  },

  // 开始考试
  async startExam(e) {
    const { id } = e.currentTarget.dataset;
    const exam = this.data.examList.find(e => e.id === id);
    
    if (!exam) {
      app.showToast('考试不存在');
      return;
    }

    wx.showModal({
      title: '开始考试',
      content: `确定开始《${exam.title}》考试吗？\n题目数量：${exam.questionCount}题\n考试时间：${exam.timeLimit}分钟`,
      success: async (res) => {
        if (res.confirm) {
          try {
            app.showLoading('准备考试中...');
            
            // 模拟创建考试会话
            const session = {
              id: Date.now().toString(),
              examId: exam.id,
              startTime: new Date().toISOString(),
              timeLimit: exam.timeLimit * 60, // 转换为秒
              questions: this.generateMockQuestions(exam.questionCount)
            };

            // 跳转到考试页面
            wx.navigateTo({
              url: `/pages/exam-session/exam-session?sessionId=${session.id}&examId=${exam.id}`
            });

          } catch (error) {
            console.error('开始考试失败:', error);
            app.showToast('开始考试失败');
          } finally {
            app.hideLoading();
          }
        }
      }
    });
  },

  // 生成模拟题目
  generateMockQuestions(count) {
    const questions = [];
    for (let i = 1; i <= count; i++) {
      questions.push({
        id: i,
        type: 'single_choice',
        content: `这是第${i}道题目的内容，请选择正确答案。`,
        options: [
          { id: 'A', content: '选项A的内容' },
          { id: 'B', content: '选项B的内容' },
          { id: 'C', content: '选项C的内容' },
          { id: 'D', content: '选项D的内容' }
        ],
        correctAnswer: 'A',
        explanation: '这是题目的解析内容。',
        difficulty: 'medium',
        points: 5
      });
    }
    return questions;
  },

  // 查看考试详情
  viewExamDetail(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/exam-detail/exam-detail?id=${id}`
    });
  },

  // 查看考试结果
  viewExamResult(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/exam-result/exam-result?id=${id}`
    });
  },

  // 重新考试
  retakeExam(e) {
    const { examId } = e.currentTarget.dataset;
    this.startExam({ currentTarget: { dataset: { id: examId } } });
  },

  // 创建模拟考试
  createMockExam() {
    wx.navigateTo({
      url: '/pages/create-exam/create-exam'
    });
  },

  // 筛选考试
  filterExams(e) {
    const { filter } = e.currentTarget.dataset;
    // 这里可以实现筛选逻辑
    console.log('筛选考试:', filter);
  },

  // 搜索考试
  searchExams(e) {
    const keyword = e.detail.value;
    // 这里可以实现搜索逻辑
    console.log('搜索考试:', keyword);
  },

  // 获取难度标签样式
  getDifficultyClass(difficulty) {
    const classMap = {
      'easy': 'difficulty-easy',
      'medium': 'difficulty-medium',
      'hard': 'difficulty-hard'
    };
    return classMap[difficulty] || 'difficulty-medium';
  },

  // 获取难度文本
  getDifficultyText(difficulty) {
    const textMap = {
      'easy': '简单',
      'medium': '中等',
      'hard': '困难'
    };
    return textMap[difficulty] || '中等';
  },

  // 获取考试类型文本
  getExamTypeText(type) {
    const textMap = {
      'chapter': '章节测试',
      'comprehensive': '综合练习',
      'mock': '模拟考试',
      'final': '期末考试'
    };
    return textMap[type] || '测试';
  },

  // 格式化时间
  formatTime(minutes) {
    if (minutes < 60) {
      return `${minutes}分钟`;
    } else {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return mins > 0 ? `${hours}小时${mins}分钟` : `${hours}小时`;
    }
  },

  // 格式化日期
  formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now - date;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return '今天';
    } else if (diffDays === 1) {
      return '昨天';
    } else if (diffDays < 7) {
      return `${diffDays}天前`;
    } else {
      return `${date.getMonth() + 1}月${date.getDate()}日`;
    }
  },

  // 计算通过率
  getPassRate() {
    const { totalExams, passedExams } = this.data.examStats;
    return totalExams > 0 ? Math.round((passedExams / totalExams) * 100) : 0;
  },

  // 导出考试记录
  async exportExamHistory() {
    try {
      app.showLoading('导出中...');
      
      // 模拟导出
      setTimeout(() => {
        app.hideLoading();
        app.showSuccess('导出成功');
      }, 2000);

    } catch (error) {
      console.error('导出失败:', error);
      app.showToast('导出失败');
    } finally {
      app.hideLoading();
    }
  },

  // 分享考试成绩
  shareExamResult(e) {
    const { score } = e.currentTarget.dataset;
    return {
      title: `我在中级会计考试中获得了${score}分！`,
      path: '/pages/exam/exam',
      imageUrl: '/images/share-exam.png'
    };
  },

  // 页面分享
  onShareAppMessage() {
    return {
      title: '中级会计在线考试系统',
      path: '/pages/exam/exam',
      imageUrl: '/images/share-exam.png'
    };
  }
});