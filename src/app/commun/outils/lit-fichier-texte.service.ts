import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class LitFichierTexteService {

    constructor() { }

    litFichier(file: File): Observable<string> {
        const fileReader = new FileReader();

        // init read
        fileReader.readAsText(file);

        return Observable.create(observer => {
            // if success
            fileReader.onload = ev => {
                const texte = (<any>ev.target).result;
                observer.next(texte);
            };

            // if failed
            fileReader.onerror = error => observer.error(error);
        });
    }

}
