import { IKeyUidRnoNo } from './i-key-uid-rno-no';
import { KfInputTexte } from '../../kf-composants/kf-elements/kf-input/kf-input-texte';
import { KfInputNombre } from '../../kf-composants/kf-elements/kf-input/kf-input-nombre';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { KeyUidRnoNo } from './key-uid-rno-no';
import { DataKeyEditeur } from '../data-key editeur';

export abstract class KeyUidRnoNoEditeur<T extends KeyUidRnoNo> extends DataKeyEditeur<T> {

    protected _kfUid: KfInputTexte;
    protected _kfRno: KfInputNombre;
    protected _kfNo: KfInputNombre;

    créeKfDeKey() {
        this._kfUid = Fabrique.input.texteInvisible('uid');
        this._kfRno = Fabrique.input.nombreInvisible('rno');
        this._kfNo = Fabrique.input.nombreInvisible('no');
        this.kfDeKey = [
            this._kfUid,
            this._kfRno,
            this._kfNo
        ];
    }
    fixeKfKey(key: IKeyUidRnoNo) {
        this._kfUid.valeur = key.uid;
        this._kfRno.valeur = key.rno;
         this._kfNo.valeur = key.no;
   }
}
