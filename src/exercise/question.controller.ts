import {
    Controller, Post, Body, UseGuards, Get, Query, Param, Put,
} from '@nestjs/common';
import { EditQuestionDto } from './dto/edit-question.dto';
import { ActiveGuard } from '../core/guards/active.guard';
import { AdminAPIPrefix, APIPrefix } from '../constants/constants';
import { CurUser } from '../core/decorators/user.decorator';
import { RolesGuard } from '../core/guards/roles.guard';
import { Roles } from '../core/decorators/roles.decorator';
import { UserRole } from '../entity/user.entity';
import { MyHttpException } from '../core/exception/my-http.exception';
import { ErrorCode } from '../constants/error';
import { QuestionType } from '../entity/question.entity';
import { QuestionService } from './question.service';
import { ParsePagePipe } from '../core/pipes/parse-page.pipe';
import { MustIntPipe } from '../core/pipes/must-int.pipe';

@Controller()
export class QuestionController {
    constructor(
        private readonly questionService: QuestionService,
    ) {
    }

    @Get(`${APIPrefix}/exercises/questions/:id`)
    async detail(@Param('id', MustIntPipe) id: number) {
        return await this.questionService.detail(id);
    }

    @Get(`${AdminAPIPrefix}/exercises/questions`)
    @UseGuards(ActiveGuard, RolesGuard)
    @Roles(UserRole.Editor, UserRole.Admin, UserRole.SuperAdmin)
    async list(@Query('page', ParsePagePipe) page: number) {
        const pageSize = 20;
        return await this.questionService.list(page, pageSize);
    }

    @Post(`${AdminAPIPrefix}/exercises/questions`)
    @UseGuards(ActiveGuard, RolesGuard)
    @Roles(UserRole.Editor, UserRole.Admin, UserRole.SuperAdmin)
    async create(@CurUser() user, @Body() createQuestionDto: EditQuestionDto) {
        if (createQuestionDto.type === QuestionType.Radio && createQuestionDto.answers.length !== 1) {
            throw new MyHttpException({
                errorCode: ErrorCode.ParamsError.CODE,
            });
        }
        if (createQuestionDto.answers.length > createQuestionDto.options.length) {
            throw new MyHttpException({
                errorCode: ErrorCode.ParamsError.CODE,
            });
        }
        const createResult = await this.questionService.create(createQuestionDto, user.id);
        return {
            id: createResult.id,
        };
    }

    @Put(`${AdminAPIPrefix}/exercises/questions/:id`)
    @UseGuards(ActiveGuard, RolesGuard)
    @Roles(UserRole.Editor, UserRole.Admin, UserRole.SuperAdmin)
    async update(@CurUser() user, @Param('id', MustIntPipe) id: number, @Body() editQuestionDto: EditQuestionDto) {
        if (editQuestionDto.type === QuestionType.Radio && editQuestionDto.answers.length !== 1) {
            throw new MyHttpException({
                errorCode: ErrorCode.ParamsError.CODE,
            });
        }
        if (editQuestionDto.answers.length > editQuestionDto.options.length) {
            throw new MyHttpException({
                errorCode: ErrorCode.ParamsError.CODE,
            });
        }
        await this.questionService.update(id, editQuestionDto, user.id);
        return {};
    }
}