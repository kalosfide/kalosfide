import { Observable } from 'rxjs';

export class ApiResult {
    statusCode: number;
    ok: boolean;
    routeErreur: string[];
    routeErreurAbsolue: boolean;
    paramRouteErreur: any;

    constructor(statusCode: number) {
        this.statusCode = statusCode;
    }

}
