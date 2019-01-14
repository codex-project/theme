export declare class ContentResponse<T> implements Response {
    readonly baseResponse: Response;
    readonly content: T;
    constructor(baseResponse: Response, content: T);
    readonly body: ReadableStream | null;
    readonly bodyUsed: boolean;
    readonly headers: Headers;
    readonly ok: boolean;
    readonly redirected: boolean;
    readonly status: number;
    readonly statusText: string;
    readonly trailer: Promise<Headers>;
    readonly type: ResponseType;
    readonly url: string;
    arrayBuffer(): Promise<ArrayBuffer>;
    blob(): Promise<Blob>;
    clone(): Response;
    formData(): Promise<FormData>;
    json(): Promise<any>;
    text(): Promise<string>;
}
