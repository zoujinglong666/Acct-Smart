# AI中级会计助手（最小 MVP 版）

基于微信小程序 + NestJS + PostgreSQL 的会计刷题学习平台，已裁剪为**最小可用闭环**：

**登录 → 刷题（每日/章节/错题重练）→ 后端判分 → 答题记录 → 自动收集错题 → 错题复习 → 学习统计**

## 项目结构

```
Acct-Smart-main
├── back-end/                 # NestJS 后端（6 个业务模块）
│   ├── src/modules/
│   │   ├── auth/             # 登录/注册/JWT（支持微信登录 + 游客模式）
│   │   ├── user/             # 用户资料 + 学习统计
│   │   ├── knowledge/        # 知识点/章节
│   │   ├── question/         # 题库：每日题目/章节题目/答题判分/解析/搜索
│   │   ├── study/            # 答题流水 + 错题本
│   │   └── wechat/           # 微信登录服务
│   ├── database/init.sql     # 数据库初始化脚本（5 张表 + 种子数据 + 官方真题）
│   ├── database/import_2012_exam.sql # 2012官方真题增量导入脚本（可单独执行）
│   ├── database/raw/         # 官方真题 PDF 原件（溯源材料）
│   └── .env.example          # 环境变量模板
├── web/index.html            # Web 版前端（单页应用，浏览器直接打开即可体验完整闭环）
└── front-end/                # 微信小程序（5 个页面）
    ├── pages/
    │   ├── index/            # 首页（统计 + 入口）
    │   ├── practice/         # 练习（每日/章节/错题重练）
    │   ├── wrong/            # 错题本（复习/标记掌握/删除）
    │   ├── profile/          # 我的（资料/统计/退出）
    │   └── login/            # 登录（微信 / 游客模式）
    └── apis/index.js         # API 统一封装
```

## 技术栈

- **后端**: NestJS 10 + TypeScript + TypeORM + PostgreSQL + JWT
- **前端**: 微信小程序原生框架 + Web 单页（原生 HTML/JS）

## 快速开始

### 环境要求
- Node.js >= 16
- PostgreSQL >= 12

### 1. 初始化数据库

```bash
# 创建数据库
createdb acct_smart

# 执行初始化脚本（建表 + 种子数据）
psql -U postgres -d acct_smart -f back-end/database/init.sql
```

### 2. 启动后端

```bash
cd back-end
npm install
cp .env.example .env   # 填入数据库密码等配置
npm run start:dev
```

- 服务地址: http://localhost:8123
- API 文档: http://localhost:8123/api/docs

### 3. 启动前端（任选其一）

**Web 版（无需安装，推荐快速体验）**：直接用浏览器打开 `web/index.html`，点击"游客模式"即可体验完整闭环。

**微信小程序**：用微信开发者工具打开 `front-end` 目录，配置项目 AppID（无 AppID 可用测试号）。
登录页支持**游客模式**（模拟登录），无需微信凭证即可体验完整闭环。

## API 接口

| 模块 | 接口 | 说明 |
|------|------|------|
| 认证 | `POST /api/auth/wechat-login` | 微信登录（code 传 `mock` 为游客模式） |
| 认证 | `POST /api/auth/login` | 普通账密登录 |
| 认证 | `POST /api/auth/register` | 注册 |
| 用户 | `GET /api/user/profile` | 用户信息 |
| 用户 | `PATCH /api/user/profile` | 更新用户信息 |
| 用户 | `GET /api/user/stats` | 学习统计 |
| 题目 | `GET /api/questions/daily` | 每日 5 题 |
| 题目 | `GET /api/questions/by-knowledge-point/:id` | 章节题目 |
| 题目 | `POST /api/questions/answer` | 提交答案（后端判分，自动收错题） |
| 题目 | `GET /api/questions/analysis/:id` | 题目解析 |
| 题目 | `GET /api/questions/search` | 搜索题目 |
| 知识点 | `GET /api/knowledge` | 知识点列表 |
| 学习 | `GET /api/study/records` | 答题记录 |
| 学习 | `GET /api/study/wrong-questions` | 错题本 |
| 学习 | `PATCH /api/study/wrong-question/:id/mastered` | 标记已掌握 |
| 学习 | `DELETE /api/study/wrong-question/:id` | 删除错题 |
| 学习 | `GET /api/study/today-status` | 今日学习状态 |

## MVP 闭环说明

- **判分在后端**：前端提交答案，后端比对 `correct_answer` 判分，防止前端篡改
- **错题自动收集**：答错的题目自动写入错题本（同一题重复答错会累计错误次数）
- **统计数据联动**：答题后同步更新题目统计、用户累计统计、今日状态

## 题库说明

- **116 道题目**，按来源分为：
  - 35 道官方真题（2012 年度全国会计专业技术资格考试《中级会计实务》客观题，来源：财政部会计财务评价中心官网 kzp.mof.gov.cn 官方试题+答案 PDF）
  - 77 道考生回忆版真题（2023 年 3 个批次 + 2024 年 1 个批次《中级会计实务》客观题，来源：正保会计网校 chinaacc.com 公开 PDF）
  - 4 道 MVP 示例题
- 题型覆盖：单选 35、多选 36、判断 45
- 真题已标注 `source`（`官方真题-2012` / `考生回忆版-2023` / `考生回忆版-2024`）与 `year`
- 官方仅公布 2012 年真题，2013 年后官方不公开发布完整真题，近年真题均为培训机构整理的考生回忆版
- 所有真题 PDF 原件与提取文本存于 `back-end/database/raw/` 用于溯源；导入脚本见 `import_2012_exam.sql`、`import_2023_2024_exam.sql`、`import_2023_0909_0910_exam.sql`，全新初始化直接执行 `init.sql`（33 个知识点 + 116 题）

## 已移除的功能（裁剪记录）

AI 答疑（OpenAI）、拍照识题（腾讯云 OCR）、考试模拟、思维导图、语音（TTS）、数据分析、学习计划、Redis 队列。历史版本可通过 git 回滚（commit `eff0ca6`）。

## 许可证

MIT License
