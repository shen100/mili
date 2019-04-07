import {
    PipeTransform,
    Injectable,
    ArgumentMetadata,
} from '@nestjs/common';

@Injectable()
export class ShouldIntPipe implements PipeTransform<string, number> {
    transform(value: string, metadata: ArgumentMetadata): any {
        if (metadata.type !== 'param' && metadata.type !== 'query') {
            return value;
        }
        const val = parseInt(value, 10);
        if (isNaN(val)) {
            return undefined;
        }
        return val;
    }
}