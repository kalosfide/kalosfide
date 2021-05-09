import { DataUtile } from 'src/app/commun/data-par-key/data-utile';
import { InvitationUtileBouton } from './invitation-utile-bouton';
import { InvitationUtileLien } from './invitation-utile-lien';
import { InvitationUtileOutils } from './invitation-utile-outils';
import { InvitationUtileTexte } from './invitation-utile-texte';
import { InvitationUtileUrl } from './invitation-utile-url';
import { InvitationService } from './invitation.service';

export class InvitationUtile extends DataUtile {

    texte: InvitationUtileTexte;

    constructor(service: InvitationService) {
        super(service);
        this.texte = new InvitationUtileTexte();
        this.pUrl = new InvitationUtileUrl(this);
        this.pLien = new InvitationUtileLien(this);
        this.pBouton = new InvitationUtileBouton(this);
        this.pOutils = new InvitationUtileOutils(this);
    }

    get service(): InvitationService {
        return this.pService as InvitationService;
    }
    get url(): InvitationUtileUrl {
        return this.pUrl as InvitationUtileUrl;
    }
    get lien(): InvitationUtileLien {
        return this.pLien as InvitationUtileLien;
    }
    get bouton(): InvitationUtileBouton {
        return this.pBouton as InvitationUtileBouton;
    }
    get outils(): InvitationUtileOutils {
        return this.pOutils as InvitationUtileOutils;
    }
}
