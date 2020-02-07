import {
    Injectable,
} from '@nestjs/common';
import * as stream from 'stream';
import * as uuid from 'uuid';
import * as mime from 'mime';
import axios from 'axios';
import * as moment from 'moment';
import * as util from 'util';
import * as OSS from 'ali-oss';
import { base64Encode, hmacSHA1 } from '../utils/security';
import { ConfigService } from '../config/config.service';
import { extName, urlBaseName } from '../utils/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Image } from '../entity/image.entity';
import { APIPrefix } from '../constants/constants';

const PassThrough = stream.PassThrough;

@Injectable()
export class OSSService {
    constructor(
        private readonly configService: ConfigService,

        @InjectRepository(Image)
        private readonly imageRepository: Repository<Image>,
    ) {}

    private createOSSClient() {
        const client = new OSS({
            region: this.configService.aliyunOSS.region,
            accessKeyId: this.configService.aliyunOSS.accessKeyID,
            accessKeySecret: this.configService.aliyunOSS.accessKeySecret,
            bucket: this.configService.aliyunOSS.bucket,
        });
        return client;
    }

    async requestPolicy() {
        const now = moment();
        const aliyun = this.configService.aliyunOSS;
        const staticConfig = this.configService.static;
        const imgMaxSizeM = staticConfig.imgMaxSize;
        const policy = {
            // 设置Policy的失效时间, 以ISO8601 GMT时间表示
            // 超过失效时间，就无法通过此Policy上传文件
            expiration: moment().add(aliyun.expiration, 'hours').toISOString(),
            conditions: [
                { bucket: aliyun.bucket },
                [ 'starts-with', '$key', aliyun.uploadPrefix ],
                [ 'content-length-range', 1, imgMaxSizeM], // 设置上传文件的大小限制, 单位字节
            ],
        };

        const base64Policy = base64Encode(JSON.stringify(policy));
        const signature = hmacSHA1(aliyun.accessKeySecret, base64Policy);
        const domain = this.configService.server.domain;
        const callbackObj = {
            callbackUrl: `https://${domain}${APIPrefix}/common/oss/callback`,
            callbackBody: '{' + [
                '\"mimeType\":${mimeType}',
                '\"size\":${size}',
                '\"filename\":${object}',
                '\"width\":${imageInfo.width}',
                '\"height\":${imageInfo.height}',
                '\"format\":${imageInfo.format}',
                '\"callback-token\":${x:callback-token}',
            ].join(',') + '}',
			callbackBodyType: 'application/json',
        };
        const isDev = this.configService.env === this.configService.DEVELOPMENT;
        return {
            uploadActionURL: aliyun.uploadActionURL,
            uploadFieldName: aliyun.uploadFieldName,
            uploadPrefix: aliyun.uploadPrefix + '/' + now.year() + '/' + (now.month() + 1),
            imgFormat: staticConfig.imgFormat,
            imgMaxSize: imgMaxSizeM,
            imgMaxSizeError: util.format(staticConfig.imgMaxSizeError, staticConfig.imgMaxSize / 1024 / 1024),
            uploadData: {
                'OSSAccessKeyId': aliyun.accessKeyID,
                'policy': base64Policy,
                'Signature': signature,
                'key': '', // 上传文件的object名称
                'success_action_status': 201,
                'callback': !isDev ? base64Encode(JSON.stringify(callbackObj)) : undefined,
                'x:callback-token': !isDev ? this.configService.aliyunOSS.callbackSecretToken : undefined,
            },
            uploadImgURL: staticConfig.uploadImgURL,
        };
    }

    async uploadFromStreamURL(url: string, pathname: string): Promise<string> {
        const client = new OSS({
            region: this.configService.aliyunOSS.region,
            accessKeyId: this.configService.aliyunOSS.accessKeyID,
            accessKeySecret: this.configService.aliyunOSS.accessKeySecret,
            bucket: this.configService.aliyunOSS.bucket,
        });
        const res = await axios({
            method: 'get',
            url,
            responseType: 'stream',
        });
        const uploadName = `${this.configService.aliyunOSS.uploadPrefix}${pathname}`;
        const result = await client.putStream(uploadName, res.data.pipe(new PassThrough()));
        let name = result.name || '';
        if (name.charAt(0) !== '/') {
            name = '/' + name;
        }
        return this.configService.static.uploadImgURL + name;
    }

    getImageURL(path: string) {
        if (path.indexOf('https://') === 0) {
            return path;
        }
        if (path.charAt(0) !== '/') {
            path = '/' + path;
        }
        return this.configService.static.uploadImgURL + path;
    }

    async getImageInfo(path: string) {
        if (path.charAt(0) !== '/') {
            path = '/' + path;
        }
        const client = this.createOSSClient();
        let result;
        try {
            result = await client.get(path, {process: 'image/info'});
        } catch (err) {
            console.log(err);
            return null;
        }
        const imgData = JSON.parse(result.content.toString());
        return {
            mime: mime.getType(imgData.Format.value),
            size: parseInt(imgData.FileSize.value, 10),
            url: path,
            width: parseInt(imgData.ImageWidth.value, 10),
            height: parseInt(imgData.ImageHeight.value, 10),
            format: imgData.Format.value,
        };
    }

    async createImage(imgData) {
        const img: Image = new Image();
        img.format = imgData.format;
        img.mime = imgData.mime;
        img.width = imgData.width;
        img.height = imgData.height;
        img.size = imgData.size;
        img.url = imgData.url;
        return await this.imageRepository.save(img);
    }

    async findImages(ids: number[]): Promise<Image[]> {
        return await this.imageRepository.find({
            where: {
                id: In(ids),
            },
        });
    }
}