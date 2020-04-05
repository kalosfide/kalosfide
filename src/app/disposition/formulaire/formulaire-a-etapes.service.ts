import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { KfSuperGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-super-groupe';
import { EtapeDeFormulaire } from './etape-de-formulaire';
import { IFormulaireAEtapes } from './formulaire-a-etapes.component';

@Injectable()
export class FormulaireAEtapeService {
    private _formulaireAEtapes: IFormulaireAEtapes;

    private _indexSubject = new Subject<number>();

    public initialise(formulaireAEtapes: IFormulaireAEtapes) {
        this._formulaireAEtapes = formulaireAEtapes;
    }

    public get formulaireAEtapes(): IFormulaireAEtapes {
        return this._formulaireAEtapes;
    }

    public trouveEtape(urlSegment: string) {
        const trouvé = this._formulaireAEtapes.etapes.find(etape => etape.nom === urlSegment);
        return trouvé ? trouvé : this._formulaireAEtapes.etapes[0];
    }
    public set index(index: number) {
        this._indexSubject.next(index);
    }

    public index$(): Observable<number> {
        return this._indexSubject.asObservable();
    }

    public termine() {
        this._formulaireAEtapes = null;
    }
}
