import { KfInputTexte } from '../../kf-composants/kf-elements/kf-input/kf-input-texte';
import { KfInputNombre } from '../../kf-composants/kf-elements/kf-input/kf-input-nombre';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { DataKeyEditeur } from '../data-key editeur';
import { KeyUidRno } from './key-uid-rno';
import { IKeyUidRno } from './i-key-uid-rno';

export abstract class KeyUidRnoEditeur<T extends KeyUidRno> extends DataKeyEditeur<T> {

    protected _kfUid: KfInputTexte;
    protected _kfRno: KfInputNombre;

    créeKfDeKey() {
        this._kfUid = Fabrique.input.texteInvisible('uid');
        this._kfRno = Fabrique.input.nombreInvisible('rno');
        this.kfDeKey = [
            this._kfUid,
            this._kfRno,
        ];
    }
    fixeKfKey(key: IKeyUidRno) {
        this._kfUid.valeur = key.uid;
        this._kfRno.valeur = key.rno;
   }
}
