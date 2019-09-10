import * as _ from 'lodash';
import {
    Controller, Get, Res, Param, Post, Body, UseGuards, Query, Delete,
} from '@nestjs/common';
import { BoilingPointService } from './boilingpoint.service';
import { TopicService } from './topic.service';
import { OSSService } from '../common/oss.service';
import { BoilingPointTopic, BoilingPoint } from '../entity/boilingpoint.entity';
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

@Controller()
export class BoilingPointController {
    constructor(
        private readonly boilingPointService: BoilingPointService,
        private readonly topicService: TopicService,
        private readonly userService: UserService,
        private readonly ossService: OSSService,
        private readonly configService: ConfigService,
    ) {}

    @Get('/boiling/topic/:topicID')
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
            boilingPointType: '',
            globalRecommends,
        });
    }

    @Get('/boiling/:type')
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
        res.render('pages/boilingpoint/boilingpoint', {
            uploadPolicy,
            topics,
            boilingPointType: type,
            globalRecommends,
        });
    }

    @Post(`${APIPrefix}/boilingpoints`)
    @UseGuards(ActiveGuard)
    async create(@CurUser() user, @Body() editBoilingPointDto: EditBoilingPointDto) {
        const result = await this.boilingPointService.create(editBoilingPointDto, user.id);
        const now = new Date();
        const boilingPoint = new BoilingPoint();
        boilingPoint.id = result.raw.insertId;
        boilingPoint.htmlContent = editBoilingPointDto.htmlContent;
        boilingPoint.createdAt = now;
        boilingPoint.browseCount = 0;
        boilingPoint.commentCount = 0;
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
            return {
                ...boilingPoint,
                imgs: boilingPoint.imgs ? boilingPoint.imgs.split(',') : [],
                userLiked: false,
                createdAtLabel: recentTime(boilingPoint.createdAt, 'YYYY.MM.DD HH:mm'),
            };
        });
        let users: User[], likes: number[], images: Image[];
        const userMap = {}, likeMap = {}, imageMap = {};
        [users, likes, images] = await Promise.all([
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
            imgIDArr.length ? this.ossService.findImages(imgIDArr) : Promise.resolve([]),
        ]);
        const uniqueUserIDs: number[] = [];
        users.map(u => {
            userMap[u.id] = u;
            uniqueUserIDs.push(u.id);
        });

        const follows = await this.userService.usersFilterByFollowerID(uniqueUserIDs, user.id);
        const followIDMap = {};
        follows.forEach(followData => followIDMap[followData.userID] = true);
        _.forIn(userMap, (value, userID) => value.isFollowed = !!followIDMap[userID]);
        likes.map(boilingPointID => likeMap[boilingPointID] = true);
        images.map(img => imageMap[img.id] = img);
        list.map(bp => {
            bp.user = userMap[bp.userID];
            bp.userLiked = !!likeMap[bp.id];
            bp.imgs = bp.imgs.map(imgID => {
                return {
                    ...imageMap[imgID],
                    url: this.configService.static.uploadImgURL + imageMap[imgID].url,
                };
            });
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

    @Delete(`${APIPrefix}/boilingpoints/:boilingpointID/like`)
    @UseGuards(ActiveGuard)
    async deleteLike(@CurUser() user, @Param('boilingpointID', MustIntPipe) boilingpointID: number) {
        await this.boilingPointService.deleteLike(boilingpointID, user.id);
        return {};
    }
}