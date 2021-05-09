import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { KfSuperGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-super-groupe';
import { EtapeDeFormulaire } from './etape-de-formulaire';
import { IFormulaireAEtapes } from './formulaire-a-etapes.component';

@Injectable()
export class FormulaireAEtapeService {
    private pFormulaireAEtapes: IFormulaireAEtapes;

    private pIndexSubject = new Subject<number>();

    public initialise(formulaireAEtapes: IFormulaireAEtapes) {
        this.pFormulaireAEtapes = formulaireAEtapes;
    }

    public get formulaireAEtapes(): IFormulaireAEtapes {
        return this.pFormulaireAEtapes;
    }

    public trouveEtape(urlSegment: string) {
        const trouvé = this.pFormulaireAEtapes.etapes.find(etape => etape.nom === urlSegment);
        return trouvé ? trouvé : this.pFormulaireAEtapes.etapes[0];
    }
    public set index(index: number) {
        this.pIndexSubject.next(index);
    }

    public index$(): Observable<number> {
        return this.pIndexSubject.asObservable();
    }

    public termine() {
        this.pFormulaireAEtapes = null;
    }
}
