import { Injectable } from '@angular/core';

import { Fournisseur } from './fournisseur';
import { ApiController } from '../commun/api-route';
import { KeyUidRnoService } from '../commun/data-par-key/key-uid-rno/key-uid-rno.service';
import { ApiRequêteService } from '../services/api-requete.service';

@Injectable()
export class FournisseurService extends KeyUidRnoService<Fournisseur> {

    public controllerUrl = ApiController.fournisseur;

    constructor(
        protected apiRequeteService: ApiRequêteService
    ) {
        super(apiRequeteService);
    }
}
