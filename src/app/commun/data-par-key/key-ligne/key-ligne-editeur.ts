import { KfInputTexte } from '../../kf-composants/kf-elements/kf-input/kf-input-texte';
import { KfInputNombre } from '../../kf-composants/kf-elements/kf-input/kf-input-nombre';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { DataKeyEditeur } from '../data-key editeur';
import { KeyLigne } from './key-ligne';
import { IKeyLigne } from './i-key-ligne';
import { KfInputDateTemps } from '../../kf-composants/kf-elements/kf-input/kf-input-date-temps';

export abstract class KeyLigneEditeur<T extends KeyLigne> extends DataKeyEditeur<T> {

    protected kfId: KfInputNombre;
    protected kfNo: KfInputNombre;
    protected kfProduitId: KfInputNombre;
    protected kfDate: KfInputDateTemps;

    créeKfDeKey() {
        this.kfId = Fabrique.input.nombreInvisible('id');
        this.kfNo = Fabrique.input.nombreInvisible('no');
        this.kfProduitId = Fabrique.input.nombreInvisible('produitId');
        this.kfDate = Fabrique.input.dateInvisible('date');
        this.kfDeKey = [
            this.kfId,
            this.kfNo,
            this.kfProduitId,
            this.kfDate
        ];
    }
    fixeKfKey(key: IKeyLigne) {
        this.kfId.valeur = key.id;
        this.kfNo.valeur = key.no;
        this.kfProduitId.valeur = key.produitId;
        this.kfDate.valeur = key.date;
    }

    fixeIdDeAjout() {
    }
}
