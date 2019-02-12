import {
    PipeTransform,
    Injectable,
    ArgumentMetadata,
    HttpException,
    HttpStatus,
    Paramtype,
} from '@nestjs/common';
import { ConfigService } from '../../config/config.service';
import { ErrorCode } from '../../config/constants';
import { MyHttpException } from '../../common/exception/my-http.exception';

@Injectable()
export class ParseIntPipe implements PipeTransform<string, number> {
    constructor(
        private readonly configService: ConfigService,
    ) {}

    transform(value: string, metadata: ArgumentMetadata): any {
        if (metadata.type !== 'param' && metadata.type !== 'query') {
            return value;
        }
        const val = parseInt(value, 10);
        if (isNaN(val)) {
            throw new MyHttpException({
                errorCode: ErrorCode.ParamsError.CODE,
            });
        }
        return val;
    }
}