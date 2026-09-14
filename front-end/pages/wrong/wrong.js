// pages/wrong/wrong.js
const app = getApp();

Page({
  data: {
    wrongQuestions: [],
    filteredQuestions: [],
    currentFilter: 'all', // all, recent, frequent, unsolved
    searchKeyword: '',
    loading: true,
    selectedQuestions: [],
    isSelectMode: false,
    sortBy: 'createTime', // createTime, wrongCount, difficulty
    sortOrder: 'desc', // desc, asc
    categories: [],
    selectedCategory: '',
    showFilterPanel: false,
    statistics: {
      total: 0,
      solved: 0,
      unsolved: 0,
      recentWeek: 0
    }
  },

  onLoad() {
    this.loadWrongQuestions();
    this.loadStatistics();
    this.loadCategories();
  },

  onShow() {
    // 刷新数据
    this.loadWrongQuestions();
  },

  // 加载错题 - 调用后端接口
  async loadWrongQuestions() {
    this.setData({ loading: true });

    try {
      // 尝试调用后端接口
      if (app.api && app.api.studyApi && wx.getStorageSync('token')) {
        try {
          const result = await app.api.studyApi.getWrongQuestions();
          console.log('错题接口返回:', result);
          
          if (result && result.data && result.data.length > 0) {
            this.setData({
              wrongQuestions: result.data,
              loading: false
            });
            this.applyFilter();
            return;
          }
        } catch (apiError) {
          console.error('调用后端错题接口失败:', apiError);
        }
      }
      
      // 使用模拟数据作为后备
      const mockData = this.getMockWrongQuestions();
      
      this.setData({
        wrongQuestions: mockData,
        loading: false
      });

      this.applyFilter();
    } catch (error) {
      console.error('加载错题失败:', error);
      this.setData({ loading: false });
      app.showToast('加载失败');
    }
  },

  // 加载统计数据 - 使用模拟数据
  async loadStatistics() {
    try {
      const mockStats = {
        total: 25,
        solved: 18,
        unsolved: 7,
        recentWeek: 3
      };
      
      this.setData({
        statistics: mockStats
      });
    } catch (error) {
      console.error('加载统计失败:', error);
    }
  },

  // 加载分类 - 使用模拟数据
  async loadCategories() {
    try {
      const mockCategories = [
        { id: 1, name: '会计实务', count: 12 },
        { id: 2, name: '经济法', count: 8 },
        { id: 3, name: '财务管理', count: 5 }
      ];
      
      this.setData({
        categories: mockCategories
      });
    } catch (error) {
      console.error('加载分类失败:', error);
    }
  },

  // 获取模拟错题数据
  getMockWrongQuestions() {
    return [
      {
        id: 1,
        questionId: 'q001',
        question: {
          content: '下列关于资产负债表的表述中，正确的是（）',
          type: 'single',
          options: [
            'A. 资产负债表反映企业某一特定日期的财务状况',
            'B. 资产负债表反映企业某一会计期间的经营成果',
            'C. 资产负债表中的资产按流动性递减顺序排列',
            'D. 资产负债表采用多步式格式'
          ],
          correctAnswer: 'A',
          explanation: '资产负债表是反映企业在某一特定日期财务状况的会计报表，属于静态报表。'
        },
        userAnswer: 'B',
        wrongCount: 2,
        isSolved: false,
        createTime: '2024-01-15T10:30:00Z',
        category: '会计实务',
        difficulty: 'medium'
      },
      {
        id: 2,
        questionId: 'q002',
        question: {
          content: '企业发生的下列支出中，应计入管理费用的是（）',
          type: 'single',
          options: [
            'A. 生产车间设备维修费',
            'B. 销售部门办公费',
            'C. 行政管理部门办公费',
            'D. 生产工人工资'
          ],
          correctAnswer: 'C',
          explanation: '行政管理部门发生的办公费应计入管理费用。'
        },
        userAnswer: 'A',
        wrongCount: 1,
        isSolved: true,
        createTime: '2024-01-14T14:20:00Z',
        category: '会计实务',
        difficulty: 'easy'
      },
      {
        id: 3,
        questionId: 'q003',
        question: {
          content: '根据《公司法》规定，股份有限公司的注册资本最低限额为（）',
          type: 'single',
          options: [
            'A. 人民币500万元',
            'B. 人民币1000万元',
            'C. 人民币2000万元',
            'D. 无最低限额要求'
          ],
          correctAnswer: 'D',
          explanation: '根据新《公司法》规定，已取消股份有限公司注册资本最低限额要求。'
        },
        userAnswer: 'A',
        wrongCount: 3,
        isSolved: false,
        createTime: '2024-01-13T09:15:00Z',
        category: '经济法',
        difficulty: 'hard'
      }
    ];
  },

  // 应用筛选
  applyFilter() {
    let filtered = [...this.data.wrongQuestions];

    // 按关键词搜索
    if (this.data.searchKeyword) {
      const keyword = this.data.searchKeyword.toLowerCase();
      filtered = filtered.filter(q => 
        q.question.content.toLowerCase().includes(keyword) ||
        q.question.explanation?.toLowerCase().includes(keyword)
      );
    }

    // 按状态筛选
    switch (this.data.currentFilter) {
      case 'recent':
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        filtered = filtered.filter(q => new Date(q.createTime) > weekAgo);
        break;
      case 'frequent':
        filtered = filtered.filter(q => q.wrongCount >= 3);
        break;
      case 'unsolved':
        filtered = filtered.filter(q => !q.isSolved);
        break;
    }

    this.setData({ filteredQuestions: filtered });
  },

  // 搜索
  onSearch(e) {
    this.setData({
      searchKeyword: e.detail.value
    });
    this.applyFilter();
  },

  // 切换筛选
  switchFilter(e) {
    const { filter } = e.currentTarget.dataset;
    this.setData({
      currentFilter: filter
    });
    this.applyFilter();
  },

  // 切换排序
  switchSort(e) {
    const { sort } = e.currentTarget.dataset;
    let { sortBy, sortOrder } = this.data;

    if (sortBy === sort) {
      sortOrder = sortOrder === 'desc' ? 'asc' : 'desc';
    } else {
      sortBy = sort;
      sortOrder = 'desc';
    }

    this.setData({ sortBy, sortOrder });
    this.loadWrongQuestions();
  },

  // 选择分类
  selectCategory(e) {
    const { category } = e.currentTarget.dataset;
    this.setData({
      selectedCategory: category === this.data.selectedCategory ? '' : category,
      showFilterPanel: false
    });
    this.loadWrongQuestions();
  },

  // 切换筛选面板
  toggleFilterPanel() {
    this.setData({
      showFilterPanel: !this.data.showFilterPanel
    });
  },

  // 查看题目详情
  viewQuestion(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/question-detail/question-detail?id=${id}&source=wrong`
    });
  },

  // 练习错题 - 使用模拟逻辑
  async practiceWrongQuestions() {
    if (this.data.filteredQuestions.length === 0) {
      app.showToast('没有可练习的错题');
      return;
    }

    wx.showModal({
      title: '开始练习',
      content: `准备练习${this.data.filteredQuestions.length}道错题`,
      success: (res) => {
        if (res.confirm) {
          wx.navigateTo({
            url: '/pages/practice/practice?type=wrong'
          });
        }
      }
    });
  },

  // 切换选择模式
  toggleSelectMode() {
    this.setData({
      isSelectMode: !this.data.isSelectMode,
      selectedQuestions: []
    });
  },

  // 选择题目
  selectQuestion(e) {
    const { id } = e.currentTarget.dataset;
    const { selectedQuestions } = this.data;
    
    const index = selectedQuestions.indexOf(id);
    if (index > -1) {
      selectedQuestions.splice(index, 1);
    } else {
      selectedQuestions.push(id);
    }

    this.setData({ selectedQuestions });
  },

  // 全选/取消全选
  toggleSelectAll() {
    const allSelected = this.data.selectedQuestions.length === this.data.filteredQuestions.length;
    
    this.setData({
      selectedQuestions: allSelected ? [] : this.data.filteredQuestions.map(q => q.id)
    });
  },

  // 批量删除 - 使用新的API
  async batchDelete() {
    if (this.data.selectedQuestions.length === 0) {
      app.showToast('请选择要删除的题目');
      return;
    }

    wx.showModal({
      title: '确认删除',
      content: `确定要删除选中的${this.data.selectedQuestions.length}道错题吗？`,
      success: async (res) => {
        if (res.confirm) {
          try {
            await app.api.studyApi.batchDeleteWrongQuestions({
              questionIds: this.data.selectedQuestions
            });

            app.showSuccess('删除成功');
            this.setData({
              isSelectMode: false,
              selectedQuestions: []
            });
            this.loadWrongQuestions();
          } catch (error) {
            console.error('批量删除失败:', error);
            app.showToast('删除失败');
          }
        }
      }
    });
  },

  // 批量标记为已掌握 - 使用新的API
  async batchMarkSolved() {
    if (this.data.selectedQuestions.length === 0) {
      app.showToast('请选择要标记的题目');
      return;
    }

    try {
      await app.api.studyApi.batchMarkSolved({
        questionIds: this.data.selectedQuestions
      });

      app.showSuccess('标记成功');
      this.setData({
        isSelectMode: false,
        selectedQuestions: []
      });
      this.loadWrongQuestions();
    } catch (error) {
      console.error('批量标记失败:', error);
      app.showToast('标记失败');
    }
  },

  // 导出错题 - 使用新的API
  async exportWrongQuestions() {
    try {
      app.showLoading('导出中...');
      
      const result = await app.api.studyApi.exportWrongQuestions({
        format: 'pdf',
        includeAnalysis: true
      });

      if (result.data?.downloadUrl) {
        wx.downloadFile({
          url: result.data.downloadUrl,
          success: (res) => {
            wx.openDocument({
              filePath: res.tempFilePath,
              success: () => {
                app.showSuccess('导出成功');
              }
            });
          }
        });
      }
    } catch (error) {
      console.error('导出失败:', error);
      app.showToast('导出失败');
    } finally {
      app.hideLoading();
    }
  },

  // 获取AI分析 - 使用新的API
  async getAIAnalysis() {
    if (this.data.filteredQuestions.length === 0) {
      app.showToast('没有错题可分析');
      return;
    }

    try {
      app.showLoading('AI分析中...');
      
      const analysis = await app.api.aiApi.analyzeWrongQuestionPattern({
        questionIds: this.data.filteredQuestions.map(q => q.questionId)
      });

      wx.navigateTo({
        url: `/pages/ai-analysis/ai-analysis?data=${encodeURIComponent(JSON.stringify(analysis.data))}`
      });
    } catch (error) {
      console.error('AI分析失败:', error);
      app.showToast('分析失败');
    } finally {
      app.hideLoading();
    }
  },

  // 语音播报统计 - 使用新的API
  async speakStatistics() {
    const stats = this.data.statistics;
    const content = `您的错题本共有${stats.total}道题目，其中已掌握${stats.solved}道，未掌握${stats.unsolved}道，最近一周新增${stats.recentWeek}道错题。`;

    try {
      const ttsResult = await app.api.audioApi.textToSpeech(content, {
        voice: 'standard',
        speed: 1.0
      });

      if (ttsResult.data?.audioUrl) {
        const audioContext = wx.createInnerAudioContext();
        audioContext.src = ttsResult.data.audioUrl;
        audioContext.play();
      }
    } catch (error) {
      console.error('语音播报失败:', error);
      app.showToast('播报失败');
    }
  },

  // 分享错题本
  onShareAppMessage() {
    return {
      title: `我的错题本有${this.data.statistics.total}道题，一起来学习吧！`,
      path: '/pages/wrong/wrong',
      imageUrl: '/images/share-wrong.png'
    };
  }
});