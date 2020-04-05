import { PageDef } from 'src/app/commun/page-def';
import { iSiteRoutePlusSegments } from 'src/app/site/site-pages';
import { FournisseurPages, FournisseurRoutes } from '../fournisseur-pages';
import { CLFPages } from 'src/app/modeles/c-l-f/c-l-f-pages';

export class FDocumentPages {
    static liste: PageDef = {
        urlSegment: CLFPages.liste.urlSegment,
        title: CLFPages.liste.title,
        titre: CLFPages.liste.titre,
        lien: CLFPages.liste.lien,
    };

    static commande: PageDef = {
        urlSegment: CLFPages.commande.urlSegment,
        title: CLFPages.commande.title,
        titre: CLFPages.commande.titre,
        lien: CLFPages.commande.lien,
    };

    static livraison: PageDef = {
        urlSegment: CLFPages.livraison.urlSegment,
        title: CLFPages.livraison.title,
        titre: CLFPages.livraison.titre,
        lien: CLFPages.livraison.lien,
    };

    static facture: PageDef = {
        urlSegment: CLFPages.facture.urlSegment,
        title: CLFPages.facture.title,
        titre: CLFPages.facture.titre,
        lien: CLFPages.facture.lien,
    };
}

export const FDocumentRoutes = iSiteRoutePlusSegments(FournisseurRoutes, [FournisseurPages.documents.urlSegment]);
