import { Observable } from 'rxjs';
import { map, catchError, delay, take } from 'rxjs/operators';
import { AbstractControl, ValidationErrors } from '@angular/forms';

import { ApiResult200Ok } from '../commun/api-results/api-result-200-ok';
import { ApiResult } from '../commun/api-results/api-result';

export abstract class TextePasPrisValidator {
    abstract textePris(texte: string): Observable<ApiResult>;

    protected _validate(ctrl: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
        return this.textePris(ctrl.value).pipe(
            take(1),
            map(apiResult => {
                const isTaken = (apiResult.statusCode === 200) && (apiResult as ApiResult200Ok<boolean>).lecture;
                return isTaken ? { textePris: true } : null;
            }),
            catchError(() => null)
        );
    }
}
