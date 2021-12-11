import { AppSite } from './app-site';
import { PageDef } from '../commun/page-def';

export class AppSitePages {
    static accueil: PageDef = {
        path: AppSite.path,
        lien: AppSite.texte,
        titre: AppSite.titre,
        title: AppSite.titre,
    };
    static peuple: PageDef = {
        path: 'peuple',
        lien: 'Peuplement',
        titre: 'Peuplement de la BDD',
        title: 'Peuplement',
    };
    static nouveauSite: PageDef = {
        path: 'nouveauSite',
        lien: 'Nouveau site',
        title: 'Nouveau site',
        titre: `Enregistrement d'un nouveau site`
    };

    static devenirClient: PageDef = {
        path: 'devenirClient',
        lien: 'Devenir client',
        title: 'Devenir client',
        titre: `Enregistrement d'un nouveau client`,
    };
    static contact: PageDef = {
        path: 'contact',
        lien: 'Contact',
        title: 'Contact',
        titre: 'Contact',
    };
    static apropos: PageDef = {
        path: 'apropos',
        lien: 'A propos',
        title: 'A propos',
        titre: 'A propos',
    };
    static compte: PageDef = {
        path: 'compte',
        title: 'Compte',
        titre: 'Compte',
    };
}
