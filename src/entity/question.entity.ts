import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
    OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { QuestionOption } from './question.option.entity';

export enum QuestionType {
    Radio = 1, // 单选
    Multiple = 2, // 多选
}

@Entity({name: 'questions'})
export class Question {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('datetime', { name: 'created_at' })
    createdAt: Date;

    @Column('datetime', { name: 'updated_at' })
    updatedAt: Date;

    @Column('varchar', { length: 200 })
    title: string;

    @Column('varchar', { name: 'code_snippet', length: 2000 })
    codeSnippet: string;

    @Column('varchar', { length: 20 })
    answers: string;

    @Column('tinyint')
    type: QuestionType;

    @OneToMany(type => QuestionOption, option => option.question)
    options: QuestionOption[];

    @Column('varchar', { length: 2000 })
    analysis: string;

    @Column('int', { name: 'user_id' })
    userID: number;

    @ManyToOne(type => User)
    @JoinColumn({ name: 'user_id' })
    user: User;
}