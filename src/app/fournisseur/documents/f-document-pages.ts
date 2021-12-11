import { PageDef } from 'src/app/commun/page-def';
import { CLFPages } from 'src/app/modeles/c-l-f/c-l-f-pages';

export class FDocumentPages {
    static liste: PageDef = {
        path: CLFPages.liste.path,
        title: CLFPages.liste.title,
        titre: CLFPages.liste.titre,
        lien: CLFPages.liste.lien,
    };

    static clients: PageDef = {
        path: CLFPages.choixClient.path,
        title: CLFPages.choixClient.title,
        titre: `Bilans par client`
    }

    static client: PageDef = {
        path: CLFPages.client.path,
        title: CLFPages.choixClient.title,
    }

    static commande: PageDef = {
        path: CLFPages.commande.path,
        title: CLFPages.commande.title,
        titre: CLFPages.commande.titre,
        lien: CLFPages.commande.lien,
    };

    static livraison: PageDef = {
        path: CLFPages.livraison.path,
        title: CLFPages.livraison.title,
        titre: CLFPages.livraison.titre,
        lien: CLFPages.livraison.lien,
    };

    static facture: PageDef = {
        path: CLFPages.facture.path,
        title: CLFPages.facture.title,
        titre: CLFPages.facture.titre,
        lien: CLFPages.facture.lien,
    };

    static cherche: PageDef = {
        path: 'cherche',
        title: 'Recherche',
        titre: 'Rechercher un document',
    }
}
