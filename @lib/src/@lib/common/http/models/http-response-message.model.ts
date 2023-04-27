// ====================================================
// Creative Medium
// ====================================================
export class HttpResponseMessage {
    constructor(message?: string, title?: string) {
        this.title = title;
        this.message = message
    }
    title: string | undefined;
    code: string | undefined;
    message: string  | undefined;
}