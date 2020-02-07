import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Question } from './question.entity';

enum QuestionAnswer {
    A = 'A',
    B = 'B',
    C = 'C',
    D = 'D',
    E = 'E',
    F = 'F',
    G = 'G',
    H = 'H',
    I = 'I',
    J = 'J',
    K = 'K',
}

@Entity({name: 'question_options'})
export class QuestionOption {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('char', { name: 'option_value', length: 1 })
    optionValue: QuestionAnswer;

    @Column('varchar', { name: 'option_desc', length: 200 })
    optionDesc: string;

    @Column('int', { name: 'question_id' })
    questionID: number;

    @ManyToOne(type => Question, question => question.options)
    @JoinColumn({name: 'question_id'})
    question: Question;
}