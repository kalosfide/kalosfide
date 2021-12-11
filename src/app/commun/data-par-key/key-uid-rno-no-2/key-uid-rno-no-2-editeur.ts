import { KfInputTexte } from '../../kf-composants/kf-elements/kf-input/kf-input-texte';
import { KfInputNombre } from '../../kf-composants/kf-elements/kf-input/kf-input-nombre';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { DataKeyEditeur } from '../data-key editeur';
import { KeyUidRnoNo2 } from './key-uid-rno-no-2';
import { IKeyUidRnoNo2 } from './i-key-uid-rno-no-2';
import { KfInputDateTemps } from '../../kf-composants/kf-elements/kf-input/kf-input-date-temps';

export abstract class KeyUidRnoNo2Editeur<T extends KeyUidRnoNo2> extends DataKeyEditeur<T> {

    protected kfUid: KfInputTexte;
    protected kfRno: KfInputNombre;
    protected kfNo: KfInputNombre;
    protected kfUid2: KfInputTexte;
    protected kfRno2: KfInputNombre;
    protected kfNo2: KfInputNombre;
    protected kfDate: KfInputDateTemps;

    créeKfDeKey() {
        this.kfUid = Fabrique.input.texteInvisible('uid');
        this.kfRno = Fabrique.input.nombreInvisible('rno');
        this.kfNo = Fabrique.input.nombreInvisible('no');
        this.kfUid2 = Fabrique.input.texteInvisible('uid2');
        this.kfRno2 = Fabrique.input.nombreInvisible('rno2');
        this.kfNo2 = Fabrique.input.nombreInvisible('no2');
        this.kfDate = Fabrique.input.dateInvisible('date');
        this.kfDeKey = [
            this.kfUid,
            this.kfRno,
            this.kfNo,
            this.kfUid2,
            this.kfRno2,
            this.kfNo2,
            this.kfDate
        ];
    }
    fixeKfKey(key: IKeyUidRnoNo2) {
        this.kfUid.valeur = key.uid;
        this.kfRno.valeur = key.rno;
        this.kfNo.valeur = key.no;
        this.kfUid2.valeur = key.uid2;
        this.kfRno2.valeur = key.rno2;
        this.kfNo2.valeur = key.no2;
        this.kfDate.valeur = key.date;
    }

    fixeNoDeAjout() {
    }
}
