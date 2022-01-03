import { IKeyIdNo } from "src/app/commun/data-par-key/key-id-no/i-key-id-no";
import { IKeyId } from "src/app/commun/data-par-key/key-id/i-key-id";
import { KeyId } from "src/app/commun/data-par-key/key-id/key-id";
import { Routeur } from "src/app/commun/routeur";
import { CLFPages } from "./c-l-f-pages";

export abstract class CLFRouteur extends Routeur {
    protected _bon: Routeur;

    constructor(parent: Routeur, ...segments: string[]) {
        super(parent, ...segments);
    }

    abstract get client(): Routeur;
    get bon(): Routeur {
        return this._bon;
    }
}

export class CommandeRouteur extends CLFRouteur {
    constructor(parent: Routeur) {
        super(parent, CLFPages.commande.path);
        this._bon = new Routeur(this, CLFPages.bon.path);
    }

    get client(): Routeur {
        return this;
    }
}

export class LFRouteur extends CLFRouteur {
    private _client: Routeur;

    constructor(parent: Routeur, segment: string) {
        super(parent, segment);
    }

    fixeClient(iKeyClient: IKeyId) {
        this._client = new Routeur(this, CLFPages.client.path, KeyId.texteDeKey(iKeyClient));
    }

    fixeBon(ikeyBon: IKeyIdNo) {
        this._bon = new Routeur(this, CLFPages.client.path, KeyId.texteDeKey(ikeyBon), CLFPages.bon.path, '' + ikeyBon.no)
    }

    get client(): Routeur {
        return this._client;
    }
}