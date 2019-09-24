import { Injectable } from '@nestjs/common';
import { Repository, In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as striptags from 'striptags';
import { BoilingPoint, BoilingPointReport, BoilingPointTopic } from '../entity/boilingpoint.entity';
import { EditBoilingPointDto } from './dto/edit-boilingpoint.dto';
import { ListResult } from '../entity/listresult.entity';
import { MyHttpException } from '../core/exception/my-http.exception';
import { ErrorCode } from '../constants/error';
import * as moment from 'moment';
import { BoilingPointConstants } from '../constants/boilingpoint';
import { recentTime } from '../utils/viewfilter';
import { User } from '../entity/user.entity';
import { Image } from '../entity/image.entity';
import { TopicService } from './topic.service';
import { UserService } from '../user/user.service';
import { OSSService } from '../common/oss.service';
import { ConfigService } from '../config/config.service';

@Injectable()
export class BoilingPointService {
    constructor(
        @InjectRepository(BoilingPoint)
        private readonly boilingPointRepository: Repository<BoilingPoint>,

        @InjectRepository(BoilingPointReport)
        private readonly boilingPointReportRepository: Repository<BoilingPointReport>,

        private readonly topicService: TopicService,
        private readonly userService: UserService,
        private readonly ossService: OSSService,
        private readonly configService: ConfigService,
    ) {}

    async findOne(options): Promise<BoilingPoint> {
        return await this.boilingPointRepository.findOne({
            where: options.where,
            select: options.select,
        });
    }

    async detail(id: number): Promise<BoilingPoint> {
        return await this.boilingPointRepository.findOne({
            select: {
                id: true,
                createdAt: true,
                htmlContent: true,
                imgs: true,
                userID: true,
                topicID: true,
                browseCount: true,
                commentCount: true,
                likeCount: true,
                summary: true,
                topic: {
                    id: true,
                    name: true,
                },
            },
            where: { id },
            relations: ['topic'],
        });
    }

    async listByTopic(topicID: number, page: number): Promise<ListResult<BoilingPoint>> {
        const pageSize = 20;
        const [list, count] = await this.boilingPointRepository.findAndCount({
            where: {
                topicID,
            },
            order: {
                createdAt: 'DESC',
            },
            skip: (page - 1) * pageSize,
            take: pageSize,
        });
        return {
            list,
            count,
            page,
            pageSize,
        };
    }

    async recommend(page: number): Promise<ListResult<BoilingPoint>> {
        const pageSize = 20;
        const [list, count] = await this.boilingPointRepository.findAndCount({
            order: {
                createdAt: 'DESC',
            },
            skip: (page - 1) * pageSize,
            take: pageSize,
        });
        return {
            list,
            count,
            page,
            pageSize,
        };
    }

    async globalRecommends(): Promise<BoilingPoint[]> {
        return await this.boilingPointRepository.find({
            order: {
                createdAt: 'DESC',
            },
            skip: 0,
            take: 3,
        });
    }

    async recommendsInTopic(): Promise<BoilingPoint[]> {
        return await this.boilingPointRepository.find({
            order: {
                createdAt: 'DESC',
            },
            skip: 0,
            take: 3,
        });
    }

    async followed(page: number): Promise<ListResult<BoilingPoint>> {
        const pageSize = 20;
        const [list, count] = await this.boilingPointRepository.findAndCount({
            order: {
                createdAt: 'DESC',
            },
            skip: (page - 1) * pageSize,
            take: pageSize,
        });
        return {
            list,
            count,
            page,
            pageSize,
        };
    }

    async hot(page: number): Promise<ListResult<BoilingPoint>> {
        const pageSize = 20;
        const [list, count] = await this.boilingPointRepository.findAndCount({
            order: {
                createdAt: 'DESC',
            },
            skip: (page - 1) * pageSize,
            take: pageSize,
        });
        return {
            list,
            count,
            page,
            pageSize,
        };
    }

    async create(editBoilingPointDto: EditBoilingPointDto, userID: number) {
        const now = new Date();
        const summary = striptags(editBoilingPointDto.htmlContent).substr(0, BoilingPointConstants.SUMMARY_LENGTH);

        let insertResult;

        await this.boilingPointRepository.manager.connection.transaction(async manager => {
            insertResult = await manager.getRepository(BoilingPoint).insert({
                htmlContent: editBoilingPointDto.htmlContent,
                summary,
                imgs: editBoilingPointDto.imgs && editBoilingPointDto.imgs.length ? editBoilingPointDto.imgs.join(',') : '',
                createdAt: now,
                commentCount: 0,
                browseCount: 0,
                userID,
                topicID: editBoilingPointDto.topicID,
            });
            await manager.query(`UPDATE users SET boilingpoint_count = boilingpoint_count + 1 WHERE id = ${userID}`);
        });
        return insertResult.raw.insertId;
    }

    /**
     * 用户创建的沸点
     */
    async userBoilingPoints(userID: number, page: number, pageSize: number): Promise<ListResult<BoilingPoint>> {
        const [list, count] = await this.boilingPointRepository.findAndCount({
            select: {
                id: true,
                createdAt: true,
                htmlContent: true,
                imgs: true,
                userID: true,
                topicID: true,
                browseCount: true,
                commentCount: true,
                likeCount: true,
                summary: true,
                topic: {
                    id: true,
                    name: true,
                },
            },
            where: { userID },
            relations: ['topic'],
            order: {
                createdAt: -1,
            },
            skip: (page - 1) * pageSize,
            take: pageSize,
        });
        return {
            list,
            count,
            page,
            pageSize,
        };
    }

    /**
     * 传入一组沸点id, 只返回用户点过赞的沸点id
     */
    async userLikeBoilingPointIDs(boilingpointIDs: number[], userID: number): Promise<number[]> {
        if (!userID) {
            return [];
        }
        const sql = `SELECT boilingpoint_id as boilingpointID FROM user_like_boilingpoints
            WHERE boilingpoint_id IN (${boilingpointIDs.join(',')}) AND user_id = ${userID}`;
        let result = await this.boilingPointRepository.manager.query(sql);
        result = result || [];
        return result.map(data => data.boilingpointID);
    }

    /**
     * 用户点过赞的沸点
     */
    async userLikeBoilingPoints(userID: number, page: number, pageSize: number): Promise<ListResult<BoilingPoint>> {
        const sql = `SELECT boilingpoints.id as id, boilingpoints.created_at as createdAt, boilingpoints.html_content as htmlContent,
                boilingpoints.imgs as imgs, boilingpoints.user_id as userID, boilingpoints.topic_id as topicID,
                boilingpoints.browse_count as browseCount, boilingpoints.comment_count as commentCount,
                boilingpoints.like_count as likeCount, boilingpoints.summary as summary
            FROM user_like_boilingpoints, boilingpoints
            WHERE user_like_boilingpoints.user_id = ? AND user_like_boilingpoints.boilingpoint_id = boilingpoints.id
            ORDER BY user_like_boilingpoints.created_at DESC LIMIT ?, ?`;
        const sql2 = `SELECT COUNT(*) as count FROM user_like_boilingpoints WHERE user_like_boilingpoints.user_id = ?`;
        const [ boilingPoints, countResult ] = await Promise.all([
            this.boilingPointRepository.manager.query(sql, [ userID, (page - 1) * pageSize, pageSize ]),
            this.boilingPointRepository.manager.query(sql2, [ userID ]),
        ]);
        return {
            count: parseInt(countResult[0].count, 10),
            list: boilingPoints,
            page,
            pageSize,
        };
    }

    /**
     * 沸点相关数据，如沸点话题、沸点的九宫格图片、沸点的作者等
     */
    async fillBoilingPointsRelativeData(boilingPoints: BoilingPoint[], userID: number) {
        if (!boilingPoints || !boilingPoints.length) {
            return [];
        }
        const boilingpointIDs: number[] = [];
        const topicIDMap = {};
        const topicIDs: number[] = [];
        const userIDMap = {};
        const userIDs: number[] = [];
        const imgIDArr: number[] = [];
        const list = boilingPoints.map(boilingPoint => {
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
            userID ? this.userLikeBoilingPointIDs(boilingpointIDs, userID) : Promise.resolve([]),
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
        const follows = await (userID ? this.userService.usersFilterByFollowerID(uniqueUserIDs, userID) : Promise.resolve([]));
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
        return list;
    }

    async like(boilingpointID: number, userID: number) {
        const boilingPoint = await this.boilingPointRepository.findOne({
            select: ['id'],
            where: { id: boilingpointID },
        });

        if (!boilingPoint) {
            throw new MyHttpException({
                errorCode: ErrorCode.ParamsError.CODE,
            });
        }

        const sql = `SELECT boilingpoint_id, user_id FROM user_like_boilingpoints
            WHERE boilingpoint_id = ${boilingpointID} AND user_id = ${userID}`;
        let result = await this.boilingPointRepository.manager.query(sql);
        result = result || [];
        if (result.length) {
            throw new MyHttpException({
                errorCode: ErrorCode.ParamsError.CODE,
                message: '已经赞过此评论',
            });
        }
        await this.boilingPointRepository.manager.connection.transaction(async manager => {
            const sql2 = `INSERT INTO user_like_boilingpoints (boilingpoint_id, user_id, created_at)
                VALUES(${boilingpointID}, ${userID}, "${moment(new Date()).format('YYYY.MM.DD HH:mm:ss')}")`;
            const sql3 = `UPDATE boilingpoints SET like_count = like_count + 1 WHERE id = ${boilingpointID}`;
            await manager.query(sql2);
            await manager.query(sql3);
        });
    }

    async deleteLike(boilingpointID: number, userID: number) {
        const sql = `SELECT boilingpoint_id, user_id FROM user_like_boilingpoints
            WHERE boilingpoint_id = ${boilingpointID} AND user_id = ${userID}`;
        let result = await this.boilingPointRepository.manager.query(sql);
        result = result || [];
        if (result.length <= 0) {
            throw new MyHttpException({
                errorCode: ErrorCode.ParamsError.CODE,
                message: '您还没有赞过此评论哦',
            });
        }
        await this.boilingPointRepository.manager.connection.transaction(async manager => {
            const sql2 = `DELETE FROM user_like_boilingpoints
                WHERE boilingpoint_id = ${boilingpointID} AND user_id = ${userID}`;
            const sql3 = `UPDATE boilingpoints SET like_count = like_count - 1 WHERE id = ${boilingpointID}`;
            await manager.query(sql2);
            await manager.query(sql3);
        });

        return result;
    }

    async report(boilingPointID: number, reporter: number, reason: number) {
        this.boilingPointReportRepository.insert({
            boilingPointID,
            reporter,
            reason,
            createdAt: new Date(),
        });
    }
}
