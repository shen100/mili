import { Injectable } from '@nestjs/common';
import { Repository, In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as striptags from 'striptags';
import { BoilingPoint, BoilingPointReport, BoilingPointTopic } from '../entity/boilingpoint.entity';
import { EditBoilingPointDto } from './dto/edit-boilingpoint.dto';
import { ListResult } from '../entity/listresult.entity';
import { MyHttpException } from '../core/exception/my-http.exception';
import { ErrorCode } from '../constants/error';
import { BoilingPointConstants } from '../constants/boilingpoint';
import { recentTime } from '../utils/viewfilter';
import { User } from '../entity/user.entity';
import { Image } from '../entity/image.entity';
import { TopicService } from './topic.service';
import { UserService } from '../user/user.service';
import { OSSService } from '../common/oss.service';

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
    ) {}

    async isExist(id: number): Promise<boolean> {
        const boilingPoint = await this.boilingPointRepository.findOne({
            id,
        }, {
            select: ['id'],
        });
        return boilingPoint !== null;
    }

    async findOne(options): Promise<BoilingPoint> {
        return await this.boilingPointRepository.findOne({
            select: options.select,
            where: options.where,
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
                likedCount: true,
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

    /**
     * 话题下的沸点
     */
    async listInTopic(topicID: number, page: number, pageSize: number): Promise<ListResult<BoilingPoint>> {
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

    /**
     * 推荐的沸点
     */
    async recommend(page: number, pageSize: number): Promise<ListResult<BoilingPoint>> {
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

    async globalRecommends() {
        const boilingPoints = await this.boilingPointRepository.find({
            order: {
                createdAt: 'DESC',
            },
            skip: 0,
            take: 3,
        });

        const imgIDArr: number[] = [];
        const imageMap = {};
        boilingPoints.map(r => {
            if (r.imgs) {
                const ids: string[] = r.imgs.split(',');
                imgIDArr.push(...ids.map(idStr => parseInt(idStr, 10)));
            }
        });
        const images: Image[] = await (imgIDArr.length ? this.ossService.findImages(imgIDArr) : Promise.resolve([]));
        images.map(img => imageMap[img.id] = img);
        const theGlobalRecommends = boilingPoints.map(bp => {
            let imgs: any[] = [];
            if (bp.imgs) {
                const ids: string[] = bp.imgs.split(',');
                imgs = ids.map(imgID => {
                    return {
                        ...imageMap[imgID],
                        url: this.ossService.getImageURL(imageMap[imgID].url),
                    };
                });
            }
            return {
                ...bp,
                imgs,
            };
        });
        return theGlobalRecommends;
    }

    /**
     * 关注的用户的沸点
     */
    async followed(followerID: number, page: number, pageSize: number): Promise<ListResult<BoilingPoint>> {
        const sql = 'SELECT user_id as userID FROM user_follower WHERE follower_id = ?';
        const users = await this.boilingPointRepository.manager.query(sql, [followerID]);
        const userIDs: number[] = users.map(user => user.userID);
        if (!userIDs.length) {
            return {
                list: [],
                count: 0,
                page,
                pageSize,
            };
        }
        const [list, count] = await this.boilingPointRepository.findAndCount({
            where: {
                userID: In(userIDs),
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

    /**
     * 热门沸点
     */
    async hot(page: number, pageSize: number): Promise<ListResult<BoilingPoint>> {
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

    /**
     * 创建沸点
     */
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
                likedCount: true,
                summary: true,
                topic: {
                    id: true,
                    name: true,
                },
            },
            where: { userID },
            relations: ['topic'],
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

    /**
     * 传入一组沸点id, 只返回用户点过赞的沸点id
     */
    async filterUserLikeBoilingPointIDs(boilingpointIDs: number[], userID: number): Promise<number[]> {
        if (!userID) {
            return [];
        }
        const sql = `SELECT boilingpoint_id as boilingpointID FROM user_like_boilingpoints
            WHERE boilingpoint_id IN (${boilingpointIDs.join(',')}) AND user_id = ?`;
        let result = await this.boilingPointRepository.manager.query(sql, [userID]);
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
                boilingpoints.liked_count as likedCount, boilingpoints.summary as summary
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
     * 填充沸点相关数据，如沸点话题、沸点的九宫格图片、沸点的作者等
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
                const ids: string[] = boilingPoint.imgs.split(',');
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
        let topics: BoilingPointTopic[], users: User[], likes: number[], follows: any[], images: Image[];
        const topicMap = {}, userMap = {}, likeMap = {}, imageMap = {};
        [topics, users, likes, follows, images] = await Promise.all([
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
            userID ? this.filterUserLikeBoilingPointIDs(boilingpointIDs, userID) : Promise.resolve([]),
            userID ? this.userService.usersFilterByFollowerID(userIDs, userID) : Promise.resolve([]),
            imgIDArr.length ? this.ossService.findImages(imgIDArr) : Promise.resolve([]),
        ]);
        topics.map(t => {
            topicMap[t.id] = t;
        });

        users.map(u => {
            userMap[u.id] = u;
        });
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
                    url: this.ossService.getImageURL(imageMap[imgID].url),
                };
            });
            bp.middleImgs = bp.imgs;
            bp.bigImgs = bp.imgs;
        });
        return list;
    }

    /**
     * 给沸点点赞
     */
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
            WHERE boilingpoint_id = ? AND user_id = ?`;
        let result = await this.boilingPointRepository.manager.query(sql, [boilingpointID, userID]);
        result = result || [];
        if (result.length) {
            // 已经赞过此沸点
            return;
        }
        await this.boilingPointRepository.manager.connection.transaction(async manager => {
            const sql2 = `INSERT INTO user_like_boilingpoints (boilingpoint_id, user_id, created_at) VALUES(?, ?, ?)`;
            const sql3 = `UPDATE boilingpoints SET liked_count = liked_count + 1 WHERE id = ?`;
            await manager.query(sql2, [boilingpointID, userID, new Date()]);
            await manager.query(sql3, [boilingpointID]);
        });
    }

    /**
     * 取消沸点的点赞
     */
    async deleteLike(boilingpointID: number, userID: number) {
        const sql = `SELECT boilingpoint_id, user_id FROM user_like_boilingpoints
            WHERE boilingpoint_id = ? AND user_id = ?`;
        let result = await this.boilingPointRepository.manager.query(sql, [boilingpointID, userID]);
        result = result || [];
        if (result.length <= 0) {
            // 还没有赞过此沸点
            return;
        }
        await this.boilingPointRepository.manager.connection.transaction(async manager => {
            const sql2 = `DELETE FROM user_like_boilingpoints WHERE boilingpoint_id = ? AND user_id = ?`;
            const sql3 = `UPDATE boilingpoints SET liked_count = liked_count - 1 WHERE id = ?`;
            await manager.query(sql2, [boilingpointID, userID]);
            await manager.query(sql3, [boilingpointID]);
        });

        return result;
    }

    /**
     * 举报沸点
     */
    async report(boilingPointID: number, reporter: number, reason: number) {
        this.boilingPointReportRepository.insert({
            boilingPointID,
            reporter,
            reason,
            createdAt: new Date(),
        });
    }
}
