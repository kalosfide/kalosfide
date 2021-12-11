import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';

import { Observable, of } from 'rxjs';
import { ApiResult } from '../../api/api-results/api-result';

import { PageDef } from 'src/app/commun/page-def';
import { AppSitePages } from '../app-site-pages';
import { FournisseurPages } from 'src/app/fournisseur/fournisseur-pages';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { CompteService } from 'src/app/compte/compte.service';
import { FormulaireComponent } from 'src/app/disposition/formulaire/formulaire.component';
import { KfGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-groupe';
import { KfTypeDEvenement } from 'src/app/commun/kf-composants/kf-partages/kf-evenements';
import { NouveauSite } from './nouveau-site';
import { KfBouton } from 'src/app/commun/kf-composants/kf-elements/kf-bouton/kf-bouton';
import { KfLien } from 'src/app/commun/kf-composants/kf-elements/kf-lien/kf-lien';
import { ApiResult204NoContent } from 'src/app/api/api-results/api-result-204-no-content';
import { KfInputTexte } from 'src/app/commun/kf-composants/kf-elements/kf-input/kf-input-texte';
import { AppSite } from '../app-site';
import { FournisseurEditeur } from 'src/app/modeles/fournisseur/fournisseur-editeur';
import { IKfAccordeonDef, KfAccordeon } from 'src/app/commun/kf-composants/kf-accordeon/kf-accordeon';
import { KfTexte } from 'src/app/commun/kf-composants/kf-elements/kf-texte/kf-texte';
import { KfIcone } from 'src/app/commun/kf-composants/kf-elements/kf-icone/kf-icone';
import { KfBootstrap } from 'src/app/commun/kf-composants/kf-partages/kf-bootstrap';
import { KfComposant } from 'src/app/commun/kf-composants/kf-composant/kf-composant';
import { KfAccordeonItem } from 'src/app/commun/kf-composants/kf-accordeon/kf-accordeon-item';

@Component({
    templateUrl: '../../disposition/page-base/page-base.html',
})
export class NouveauSiteComponent extends FormulaireComponent implements OnInit, OnDestroy {

    pageDef: PageDef = AppSitePages.nouveauSite;

    nouveauSite: NouveauSite;

    get titre(): string {
        return this.pageDef.titre;
    }

    éditeur: FournisseurEditeur;
    email: KfInputTexte;

    texteBoutonSoumettre: () => string;

    créeEdition: () => KfGroupe;

    créeBoutonsDeFormulaire: (formulaire: KfGroupe) => (KfBouton | KfLien)[];

    apiDemande: () => Observable<ApiResult>;

    actionSiOk: () => void;


    constructor(
        protected route: ActivatedRoute,
        protected service: CompteService,
    ) {
        super(service);

        this.titreRésultatErreur = 'Enregistrement impossible';
        this.titreRésultatSucces = 'Enregistrement réussi.';
    }

    get kfUrl(): KfInputTexte {
        return this.éditeur.siteEditeur.kfUrl;
    }

    créeEditionBase(): KfGroupe {
        const groupe = Fabrique.formulaire.formulaire();

        this.éditeur = new FournisseurEditeur(this);
        this.éditeur.créeKfDeData();
        this.éditeur.kfDeData.forEach(c => groupe.ajoute(c));
        return groupe;
    }

    créeBoutonsDemande(formulaire: KfGroupe): (KfBouton | KfLien)[] {
        this.boutonSoumettre = Fabrique.bouton.soumettre(formulaire, this.texteBoutonSoumettre());
        const boutonAnnuler = Fabrique.lien.boutonAnnuler({ routeur: Fabrique.url.appRouteur.appSite });
        return [boutonAnnuler, this.boutonSoumettre];
    }

    créeEditionDemande(): KfGroupe {

        this.texteBoutonSoumettre = () => {
            let texte = `Créer le site`;
            if (this.kfUrl.valeur && !this.kfUrl.gereValeur.invalide) {
                texte += this.texteDAdresse(this.kfUrl.valeur);
            }
            return texte;
        };
        const groupe = Fabrique.formulaire.formulaire();

        this.éditeur = new FournisseurEditeur(this);
        this.éditeur.créeKfDeData();

        const def: IKfAccordeonDef = {
            plusieursOuverts: true,
            classe: KfAccordeon.bootstrapClasse
        }
        const accordéon = new KfAccordeon('demande', def);
        const ajouteItem: (nom: string, titre: string, valide: () => boolean, ...composants: KfComposant[]) => KfAccordeonItem
         = (nom: string, titre: string, valide: () => boolean, ...composants: KfComposant[]) => {
            const bouton = new KfBouton(nom);
            const texte = new KfTexte('', titre);
            texte.ajouteClasse(KfBootstrap.classeTexte({ poids: 'bold' }));
            const iconeValide = new KfIcone('', Fabrique.icone.def.accepter);
            iconeValide.ajouteClasse(
                KfBootstrap.classeSpacing('margin', 'gauche', 2),
                KfBootstrap.classeTexte({ color: 'success' }),
                { nom: 'kf-invisible', active: () => !valide() }
            );
            const iconeInvalide = new KfIcone('', Fabrique.icone.def.danger_cercle);
            iconeInvalide.ajouteClasse(
                KfBootstrap.classeSpacing('margin', 'gauche', 2),
                KfBootstrap.classeTexte({ color: 'danger' }),
                { nom: 'kf-invisible', active: () => valide() }
            );
            bouton.contenuPhrase.fixeContenus(texte, iconeValide, iconeInvalide);
            const groupe = new KfGroupe('');
            composants.forEach(c => groupe.ajoute(c));
            groupe.ajouteClasse(KfBootstrap.classeSpacing('padding', 'tous', 3));

            const item = accordéon.ajouteItem(bouton, groupe);
            bouton.ajouteClasse({ nom: KfBootstrap.classeFond('light'), active: () => !item.ouvert });
            return item;
        }
        ajouteItem('role', 'Identification de la société', () => this.éditeur.roleEditeur.valide, ...this.éditeur.roleEditeur.kfDeData);
        ajouteItem('site', 'Définition du site', () => this.éditeur.siteEditeur.valide, ...this.éditeur.siteEditeur.kfDeData);
        const email = Fabrique.input.email();
        Fabrique.formulaire.préparePourPage(email);
        const item = ajouteItem('connection', 'Identifiant de connection', () => !email.gereValeur.invalide, email);
        const identifiant = this.service.identification.litIdentifiant();
        if (identifiant) {
            email.valeur = identifiant.email;
            item.ouvert = true;
        }

        groupe.ajoute(accordéon);
        this.kfUrl.gereHtml.suitLaValeur();
        this.kfUrl.gereHtml.ajouteTraiteur(KfTypeDEvenement.valeurChange,
            () => {
                this.boutonSoumettre.fixeTexte(this.texteBoutonSoumettre());
            });

        return groupe;
    }

    texteDAdresse(urlSite: string): string {
        const routeur = Fabrique.url.appRouteur.site;
        routeur.fixeSite(urlSite);
        return ` d'adresse ${routeur.url()}`;

    }

    initialiseDemande() {

        this.créeEdition = (): KfGroupe => this.créeEditionDemande();

        this.créeBoutonsDeFormulaire = (formulaire: KfGroupe) => this.créeBoutonsDemande(formulaire);

        this.apiDemande = (): Observable<ApiResult> => {
            const valeur: NouveauSite = this.valeur;
            return this.service.demandeNouveauSite(valeur);
        }

        this.actionSiOk = (): void => {

            this.routeur.navigueUrlDef({ routeur: Fabrique.url.appRouteur.appSite });
        }
    }

    initialiseActive() {

        this.créeAvantFormulaire = () => [this.créeEditionBase()];

        this.créeEdition = (): KfGroupe => {
            const groupe = Fabrique.formulaire.formulaire();
            const email = Fabrique.input.email();
            groupe.ajoute(email);
            const password = Fabrique.input.motDePasse(null);
            groupe.ajoute(password);
            const code = Fabrique.input.texteInvisible('code', this.nouveauSite.code);
            groupe.ajoute(code);

            return groupe;
        }

        this.créeBoutonsDeFormulaire = (formulaire: KfGroupe) => {
            this.boutonSoumettre = Fabrique.bouton.soumettre(formulaire, 'Activer le site' + this.texteDAdresse(this.nouveauSite.url));
            return [this.boutonSoumettre];
        };

        this.apiDemande = (): Observable<ApiResult> => {
            const valeur: NouveauSite = this.valeur;
            return this.service.activeNouveauSite(valeur);
        }

        this.actionSiOk = (): void => {
            Fabrique.url.appRouteur.site.fixeSite(this.kfUrl.valeur);
            this.routeur.naviguePageDef(FournisseurPages.accueil, Fabrique.url.appRouteur.fournisseur);
        }
    }

    initialiseExemple() {
        this.créeAvantFormulaire = () => {
            const groupe = Fabrique.alerte('exemple', 'info', undefined,
                `Vous pouvez voir ci-dessous les informations à fournir pour demander la création d'un site sur ${AppSite.nom}`
            )
            return [groupe];
        }

        this.créeEdition = (): KfGroupe => this.créeEditionDemande();

        this.créeBoutonsDeFormulaire = (formulaire: KfGroupe) => this.créeBoutonsDemande(null);

        this.apiDemande = (): Observable<ApiResult> => of(new ApiResult204NoContent())

        this.actionSiOk = (): void => { }
    }

    ngOnInit() {
        this.subscriptions.push(this.route.data.subscribe((data: Data) => {
            this.nouveauSite = data.nouveauSite;
            if (this.nouveauSite) {
                if (this.nouveauSite.code) {
                    this.initialiseActive();
                } else {
                    this.initialiseExemple();
                }
            } else {
                this.initialiseDemande();
            }
            this.niveauTitre = 0;
            this.créeTitrePage();
            this.superGroupe = Fabrique.formulaire.superGroupe(this);
        }));
    }

}
