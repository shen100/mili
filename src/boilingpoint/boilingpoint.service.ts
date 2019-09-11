import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as striptags from 'striptags';
import { BoilingPoint, BoilingPointReport } from '../entity/boilingpoint.entity';
import { EditBoilingPointDto } from './dto/edit-boilingpoint.dto';
import { ListResult } from '../entity/listresult.entity';
import { MyHttpException } from '../core/exception/my-http.exception';
import { ErrorCode } from '../constants/error';
import * as moment from 'moment';
import { BoilingPointConstants } from '../constants/boilingpoint';

@Injectable()
export class BoilingPointService {
    constructor(
        @InjectRepository(BoilingPoint)
        private readonly boilingPointRepository: Repository<BoilingPoint>,

        @InjectRepository(BoilingPointReport)
        private readonly boilingPointReportRepository: Repository<BoilingPointReport>,
    ) {}

    async findOne(options): Promise<BoilingPoint> {
        return await this.boilingPointRepository.findOne({
            where: options.where,
            select: options.select,
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
        return await this.boilingPointRepository.insert({
            htmlContent: editBoilingPointDto.htmlContent,
            summary,
            imgs: editBoilingPointDto.imgs && editBoilingPointDto.imgs.length ? editBoilingPointDto.imgs.join(',') : '',
            createdAt: now,
            commentCount: 0,
            browseCount: 0,
            userID,
            topicID: editBoilingPointDto.topicID,
        });
    }

    // 用户点过赞的沸点
    async userLikes(boilingpointIDs: number[], userID: number): Promise<number[]> {
        if (!userID) {
            return [];
        }
        const sql = `SELECT boilingpoint_id as boilingpointID FROM user_like_boilingpoints
            WHERE boilingpoint_id IN (${boilingpointIDs.join(',')}) AND user_id = ${userID}`;
        let result = await this.boilingPointRepository.manager.query(sql);
        result = result || [];
        return result.map(data => data.boilingpointID);
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
