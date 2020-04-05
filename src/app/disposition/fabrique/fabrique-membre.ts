import { FabriqueClasse } from './fabrique';

export class FabriqueMembre {
    private _fabrique: FabriqueClasse;
    constructor(fabrique: FabriqueClasse) {
        this._fabrique = fabrique;
    }
    public get fabrique(): FabriqueClasse { return this._fabrique; }
}
