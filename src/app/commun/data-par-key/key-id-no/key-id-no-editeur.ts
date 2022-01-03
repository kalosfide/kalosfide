import { IKeyIdNo } from './i-key-id-no';
import { KfInputTexte } from '../../kf-composants/kf-elements/kf-input/kf-input-texte';
import { KfInputNombre } from '../../kf-composants/kf-elements/kf-input/kf-input-nombre';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { KeyIdNo } from './key-id-no';
import { DataKeyEditeur } from '../data-key editeur';

export abstract class KeyUidRnoNoEditeur<T extends KeyIdNo> extends DataKeyEditeur<T> {

    protected pKfId: KfInputNombre;
    protected pKfNo: KfInputNombre;

    créeKfDeKey() {
        this.pKfId = Fabrique.input.nombreInvisible('id');
        this.pKfNo = Fabrique.input.nombreInvisible('no');
        this.kfDeKey = [
            this.pKfId,
            this.pKfNo
        ];
    }
    fixeKfKey(key: IKeyIdNo) {
        this.pKfId.valeur = key.id;
        this.pKfNo.valeur = key.no;
    }
    fixeIdDeAjout(key: IKeyIdNo) {
        this.pKfNo.valeur = key.no;
    }
}
