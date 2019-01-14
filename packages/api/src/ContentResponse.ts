export class ContentResponse<T> implements Response {

    constructor(public readonly baseResponse: Response, public readonly content: T) {    }

    public get body(): ReadableStream | null { return this.baseResponse.body;}

    public get bodyUsed(): boolean { return this.baseResponse.bodyUsed;}

    public get headers(): Headers { return this.baseResponse.headers;}

    public get ok(): boolean { return this.baseResponse.ok;}

    public get redirected(): boolean { return this.baseResponse.redirected;}

    public get status(): number { return this.baseResponse.status;}

    public get statusText(): string { return this.baseResponse.statusText;}

    public get trailer(): Promise<Headers> { return this.baseResponse.trailer;}

    public get type(): ResponseType { return this.baseResponse.type;}

    public get url(): string { return this.baseResponse.url;}

    public arrayBuffer(): Promise<ArrayBuffer> {return this.baseResponse.arrayBuffer(); }

    public blob(): Promise<Blob> { return this.baseResponse.blob(); }

    public clone(): Response {return this.baseResponse.clone(); }

    public formData(): Promise<FormData> {return this.baseResponse.formData(); }

    public json(): Promise<any> {return this.baseResponse.json(); }

    public text(): Promise<string> {return this.baseResponse.text();}
}
