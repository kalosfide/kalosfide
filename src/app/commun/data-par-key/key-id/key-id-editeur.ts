import { KfInputTexte } from '../../kf-composants/kf-elements/kf-input/kf-input-texte';
import { KfInputNombre } from '../../kf-composants/kf-elements/kf-input/kf-input-nombre';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { DataKeyEditeur } from '../data-key editeur';
import { KeyId } from './key-id';
import { IKeyId } from './i-key-id';

export abstract class KeyIdEditeur<T extends KeyId> extends DataKeyEditeur<T> {

    protected _kfId: KfInputNombre;

    créeKfDeKey() {
        this._kfId = Fabrique.input.nombreInvisible('id');
        this.kfDeKey = [
            this._kfId,
        ];
    }
    fixeKfKey(key: IKeyId) {
        this._kfId.valeur = key.id;
    }
    fixeIdDeAjout(key: IKeyId) {
        this._kfId.valeur = key.id;
    }
}
