import { Component, OnInit } from '@angular/core';
import { PageBaseComponent } from '../disposition/page-base/page-base.component';
import { AppSitePages } from './app-site-pages';
import { Fabrique } from '../disposition/fabrique/fabrique';
import { KfSuperGroupe } from '../commun/kf-composants/kf-groupe/kf-super-groupe';
import { Identifiant } from '../securite/identifiant';
import { KfGroupe } from '../commun/kf-composants/kf-groupe/kf-groupe';
import { KfEtiquette } from '../commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { AppSite } from './app-site';
import { KfTypeDeBaliseHTML } from '../commun/kf-composants/kf-composants-types';
import { ILienDef } from '../disposition/fabrique/fabrique-lien';
import { ComptePages } from '../compte/compte-pages';
import { IdentificationService } from '../securite/identification.service';
import { KfUlComposant } from '../commun/kf-composants/kf-ul-ol/kf-ul-ol-composant';
import { Site } from '../modeles/site/site';
import { BootstrapTypeTexteCouleur, KfBootstrap } from '../commun/kf-composants/kf-partages/kf-bootstrap';
import { RouteurService } from '../services/routeur.service';
import { KfTexte } from '../commun/kf-composants/kf-elements/kf-texte/kf-texte';
import { Routeur } from '../commun/routeur';
import { FournisseurPages } from '../fournisseur/fournisseur-pages';
import { KfIcone } from '../commun/kf-composants/kf-elements/kf-icone/kf-icone';
import { CLFTextes, CLFUtileTexte } from '../modeles/c-l-f/c-l-f-utile-texte';
import { typeCLF } from '../modeles/c-l-f/c-l-f-type';
import { ClientPages } from '../client/client-pages';
import { EtatRole, EtatsRole } from '../modeles/role/etat-role';
import { CODE_EXEMPLE } from '../modeles/code-exemple';
import { SitePages } from '../site/site-pages';
import { AppPages } from '../app-pages';
import { TexteOutils } from '../commun/outils/texte-outils';
import { Dateur } from '../commun/outils/dateur';
import { PageDef } from '../commun/page-def';

class CarteMessage {
    texte: string;
    type: BootstrapTypeTexteCouleur;
}

class CarteDef {
    role: string;
    nom: string;
    texteDefs: CarteMessage[];
    lienDefs: ILienDef[];

    constructor() {
        this.texteDefs = [];
        this.lienDefs = [];
    }
}

@Component({
    templateUrl: '../disposition/page-base/page-base.html',
})
export class AppSiteAccueilComponent extends PageBaseComponent implements OnInit {

    pageDef = AppSitePages.accueil;
    identifiant: Identifiant;

    get titre(): string {
        return this.pageDef.titre;
    }

    constructor(
        private identification: IdentificationService,
        private routeur: RouteurService,
    ) {
        super();
    }

    créePrésentation(): KfGroupe {
        const groupe = new KfGroupe('presentation');
        const textes: KfEtiquette[] = [];
        Fabrique.ajouteEtiquetteP(textes).ajouteTextes(
            `${AppSite.titre} permet à un fournisseur de gérer bons de commandes, bons de livraison et factures `
            + `dans son site personnel auquel lui seul et ses clients ont accés.`);
        Fabrique.ajouteEtiquetteP(textes).ajouteContenus(
            {
                texte: `Sur un site ${AppSite.titre}, le fournisseur peut publier le catalogue de ses produits, `
                    + `gérer l'accès de ses clients, `
                    + `recevoir des bons de commandes, créer des bons de livraison et des factures et télécharger ces documents. `,
                suiviDeSaut: true
            },
            `Un client peut créer ses bons de commandes et télécharger ses bons de commandes, bons de livraison et factures.`
        );
        Fabrique.ajouteEtiquetteP(textes).ajouteContenus(
            `Pour éviter que des programmes robots créent des sites aux noms de sociétés imaginaires ou qu'un pirate crée un site `
            + `au nom d'une société qui ne lui appartient pas (ce qui empêcherait cette société de créer son site), `
            + `un fournisseur doit transmettre à ${AppSite.titre} les informations qui doivent figurer `
            + `sur les factures et réserver son nom de site. `,
            `(Pour voir quelles sont ces informations, cliquez `,
            Fabrique.lien.enLigne({
                contenu: { texte: `ici` },
                urlDef: {
                    pageDef: AppSitePages.nouveauSite,
                    routeur: Fabrique.url.appRouteur.appSite,
                    params: [{ nom: 'code', valeur: CODE_EXEMPLE }]
                }
            }),
            { texte: ').', suiviDeSaut: true },
            {
                texte: `${AppSite.titre} prend alors contact avec l'emetteur des futures factures pour vérifier `
                    + `que c'est bien elle qui est à l'origine de la demande de création du site, `
                    + `puis lui envoie une invitation, c'est à dire un message email contenant un lien avec un code `
                    + `permettant accéder à une page où il pourra finaliser la création de son site. `,
                suiviDeSaut: true,
            },
            `Pour qu'un de ses clients puisse accèder à son site, un fournisseur doit lui envoyer `
            + `une invitation, c'est à dire un message email contenant un lien avec un code `
            + `permettant accéder à une page où ce client pourra saisir les informations nécessaires à la création de son compte. `,
            `(Pour voir quelles sont ces informations, cliquez `,
            Fabrique.lien.enLigne({
                contenu: { texte: `ici` },
                urlDef: {
                    pageDef: AppSitePages.devenirClient,
                    routeur: Fabrique.url.appRouteur.appSite,
                    params: [{ nom: 'code', valeur: CODE_EXEMPLE }]
                }
            }),
            ').'
        );
        Fabrique.ajouteEtiquetteP(textes).ajouteTextes(
            `Avec ce système de participation sur invitation, chaque site ${AppSite.titre} est un espace clos auquel seuls `
            + `le fournisseur et les clients qu'il a invité ont accés. A part l'admnistration de ${AppSite.titre}, `
            + `personne d'autre ne peut savoir que le site existe.`
        );

        textes.forEach(t => groupe.ajoute(t));
        return groupe;
    }

    créeSansIdentifiant(): KfGroupe {
        const textes: KfEtiquette[] = [];
        let étiquette: KfEtiquette;
        let def: ILienDef;
        étiquette = Fabrique.ajouteEtiquetteP(textes);
        étiquette.fixeContenus(
            `Vous n'êtes pas connecté à ${AppSite.titre}.`
        );
        étiquette = Fabrique.ajouteEtiquetteP(textes);
        étiquette.ajouteTextes(
            `Si vous avez un compte, vous pouvez `
        );
        def = {
            nom: 'connection',
            urlDef: {
                pageDef: ComptePages.connection,
                routeur: Fabrique.url.appRouteur.compte,
            },
            contenu: { texte: 'vous connecter' },
        };
        étiquette.contenuPhrase.ajouteContenus(Fabrique.lien.enLigne(def));
        étiquette.ajouteTextes(` à ${AppSite.titre}.`);

        const groupe = new KfGroupe('');
        KfBootstrap.ajouteClasseAlerte(groupe, 'info');
        textes.forEach(t => groupe.ajoute(t));

        return groupe;
    }

    créeDemandeNouveauSite(): KfGroupe {
        const textes: KfEtiquette[] = [];
        let étiquette: KfEtiquette;
        let def: ILienDef;
        étiquette = Fabrique.ajouteEtiquetteP(textes);
        def = {
            nom: 'nouveauSite',
            urlDef: {
                pageDef: AppSitePages.nouveauSite,
                routeur: Fabrique.url.appRouteur.appSite,
            },
        };
        étiquette.fixeContenus(
            `Vous pouvez commencer la création du site ${AppSite.titre} de votre société sur la page: `,
            Fabrique.lien.enLigne(def)
        );
        étiquette = Fabrique.ajouteEtiquetteP(textes);
        étiquette.ajouteTextes(
            `Le service client de ${AppSite.titre} prendra contact avec la société concernée par la demande `
            + `pour finaliser la création de son site.`);

        const groupe = new KfGroupe('');
        KfBootstrap.ajouteClasseAlerte(groupe, 'primary');
        textes.forEach(t => groupe.ajoute(t));

        return groupe;
    }

    avertissementPasDéconnecté(site: Site): {
        texte: string,
        type: BootstrapTypeTexteCouleur,
    } {
        // l'avertissement ne doit apparaître qu'une seule fois
        site.nouveauxDocs = [];
        this.identification.fixeIdentifiant(this.identifiant);
        return {
            texte: `Vous ne vous êtes pas déconnecté à la fin de votre session précédente sur ${AppSite.nom}. `
                + `Vous ne pouvez pas savoir ici si de nouveaux documents sont arrivés depuis.`,
            type: 'warning',
        };
    }

    private messageFermé(compte: string): CarteMessage {
        return {
            texte: `${compte} est définitivement fermé. Vous ne pouvez plus y accéder.`,
            type: 'warning'
        };
    }

    private messageInactif(compte: string, dateInactif: Date): CarteMessage {
        const dateDébutFermé = Dateur.ajouteJours(dateInactif, EtatsRole.nbJoursInactifsAvantFermé);
        return {
            texte: `${compte} est désactivé. La fermeture définitive aura lieu le ${TexteOutils.date.formate(dateDébutFermé, {
                hierAujourDHuiDemain: { aujourDHui: true, demain: true },
                autreJour: TexteOutils.date.en_lettres
            })} à ${dateDébutFermé.getHours()}h ${dateDébutFermé.getMinutes()}. `
                + `Jusque là, vous pouvez toujours télécharger vos documents.`,
            type: 'warning'
        };
    }

    carteDef(site: Site): CarteDef {
        const def = new CarteDef();
        const routeurDeSite = Fabrique.url.appRouteur.site;
        let routeurDeRole: Routeur;
        let pageDefAccueil: PageDef;
        let pageDefDocuments: PageDef;
        if (site.client) {
            def.role = 'Client';
            def.nom = site.client.nom;
            routeurDeRole = routeurDeSite.enfant(SitePages.client.path);
            pageDefAccueil = ClientPages.accueil;
            pageDefDocuments = ClientPages.documents;
        } else {
            def.role = 'Fournisseur';
            def.nom = site.fournisseur.nom;
            routeurDeRole = routeurDeSite.enfant(SitePages.fournisseur.path);
            pageDefAccueil = FournisseurPages.accueil;
            pageDefDocuments = FournisseurPages.documents;
        }
        if (site.fournisseur.etat === EtatRole.fermé) {
            def.texteDefs.push(this.messageFermé('Le site'));
            return def;
        }
        const lienDef: (pageDef: PageDef, routeur: Routeur) => ILienDef = (pageDef: PageDef, routeur: Routeur) => {
            return {
                nom: pageDef.path + site.id,
                urlDef: { pageDef, routeur }
            }
        };

        let dateInactif: Date;
        let compte: string;
        if (site.fournisseur.etat === EtatRole.inactif) {
            dateInactif = site.fournisseur.dateEtat, EtatsRole.nbJoursInactifsAvantFermé;
            compte = 'Le site';
        }
        if (site.client && site.client.etat === EtatRole.inactif) {
            dateInactif = site.client.dateEtat, EtatsRole.nbJoursInactifsAvantFermé;
            compte = 'Votre compte client';
        }
        if (compte) {
            def.texteDefs.push(this.messageInactif(compte, dateInactif));
            def.lienDefs.push(lienDef(pageDefDocuments, routeurDeRole));
            return def;
        }

        def.lienDefs.push(lienDef(pageDefAccueil, routeurDeRole));
        if (site.client) {
            if (!site.ouvert) {
                def.texteDefs = [
                    {
                        texte: `Une modification du catalogue est en cours.`
                            + ` Vous ne pouvez pas commander quand une modification du catalogue est en cours.`,
                        type: 'danger',
                    },
                ];
            }
            def.lienDefs = [lienDef(pageDefAccueil, routeurDeRole)];
        } else {
            const pasDeProduits = site.bilan.catalogue.produits === 0;
            const pasDeClients = site.bilan.clients.actifs === 0 && site.bilan.clients.nouveaux === 0;
            const gestion = routeurDeRole.enfant(FournisseurPages.gestion.path);
            if (pasDeProduits) {
                def.texteDefs.push(
                    {
                        texte: `Il n'y a pas de produits disponibles dans votre catalogue.`
                            + ` Votre site ne peut pas fonctionner si son catalogue est vide.`,
                        type: 'danger',
                    },
                );
                def.lienDefs.push(lienDef(FournisseurPages.catalogue, gestion));
            } else {
                if (!site.ouvert && !pasDeClients) {
                    def.texteDefs.push(
                        {
                            texte: `Une modification du catalogue est en cours.`
                                + ` Vos clients ne peuvent pas commander quand une modification du catalogue est en cours.`,
                            type: 'danger',
                        },
                    );
                    def.lienDefs.push(lienDef(FournisseurPages.catalogue, gestion));
                }
            }
            if (pasDeClients) {
                def.texteDefs.push(
                    {
                        texte: `Il n'y a pas de clients actifs sur votre site.`
                            + ` Votre site ne peut pas fonctionner s'il n'a pas de clients.`,
                        type: 'danger',
                    },
                );
                def.lienDefs.push(lienDef(FournisseurPages.clients, gestion));
            } else {
                if (site.bilan.clients.nouveaux > 0) {
                    const t: { un_nouveau_client: string, son_compte: string } = site.bilan.clients.nouveaux === 1
                        ? { un_nouveau_client: 'un nouveau client', son_compte: 'son compte' }
                        : { un_nouveau_client: 'de nouveaux clients', son_compte: 'leurs comptes' }
                    def.texteDefs.push(
                        {
                            texte: `Vous avez ${t.un_nouveau_client}.`
                                + ` Vous devez activer ${t.son_compte} avant de pouvoir créer des bons de livraison et des factures.`,
                            type: 'danger',
                        },
                    );
                    def.lienDefs.push(lienDef(FournisseurPages.clients, gestion));
                }
            }
        }

        if (this.identifiant.idDernierSite === undefined || this.identifiant.idDernierSite === null) {
            def.texteDefs.push(this.avertissementPasDéconnecté(site));
        } else {
            const nouveauxDocs = site.nouveauxDocs;
            if (nouveauxDocs.length > 0) {
                const textes = new CLFUtileTexte();
                const texteNouveau = (clfTextes: CLFTextes, nb: number) =>
                    clfTextes.en_toutes_lettres(nb) + ' ' + (nb === 1 ? clfTextes.nouveau_doc : clfTextes.nouveaux_docs);
                const texteReçu = (textesNouveau: string) =>
                    `Depuis votre dernière déconnection de ${AppSite.nom}, vous avez reçu ${textesNouveau}.`;
                if (site.client) {
                    // c'est un site de client
                    const textesNouveau: string[] = [];
                    let nb = nouveauxDocs.filter(apiDoc => typeCLF(apiDoc.type) === 'livraison').length;
                    if (nb > 0) {
                        textesNouveau.push(texteNouveau(textes.livraison, nb));
                    }
                    nb = nouveauxDocs.filter(apiDoc => typeCLF(apiDoc.type) === 'facture').length;
                    if (nb > 0) {
                        textesNouveau.push(texteNouveau(textes.facture, nb));
                    }
                    def.texteDefs.push(
                        {
                            texte: texteReçu(textesNouveau.join(' et ')),
                            type: 'success'
                        }
                    );
                    def.lienDefs.push(lienDef(ClientPages.documents, routeurDeRole));
                } else {
                    // c'est un site de fournisseur
                    def.texteDefs.push(
                        {
                            texte: texteReçu(texteNouveau(textes.commande, nouveauxDocs.length)),
                            type: 'success'
                        }
                    );
                    def.lienDefs.push(lienDef(FournisseurPages.livraison, routeurDeRole));
                }
            }
        }
        return def;
    }

    créeCarte(site: Site): KfGroupe {
        const carte = new KfGroupe('carte' + site.id);
        carte.ajouteClasse('card mb-2');
        const corps = new KfGroupe('corps' + site.id);
        corps.ajouteClasse('card-body');
        carte.ajoute(corps);
        let étiquette: KfEtiquette;
        étiquette = new KfEtiquette('titre', 'Site: ' + site.titre);
        étiquette.baliseHtml = KfTypeDeBaliseHTML.h5;
        étiquette.ajouteClasse('card-title');
        corps.ajoute(étiquette);
        const def = this.carteDef(site);
        étiquette = new KfEtiquette('site', 'Role: ' + def.role);
        étiquette.baliseHtml = KfTypeDeBaliseHTML.h6;
        étiquette.ajouteClasse('card-subtitle');
        corps.ajoute(étiquette);
        étiquette = new KfEtiquette('nom', 'Nom: ' + def.nom);
        étiquette.baliseHtml = KfTypeDeBaliseHTML.p;
        étiquette.ajouteClasse('card-text');
        corps.ajoute(étiquette);
        if (def.texteDefs.length > 0) {
            const messages = new KfUlComposant('messages');
            messages.ajouteClasse('list-group list-group-flush');
            carte.ajoute(messages);
            for (let i = 0; i < def.texteDefs.length; i++) {
                const texteDef = def.texteDefs[i];
                const message = new KfEtiquette('');
                const icone = new KfIcone('', Fabrique.icone.def.marque);
                icone.ajouteClasse(KfBootstrap.classeTexte({ color: texteDef.type }), 'me-2');
                const texte = new KfTexte('', texteDef.texte);
                message.contenuPhrase.contenus = [icone, texte];
                messages.ajoute(message);
                const li = messages.lis[i];
                li.ajouteClasse('list-group-item');
            }
        }
        const liens: KfGroupe = new KfGroupe('liens');
        liens.ajouteClasse('card-body');
        const liensDefs = Object.keys(def.lienDefs);
        if (liensDefs.length > 0) {
            liensDefs.forEach(key => {
                const lien = Fabrique.lien.enLigne(def.lienDefs[key]);
                lien.ajouteClasse('btn btn-link');
                liens.ajoute(lien);
            });
            carte.ajoute(liens);
        }
        return carte;
    }


    créeCarteAdministrateur(): KfGroupe {
        const carte = new KfGroupe('carte');
        carte.ajouteClasse('card mb-2');
        const corps = new KfGroupe('corps');
        corps.ajouteClasse('card-body');
        carte.ajoute(corps);
        let étiquette: KfEtiquette;
        étiquette = new KfEtiquette('titre', 'Site: ' + AppSite.titre);
        étiquette.baliseHtml = KfTypeDeBaliseHTML.h5;
        étiquette.ajouteClasse('card-title');
        corps.ajoute(étiquette);
        étiquette = new KfEtiquette('site', 'Role: Administrateur');
        étiquette.baliseHtml = KfTypeDeBaliseHTML.h6;
        étiquette.ajouteClasse('card-subtitle');
        corps.ajoute(étiquette);
        const accueil: ILienDef = { urlDef: { pageDef: AppPages.admin, routeur: Fabrique.url.appRouteur } };
        const lienDefs: { [key: string]: ILienDef } = {};
        lienDefs['accueil'] = accueil;
        const informations: {
            texte: string,
            type: BootstrapTypeTexteCouleur,
        }[] = [];
        if (informations.length > 0) {
            const messages = new KfUlComposant('messages');
            messages.ajouteClasse('list-group list-group-flush');
            carte.ajoute(messages);
            for (let i = 0; i < informations.length; i++) {
                const information = informations[i];
                const message = new KfEtiquette('');
                const icone = new KfIcone('', Fabrique.icone.def.marque);
                icone.ajouteClasse(KfBootstrap.classeTexte({ color: information.type }), 'me-2');
                const texte = new KfTexte('', information.texte);
                message.contenuPhrase.contenus = [icone, texte];
                messages.ajoute(message);
                const li = messages.lis[i];
                li.ajouteClasse('list-group-item');
            }
        }
        const liens: KfGroupe = new KfGroupe('liens');
        liens.ajouteClasse('card-body');
        Object.keys(lienDefs).forEach(key => {
            const lien = Fabrique.lien.enLigne(lienDefs[key]);
            lien.ajouteClasse('btn btn-link');
            liens.ajoute(lien);
        });
        carte.ajoute(liens);
        return carte;
    }

    créeAvecIdentifiant(): KfGroupe {
        const textes: KfEtiquette[] = [];
        let étiquette: KfEtiquette;
        étiquette = Fabrique.ajouteEtiquetteP(textes);
        étiquette.ajouteTextes(
            `Vous êtes connecté à ${AppSite.titre} avec l'email `,
            {
                texte: this.identifiant.email,
                balise: KfTypeDeBaliseHTML.b
            },
            ` ce qui vous donne accès à:`
        );

        const groupe = new KfGroupe('');
        KfBootstrap.ajouteClasseAlerte(groupe, 'info');
        textes.forEach(t => groupe.ajoute(t));
        if (this.identifiant.estAdministrateur) {
            groupe.ajoute(this.créeCarteAdministrateur());
        } else {
            this.identifiant.sites.forEach((site: Site) => groupe.ajoute(this.créeCarte(site)));
        }
        return groupe;
    }

    protected créeContenus() {
        this.superGroupe = new KfSuperGroupe(this.nom);
        this.superGroupe.ajoute(this.créePrésentation());
        if (this.identifiant) {
            this.superGroupe.ajoute(this.créeAvecIdentifiant());
        } else {
            this.superGroupe.ajoute(this.créeSansIdentifiant());
        }
        this.superGroupe.ajoute(this.créeDemandeNouveauSite());
        this.superGroupe.quandTousAjoutés();
    }

    ngOnInit() {
        this.identifiant = this.identification.litIdentifiant();
        this.niveauTitre = 0;
        this.créeTitrePage();
        this.créeContenus();
    }
}
