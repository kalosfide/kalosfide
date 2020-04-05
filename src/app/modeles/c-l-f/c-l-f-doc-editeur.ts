import { KeyUidRnoEditeur } from 'src/app/commun/data-par-key/key-uid-rno/key-uid-rno-no-editeur';
import { CLFDoc } from './c-l-f-doc';
import { IDataKeyComponent } from 'src/app/commun/data-par-key/i-data-key-component';
import { KfCaseACocher } from 'src/app/commun/kf-composants/kf-elements/kf-case-a-cocher/kf-case-a-cocher';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { CLFService } from './c-l-f.service';

export class CLFDocEditeur extends KeyUidRnoEditeur<CLFDoc> {
    private document: CLFDoc;

    kfChoisi: KfCaseACocher;

    constructor(document: CLFDoc, component: IDataKeyComponent) {
        super(component);
        this.document = document;
    }

    créeKfDeData() {
        this.kfChoisi = Fabrique.caseACocher('choisi', undefined,
            () => {
                (this.component.iservice as CLFService).changeChoisi(this.document.no, this.kfChoisi.valeur);
            }
        );
        this.kfChoisi.valeur = this.document.apiDoc.choisi === true;
        if (!this.document.préparé) {
            this.kfChoisi.inactivité = true;
        }
        this.kfDeData = [this.kfChoisi];
    }

}
