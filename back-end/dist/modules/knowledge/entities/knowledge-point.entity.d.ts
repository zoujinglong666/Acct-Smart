import { BaseEntity } from '../../../common/entities/base.entity';
import { Question } from '../../question/entities/question.entity';
export declare class KnowledgePoint extends BaseEntity {
    title: string;
    content: string;
    parentId: number;
    chapterNumber: string;
    sortOrder: number;
    importance: 'basic' | 'important' | 'difficult';
    tags: string[];
    studyCount: number;
    parent: KnowledgePoint;
    children: KnowledgePoint[];
    questions: Question[];
}
