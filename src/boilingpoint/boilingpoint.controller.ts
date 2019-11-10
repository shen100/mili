import * as util from 'util';
import * as _ from 'lodash';
import {
    Controller, Get, Res, Param, Post, Body, UseGuards, Query, Delete,
} from '@nestjs/common';
import { BoilingPointService } from './boilingpoint.service';
import { TopicService } from './topic.service';
import { OSSService } from '../common/oss.service';
import { BoilingPointTopic, BoilingPoint, ReportReasons } from '../entity/boilingpoint.entity';
import { MyHttpException } from '../core/exception/my-http.exception';
import { ErrorCode } from '../constants/error';
import { EditBoilingPointDto } from './dto/edit-boilingpoint.dto';
import { APIPrefix } from '../constants/constants';
import { CurUser } from '../core/decorators/user.decorator';
import { ActiveGuard } from '../core/guards/active.guard';
import { UserService } from '../user/user.service';
import { MustIntPipe } from '../core/pipes/must-int.pipe';
import { ParsePagePipe } from '../core/pipes/parse-page.pipe';
import { recentTime } from '../utils/viewfilter';
import { Image } from '../entity/image.entity';
import { User } from '../entity/user.entity';
import { RedisService } from '../redis/redis.service';

@Controller()
export class BoilingPointController {
    constructor(
        private readonly boilingPointService: BoilingPointService,
        private readonly topicService: TopicService,
        private readonly userService: UserService,
        private readonly ossService: OSSService,
        private readonly redisService: RedisService,
    ) {}

    /**
     * 话题下的沸点页面
     */
    @Get('/boilings/topic/:topicID')
    async boilingView(@Param('topicID', MustIntPipe) topicID: number, @Res() res) {
        const [ uploadPolicy, topics, globalRecommends ] = await Promise.all([
            this.ossService.requestPolicy(),
            this.topicService.list(),
            this.boilingPointService.globalRecommends(),
        ]);
        const curTopic: BoilingPointTopic = topics.find(t => t.id === topicID);
        if (!curTopic) {
            throw new MyHttpException({
                errorCode: ErrorCode.NotFound.CODE,
            });
        }
        res.render('pages/boilingpoint/boilingpoint', {
            uploadPolicy,
            topics,
            topicID,
            boilingPointType: 'topic',
            globalRecommends,
        });
    }

    /**
     * 沸点详情页面
     */
    @Get('/boiling/:id')
    async detailView(@CurUser() user, @Param('id', MustIntPipe) id: number, @Res() res) {
        const boilingPoint = await this.boilingPointService.findOne({
            where: { id },
        });
        if (!boilingPoint) {
            throw new MyHttpException({
                errorCode: ErrorCode.NotFound.CODE,
            });
        }
        const imgIDArr: number[] = [];
        if (boilingPoint.imgs) {
            // 519,520
            const ids = boilingPoint.imgs.split(',');
            imgIDArr.push(...ids.map(idStr => parseInt(idStr, 10)));
        }
        const boilingPointData = {
            ...boilingPoint,
            imgs: [],
            middleImgs: [],
            bigImgs: [],
            userLiked: false,
            isFollowed: false,
            createdAtLabel: recentTime(boilingPoint.createdAt, 'YYYY.MM.DD HH:mm'),
        };
        let author: User, likes: number[], images: Image[], recommends;
        let follows: any[], uploadPolicy;
        [author, likes, images, recommends, follows, uploadPolicy] = await Promise.all([
            this.userService.findOne({
                where: { id: boilingPoint.userID },
                select: {
                    id: true,
                    username: true,
                    avatarURL: true,
                    job: true,
                    company: true,
                },
            }),
            user ? this.boilingPointService.userLikeBoilingPointIDs([ boilingPoint.id ], user.id) : Promise.resolve([]),
            imgIDArr.length ? this.ossService.findImages(imgIDArr) : Promise.resolve([]),
            this.boilingPointService.globalRecommends(),
            (user ? this.userService.usersFilterByFollowerID([boilingPoint.userID], user.id) : Promise.resolve([])),
            this.ossService.requestPolicy(),
        ]);
        boilingPointData.user = author;
        boilingPointData.userLiked = !!(likes && likes.length);
        boilingPointData.isFollowed = !!(follows && follows.length);
        if (images && images.length) {
            boilingPointData.imgs = images.map(imgItem => {
                return {
                    ...imgItem,
                    url: this.ossService.getImageURL(imgItem.url),
                };
            });
            boilingPointData.middleImgs = boilingPointData.imgs;
            boilingPointData.bigImgs = boilingPointData.imgs;
        }
        res.render('pages/boilingpoint/boilingpointDetail', {
            boilingPoint: boilingPointData,
            recommends,
            uploadPolicy,
        });
    }

    /**
     * 推荐、热门、关注页面
     */
    @Get('/boilings/:type')
    async boilingTypeView(@CurUser() user, @Param('type') type: string, @Res() res) {
        if (['recommend', 'hot', 'followed'].indexOf(type) < 0) {
            throw new MyHttpException({
                errorCode: ErrorCode.NotFound.CODE,
            });
        }
        const [ uploadPolicy, topics, globalRecommends ] = await Promise.all([
            this.ossService.requestPolicy(),
            this.topicService.list(),
            this.boilingPointService.globalRecommends(),
        ]);
        res.render('pages/boilingpoint/boilingpoint', {
            user,
            uploadPolicy,
            topics,
            topicID: undefined,
            boilingPointType: type,
            globalRecommends,
        });
    }

    /**
     * 推荐沸点
     */
    @Get(`${APIPrefix}/boilingpoints/recommend`)
    async recommend(@CurUser() user, @Query('page', ParsePagePipe) page: number) {
        const boilingPoints = await this.boilingPointService.recommend(page);
        const list = await this.boilingPointService.fillBoilingPointsRelativeData(boilingPoints.list, user ? user.id : undefined);
        return {
            ...boilingPoints,
            list,
        };
    }

    /**
     * 热门沸点
     */
    @Get(`${APIPrefix}/boilingpoints/hot`)
    async hot(@CurUser() user, @Query('page', ParsePagePipe) page: number) {
        const boilingPoints = await this.boilingPointService.hot(page);
        const list = await this.boilingPointService.fillBoilingPointsRelativeData(boilingPoints.list, user ? user.id : undefined);
        return {
            ...boilingPoints,
            list,
        };
    }

    /**
     * 关注的沸点
     */
    @Get(`${APIPrefix}/boilingpoints/followed`)
    @UseGuards(ActiveGuard)
    async followed(@CurUser() user, @Query('page', ParsePagePipe) page: number) {
        const boilingPoints = await this.boilingPointService.followed(page);
        const list = await this.boilingPointService.fillBoilingPointsRelativeData(boilingPoints.list, user ? user.id : undefined);
        return {
            ...boilingPoints,
            list,
        };
    }

    /**
     * 话题下的沸点
     */
    @Get(`${APIPrefix}/boilingpoints/topic`)
    async listByTopic(@CurUser() user, @Query('topicID', MustIntPipe) topicID: number, @Query('page', ParsePagePipe) page: number) {
        const [topic, boilingPoints] = await Promise.all([
            this.topicService.basic(topicID),
            this.boilingPointService.listByTopic(topicID, page),
        ]);
        if (!topic) {
            throw new MyHttpException({
                errorCode: ErrorCode.NotFound.CODE,
            });
        }
        const list = await this.boilingPointService.fillBoilingPointsRelativeData(boilingPoints.list, user ? user.id : undefined);
        return {
            ...boilingPoints,
            list,
        };
    }

    /**
     * 用户创建的沸点
     */
    @Get(`${APIPrefix}/boilingpoints/user/:authorID`)
    async userBoilingPoints(@CurUser() user, @Param('authorID', MustIntPipe) authorID: number, @Query('page', ParsePagePipe) page: number) {
        const pageSize = 20;
        const [author, listResult] = await Promise.all([
            this.userService.findOne({
                where: { id: authorID },
                select: ['id', 'username', 'avatarURL'],
            }),
            this.boilingPointService.userBoilingPoints(user.id, page, pageSize),
        ]);
        if (!author) {
            throw new MyHttpException({
                errorCode: ErrorCode.NotFound.CODE,
            });
        }
        const list = await this.boilingPointService.fillBoilingPointsRelativeData(listResult.list, user ? user.id : undefined);
        return {
            ...listResult,
            list,
        };
    }

    /**
     * 用户点过赞的沸点
     */
    @Get(`${APIPrefix}/boilingpoints/user/:authorID/like`)
    async userLikeBoilingPoints(@CurUser() user, @Param('authorID', MustIntPipe) authorID: number, @Query('page', ParsePagePipe) page: number) {
        const userID = user ? user.id : undefined;
        const pageSize: number = 20;
        const [author, listResult] = await Promise.all([
            this.userService.findOne({
                where: { id: authorID },
                select: ['id', 'username', 'avatarURL'],
            }),
            this.boilingPointService.userLikeBoilingPoints(authorID, page, pageSize),
        ]);
        if (!author) {
            throw new MyHttpException({
                errorCode: ErrorCode.NotFound.CODE,
            });
        }
        const list = await this.boilingPointService.fillBoilingPointsRelativeData(listResult.list, userID);
        return {
            ...listResult,
            list,
        };
    }

    /**
     * 创建沸点
     */
    @Post(`${APIPrefix}/boilingpoints`)
    @UseGuards(ActiveGuard)
    async create(@CurUser() user, @Body() editBoilingPointDto: EditBoilingPointDto) {
        const [ insertId ] = await Promise.all([
            this.boilingPointService.create(editBoilingPointDto, user.id),
            this.redisService.delCache(util.format(this.redisService.cacheKeys.user, user.id)),
        ]);
        const now = new Date();
        const boilingPoint = new BoilingPoint();
        boilingPoint.id = insertId;
        boilingPoint.htmlContent = editBoilingPointDto.htmlContent;
        boilingPoint.createdAt = now;
        boilingPoint.browseCount = 0;
        boilingPoint.commentCount = 0;
        boilingPoint.rootCommentCount = 0;
        boilingPoint.userID = user.id;
        boilingPoint.topicID = editBoilingPointDto.topicID;
        if (boilingPoint.topicID) {
            boilingPoint.topic = await this.topicService.basic(boilingPoint.topicID);
        }
        return {
            ...boilingPoint,
            imgs: editBoilingPointDto.imgs && editBoilingPointDto.imgs.length ? editBoilingPointDto.imgs : [],
        };
    }

    /**
     * 点赞
     */
    @Post(`${APIPrefix}/boilingpoints/:id/like`)
    @UseGuards(ActiveGuard)
    async like(@CurUser() user, @Param('id', MustIntPipe) id: number) {
        await this.boilingPointService.like(id, user.id);
        return {};
    }

    /**
     * 举报沸点
     */
    @Post(`${APIPrefix}/boilingpoints/:id/report`)
    @UseGuards(ActiveGuard)
    async report(@CurUser() user, @Param('id', MustIntPipe) id: number, @Body('reason') reason: number) {
        if (ReportReasons.indexOf(reason) < 0) {
            throw new MyHttpException({
                errorCode: ErrorCode.ParamsError.CODE,
            });
        }
        const boilingPoint = await this.boilingPointService.findOne({
            where: { id },
            select: [ 'id' ],
        });
        if (!boilingPoint) {
            throw new MyHttpException({
                errorCode: ErrorCode.NotFound.CODE,
            });
        }
        await this.boilingPointService.report(boilingPoint.id, user.id, reason);
        return {};
    }

    /**
     * 取消点赞
     */
    @Delete(`${APIPrefix}/boilingpoints/:id/like`)
    @UseGuards(ActiveGuard)
    async deleteLike(@CurUser() user, @Param('id', MustIntPipe) id: number) {
        await this.boilingPointService.deleteLike(id, user.id);
        return {};
    }
}