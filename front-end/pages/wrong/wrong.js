// pages/wrong/wrong.js - 错题本（列表 / 标记掌握 / 删除）
const app = getApp();

Page({
  data: {
    wrongQuestions: [],
    filteredQuestions: [],
    currentFilter: 'all', // all, recent, frequent, unsolved
    searchKeyword: '',
    loading: true,
    statistics: {
      total: 0,
      solved: 0,
      unsolved: 0,
      recentWeek: 0
    }
  },

  onLoad() {
    this.loadWrongQuestions();
  },

  onShow() {
    // 回到页面时刷新数据
    this.loadWrongQuestions();
  },

  // 加载错题 - 调用后端接口
  async loadWrongQuestions() {
    this.setData({ loading: true });

    try {
      const res = await app.api.studyApi.getWrongQuestions();
      const wrongQuestions = (res && res.data) || [];

      this.setData({ wrongQuestions });
      this.applyFilter();
      this.calcStatistics();
    } catch (error) {
      console.error('加载错题失败:', error);
      this.setData({ wrongQuestions: [], filteredQuestions: [] });
    } finally {
      this.setData({ loading: false });
    }
  },

  // 计算统计数据
  calcStatistics() {
    const list = this.data.wrongQuestions;
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    this.setData({
      statistics: {
        total: list.length,
        solved: list.filter(q => q.isSolved).length,
        unsolved: list.filter(q => !q.isSolved).length,
        recentWeek: list.filter(q => new Date(q.createdAt) > weekAgo).length
      }
    });
  },

  // 应用筛选
  applyFilter() {
    let filtered = [...this.data.wrongQuestions];

    // 按关键词搜索
    if (this.data.searchKeyword) {
      const keyword = this.data.searchKeyword.toLowerCase();
      filtered = filtered.filter(q =>
        (q.question && q.question.content.toLowerCase().includes(keyword)) ||
        (q.explanation && q.explanation.toLowerCase().includes(keyword))
      );
    }

    // 按状态筛选
    switch (this.data.currentFilter) {
      case 'recent':
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        filtered = filtered.filter(q => new Date(q.createdAt) > weekAgo);
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
    this.setData({ searchKeyword: e.detail.value });
    this.applyFilter();
  },

  // 切换筛选
  switchFilter(e) {
    const { filter } = e.currentTarget.dataset;
    this.setData({ currentFilter: filter });
    this.applyFilter();
  },

  // 标记已掌握
  markMastered(e) {
    const { id } = e.currentTarget.dataset;

    wx.showModal({
      title: '标记已掌握',
      content: '标记后该题不再计入未掌握错题',
      success: async (res) => {
        if (!res.confirm) return;
        try {
          await app.api.studyApi.markWrongQuestionMastered(id);
          app.showSuccess('已标记掌握');
          this.loadWrongQuestions();
        } catch (error) {
          console.error('标记失败:', error);
          app.showToast('操作失败');
        }
      }
    });
  },

  // 删除错题
  deleteWrong(e) {
    const { id } = e.currentTarget.dataset;

    wx.showModal({
      title: '删除错题',
      content: '确定要删除这道错题吗？',
      success: async (res) => {
        if (!res.confirm) return;
        try {
          await app.api.studyApi.deleteWrongQuestion(id);
          app.showSuccess('已删除');
          this.loadWrongQuestions();
        } catch (error) {
          console.error('删除失败:', error);
          app.showToast('操作失败');
        }
      }
    });
  },

  // 错题重练
  retryWrong() {
    if (this.data.filteredQuestions.length === 0) {
      app.showToast('当前筛选下没有错题');
      return;
    }
    wx.navigateTo({
      url: '/pages/practice/practice?mode=wrong'
    });
  },

  // 格式化日期
  formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const pad = (n) => String(n).padStart(2, '0');
    return `${date.getMonth() + 1}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
  },

  // 分享
  onShareAppMessage() {
    return {
      title: `我的错题本有${this.data.statistics.total}道题，一起来学习吧！`,
      path: '/pages/index/index'
    };
  }
});
