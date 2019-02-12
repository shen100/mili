import { createParamDecorator } from '@nestjs/common';

export const CurUser = createParamDecorator((data, req) => {
    return req.user;
});