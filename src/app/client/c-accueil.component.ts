import { Component, OnInit } from '@angular/core';
import { PageDef } from '../commun/page-def';
import { ClientPages } from './client-pages';
import { IBarreTitre } from '../disposition/fabrique/fabrique-titre-page/fabrique-titre-page';
import { Fabrique } from '../disposition/fabrique/fabrique';
import { KfComposant } from '../commun/kf-composants/kf-composant/kf-composant';
import { KfEtiquette } from '../commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { KfTypeDeBaliseHTML } from '../commun/kf-composants/kf-composants-types';
import { PageBaseComponent } from '../disposition/page-base/page-base.component';
import { Site } from '../modeles/site/site';
import { KfSuperGroupe } from '../commun/kf-composants/kf-groupe/kf-super-groupe';
import { ActivatedRoute } from '@angular/router';
import { KfGroupe } from '../commun/kf-composants/kf-groupe/kf-groupe';
import { ClientCLFService } from './client-c-l-f.service';
import { BootstrapType, KfBootstrap } from '../commun/kf-composants/kf-partages/kf-bootstrap';
import { GroupeBoutonsMessages } from '../disposition/fabrique/fabrique-formulaire';
import { KfBouton } from '../commun/kf-composants/kf-elements/kf-bouton/kf-bouton';
import { ApiRequêteAction } from '../api/api-requete-action';
import { map } from 'rxjs/operators';
import { ApiResult204NoContent } from '../api/api-results/api-result-204-no-content';
import { CLFDoc } from '../modeles/c-l-f/c-l-f-doc';
import { CLFTextes } from '../modeles/c-l-f/c-l-f-utile-texte';
import { Identifiant } from '../securite/identifiant';
import { ApiDoc } from '../modeles/c-l-f/api-doc';
import { AppSite } from '../app-site/app-site';
import { KfContenuPhraséDef } from '../commun/kf-composants/kf-partages/kf-contenu-phrase/kf-contenu-phrase';

@Component({
    templateUrl: '../disposition/page-base/page-base.html',
})
export class CAccueilComponent extends PageBaseComponent implements OnInit {

    pageDef: PageDef = ClientPages.accueil;

    vientDOuvrir: boolean;
    alerteFermé: KfGroupe;
    alerteRéouvert: KfGroupe;

    identifiant: Identifiant;
    site: Site;

    get titre(): string {
        return this.site.titre;
    }

    constructor(
        protected route: ActivatedRoute,
        protected service: ClientCLFService,
    ) {
        super();
    }

    créeBarreTitre = (): IBarreTitre => {
        const barre = Fabrique.titrePage.barreTitre({
            pageDef: this.pageDef,
            contenuAidePage: this.contenuAidePage(),
            groupesDeBoutons: [Fabrique.titrePage.groupeDefAccès('client')]
        });

        this.barre = barre;
        return barre;
    }

    private contenuAidePage(): KfComposant[] {
        const infos: KfComposant[] = [];

        let etiquette: KfEtiquette;

        etiquette = Fabrique.ajouteEtiquetteP(infos);
        etiquette.ajouteTextes(
            `Ceci est `,
            { texte: 'à faire', balise: KfTypeDeBaliseHTML.b },
            '.'
        );

        return infos;
    }

    private rafraichit() {
        this.barre.site = this.site;
        this.barre.rafraichit();
        this.alerteRéouvert.nePasAfficher = !this.vientDOuvrir;
        this.alerteFermé.nePasAfficher = this.site.ouvert;
    }

    private alerte(ouvert: boolean): KfGroupe {
        const textesEtatSite = this.service.clientUtile.textesEtatSite(ouvert);
        const messages: KfEtiquette[] = [];
        let étiquette: KfEtiquette;
        étiquette = Fabrique.ajouteEtiquetteP(messages);
        étiquette.fixeTextes(textesEtatSite.titre);
        étiquette.ajouteClasse(KfBootstrap.classeTexte({ poids: 'bold' }));
        const defs = textesEtatSite.textes.map(t => ({ texte: t, suiviDeSaut: true }));
        étiquette = Fabrique.ajouteEtiquetteP(messages);
        étiquette.fixeTextes(...defs);
        let boutons: KfBouton[];
        let typeAlerte: BootstrapType;
        if (ouvert) {
            typeAlerte = 'success';
        } else {
            typeAlerte = 'danger';
            const apiAction: ApiRequêteAction = {
                demandeApi: () => this.service.litEtatSiteEtRetourneTrue().pipe(map(() => new ApiResult204NoContent())),
                actionSiOk: () => {
                    const site = this.service.identification.siteEnCours;
                    if (site.ouvert) {
                        this.vientDOuvrir = true;
                        Site.copieEtat(site, this.site)
                        this.rafraichit();
                    }
                }
            };
            const bouton = Fabrique.bouton.boutonAttente('rafraichit', Fabrique.contenu.rafraichit(), apiAction, this.service);
            boutons = [bouton];
        }
        const g = new GroupeBoutonsMessages('alerte_' + ouvert, { messages, boutons });
        g.alerte(typeAlerte);
        return g.groupe;
    }

    private ajouteNouveauxDocs() {
        if (!this.site.nouveauxDocs) {
            // il n'y a pas eu de déconnection
            this.superGroupe.ajoute(Fabrique.alerte(
                'deconnecte',
                'warning',
                'Dommage!',
                `Vous ne vous êtes pas déconnecté à la fin de votre session précédente sur ${AppSite.nom}. `
                + `Vous ne pouvez pas savoir ici si de nouveaux documents sont arrivés depuis.`,
                `Pour le découvrir, allez sur la page `,
                {
                    pageDef: ClientPages.documents,
                    routeur: Fabrique.url.appRouteur.client
                },
            ));
            // l'avertissement ne doit apparaître qu'une seule fois
            this.site.nouveauxDocs = [];
            this.service.identification.fixeIdentifiant(this.identifiant);
            return;
        }
        if (this.site.nouveauxDocs.length === 0) {
            return;
        }
        const messages: KfContenuPhraséDef[][] = [];
        let estLePremier: boolean = true;
        const ajouteNouveau: (textes: CLFTextes, docs: CLFDoc[]) => KfContenuPhraséDef[] = (textes: CLFTextes, docs: CLFDoc[]) => {
            const contenus: KfContenuPhraséDef[] = [];
            const nombre = textes.en_toutes_lettres(docs.length);
            const t: {
                nouveau_doc: string,
                le: string,
                ce_lien: string
            } =  docs.length === 1
                    ? { nouveau_doc: textes.nouveau_doc, le: textes.def.le, ce_lien: 'ce lien: ' }
                    : { nouveau_doc: textes.nouveaux_docs, le: 'les', ce_lien: 'ces' }
            const début = estLePremier
                ? `Depuis votre dernière déconnection de ${AppSite.nom}, v`
                : `V`
            estLePremier = false;
            contenus.push(début + `ous avez reçu ` + nombre
                + `${t.nouveau_doc}. Vous pouvez ${t.le} consulter en suivant ${t.ce_lien} `);
            docs.forEach(d => contenus.push(this.service.utile.lien.document(d)));
            return contenus;
        }
        const nouveaux = this.site.nouveauxDocs.map((apiDoc: ApiDoc) => CLFDoc.deKey(apiDoc));
        const livraisons = nouveaux.filter(d => d.type === 'livraison');
        if (livraisons.length > 0) {
            messages.push(ajouteNouveau(this.service.utile.texte.livraison, livraisons));
        }
        const factures = nouveaux.filter(d => d.type === 'facture');
        if (factures.length > 0) {
            messages.push(ajouteNouveau(this.service.utile.texte.facture, factures));
        }
        this.superGroupe.ajoute(Fabrique.alerte(
            'nouveauxDocs',
            'success',
            'Nouveau',
            messages
        ));
    }

    protected créeContenus() {
        this.superGroupe = new KfSuperGroupe(this.nom);
        this.ajouteNouveauxDocs();
        this.alerteFermé = this.alerte(false);
        this.superGroupe.ajoute(this.alerteFermé);
        this.alerteRéouvert = this.alerte(true);
        this.superGroupe.ajoute(this.alerteRéouvert);
        const titre = new KfEtiquette('titre', this.titre);
        titre.baliseHtml = KfTypeDeBaliseHTML.h4;
        this.superGroupe.ajoute(titre);
    }

    ngOnInit() {
        this.identifiant = this.service.identification.litIdentifiant();
        this.site = Identifiant.siteEnCours(this.identifiant);
        this.niveauTitre = 0;
        this.créeTitrePage();
        this.créeContenus();
        this.rafraichit();
    }

}
