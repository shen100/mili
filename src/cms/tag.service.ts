import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from '../entity/tag.entity';
import { CreateTagDto } from './dto/create-tag.dto';
import { OSSService } from '../common/oss.service';

@Injectable()
export class TagService {
    constructor(
        @InjectRepository(Tag)
        private readonly tagRepository: Repository<Tag>,

        private readonly ossService: OSSService,
    ) {}

    async create(createTagDto: CreateTagDto) {
        const imgURL = await this.ossService.uploadFromStreamURL(createTagDto.iconURL);
        return await this.tagRepository.create({
            name: createTagDto.name,
            iconURL: imgURL,
            followerCount: 0,
            articleCount: 0,
            createdAt: new Date(),
        });
    }
}