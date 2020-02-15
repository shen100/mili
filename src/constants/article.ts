export class ArticleConstants {
    static readonly SUMMARY_LENGTH: number = 100;
    static readonly MAX_CATEGORY_COUNT: number = 1;
    static readonly MAX_TAG_COUNT: number = 1;
    static readonly MAX_TITLE_LENGTH: number = 100;
    static readonly CONTENT_MAX_LENGTH = 65535;
    static readonly HTML_CONTENT_MAX_LENGTH = 65535;
}

export class CrawlerConstants {
    static readonly SELECTOR_MAX_LENGTH = 100; // 选择器最大长度

    static readonly SELECTOR_MIN_LENGTH = 1; // 选择器最小长度

    static readonly FROM_TEMPLATE_MAX_LENGTH = 1000; // 来源模板最大长度

    static readonly FROM_TEMPLATE_MIN_LENGTH = 1; // 来源模板最小长度
}

export class MarkedConstants {
    static readonly options = {
        gfm: true,
        breaks: true,
    };
}