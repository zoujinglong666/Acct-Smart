// pages/plan/plan.js
const app = getApp();

Page({
  data: {
    currentPlan: null,
    planList: [],
    loading: true,
    showCreateDialog: false,
    newPlan: {
      name: '',
      targetDate: '',
      dailyTime: 60,
      subjects: []
    },
    subjects: [
      { id: 'intermediate_accounting', name: '中级会计实务', selected: true },
      { id: 'financial_management', name: '财务管理', selected: true },
      { id: 'economic_law', name: '经济法', selected: true }
    ],
    planTemplates: [
      {
        id: 'intensive_3month',
        name: '3个月冲刺计划',
        duration: 90,
        dailyTime: 120,
        description: '适合有一定基础，需要快速提升的考生'
      },
      {
        id: 'steady_6month',
        name: '6个月稳步计划',
        duration: 180,
        dailyTime: 90,
        description: '适合零基础或基础薄弱的考生'
      },
      {
        id: 'flexible_custom',
        name: '自定义计划',
        duration: 0,
        dailyTime: 60,
        description: '根据个人情况灵活安排学习进度'
      }
    ],
    selectedTemplate: null,
    studyProgress: {
      totalDays: 0,
      studiedDays: 0,
      totalTime: 0,
      studiedTime: 0,
      completionRate: 0
    }
  },

  onLoad() {
    this.loadStudyPlans();
    this.loadStudyProgress();
  },

  onShow() {
    this.loadStudyPlans();
  },

  // 加载学习计划
  async loadStudyPlans() {
    this.setData({ loading: true });

    try {
      // 使用模拟数据
      const mockCurrentPlan = {
        id: '1',
        name: '6个月稳步学习计划',
        targetDate: '2024-05-15',
        dailyTime: 90,
        subjects: ['intermediate_accounting', 'financial_management', 'economic_law'],
        createdDate: '2024-01-15',
        totalDays: 120,
        studiedDays: 45,
        progress: 37.5,
        status: 'active',
        weeklySchedule: [
          { day: '周一', subjects: ['中级会计实务'], time: 90, completed: true },
          { day: '周二', subjects: ['财务管理'], time: 90, completed: true },
          { day: '周三', subjects: ['经济法'], time: 90, completed: false },
          { day: '周四', subjects: ['中级会计实务'], time: 90, completed: false },
          { day: '周五', subjects: ['财务管理'], time: 90, completed: false },
          { day: '周六', subjects: ['综合复习'], time: 120, completed: false },
          { day: '周日', subjects: ['休息'], time: 0, completed: true }
        ],
        milestones: [
          { name: '基础知识学习', targetDate: '2024-03-01', completed: true },
          { name: '强化练习', targetDate: '2024-04-01', completed: false },
          { name: '冲刺复习', targetDate: '2024-05-01', completed: false }
        ]
      };

      const mockPlanList = [
        mockCurrentPlan,
        {
          id: '2',
          name: '3个月冲刺计划',
          targetDate: '2024-04-15',
          dailyTime: 120,
          subjects: ['intermediate_accounting', 'financial_management'],
          createdDate: '2024-02-01',
          totalDays: 75,
          studiedDays: 0,
          progress: 0,
          status: 'draft'
        }
      ];

      this.setData({
        currentPlan: mockCurrentPlan,
        planList: mockPlanList,
        loading: false
      });

    } catch (error) {
      console.error('加载学习计划失败:', error);
      this.setData({ loading: false });
      app.showToast('加载失败');
    }
  },

  // 加载学习进度
  async loadStudyProgress() {
    try {
      // 使用模拟数据
      const mockProgress = {
        totalDays: 120,
        studiedDays: 45,
        totalTime: 10800, // 分钟
        studiedTime: 4050, // 分钟
        completionRate: 37.5,
        weeklyStats: [
          { week: '第1周', studyTime: 630, target: 630, completed: true },
          { week: '第2周', studyTime: 540, target: 630, completed: false },
          { week: '第3周', studyTime: 720, target: 630, completed: true },
          { week: '第4周', studyTime: 450, target: 630, completed: false },
          { week: '第5周', studyTime: 600, target: 630, completed: false },
          { week: '第6周', studyTime: 480, target: 630, completed: false }
        ]
      };

      this.setData({ studyProgress: mockProgress });

    } catch (error) {
      console.error('加载学习进度失败:', error);
    }
  },

  // 显示创建计划对话框
  showCreateDialog() {
    this.setData({ 
      showCreateDialog: true,
      selectedTemplate: null,
      newPlan: {
        name: '',
        targetDate: '',
        dailyTime: 60,
        subjects: []
      }
    });
  },

  // 隐藏创建计划对话框
  hideCreateDialog() {
    this.setData({ showCreateDialog: false });
  },

  // 选择计划模板
  selectTemplate(e) {
    const { template } = e.currentTarget.dataset;
    const templateData = this.data.planTemplates.find(t => t.id === template);
    
    if (templateData) {
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + templateData.duration);
      
      this.setData({
        selectedTemplate: template,
        'newPlan.name': templateData.name,
        'newPlan.dailyTime': templateData.dailyTime,
        'newPlan.targetDate': targetDate.toISOString().split('T')[0]
      });
    }
  },

  // 计划名称输入
  onPlanNameInput(e) {
    this.setData({
      'newPlan.name': e.detail.value
    });
  },

  // 目标日期选择
  onTargetDateChange(e) {
    this.setData({
      'newPlan.targetDate': e.detail.value
    });
  },

  // 每日学习时间输入
  onDailyTimeInput(e) {
    this.setData({
      'newPlan.dailyTime': parseInt(e.detail.value) || 60
    });
  },

  // 切换科目选择
  toggleSubject(e) {
    const { subject } = e.currentTarget.dataset;
    const subjects = this.data.subjects.map(s => {
      if (s.id === subject) {
        return { ...s, selected: !s.selected };
      }
      return s;
    });
    
    this.setData({ subjects });
  },

  // 创建学习计划
  async createPlan() {
    const { newPlan, subjects } = this.data;
    
    // 验证输入
    if (!newPlan.name.trim()) {
      app.showToast('请输入计划名称');
      return;
    }
    
    if (!newPlan.targetDate) {
      app.showToast('请选择目标日期');
      return;
    }
    
    const selectedSubjects = subjects.filter(s => s.selected);
    if (selectedSubjects.length === 0) {
      app.showToast('请至少选择一个科目');
      return;
    }

    try {
      app.showLoading('创建中...');
      
      // 模拟创建计划
      const plan = {
        id: Date.now().toString(),
        name: newPlan.name,
        targetDate: newPlan.targetDate,
        dailyTime: newPlan.dailyTime,
        subjects: selectedSubjects.map(s => s.id),
        createdDate: new Date().toISOString().split('T')[0],
        totalDays: this.calculateTotalDays(newPlan.targetDate),
        studiedDays: 0,
        progress: 0,
        status: 'active'
      };

      // 更新计划列表
      const planList = [plan, ...this.data.planList];
      this.setData({
        currentPlan: plan,
        planList,
        showCreateDialog: false
      });

      app.showSuccess('计划创建成功');
      
    } catch (error) {
      console.error('创建计划失败:', error);
      app.showToast('创建失败');
    } finally {
      app.hideLoading();
    }
  },

  // 计算总天数
  calculateTotalDays(targetDate) {
    const target = new Date(targetDate);
    const now = new Date();
    const diffTime = target - now;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  },

  // 激活计划
  async activatePlan(e) {
    const { id } = e.currentTarget.dataset;
    const plan = this.data.planList.find(p => p.id === id);
    
    if (plan) {
      try {
        // 更新当前计划
        this.setData({ currentPlan: plan });
        app.showSuccess('计划已激活');
      } catch (error) {
        console.error('激活计划失败:', error);
        app.showToast('激活失败');
      }
    }
  },

  // 删除计划
  async deletePlan(e) {
    const { id } = e.currentTarget.dataset;
    
    wx.showModal({
      title: '删除计划',
      content: '确定要删除这个学习计划吗？',
      success: (res) => {
        if (res.confirm) {
          try {
            const planList = this.data.planList.filter(p => p.id !== id);
            let currentPlan = this.data.currentPlan;
            
            // 如果删除的是当前计划，清空当前计划
            if (currentPlan && currentPlan.id === id) {
              currentPlan = planList.length > 0 ? planList[0] : null;
            }
            
            this.setData({
              planList,
              currentPlan
            });
            
            app.showSuccess('删除成功');
          } catch (error) {
            console.error('删除计划失败:', error);
            app.showToast('删除失败');
          }
        }
      }
    });
  },

  // 编辑计划
  editPlan(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/plan-edit/plan-edit?id=${id}`
    });
  },

  // 查看计划详情
  viewPlanDetail(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/plan-detail/plan-detail?id=${id}`
    });
  },

  // 开始今日学习
  startTodayStudy() {
    if (!this.data.currentPlan) {
      app.showToast('请先创建学习计划');
      return;
    }
    
    wx.navigateTo({
      url: '/pages/study/study'
    });
  },

  // 查看学习统计
  viewStudyStats() {
    wx.navigateTo({
      url: '/pages/study-stats/study-stats'
    });
  },

  // 调整计划
  adjustPlan() {
    if (!this.data.currentPlan) {
      app.showToast('请先创建学习计划');
      return;
    }
    
    wx.navigateTo({
      url: `/pages/plan-adjust/plan-adjust?id=${this.data.currentPlan.id}`
    });
  },

  // 格式化时间
  formatTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}小时${mins}分钟`;
    } else {
      return `${mins}分钟`;
    }
  },

  // 格式化日期
  formatDate(dateString) {
    const date = new Date(dateString);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  },

  // 计算剩余天数
  calculateRemainingDays(targetDate) {
    const target = new Date(targetDate);
    const now = new Date();
    const diffTime = target - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  },

  // 分享学习计划
  onShareAppMessage() {
    if (this.data.currentPlan) {
      return {
        title: `我的学习计划：${this.data.currentPlan.name}`,
        path: '/pages/plan/plan',
        imageUrl: '/images/share-plan.png'
      };
    } else {
      return {
        title: '制定你的中级会计学习计划',
        path: '/pages/plan/plan'
      };
    }
  }
});