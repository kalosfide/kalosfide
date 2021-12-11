import { IKeyUidRnoNo } from './i-key-uid-rno-no';
import { KfInputTexte } from '../../kf-composants/kf-elements/kf-input/kf-input-texte';
import { KfInputNombre } from '../../kf-composants/kf-elements/kf-input/kf-input-nombre';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { KeyUidRnoNo } from './key-uid-rno-no';
import { DataKeyEditeur } from '../data-key editeur';

export abstract class KeyUidRnoNoEditeur<T extends KeyUidRnoNo> extends DataKeyEditeur<T> {

    protected pKfUid: KfInputTexte;
    protected pKfRno: KfInputNombre;
    protected pKfNo: KfInputNombre;

    créeKfDeKey() {
        this.pKfUid = Fabrique.input.texteInvisible('uid');
        this.pKfRno = Fabrique.input.nombreInvisible('rno');
        this.pKfNo = Fabrique.input.nombreInvisible('no');
        this.kfDeKey = [
            this.pKfUid,
            this.pKfRno,
            this.pKfNo
        ];
    }
    fixeKfKey(key: IKeyUidRnoNo) {
        this.pKfUid.valeur = key.uid;
        this.pKfRno.valeur = key.rno;
        this.pKfNo.valeur = key.no;
    }
    fixeNoDeAjout(key: IKeyUidRnoNo) {
        this.pKfNo.valeur = key.no;
    }
}
