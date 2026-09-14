# AI中级会计助手

基于微信小程序 + NestJS + PostgreSQL 的智能会计学习平台

## 项目架构

```
AI中级会计助手
├── back-end/          # NestJS后端服务
│   ├── src/
│   │   ├── modules/   # 业务模块
│   │   │   ├── auth/      # 认证模块
│   │   │   ├── user/      # 用户模块
│   │   │   ├── wechat/    # 微信登录模块
│   │   │   ├── knowledge/ # 知识点模块
│   │   │   ├── question/  # 题库模块
│   │   │   ├── study/     # 学习记录模块
│   │   │   └── ai/        # AI服务模块
│   │   ├── common/    # 公共模块
│   │   └── main.ts    # 应用入口
│   └── package.json
└── front-end/         # 微信小程序前端
    ├── pages/         # 页面文件
    ├── components/    # 组件文件
    ├── utils/         # 工具函数
    ├── app.js         # 小程序入口
    ├── app.json       # 小程序配置
    └── app.wxss       # 全局样式
```

## 技术栈

### 后端
- **框架**: NestJS
- **数据库**: PostgreSQL
- **缓存**: Redis
- **认证**: JWT + 微信登录
- **AI服务**: OpenAI GPT-4
- **队列**: BullMQ

### 前端
- **框架**: 微信小程序原生框架
- **UI组件**: 微信官方组件 + 自定义组件
- **状态管理**: 全局数据管理

## 核心功能

### 1. 用户系统
- 微信授权登录
- 用户信息管理
- 学习进度跟踪

### 2. 知识点学习
- 分章节知识点展示
- AI智能讲解
- 学习进度记录

### 3. 题库练习
- 分类题库
- 智能推荐
- 答题记录分析

### 4. 错题管理
- 错题自动收集
- 薄弱知识点分析
- 个性化复习建议

### 5. AI助手
- 智能答疑
- 知识点讲解
- 学习建议生成

### 6. 学习计划
- 个性化学习计划
- 进度跟踪
- 提醒功能

## 快速开始

### 环境要求
- Node.js >= 16.0.0
- PostgreSQL >= 12.0
- Redis >= 6.0
- 微信开发者工具

### 后端启动

1. 安装依赖
```bash
cd back-end
npm install
```

2. 配置环境变量
```bash
cp .env.example .env
# 编辑 .env 文件，填入相应配置
```

3. 启动数据库
```bash
# 启动 PostgreSQL 和 Redis
# 创建数据库 acct_smart
```

4. 启动服务
```bash
npm run start:dev
```

### 前端启动

1. 使用微信开发者工具打开 `front-end` 目录

2. 配置小程序 AppID
   - 在 `app.json` 中配置你的小程序 AppID
   - 在 `app.js` 中修改后端 API 地址

3. 编译运行

## API 接口

### 认证相关
- `POST /api/auth/wechat-login` - 微信登录

### 用户相关
- `GET /api/user/profile` - 获取用户信息
- `PUT /api/user/profile` - 更新用户信息
- `GET /api/user/stats` - 获取学习统计

### 知识点相关
- `GET /api/knowledge/chapters` - 获取章节列表
- `GET /api/knowledge/points` - 获取知识点列表
- `GET /api/knowledge/:id` - 获取知识点详情

### 题库相关
- `GET /api/question/list` - 获取题目列表
- `POST /api/question/answer` - 提交答案
- `GET /api/question/analysis/:id` - 获取题目解析

### AI相关
- `POST /api/ai/explanation` - 生成知识点讲解
- `POST /api/ai/analysis` - 生成题目解析
- `POST /api/ai/answer` - AI答疑

## 数据库设计

### 主要表结构

#### 用户表 (users)
- id: 主键
- openid: 微信openid
- nickname: 昵称
- avatar: 头像
- total_study_time: 总学习时长
- continuous_study_days: 连续学习天数

#### 知识点表 (knowledge_points)
- id: 主键
- title: 知识点标题
- content: 知识点内容
- chapter_number: 章节编号
- importance: 重要程度

#### 题目表 (questions)
- id: 主键
- knowledge_point_id: 关联知识点
- content: 题目内容
- type: 题目类型
- correct_answer: 正确答案
- explanation: 答案解析

#### 学习记录表 (study_records)
- id: 主键
- user_id: 用户ID
- question_id: 题目ID
- user_answer: 用户答案
- is_correct: 是否正确
- time_spent: 答题用时

## 部署说明

### 后端部署
1. 构建项目
```bash
npm run build
```

2. 使用 PM2 部署
```bash
pm2 start dist/main.js --name acct-smart-api
```

### 前端部署
1. 在微信开发者工具中上传代码
2. 提交审核
3. 发布上线

## 开发规范

### 代码规范
- 使用 ESLint + Prettier 进行代码格式化
- 遵循 TypeScript 严格模式
- 使用语义化的变量和函数命名

### Git 提交规范
- feat: 新功能
- fix: 修复bug
- docs: 文档更新
- style: 代码格式调整
- refactor: 代码重构
- test: 测试相关
- chore: 构建过程或辅助工具的变动

## 许可证

MIT License

## 联系方式

如有问题，请联系开发团队。