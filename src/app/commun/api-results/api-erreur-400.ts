import { Observable } from 'rxjs';

export interface ApiErreur400 {
    champ: string;
    code: string;
}
export interface ApiErreur400Traite {
    code: string;
    traite?: () => void;
    traiteObs?: () => Observable<boolean>;
}
