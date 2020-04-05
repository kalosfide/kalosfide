import { CLFUtile } from './c-l-f-utile';
import { DataUtileColonne } from 'src/app/commun/data-par-key/data-utile-colonne';
import { CLFUtileColonneLigne } from './c-l-f-utile-colonne-ligne';
import { CLFUtileColonneClient } from './c-l-f-utile-colonne-client';
import { CLFUtileColonneDocCLF } from './c-l-f-utile-colonne-doc';

export class CLFUtileColonne extends DataUtileColonne {
    private _client: CLFUtileColonneClient;
    private _docCLF: CLFUtileColonneDocCLF;
    protected _ligne: CLFUtileColonneLigne;

    constructor(utile: CLFUtile) {
        super(utile);
        this._client = new CLFUtileColonneClient(utile);
        this._docCLF = new CLFUtileColonneDocCLF(utile);
        this._ligne = new CLFUtileColonneLigne(utile);
    }

    get utile(): CLFUtile {
        return this.dataUtile as CLFUtile;
    }

    get client(): CLFUtileColonneClient {
        return this._client;
    }

    get docCLF(): CLFUtileColonneDocCLF {
        return this._docCLF;
    }

    get ligne(): CLFUtileColonneLigne {
        return this._ligne;
    }

}
