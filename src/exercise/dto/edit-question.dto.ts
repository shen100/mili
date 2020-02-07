import { MinLength, MaxLength, IsString, IsEnum, Validate, ValidateIf } from 'class-validator';
import { QuestionConstants } from '../../constants/exercise';
import { QuestionType } from '../../entity/question.entity';
import { OptionsValidator } from './validation/OptionsValidator';
import { QuestionOption } from '../../entity/question.option.entity';
import { AnswersValidator } from './validation/AnswersValidator';

export class EditQuestionDto {
    @MinLength(1, {
        message: '题目不能为空',
    })
    @MaxLength(QuestionConstants.TitleMaxLength, {
        message: '题目不能超过 $constraint1 个字符',
    })
    @IsString()
    readonly title: string;

    @ValidateIf(obj => {
        return obj && typeof obj.codeSnippet !== 'undefined' && obj.codeSnippet !== '';
    })
    @MaxLength(QuestionConstants.CodeSnippetMaxLength, {
        message: '代码段不能超过 $constraint1 个字符',
    })
    @IsString()
    readonly codeSnippet: string;

    @IsEnum(QuestionType, {
        message: '无效的题型',
    })
    readonly type: number;

    @Validate(OptionsValidator, {
        message: '无效的选项',
    })
    options: QuestionOption[];

    @Validate(AnswersValidator, {
        message: '无效的答案',
    })
    answers: string[];

    @ValidateIf(obj => {
        return obj && typeof obj.analysis !== 'undefined';
    })
    @MaxLength(QuestionConstants.AnalysisMaxLength, {
        message: '答题解析不能超过 $constraint1 个字符',
    })
    @IsString()
    readonly analysis: string;
}