export abstract class MyRequest {
    public reqStartTime: number;
    public readonly originalUrl: string;
    public readonly method: string;
    public readonly headers: any;
    public readonly clientIp: string;

    public abstract csrfToken(): string;
}

export class MyResponse {
    public locals: any;
}