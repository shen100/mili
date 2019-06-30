export const APIPrefix: string = '/api/v1';

export const NO_PARENT = 0;

export class UserConstants {
    static readonly USERNAME_MIN_LENGTH: number = 4;
    static readonly USERNAME_MAX_LENGTH: number = 16;
    static readonly PASSWORD_MIN_LENGTH: number = 6;
    static readonly PASSWORD_MAX_LENGTH: number = 20;
    static readonly CAPTCHA_LENGTH: number = 6;
}

export class ArticleConstants {
    static readonly SUMMARY_LENGTH: number = 100;
    static readonly MAX_CATEGORY_COUNT: number = 1;
    static readonly MAX_TAG_COUNT: number = 1;
    static readonly MAX_TITLE_LENGTH: number = 100;
}

export class CategoryConstants {
    static readonly CATEGORY_MIN_LENGTH: number = 1;
    static readonly CATEGORY_MAX_LENGTH: number = 20;
}

export class TagConstants {
    static readonly TAG_MIN_LENGTH: number = 1;
    static readonly TAG_MAX_LENGTH: number = 20;
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

export class CommentConstants {
    static readonly CommentTypeArticle: string = 'article';
    static readonly CommentTypeChapter: string = 'chapter';
}

export class HandbookConstants {
    static readonly MAX_PRICE: number = 100000000;

    static readonly TITLE_MIN_LENGTH: number = 1;
    static readonly TITLE_MAX_LENGTH: number = 100000;

    static readonly INTRODUCE_MIN_LENGTH: number = 1;
    static readonly INTRODUCE_MAX_LENGTH: number = 100000;

    static readonly SUMMARY_MIN_LENGTH: number = 1;
    static readonly SUMMARY_MAX_LENGTH: number = 100000;

    static readonly AUTHOR_MIN_LENGTH: number = 1;
    static readonly AUTHOR_MAX_LENGTH: number = 100000;

    static readonly CHAPTER_NAME_MAX_LENGTH: number = 100;
    static readonly CHAPTER_CONTENT_MIN_LENGTH: number = 1;
    static readonly CHAPTER_CONTENT_MAX_LENGTH: number = 100000;
}