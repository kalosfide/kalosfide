import { KfLien } from 'src/app/commun/kf-composants/kf-elements/kf-lien/kf-lien';
import { ILienDef } from 'src/app/disposition/fabrique/fabrique-lien';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { CLFUtileUrl } from './c-l-f-utile-url';
import { CLFUtile } from './c-l-f-utile';
import { DataUtileLien } from 'src/app/commun/data-par-key/data-utile-lien';
import { CLFDoc } from './c-l-f-doc';
import { CLFLigne } from './c-l-f-ligne';
import { IKeyId } from 'src/app/commun/data-par-key/key-id/i-key-id';
import { Client } from '../client/client';
import { CLFDocs } from './c-l-f-docs';

export class CLFUtileLien extends DataUtileLien {

    constructor(utile: CLFUtile) {
        super(utile);
    }

    get utile(): CLFUtile {
        return this.dataUtile as CLFUtile;
    }

    get url(): CLFUtileUrl {
        return this.utile.url;
    }

    /**
     * Route: (livraison ou facture)/clients
     * avec le texteKey du client en fragment.
     * @param keyClient key du client
     */
    retourDUnClient(keyClient: IKeyId): KfLien {
        return Fabrique.lien.retour(this.url.retourDUnClient(keyClient), 'Clients');
    }

    /**
     * Route: (livraison ou facture)/client/:key
     * Lien vers la page titre contenant toutes les pages d'édition d'un document de synthèse.
     * @param clfDocs contient le client et ses documents à synthétiser et s'il n'y en a pas la dernière synthèse.
     */
    client(client: Client): KfLien {
        return Fabrique.lien.bouton(this.def('client', this.url.client(client), Fabrique.contenu.choisit()));
    }

    /**
     * Route: commande/bon ou (livraison ou facture)/client/:key/bon/:[NomParam.noDoc]
     * Lien vers la page titre contenant toutes les pages d'édition d'un document.
     */
    bon(clfDoc: CLFDoc): KfLien {
        return Fabrique.lien.bouton(this.def('bon', this.url.bon(clfDoc), Fabrique.contenu.édite()));
    }

    /**
     * Route: (livraison ou facture)/client/:key/bons
     * avec le no du bon en fragment
     * @param clfDoc bon qui est édité
     */
    retourDeBon(clfDoc: CLFDoc): KfLien {
        return Fabrique.lien.retour(this.url.retourDeBon(clfDoc), this.utile.texte.textes(clfDoc.clfDocs.type).def.Bons);
    }

    /**
     * Route: commande/bon
     * Url de la page du bon.
     */
    retourDeSitePasOuvert(): KfLien {
        const def: ILienDef = {
            urlDef: this.url.retourDeSitePasOuvert(),
            contenu: { texte: this.utile.texte.commande.def.Doc }
        }
        return Fabrique.lien.dansAlerte(Fabrique.lien.enLigne(def));
    }

    /**
     * Route: ./client/:key/bon/0
     * Lien vers la page de création d'un bon de commande virtuel
     */
    bonVirtuelDef(clfDocs: CLFDocs): ILienDef {
        return {
            urlDef: this.url.bonVirtuel(clfDocs.client),
            contenu: { texte: `${clfDocs.apiDocs.length === 0 ? 'Créer' : 'Ajouter'} un bon virtuel` }
        };
    }
    bonVirtuel(client: Client): KfLien {
        return Fabrique.lien.ajoute(this.url.bonVirtuel(client), 'Ajouter un bon virtuel');
    }

    defAjoute(): ILienDef {
        return { urlDef: this.url.choixProduit(), contenu: { texte: 'Ajouter une ligne' } };
    }
    ajoute(): KfLien {
        return Fabrique.lien.ajoute(this.url.choixProduit(), 'Ajouter une ligne');
    }
    retourDeChoixProduit(): KfLien {
        return Fabrique.lien.retour(this.url.lignes());
    }
    retourDeAjoute(ligne: CLFLigne): KfLien {
        return Fabrique.lien.retour(this.url.retourDeAjoute(ligne), 'Changer de produit');
    }

    supprime(ligne: CLFLigne): KfLien {
        const iconeDef = ligne.client && ligne.parent.crééParLeClient ? Fabrique.contenu.annule() : Fabrique.contenu.supprime();
        return Fabrique.lien.bouton(this.def('supprime', this.url.supprime(ligne), iconeDef));
    }

    /**
     * Route: document/clients
     * avec le texteKey du client en fragment.
     * @param keyClient key du client
     */
     retourDUnClientVersBilansDocs(keyClient: IKeyId): KfLien {
        return Fabrique.lien.retour(this.url.retourDUnClientVersBilansDocs(keyClient), 'Autre client');
    }

    retourDeDocument(document?: CLFDoc): KfLien {
        return Fabrique.lien.retour(this.url.retourDeDocument(document));
    }

    document(document: CLFDoc): KfLien {
        return Fabrique.lien.enLigne(this.def('', this.url.document(document), { texte: document.titreCode }));
    }
}
