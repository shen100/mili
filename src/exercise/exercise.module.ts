import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from '../entity/question.entity';
import { QuestionOption } from '../entity/question.option.entity';
import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Question,
            QuestionOption,
        ]),
    ],
    controllers: [
        QuestionController,
    ],
    providers: [
        QuestionService,
    ],
})
export class ExerciseModule {}