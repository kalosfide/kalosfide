import { ApiResult } from './api-result';

export class ApiResult200Ok<T> extends ApiResult {
    static code = 200;

    private pLecture: T;

    constructor(lecture: T) {
        super(200);
        this.pLecture = lecture;
        this.ok = true;
    }
    get lecture(): T {
        return this.pLecture;
    }
}
