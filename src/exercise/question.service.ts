import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question, QuestionType } from '../entity/question.entity';
import { EditQuestionDto } from './dto/edit-question.dto';
import { QuestionOption } from '../entity/question.option.entity';
import { ListResult } from '../entity/listresult.entity';

@Injectable()
export class QuestionService {

    constructor(
        @InjectRepository(Question)
        private readonly questionRepository: Repository<Question>,
    ) {}

    async list(page: number, pageSize: number): Promise<ListResult<Question>> {
        const [ list, count ] = await Promise.all([
            this.questionRepository.find({
                order: {
                    updatedAt: 'DESC',
                },
                skip: (page - 1) * pageSize,
                take: pageSize,
            }),
            this.questionRepository.count(),
        ]);
        return {
            list,
            count,
            page,
            pageSize,
        };
    }

    async detail(id: number) {
        return await this.questionRepository.findOne({
            where: {
                id,
            },
            relations: ['options'],
        });
    }

    async create(createQuestionDto: EditQuestionDto, userID: number) {
        const question = new Question();
        question.title = createQuestionDto.title;
        question.type = createQuestionDto.type;
        question.analysis = createQuestionDto.analysis;
        question.codeSnippet = createQuestionDto.codeSnippet || '';
        if (createQuestionDto.type === QuestionType.Radio) {
            question.answers = createQuestionDto.answers[0];
        } else if (createQuestionDto.type === QuestionType.Multiple) {
            question.answers = createQuestionDto.answers.join(',');
        }
        question.userID = userID;
        question.createdAt = question.updatedAt = new Date();
        let questionResult;
        await this.questionRepository.manager.connection.transaction(async manager => {
            questionResult = await manager.getRepository(Question).save(question);
            const options: QuestionOption[] = createQuestionDto.options.map(opt => {
                const questionOption = new QuestionOption();
                questionOption.optionValue = opt.optionValue;
                questionOption.optionDesc = opt.optionDesc;
                questionOption.questionID = questionResult.id;
                return questionOption;
            });
            await manager.getRepository(QuestionOption).insert(options);
        });
        return questionResult;
    }

    async update(questionID: number, editQuestionDto: EditQuestionDto, userID: number) {
        let answers: string;
        if (editQuestionDto.type === QuestionType.Radio) {
            answers = editQuestionDto.answers[0];
        } else if (editQuestionDto.type === QuestionType.Multiple) {
            answers = editQuestionDto.answers.join(',');
        }
        await this.questionRepository.manager.connection.transaction(async manager => {
            await manager.getRepository(Question).update({
                id: questionID,
            }, {
                title: editQuestionDto.title,
                type: editQuestionDto.type,
                analysis: editQuestionDto.analysis,
                codeSnippet: editQuestionDto.codeSnippet || '',
                answers,
                updatedAt: new Date(),
                userID,
            });
            const newOptions: QuestionOption[] = [];
            const optionSQLArr = [ 'UPDATE question_options SET option_desc = CASE id ' ];
            const optionSQLParams = [];
            let hasUpdateOption = false;
            editQuestionDto.options.map(opt => {
                if (opt.id) {
                    hasUpdateOption = true;
                    optionSQLArr.push('WHEN ? THEN ?');
                    optionSQLParams.push(...[opt.id, opt.optionDesc]);
                    return;
                }
                const questionOption = new QuestionOption();
                questionOption.optionValue = opt.optionValue;
                questionOption.optionDesc = opt.optionDesc;
                questionOption.questionID = questionID;
                newOptions.push(questionOption);
            });
            optionSQLArr.push('ELSE NULL');
            optionSQLArr.push('END');
            optionSQLArr.push('WHERE question_id = ?');
            optionSQLParams.push(questionID);
            if (hasUpdateOption) {
                await manager.query(optionSQLArr.join(' '), optionSQLParams);
            }
            if (newOptions.length) {
                await manager.getRepository(QuestionOption).insert(newOptions);
            }
        });
    }
}