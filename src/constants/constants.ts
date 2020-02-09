export const APIPrefix: string = '/api/v1';
export const AdminAPIPrefix: string = '/api/v1/admin';
export const AdminPageURL: string = '/admin';

export const NO_PARENT = 0;

export class UserConstants {
    static readonly USERNAME_MIN_LENGTH: number = 4;
    static readonly USERNAME_MAX_LENGTH: number = 16;
    static readonly PASSWORD_MIN_LENGTH: number = 6;
    static readonly PASSWORD_MAX_LENGTH: number = 20;
    static readonly JOB_MIN_LENGTH: number = 0;
    static readonly JOB_MAX_LENGTH: number = 100;
    static readonly COMPANY_MIN_LENGTH: number = 0;
    static readonly COMPANY_MAX_LENGTH: number = 100;
    static readonly INTRODUCE_MIN_LENGTH: number = 0;
    static readonly INTRODUCE_MAX_LENGTH: number = 100;
    static readonly PERSONAL_HOMEPAGE_MIN_LENGTH: number = 0;
    static readonly PERSONAL_HOMEPAGE__MAX_LENGTH: number = 100;
    static readonly CAPTCHA_LENGTH: number = 6;
}

export class CollectionConstants {
    static readonly NAME_MIN_LENGTH: number = 1; // 专题名称最小长度
    static readonly NAME_MAX_LENGTH: number = 50; // 专题名称最大长度
    static readonly URL_MAX_LENGTH: number = 500;
    static readonly ANNOUNCEMENT_MIN_LENGTH: number = 0; // 专题公告最小长度
    static readonly ANNOUNCEMENT_MAX_LENGTH: number = 200; // 专题公告最大长度
    static readonly ADMIN_MAX_COUNT: number = 10; // 专题最多有多少个管理员
}

export class PeriodConstants {
    static readonly ALL: number = 0;
    static readonly DAY: number = 1; // 一天内
    static readonly WEEK: number = 2; // 一周内
    static readonly THREE_MONTHS: number = 3; // 三月内
}