import { KeyIdEditeur } from 'src/app/commun/data-par-key/key-id/key-id-editeur';
import { CLFDoc } from './c-l-f-doc';
import { IDataComponent } from 'src/app/commun/data-par-key/i-data-component';
import { KfCaseACocher } from 'src/app/commun/kf-composants/kf-elements/kf-case-a-cocher/kf-case-a-cocher';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { CLFService } from './c-l-f.service';

export class CLFDocEditeur extends KeyIdEditeur<CLFDoc> {
    private document: CLFDoc;

    kfChoisi: KfCaseACocher;

    constructor(document: CLFDoc, component: IDataComponent) {
        super(component);
        this.document = document;
    }

    créeKfDeData() {
        this.kfChoisi = Fabrique.caseACocher(`choisi_${this.document.no}`, undefined,
            (() => {
                this.document.synthèse.rafraichitCaseToutSélectionner();
                // quand la valeur change, le service enregistre le changement dans le stock et émet un observable du bilan
                (this.component.iservice as CLFService).changeChoisi(this.document.no, this.kfChoisi.valeur);
            }).bind(this)
        );
        this.kfChoisi.géreClasseEntree.ajouteClasse('text-center');
//        Fabrique.caseACocherAspect(this.kfChoisi);
        this.kfChoisi.valeur = this.document.apiDoc.choisi === true;
        if (!this.document.préparé) {
            this.kfChoisi.inactivité = true;
        }
        this.kfDeData = [this.kfChoisi];
    }

}
