// pages/knowledge/knowledge.js
const app = getApp();

Page({
  data: {
    knowledgeId: '',
    knowledgeDetail: null,
    relatedKnowledge: [],
    userProgress: 0,
    notes: [],
    loading: true,
    showNoteDialog: false,
    noteContent: '',
    currentSection: 0,
    sections: [],
    bookmarked: false,
    studyTime: 0,
    timer: null
  },

  onLoad(options) {
    if (options.id) {
      this.setData({ knowledgeId: options.id });
      this.loadKnowledgeDetail();
    } else {
      // 如果没有ID，显示知识点列表
      this.loadKnowledgeList();
    }
  },

  onShow() {
    // 开始计时
    this.startTimer();
  },

  onHide() {
    // 停止计时并保存学习时间
    this.stopTimer();
  },

  onUnload() {
    this.stopTimer();
  },

  // 开始计时
  startTimer() {
    this.data.timer = setInterval(() => {
      this.setData({
        studyTime: this.data.studyTime + 1
      });
    }, 1000);
  },

  // 停止计时
  stopTimer() {
    if (this.data.timer) {
      clearInterval(this.data.timer);
      this.data.timer = null;
      
      // 保存学习时间
      if (this.data.studyTime > 10) { // 学习超过10秒才记录
        this.saveStudyTime();
      }
    }
  },

  // 保存学习时间
  async saveStudyTime() {
    try {
      await app.api.studyApi.createStudyRecord({
        type: 'knowledge',
        targetId: this.data.knowledgeId,
        studyTime: this.data.studyTime,
        progress: this.data.userProgress
      });
    } catch (error) {
      console.error('保存学习时间失败:', error);
    }
  },

  // 加载知识点详情
  async loadKnowledgeDetail() {
    this.setData({ loading: true });

    try {
      // 使用模拟数据
      const mockDetail = {
        id: this.data.knowledgeId,
        title: '资产负债表编制',
        chapter: '第三章 财务报表',
        difficulty: 'medium',
        content: `
# 资产负债表编制

## 概述
资产负债表是反映企业在特定日期财务状况的会计报表，它按照"资产=负债+所有者权益"的会计等式，把企业在一定日期的资产、负债和所有者权益各项目按照一定的分类标准和顺序排列。

## 基本结构

### 资产部分
1. **流动资产**
   - 货币资金
   - 交易性金融资产
   - 应收票据
   - 应收账款
   - 预付款项
   - 其他应收款
   - 存货

2. **非流动资产**
   - 长期股权投资
   - 固定资产
   - 无形资产
   - 商誉

### 负债部分
1. **流动负债**
   - 短期借款
   - 应付票据
   - 应付账款
   - 预收款项
   - 应付职工薪酬

2. **非流动负债**
   - 长期借款
   - 应付债券
   - 长期应付款

### 所有者权益部分
- 实收资本
- 资本公积
- 盈余公积
- 未分配利润

## 编制要点

### 1. 数据来源
- 总账余额
- 明细账余额
- 必要的调整分录

### 2. 编制步骤
1. 收集相关账户余额
2. 进行必要的调整
3. 按照报表格式填列
4. 核对平衡关系

### 3. 注意事项
- 确保借贷平衡
- 注意重分类调整
- 关注期末调整事项
- 披露重要事项

## 实务案例

某公司2023年12月31日相关账户余额如下：
- 银行存款：500,000元
- 应收账款：300,000元
- 存货：200,000元
- 固定资产：1,000,000元
- 应付账款：150,000元
- 短期借款：200,000元
- 实收资本：1,000,000元
- 未分配利润：650,000元

根据以上数据编制资产负债表...
        `,
        estimatedTime: 45,
        keyPoints: [
          '掌握资产负债表的基本结构',
          '理解各项目的填列方法',
          '熟悉编制步骤和注意事项',
          '能够进行实务操作'
        ],
        examples: [
          {
            title: '基础编制练习',
            description: '根据试算平衡表编制资产负债表'
          },
          {
            title: '调整事项处理',
            description: '处理期末调整事项后编制报表'
          }
        ]
      };

      const mockRelated = [
        { id: '2', title: '利润表编制', chapter: '第三章', difficulty: 'medium' },
        { id: '3', title: '现金流量表', chapter: '第三章', difficulty: 'hard' },
        { id: '4', title: '会计科目设置', chapter: '第二章', difficulty: 'easy' }
      ];

      const mockNotes = [
        {
          id: '1',
          content: '资产负债表的核心是平衡关系，一定要确保左右两边相等',
          createTime: '2024-01-15 10:30:00'
        },
        {
          id: '2', 
          content: '编制时要特别注意应收账款的坏账准备抵减',
          createTime: '2024-01-14 15:20:00'
        }
      ];

      // 分割内容为章节
      const sections = this.parseContentSections(mockDetail.content);

      this.setData({
        knowledgeDetail: mockDetail,
        relatedKnowledge: mockRelated,
        notes: mockNotes,
        sections: sections,
        userProgress: Math.floor(Math.random() * 100), // 模拟进度
        bookmarked: Math.random() > 0.5, // 模拟收藏状态
        loading: false
      });

    } catch (error) {
      console.error('加载知识点详情失败:', error);
      this.setData({ loading: false });
      app.showToast('加载失败');
    }
  },

  // 加载知识点列表
  async loadKnowledgeList() {
    this.setData({ loading: true });

    try {
      // 使用模拟数据
      const mockList = [
        {
          id: '1',
          title: '资产负债表编制',
          chapter: '第三章 财务报表',
          difficulty: 'medium',
          progress: 75,
          estimatedTime: 45,
          isCompleted: false
        },
        {
          id: '2',
          title: '利润表编制',
          chapter: '第三章 财务报表', 
          difficulty: 'medium',
          progress: 60,
          estimatedTime: 40,
          isCompleted: false
        },
        {
          id: '3',
          title: '现金流量表',
          chapter: '第三章 财务报表',
          difficulty: 'hard',
          progress: 30,
          estimatedTime: 60,
          isCompleted: false
        },
        {
          id: '4',
          title: '会计科目设置',
          chapter: '第二章 会计基础',
          difficulty: 'easy',
          progress: 100,
          estimatedTime: 30,
          isCompleted: true
        },
        {
          id: '5',
          title: '借贷记账法',
          chapter: '第二章 会计基础',
          difficulty: 'easy',
          progress: 90,
          estimatedTime: 35,
          isCompleted: false
        }
      ];

      this.setData({
        knowledgeList: mockList,
        loading: false
      });

    } catch (error) {
      console.error('加载知识点列表失败:', error);
      this.setData({ loading: false });
      app.showToast('加载失败');
    }
  },

  // 解析内容章节
  parseContentSections(content) {
    const lines = content.split('\n');
    const sections = [];
    let currentSection = null;

    lines.forEach(line => {
      if (line.startsWith('## ')) {
        if (currentSection) {
          sections.push(currentSection);
        }
        currentSection = {
          title: line.replace('## ', ''),
          content: ''
        };
      } else if (currentSection) {
        currentSection.content += line + '\n';
      }
    });

    if (currentSection) {
      sections.push(currentSection);
    }

    return sections;
  },

  // 切换章节
  switchSection(e) {
    const { index } = e.currentTarget.dataset;
    this.setData({ currentSection: index });
  },

  // 更新学习进度
  async updateProgress(progress) {
    try {
      this.setData({ userProgress: progress });
      
      // 模拟API调用
      console.log('更新进度:', progress);
      
      if (progress >= 100) {
        app.showSuccess('恭喜完成学习！');
      }
    } catch (error) {
      console.error('更新进度失败:', error);
    }
  },

  // 标记完成
  markComplete() {
    this.updateProgress(100);
  },

  // 收藏/取消收藏
  async toggleBookmark() {
    try {
      const newBookmarked = !this.data.bookmarked;
      this.setData({ bookmarked: newBookmarked });
      
      app.showToast(newBookmarked ? '已收藏' : '已取消收藏');
    } catch (error) {
      console.error('收藏操作失败:', error);
    }
  },

  // 显示笔记对话框
  showNoteDialog() {
    this.setData({ 
      showNoteDialog: true,
      noteContent: ''
    });
  },

  // 隐藏笔记对话框
  hideNoteDialog() {
    this.setData({ showNoteDialog: false });
  },

  // 笔记内容输入
  onNoteInput(e) {
    this.setData({ noteContent: e.detail.value });
  },

  // 保存笔记
  async saveNote() {
    if (!this.data.noteContent.trim()) {
      app.showToast('请输入笔记内容');
      return;
    }

    try {
      const newNote = {
        id: Date.now().toString(),
        content: this.data.noteContent,
        createTime: new Date().toLocaleString()
      };

      const notes = [...this.data.notes, newNote];
      this.setData({ 
        notes,
        showNoteDialog: false,
        noteContent: ''
      });

      app.showSuccess('笔记保存成功');
    } catch (error) {
      console.error('保存笔记失败:', error);
      app.showToast('保存失败');
    }
  },

  // 删除笔记
  async deleteNote(e) {
    const { id } = e.currentTarget.dataset;
    
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这条笔记吗？',
      success: (res) => {
        if (res.confirm) {
          const notes = this.data.notes.filter(note => note.id !== id);
          this.setData({ notes });
          app.showSuccess('删除成功');
        }
      }
    });
  },

  // 查看相关知识点
  viewRelatedKnowledge(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/knowledge/knowledge?id=${id}`
    });
  },

  // 开始练习
  startPractice() {
    wx.navigateTo({
      url: `/pages/practice/practice?knowledgeId=${this.data.knowledgeId}`
    });
  },

  // 查看知识点详情（从列表页）
  viewKnowledgeDetail(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/knowledge/knowledge?id=${id}`
    });
  },

  // 语音播报
  async speakContent() {
    if (!this.data.knowledgeDetail) return;

    try {
      const content = this.data.sections[this.data.currentSection]?.content || 
                     this.data.knowledgeDetail.title;
      
      // 模拟语音播报
      app.showToast('开始播报');
      console.log('播报内容:', content);
    } catch (error) {
      console.error('语音播报失败:', error);
      app.showToast('播报失败');
    }
  },

  // 分享
  onShareAppMessage() {
    if (this.data.knowledgeDetail) {
      return {
        title: `${this.data.knowledgeDetail.title} - 一起来学习吧！`,
        path: `/pages/knowledge/knowledge?id=${this.data.knowledgeId}`,
        imageUrl: '/images/share-knowledge.png'
      };
    } else {
      return {
        title: '中级会计知识点学习',
        path: '/pages/knowledge/knowledge'
      };
    }
  }
});