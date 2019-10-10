import {
    Controller, Get, Res, Param,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CategoryService } from './category.service';
import { MyHttpException } from '../core/exception/my-http.exception';
import { ErrorCode } from '../constants/error';

@Controller()
export class RecommendController {
    constructor(
        private readonly categoryService: CategoryService,
    ) {}

    @Get('/recommendations/authors/:categoryPathName')
    async usersView(@Param('categoryPathName') categoryPathName: string, @Res() res) {
        const [categories] = await Promise.all([
            this.categoryService.all(),
        ]);
        const category = categories.find(c => c.pathname === categoryPathName);
        if (!category && categoryPathName !== 'recommended') {
            throw new MyHttpException({
                errorCode: ErrorCode.NotFound.CODE,
            });
        }
        res.render('pages/recommendations/authors', {
            categoryPathName,
            categories,
        });
    }
}