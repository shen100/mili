export class BoilingPointConstants {
    static readonly MAX_CONTENT_LENGTH: number = 1000;
    static readonly MAX_IMAGE_COUNT: number = 9;
    static readonly MAX_TOPIC_TITLE_LENGTH: number = 10;
    static readonly SUMMARY_LENGTH: number = 100;

    static readonly ReportReasons: number[] = [
        0, // 其它
        1, // 和话题不符
        2, // 恶意攻击谩骂
        3, // 广告营销
    ];
}