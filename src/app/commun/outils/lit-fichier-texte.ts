import { Observable } from 'rxjs';

export function litFichierTexte(file: File): Observable<string> {
    const fileReader = new FileReader();

    // init read
    fileReader.readAsText(file);

    return new Observable(observer => {
        // if success
        fileReader.onload = ev => {
            const texte = (<any>ev.target).result;
            observer.next(texte);
        };

        // if failed
        fileReader.onerror = error => observer.error(error);
    });
}