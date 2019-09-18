import * as util from 'util';
import * as _ from 'lodash';
import {
    Controller, Get, Res, Param, Post, Body, UseGuards, Query, Delete,
} from '@nestjs/common';
import { BoilingPointService } from './boilingpoint.service';
import { TopicService } from './topic.service';
import { OSSService } from '../common/oss.service';
import { BoilingPointTopic, BoilingPoint, ReportReasons, BoilingPointReport } from '../entity/boilingpoint.entity';
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
import { In } from 'typeorm';
import { Image } from '../entity/image.entity';
import { User } from '../entity/user.entity';
import { ConfigService } from '../config/config.service';
import { RedisService } from '../redis/redis.service';

@Controller()
export class BoilingPointController {
    constructor(
        private readonly boilingPointService: BoilingPointService,
        private readonly topicService: TopicService,
        private readonly userService: UserService,
        private readonly ossService: OSSService,
        private readonly configService: ConfigService,
        private readonly redisService: RedisService,
    ) {}

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

    @Get('/boiling/:id')
    async detailView(@CurUser() user, @Param('id', MustIntPipe) id: number, @Res() res) {
        const boilingPoint = await this.boilingPointService.findOne({
            where: { id },
        });
        const imgIDArr: number[] = [];
        if (boilingPoint.imgs) {
            const ids = boilingPoint.imgs.split(',');
            imgIDArr.push(...ids.map(idStr => parseInt(idStr, 10)));
        }
        const boilingPointData = {
            ...boilingPoint,
            imgs: [],
            userLiked: false,
            isFollowed: false,
            createdAtLabel: recentTime(boilingPoint.createdAt, 'YYYY.MM.DD HH:mm'),
        };
        let author: User, likes: number[], images: Image[], recommends: BoilingPoint[];
        [author, likes, images, recommends] = await Promise.all([
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
            user ? this.boilingPointService.userLikes([ boilingPoint.id ], user.id) : Promise.resolve([]),
            imgIDArr.length ? this.ossService.findImages(imgIDArr) : Promise.resolve([]),
            this.boilingPointService.recommendsInTopic(),
        ]);

        const follows = await (user ? this.userService.usersFilterByFollowerID([boilingPoint.userID] , user.id) : Promise.resolve([]));
        boilingPointData.user = author;
        boilingPointData.userLiked = !!(likes && likes.length);
        boilingPointData.isFollowed = !!(follows && follows.length);
        if (images && images.length) {
            boilingPointData.imgs = [
                {
                    ...images[0],
                    url: this.configService.static.uploadImgURL + images[0].url,
                },
            ];
        }
        res.render('pages/boilingpoint/boilingpointDetail', {
            boilingPoint: boilingPointData,
            recommends,
        });
    }

    @Get('/boilings/:type')
    async boilingTypeView(@Param('type') type: string, @Res() res) {
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
        const imgIDArr: number[] = [];
        const imageMap = {};
        globalRecommends.map(r => {
            if (r.imgs) {
                const ids = r.imgs.split(',');
                imgIDArr.push(...ids.map(idStr => parseInt(idStr, 10)));
            }
        });
        const images: Image[] = await (imgIDArr.length ? this.ossService.findImages(imgIDArr) : Promise.resolve([]));
        images.map(img => imageMap[img.id] = img);
        const theGlobalRecommends = globalRecommends.map(bp => {
            let imgs: any[] = [];
            if (bp.imgs) {
                const ids = bp.imgs.split(',');
                imgs = ids.map(imgID => {
                    return {
                        ...imageMap[imgID],
                        url: this.configService.static.uploadImgURL + imageMap[imgID].url,
                    };
                });
            }
            return {
                ...bp,
                imgs,
            };
        });
        res.render('pages/boilingpoint/boilingpoint', {
            uploadPolicy,
            topics,
            boilingPointType: type,
            globalRecommends: theGlobalRecommends,
        });
    }

    @Post(`${APIPrefix}/boilingpoints`)
    @UseGuards(ActiveGuard)
    async create(@CurUser() user, @Body() editBoilingPointDto: EditBoilingPointDto) {
        const insertId = await this.boilingPointService.create(editBoilingPointDto, user.id);
        const now = new Date();
        const boilingPoint = new BoilingPoint();
        boilingPoint.id = insertId;
        boilingPoint.htmlContent = editBoilingPointDto.htmlContent;
        boilingPoint.createdAt = now;
        boilingPoint.browseCount = 0;
        boilingPoint.commentCount = 0;
        boilingPoint.userID = user.id;
        boilingPoint.topicID = editBoilingPointDto.topicID;
        if (boilingPoint.topicID) {
            boilingPoint.topic = await this.topicService.basic(boilingPoint.topicID);
        }
        await this.redisService.delCache(util.format(this.redisService.cacheKeys.user, user.id));
        return {
            ...boilingPoint,
            imgs: editBoilingPointDto.imgs && editBoilingPointDto.imgs.length ? editBoilingPointDto.imgs : [],
        };
    }

    @Get(`${APIPrefix}/boilingpoints`)
    async list(@CurUser() user, @Query('topicID', MustIntPipe) topicID: number, @Query('page', ParsePagePipe) page: number) {
        const [topic, boilingPoints] = await Promise.all([
            this.topicService.basic(topicID),
            this.boilingPointService.listByTopic(topicID, page),
        ]);
        if (!topic) {
            throw new MyHttpException({
                errorCode: ErrorCode.NotFound.CODE,
            });
        }
        const userIDMap = {};
        const userIDs: number[] = [];
        const boilingpointIDs: number[] = [];
        const list = boilingPoints.list.map(boilingPoint => {
            boilingpointIDs.push(boilingPoint.id);
            boilingPoint.topic = topic;
            if (!userIDMap[boilingPoint.userID]) {
                userIDs.push(boilingPoint.userID);
                userIDMap[boilingPoint.userID] = true;
            }
            return {
                ...boilingPoint,
                userLiked: false,
                createdAtLabel: recentTime(boilingPoint.createdAt, 'YYYY.MM.DD HH:mm'),
            };
        });
        const [users, likes] = await Promise.all([
            this.userService.findUsers({
                id: In(userIDs),
            }, {
                id: true,
                username: true,
                avatarURL: true,
                job: true,
                company: true,
            }),
            this.boilingPointService.userLikes(boilingpointIDs, user && user.id),
        ]);

        const userMap = {};
        users.map(u => userMap[u.id] = u);
        const likesMap = {};
        likes.map(boilingPointID => likesMap[boilingPointID] = true);
        list.map(bp => {
            bp.user = userMap[bp.userID];
            bp.userLiked = !!likesMap[bp.id];
        });
        return {
            topic,
            ...boilingPoints,
            list,
        };
    }

    @Get(`${APIPrefix}/boilingpoints/recommend`)
    async recommend(@CurUser() user, @Query('page', ParsePagePipe) page: number) {
        const boilingPoints = await this.boilingPointService.recommend(page);
        const boilingpointIDs: number[] = [];
        const topicIDMap = {};
        const topicIDs: number[] = [];
        const userIDMap = {};
        const userIDs: number[] = [];
        const imgIDArr: number[] = [];
        const list = boilingPoints.list.map(boilingPoint => {
            boilingpointIDs.push(boilingPoint.id);
            if (boilingPoint.imgs) {
                const ids = boilingPoint.imgs.split(',');
                imgIDArr.push(...ids.map(idStr => parseInt(idStr, 10)));
            }
            if (!userIDMap[boilingPoint.userID]) {
                userIDs.push(boilingPoint.userID);
                userIDMap[boilingPoint.userID] = true;
            }
            if (!topicIDMap[boilingPoint.topicID]) {
                topicIDMap[boilingPoint.topicID] = true;
                topicIDs.push(boilingPoint.topicID);
            }
            return {
                ...boilingPoint,
                imgs: boilingPoint.imgs ? boilingPoint.imgs.split(',') : [],
                middleImgs: [],
                bigImgs: [],
                userLiked: false,
                createdAtLabel: recentTime(boilingPoint.createdAt, 'YYYY.MM.DD HH:mm'),
            };
        });
        let topics: BoilingPointTopic[], users: User[], likes: number[], images: Image[];
        const topicMap = {}, userMap = {}, likeMap = {}, imageMap = {};
        [topics, users, likes, images] = await Promise.all([
            this.topicService.listInIDs(topicIDs),
            this.userService.findUsers({
                id: In(userIDs),
            }, {
                id: true,
                username: true,
                avatarURL: true,
                job: true,
                company: true,
            }),
            user ? this.boilingPointService.userLikes(boilingpointIDs, user.id) : Promise.resolve([]),
            imgIDArr.length ? this.ossService.findImages(imgIDArr) : Promise.resolve([]),
        ]);
        topics.map(t => {
            topicMap[t.id] = t;
        });

        const uniqueUserIDs: number[] = [];
        users.map(u => {
            userMap[u.id] = u;
            uniqueUserIDs.push(u.id);
        });
        const follows = await (user ? this.userService.usersFilterByFollowerID(uniqueUserIDs, user.id) : Promise.resolve([]));
        const followIDMap = {};
        follows.forEach(followData => followIDMap[followData.userID] = true);
        likes.map(boilingPointID => likeMap[boilingPointID] = true);
        images.map(img => imageMap[img.id] = img);
        list.map(bp => {
            bp.topic = topicMap[bp.topicID];
            bp.user = {
                ...userMap[bp.userID],
                isFollowed: !!followIDMap[bp.userID],
            };
            bp.userLiked = !!likeMap[bp.id];
            bp.imgs = bp.imgs.map(imgID => {
                return {
                    ...imageMap[imgID],
                    url: this.configService.static.uploadImgURL + imageMap[imgID].url,
                };
            });
            bp.middleImgs = bp.imgs;
            bp.bigImgs = bp.imgs;
        });
        return {
            ...boilingPoints,
            list,
        };
    }

    @Get(`${APIPrefix}/boilingpoints/user/:userID`)
    async userBoilingPoints(@CurUser() user, @Query('page', ParsePagePipe) page: number) {
        const boilingPoints = await this.boilingPointService.recommend(page);
        const boilingpointIDs: number[] = [];
        const topicIDMap = {};
        const topicIDs: number[] = [];
        const userIDMap = {};
        const userIDs: number[] = [];
        const imgIDArr: number[] = [];
        const list = boilingPoints.list.map(boilingPoint => {
            boilingpointIDs.push(boilingPoint.id);
            if (boilingPoint.imgs) {
                const ids = boilingPoint.imgs.split(',');
                imgIDArr.push(...ids.map(idStr => parseInt(idStr, 10)));
            }
            if (!userIDMap[boilingPoint.userID]) {
                userIDs.push(boilingPoint.userID);
                userIDMap[boilingPoint.userID] = true;
            }
            if (!topicIDMap[boilingPoint.topicID]) {
                topicIDMap[boilingPoint.topicID] = true;
                topicIDs.push(boilingPoint.topicID);
            }
            return {
                ...boilingPoint,
                imgs: boilingPoint.imgs ? boilingPoint.imgs.split(',') : [],
                middleImgs: [],
                bigImgs: [],
                userLiked: false,
                createdAtLabel: recentTime(boilingPoint.createdAt, 'YYYY.MM.DD HH:mm'),
            };
        });
        let topics: BoilingPointTopic[], users: User[], likes: number[], images: Image[];
        const topicMap = {}, userMap = {}, likeMap = {}, imageMap = {};
        [topics, users, likes, images] = await Promise.all([
            this.topicService.listInIDs(topicIDs),
            this.userService.findUsers({
                id: In(userIDs),
            }, {
                id: true,
                username: true,
                avatarURL: true,
                job: true,
                company: true,
            }),
            user ? this.boilingPointService.userLikes(boilingpointIDs, user.id) : Promise.resolve([]),
            imgIDArr.length ? this.ossService.findImages(imgIDArr) : Promise.resolve([]),
        ]);
        topics.map(t => {
            topicMap[t.id] = t;
        });

        const uniqueUserIDs: number[] = [];
        users.map(u => {
            userMap[u.id] = u;
            uniqueUserIDs.push(u.id);
        });
        const follows = await (user ? this.userService.usersFilterByFollowerID(uniqueUserIDs, user.id) : Promise.resolve([]));
        const followIDMap = {};
        follows.forEach(followData => followIDMap[followData.userID] = true);
        likes.map(boilingPointID => likeMap[boilingPointID] = true);
        images.map(img => imageMap[img.id] = img);
        list.map(bp => {
            bp.topic = topicMap[bp.topicID];
            bp.user = {
                ...userMap[bp.userID],
                isFollowed: !!followIDMap[bp.userID],
            };
            bp.userLiked = !!likeMap[bp.id];
            bp.imgs = bp.imgs.map(imgID => {
                return {
                    ...imageMap[imgID],
                    url: this.configService.static.uploadImgURL + imageMap[imgID].url,
                };
            });
            bp.middleImgs = bp.imgs;
            bp.bigImgs = bp.imgs;
        });
        return {
            ...boilingPoints,
            list,
        };
    }

    @Get(`${APIPrefix}/boilingpoints/followed`)
    async followed(@Query('page', ParsePagePipe) page: number) {
        const boilingPoints = await this.boilingPointService.followed(page);
        return {
            ...boilingPoints,
        };
    }

    @Get(`${APIPrefix}/boilingpoints/hot`)
    async hot(@Query('page', ParsePagePipe) page: number) {
        const boilingPoints = await this.boilingPointService.hot(page);
        return {
            ...boilingPoints,
        };
    }

    @Post(`${APIPrefix}/boilingpoints/:boilingpointID/like`)
    @UseGuards(ActiveGuard)
    async like(@CurUser() user, @Param('boilingpointID', MustIntPipe) boilingpointID: number) {
        await this.boilingPointService.like(boilingpointID, user.id);
        return {};
    }

    @Delete(`${APIPrefix}/boilingpoints/:id/like`)
    @UseGuards(ActiveGuard)
    async deleteLike(@CurUser() user, @Param('id', MustIntPipe) id: number) {
        await this.boilingPointService.deleteLike(id, user.id);
        return {};
    }

    @Post(`${APIPrefix}/boilingpoints/:id/report`)
    @UseGuards(ActiveGuard)
    async report(@CurUser() user, @Param('id', MustIntPipe) id: number, @Body('reason') reason: number) {
        if (ReportReasons.indexOf(reason) < 0) {
            throw new MyHttpException({
                errorCode: ErrorCode.ParamsError.CODE,
                message: '参数错误',
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
}