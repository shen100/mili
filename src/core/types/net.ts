export class MyRequest {
    public reqStartTime: number;
    public readonly originalUrl: string;
    public readonly method: string;

    public csrfToken(): string {
        return '';
    }
}

export class MyResponse {
    public locals: any;
}