import { DataUtileOutils } from 'src/app/commun/data-par-key/data-utile-outils';
import { DataUtileUrl } from 'src/app/commun/data-par-key/data-utile-url';
import { KeyUidRno } from 'src/app/commun/data-par-key/key-uid-rno/key-uid-rno';
import { IKfVueTableOutil } from 'src/app/commun/kf-composants/kf-vue-table/kf-vue-table-outil';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { IUrlDef } from 'src/app/disposition/fabrique/fabrique-url';
import { FournisseurClientPages, FournisseurClientRoutes } from 'src/app/fournisseur/clients/client-pages';
import { Client } from '../client/client';
import { Invitation } from './invitation';
import { InvitationUtile } from './invitation-utile';

export class InvitationUtileOutils extends DataUtileOutils {

    constructor(utile: InvitationUtile) {
        super(utile);
    }

    get utile(): InvitationUtile {
        return this._dataUtile as InvitationUtile;
    }

    ajoute(): IKfVueTableOutil<Invitation> {
        return Fabrique.vueTable.outilAjoute(this.utile.lien.ajoute(FournisseurClientPages.invitations.urlSegment));
    }
}
