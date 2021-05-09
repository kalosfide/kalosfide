import { ClientUtile } from './client-utile';
import { Client } from './client';
import { DataUtileLien } from 'src/app/commun/data-par-key/data-utile-lien';
import { KfLien } from 'src/app/commun/kf-composants/kf-elements/kf-lien/kf-lien';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { FournisseurClientPages } from 'src/app/fournisseur/clients/client-pages';

export class ClientUtileLien extends DataUtileLien {
    constructor(utile: ClientUtile) {
        super(utile);
    }

    get utile(): ClientUtile {
        return this.parent as ClientUtile;
    }

    // liens de barre
    accueil(): KfLien {
        return Fabrique.lien.deBarre(
            this.utile.urlKey.dePageDef(FournisseurClientPages.accueil),
            Fabrique.icone.nomIcone.info);
    }
    clients(): KfLien {
        return Fabrique.lien.deBarre(
            this.utile.urlKey.dePageDef(FournisseurClientPages.index),
            Fabrique.icone.nomIcone.personnes,
            'Liste');
    }
    invitations(): KfLien {
        return Fabrique.lien.deBarre(
            this.utile.urlKey.dePageDef(FournisseurClientPages.invitations),
            Fabrique.icone.nomIcone.envelope);
    }
    index(): KfLien {
        return this.utile.lienKey.index();
    }
    retourIndex(t: Client): KfLien {
        return this.utile.lienKey.retourIndex(t);
    }
    ajoute(): KfLien {
        return this.utile.lienKey.ajoute();
    }

    // liens de table
    edite(t: Client): KfLien {
        return this.utile.lienKey.edite(t);
    }
    aperçu(t: Client): KfLien {
        return this.utile.lienKey.edite(t);
    }

    invite(client: Client): KfLien {
        return Fabrique.lien.lien(this.def('', this.utile.url.invite(client), Fabrique.contenu.invite));
    }

    invité(client: Client): KfLien {
        return Fabrique.lien.lien(this.def('', this.utile.url.invite(client), Fabrique.contenu.invité));
    }

    accepte(client: Client): KfLien {
        return Fabrique.lien.lien(this.def('', this.utile.url.accepte(client), Fabrique.contenu.accepter));
    }

    exclut(client: Client): KfLien {
        return Fabrique.lien.lien(this.def('', this.utile.url.exclut(client), Fabrique.contenu.exclure));
    }

    supprime(client: Client): KfLien {
        return Fabrique.lien.lien(this.def('', this.utile.url.exclut(client), Fabrique.contenu.supprime));
    }
}
