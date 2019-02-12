import * as _ from 'lodash';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserTrack } from '../entity/stats.entity';
import { MyHttpException } from '../common/exception/my-http.exception';
import { ErrorCode } from '../config/constants';

@Injectable()
export class StatsService {
    constructor(
        @InjectRepository(UserTrack)
        private readonly userTrackRepository: Repository<UserTrack>,
    ) {}

    async userTrack(data: any) {
        if (!data.clientID) {
            throw new MyHttpException({
                errorCode: ErrorCode.ParamsError.CODE,
            });
        }
        const userTrack: UserTrack = new UserTrack();
        data.date = new Date();
        for (const key of Object.keys(data)) {
            userTrack[key] = data[key];
        }
        return await this.userTrackRepository.save(userTrack);
    }
}