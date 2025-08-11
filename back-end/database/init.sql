-- AI中级会计助手数据库初始化脚本
-- PostgreSQL 数据库建表语句

-- 创建数据库（如果不存在）
-- CREATE DATABASE acct_smart;

-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    openid VARCHAR(255) UNIQUE NOT NULL,
    unionid VARCHAR(255),
    nickname VARCHAR(255) NOT NULL,
    avatar TEXT,
    gender VARCHAR(20) DEFAULT 'unknown' CHECK (gender IN ('male', 'female', 'unknown')),
    phone VARCHAR(20),
    email VARCHAR(255),
    total_study_time INTEGER DEFAULT 0,
    continuous_study_days INTEGER DEFAULT 0,
    last_study_date DATE,
    total_questions INTEGER DEFAULT 0,
    correct_questions INTEGER DEFAULT 0,
    preferences JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建知识点表
CREATE TABLE IF NOT EXISTS knowledge_points (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    parent_id INTEGER REFERENCES knowledge_points(id),
    chapter_number VARCHAR(50) NOT NULL,
    sort_order INTEGER DEFAULT 0,
    importance VARCHAR(20) DEFAULT 'basic' CHECK (importance IN ('basic', 'important', 'difficult')),
    tags JSONB,
    study_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建题目表
CREATE TABLE IF NOT EXISTS questions (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('single', 'multiple', 'judge', 'calculation')),
    options JSONB,
    correct_answer VARCHAR(500) NOT NULL,
    explanation TEXT,
    knowledge_point_id INTEGER NOT NULL REFERENCES knowledge_points(id),
    difficulty VARCHAR(20) DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
    answer_count INTEGER DEFAULT 0,
    correct_count INTEGER DEFAULT 0,
    tags JSONB,
    is_active BOOLEAN DEFAULT true,
    source VARCHAR(255),
    year INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建学习记录表
CREATE TABLE IF NOT EXISTS study_records (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    question_id INTEGER NOT NULL REFERENCES questions(id),
    user_answer VARCHAR(500) NOT NULL,
    is_correct BOOLEAN NOT NULL,
    time_spent INTEGER NOT NULL,
    answer_type VARCHAR(20) NOT NULL CHECK (answer_type IN ('practice', 'exam', 'daily')),
    exam_record_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建错题表
CREATE TABLE IF NOT EXISTS wrong_questions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    question_id INTEGER NOT NULL REFERENCES questions(id),
    wrong_count INTEGER DEFAULT 1,
    last_wrong_time TIMESTAMP NOT NULL,
    is_mastered BOOLEAN DEFAULT false,
    wrong_reasons JSONB,
    review_schedule JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, question_id)
);

-- 创建学习计划表
CREATE TABLE IF NOT EXISTS study_plans (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    content JSONB NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
    progress INTEGER DEFAULT 0,
    statistics JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建试卷表
CREATE TABLE IF NOT EXISTS exam_papers (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(20) NOT NULL CHECK (type IN ('mock', 'sprint', 'daily')),
    question_ids JSONB NOT NULL,
    duration INTEGER NOT NULL,
    total_score INTEGER NOT NULL,
    pass_score INTEGER NOT NULL,
    question_distribution JSONB,
    is_active BOOLEAN DEFAULT true,
    instructions JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建考试记录表
CREATE TABLE IF NOT EXISTS exam_records (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    exam_paper_id INTEGER NOT NULL REFERENCES exam_papers(id),
    user_answers JSONB NOT NULL,
    total_score INTEGER NOT NULL,
    user_score INTEGER NOT NULL,
    correct_count INTEGER NOT NULL,
    total_count INTEGER NOT NULL,
    time_used INTEGER NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('completed', 'timeout', 'abandoned')),
    score_by_type JSONB,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_users_openid ON users(openid);
CREATE INDEX IF NOT EXISTS idx_knowledge_points_parent ON knowledge_points(parent_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_points_chapter ON knowledge_points(chapter_number);
CREATE INDEX IF NOT EXISTS idx_questions_knowledge_point ON questions(knowledge_point_id);
CREATE INDEX IF NOT EXISTS idx_questions_type ON questions(type);
CREATE INDEX IF NOT EXISTS idx_questions_difficulty ON questions(difficulty);
CREATE INDEX IF NOT EXISTS idx_study_records_user ON study_records(user_id);
CREATE INDEX IF NOT EXISTS idx_study_records_question ON study_records(question_id);
CREATE INDEX IF NOT EXISTS idx_study_records_created ON study_records(created_at);
CREATE INDEX IF NOT EXISTS idx_wrong_questions_user ON wrong_questions(user_id);
CREATE INDEX IF NOT EXISTS idx_wrong_questions_user_question ON wrong_questions(user_id, question_id);
CREATE INDEX IF NOT EXISTS idx_study_plans_user ON study_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_exam_records_user ON exam_records(user_id);
CREATE INDEX IF NOT EXISTS idx_exam_records_paper ON exam_records(exam_paper_id);

-- 插入初始数据
-- 插入知识点数据
INSERT INTO knowledge_points (title, content, chapter_number, sort_order, importance, tags) VALUES
-- 第一章 总论
('会计概念', '会计是以货币为主要计量单位，运用专门的方法，核算和监督一个单位经济活动的一种经济管理活动。', '1.1', 1, 'important', '["基础概念", "重点"]'),
('会计职能', '会计具有核算职能和监督职能，核算职能是基本职能，监督职能是重要职能。', '1.2', 2, 'important', '["基础概念", "重点"]'),
('会计基本假设', '会计主体、持续经营、会计分期、货币计量是会计核算的基本前提。', '1.3', 3, 'important', '["基础概念", "重点"]'),
('会计信息质量要求', '相关性、可靠性、可理解性、可比性、实质重于形式、重要性、谨慎性、及时性。', '1.4', 4, 'important', '["基础概念", "重点"]'),

-- 第二章 会计政策、会计估计及其变更和差错更正
('会计政策', '企业在会计确认、计量和报告中所采用的原则、基础和会计处理方法。', '2.1', 5, 'important', '["会计政策", "重点"]'),
('会计估计', '企业对其结果不确定的交易或事项以最近可利用的信息为基础所作的判断。', '2.2', 6, 'important', '["会计估计", "重点"]'),
('前期差错更正', '企业发现前期财务报表存在错误时的处理方法。', '2.3', 7, 'important', '["差错更正", "重点"]'),

-- 第三章 存货
('存货的确认', '存货是指企业在日常活动中持有以备出售的产成品或商品、处在生产过程中的在产品、在生产过程或提供劳务过程中耗用的材料和物料等。', '3.1', 8, 'important', '["存货", "重点"]'),
('存货的初始计量', '存货应当按照成本进行初始计量。存货成本包括采购成本、加工成本和其他成本。', '3.2', 9, 'important', '["存货", "重点"]'),
('发出存货的计量', '企业应当采用先进先出法、移动加权平均法、月末一次加权平均法或者个别计价法确定发出存货的实际成本。', '3.3', 10, 'important', '["存货", "重点"]');

-- 插入示例题目
INSERT INTO questions (content, type, options, correct_answer, explanation, knowledge_point_id, difficulty, tags) VALUES
('下列各项中，属于会计信息质量要求的是（）', 'single', '["A. 相关性", "B. 重要性", "C. 谨慎性", "D. 以上都是"]', 'D', '会计信息质量要求包括相关性、可靠性、可理解性、可比性、实质重于形式、重要性、谨慎性和及时性。', 4, 'easy', '["基础题", "概念题"]'),
('企业购入材料一批，价款10000元，增值税1300元，运杂费500元，该批材料的入账价值为（）元', 'single', '["A. 10000", "B. 10500", "C. 11300", "D. 11800"]', 'B', '材料的入账价值=买价+运杂费=10000+500=10500元，增值税可以抵扣，不计入材料成本。', 9, 'medium', '["计算题", "存货"]'),
('会计的基本职能包括（）', 'multiple', '["A. 核算职能", "B. 监督职能", "C. 预测职能", "D. 决策职能"]', 'AB', '会计的基本职能是核算职能和监督职能，其中核算职能是基本职能。', 2, 'easy', '["基础题", "概念题"]'),
('会计主体假设要求企业应当对其本身发生的交易或事项进行会计确认、计量和报告。（）', 'judge', '[]', '正确', '会计主体假设明确了会计核算的空间范围，要求企业只对自身的交易或事项进行会计处理。', 3, 'easy', '["基础题", "判断题"]');

-- 插入示例试卷
INSERT INTO exam_papers (title, description, type, question_ids, duration, total_score, pass_score, question_distribution, instructions) VALUES
('中级会计实务模拟试卷一', '根据最新考试大纲编制的模拟试卷', 'mock', '[1, 2, 3, 4]', 120, 100, 60, '{"single": 2, "multiple": 1, "judge": 1, "calculation": 0}', '["本试卷共4题，满分100分", "考试时间120分钟", "请仔细审题，认真作答"]');

-- 创建更新时间触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为所有表创建更新时间触发器
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_knowledge_points_updated_at BEFORE UPDATE ON knowledge_points FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_questions_updated_at BEFORE UPDATE ON questions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_study_records_updated_at BEFORE UPDATE ON study_records FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_wrong_questions_updated_at BEFORE UPDATE ON wrong_questions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_study_plans_updated_at BEFORE UPDATE ON study_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_exam_papers_updated_at BEFORE UPDATE ON exam_papers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_exam_records_updated_at BEFORE UPDATE ON exam_records FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();