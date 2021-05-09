import { DataUtileUrl } from 'src/app/commun/data-par-key/data-utile-url';
import { KeyUidRno } from 'src/app/commun/data-par-key/key-uid-rno/key-uid-rno';
import { PageDef } from 'src/app/commun/page-def';
import { IUrlDef } from 'src/app/disposition/fabrique/fabrique-url';
import { FournisseurClientPages, FournisseurClientRoutes } from 'src/app/fournisseur/clients/client-pages';
import { Client } from '../client/client';
import { InvitationUtile } from './invitation-utile';

export class InvitationUtileUrl extends DataUtileUrl {

    constructor(utile: InvitationUtile) {
        super(utile);
    }

    get utile(): InvitationUtile {
        return this.parent as InvitationUtile;
    }

    index(): IUrlDef {
        return this.__urlDef(FournisseurClientRoutes, FournisseurClientPages.invitations);
    }
    invite(urlSegmentRetour: string, client?: Client): IUrlDef {
        let textekey: string;
        if (client) {
            textekey = KeyUidRno.texteDeKey(client);
        }
        const def = this.__urlDef(FournisseurClientRoutes, FournisseurClientPages.invite, textekey);
        def.params = [
            {
                nom: 'retour',
                valeur: urlSegmentRetour
            }
        ];
        return def;
    }
    annuleInvite(urlSegmentRetour: string): IUrlDef {
        const pageDefs: PageDef[] = [
            FournisseurClientPages.accueil,
            FournisseurClientPages.index,
            FournisseurClientPages.invitations
        ];
        return this.__urlDef(FournisseurClientRoutes, pageDefs.find(p => p.urlSegment === urlSegmentRetour));
    }

}
