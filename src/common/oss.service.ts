import {
    Injectable,
} from '@nestjs/common';
import * as stream from 'stream';
import axios from 'axios';
import * as moment from 'moment';
import * as util from 'util';
import OSS from 'ali-oss';
import { base64Encode, hmacSHA1 } from '../utils/security';
import { ConfigService } from '../config/config.service';
import { urlBaseName } from '../utils/common';

const PassThrough = stream.PassThrough;

@Injectable()
export class OSSService {
    constructor(
        private readonly configService: ConfigService,
    ) {}

    async requestPolicy() {
        const now = moment();
        const aliyun = this.configService.aliyunOSS;
        const staticConfig = this.configService.static;
        const imgMaxSizeM = staticConfig.imgMaxSize * 1024 * 1024;
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
        return {
            uploadActionURL: aliyun.uploadActionURL,
            uploadFieldName: aliyun.uploadFieldName,
            uploadPrefix: aliyun.uploadPrefix + '/' + now.year() + '/' + (now.month() + 1),
            imgFormat: staticConfig.imgFormat,
            imgMaxSize: imgMaxSizeM,
            imgMaxSizeError: util.format(staticConfig.imgMaxSizeError, staticConfig.imgMaxSize),
            uploadData: {
                OSSAccessKeyId: aliyun.accessKeyID,
                policy: base64Policy,
                Signature: signature,
                key: '', // 上传文件的object名称
                success_action_status: 201,
            },
            uploadImgURL: staticConfig.uploadImgURL,
        };
    }

    async uploadFromStreamURL(url: string) {
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
        const basename = urlBaseName(url);
        const result = client.putStream(`tags/${basename}`, res.data.pipe(new PassThrough()));
        return '';
    }
}