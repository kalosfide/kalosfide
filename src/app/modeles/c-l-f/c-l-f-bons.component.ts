import { OnInit, OnDestroy } from '@angular/core';

import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { Site } from 'src/app/modeles/site/site';
import { Identifiant } from 'src/app/securite/identifiant';
import { IKfVueTableDef } from 'src/app/commun/kf-composants/kf-vue-table/i-kf-vue-table-def';
import { ActivatedRoute, Data } from '@angular/router';
import { CLFService } from './c-l-f.service';
import { KfGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-groupe';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { KfSuperGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-super-groupe';
import { RouteurService } from 'src/app/services/routeur.service';
import { PageTableComponent } from 'src/app/disposition/page-table/page-table.component';
import { IGroupeTableDef, GroupeTable } from 'src/app/disposition/page-table/groupe-table';
import { EtatTable } from 'src/app/disposition/fabrique/etat-table';
import { BarreTitre } from 'src/app/disposition/fabrique/fabrique-titre-page/fabrique-titre-page';
import { KfComposant } from 'src/app/commun/kf-composants/kf-composant/kf-composant';
import { KfTypeDeBaliseHTML } from 'src/app/commun/kf-composants/kf-composants-types';
import { CLFDoc } from './c-l-f-doc';
import { CLFUtile } from './c-l-f-utile';
import { CLFDocs } from './c-l-f-docs';
import { GroupeBoutonsMessages } from 'src/app/disposition/fabrique/fabrique-formulaire';
import { KfBouton } from 'src/app/commun/kf-composants/kf-elements/kf-bouton/kf-bouton';
import { FabriqueBootstrap } from 'src/app/disposition/fabrique/fabrique-bootstrap';
import { KfLien } from 'src/app/commun/kf-composants/kf-elements/kf-lien/kf-lien';
import { IBoutonDef } from 'src/app/disposition/fabrique/fabrique-bouton';
import { ModeAction } from './condition-action';
import { ILienDef } from 'src/app/disposition/fabrique/fabrique-lien';
import { TexteOutils } from 'src/app/commun/outils/texte-outils';
import { FournisseurRoutes, FournisseurPages } from 'src/app/fournisseur/fournisseur-pages';
import { KfCaseACocher } from 'src/app/commun/kf-composants/kf-elements/kf-case-a-cocher/kf-case-a-cocher';

/**
 * Route: ./client/:key/bons
 * Page de choix du bon à éditer et de sélection des bons à synthétiser du client.
 * Table des bons du client avec leur état de préparation, lien vers ./client/:key/doc/:no et case de sélection.
 * Bouton: Vérifier.
 */
export abstract class CLFBonsComponent extends PageTableComponent<CLFDoc> implements OnInit, OnDestroy {

    site: Site;
    identifiant: Identifiant;
    barre: BarreTitre;

    date: Date;

    clfDocs: CLFDocs;
    document: CLFDoc;

    étiquetteSélectionnez: KfEtiquette;
    étiquetteSélectionnés: KfEtiquette;
    étiquetteAnnulés: KfEtiquette;
    boutonCréer: KfBouton;
    groupeCréer: KfGroupe;

    constructor(
        protected route: ActivatedRoute,
        protected service: CLFService,
    ) {
        super(route, service);
    }

    get routeur(): RouteurService { return this.service.routeur; }
    get utile(): CLFUtile { return this.service.utile; }

    get texteUtile() {
        return this.utile.texte.textes(this.clfDocs.type);
    }

    créeBarreTitre = (): BarreTitre => {
        const barre = Fabrique.titrePage.barreTitre({
            pageDef: this.pageDef,
            contenuAidePage: this.contenuAidePage(),
        });

        this.barre = barre;

        return barre;
    }

    protected contenuAidePage(): KfComposant[] {
        const infos: KfComposant[] = [];

        let etiquette: KfEtiquette;

        etiquette = Fabrique.ajouteEtiquetteP(infos);
        Fabrique.ajouteTexte(etiquette,
            `Ceci est `,
            { texte: 'à faire', balise: KfTypeDeBaliseHTML.b },
            '.'
        );

        etiquette = Fabrique.ajouteEtiquetteP(infos);
        Fabrique.ajouteTexte(etiquette,
            `Ceci est `,
            { texte: 'à faire', balise: KfTypeDeBaliseHTML.b },
            '.'
        );

        return infos;
    }

    private infosBonVirtuel(): KfBouton {
        const infos: KfComposant[] = [];

        let etiquette: KfEtiquette;

        etiquette = Fabrique.ajouteEtiquetteP(infos);
        Fabrique.ajouteTexte(etiquette,
            `Indépendamment des ${this.texteUtile.def.bons} du client, vous pouvez ajouter des lignes à`
            + ` ${this.texteUtile.un_doc} en utilisant un ${this.texteUtile.def.bon} virtuel.`,
        );

        etiquette = Fabrique.ajouteEtiquetteP(infos);
        Fabrique.ajouteTexte(etiquette, this.texteUtile.descriptionBonVirtuel);

        const bouton = Fabrique.bouton.aide({
            nom: 'infos_bon_virtuel',
            infos
        });
        FabriqueBootstrap.ajouteClasse(bouton, 'btn', 'light');
        return bouton;
    }

    créeGroupeTableDef(): IGroupeTableDef<CLFDoc> {
        const vueTableDef: IKfVueTableDef<CLFDoc> = {
            colonnesDef: this.utile.colonne.docCLF.defsSélectionDocuments(this.document),
            superGroupe: (doc: CLFDoc) => {
                if (!doc.éditeur) {
                    doc.créeEditeur(this);
                    doc.éditeur.créeSuperGroupe();
                }
                return doc.éditeur.superGroupe;
            },
        };
        if (!this.clfDocs.apiBonVirtuel) {
            const outils = Fabrique.vueTable.outils<CLFDoc>(this.nom);
            const outilAjoute = Fabrique.vueTable.outilAjoute(this.utile.lien.bonVirtuel(this.clfDocs.client), this.infosBonVirtuel());
            outilAjoute.bbtnGroup.afficherSi(this.utile.conditionTable.edition);
            outils.ajoute(outilAjoute);
            vueTableDef.outils = outils;
        }
        const txts: () => string[] = () => [
            `Il n\'a pas de ${this.texteUtile.def.bon} envoyé par ${this.clfDocs.client.nom}`
            + ` pour servir de base à ${this.texteUtile.un_doc}.`,
            `Vous pouvez cependant créer ${this.texteUtile.un_doc} en utilisant`
            + ` un ${this.texteUtile.def.bon} virtuel où vous pourrez ajouter les produits à ${this.texteUtile.def.faire}.`,
            this.texteUtile.descriptionBonVirtuel
        ];
        const etatTable = Fabrique.vueTable.etatTable({
            nePasAfficherSiPasVide: true,
            nbMessages: 3,
            avecSolution: true,
            charge: ((etat: EtatTable) => {
                const texts = txts();
                for (let i = 0; i < 3; i++) {
                    (etat.grBtnsMsgs.messages[i] as KfEtiquette).fixeTexte(texts[i]);
                }
                Fabrique.lien.fixeDef(etat.grBtnsMsgs.boutons[0] as KfLien, this.utile.lien.bonVirtuelDef(this.clfDocs));
                etat.grBtnsMsgs.alerte('info');
            }).bind(this)
        });
        Fabrique.ajouteTexte(etatTable.grBtnsMsgs.messages[2] as KfEtiquette, { texte: '', balise: KfTypeDeBaliseHTML.small });
        const def: IGroupeTableDef<CLFDoc> = {
            vueTableDef,
            etatTable
        };
        return def;
    }

    private ajouteGroupeDétails() {
        const groupe = new KfGroupe('documents');
        const groupeTableDef = this.créeGroupeTableDef();
        this.groupeTable = new GroupeTable<CLFDoc>(groupeTableDef);
        this.groupeTable.ajouteA(groupe);
        this.superGroupe.ajoute(groupe);
    }

    private ajouteGroupeCréer() {
        const messages: KfComposant[] = [];
        let etiquette: KfEtiquette;
        etiquette = Fabrique.ajouteEtiquetteP(messages);
        this.étiquetteSélectionnés = etiquette;
        etiquette = Fabrique.ajouteEtiquetteP(messages);
        this.étiquetteAnnulés = etiquette;

        const boutons: (KfBouton | KfLien)[] = [];
        const def: IBoutonDef = {
            nom: 'creer',
            action: () => this.service.routeur.navigueUrlDef(this.utile.url.envoi(this.clfDocs)),
            contenu: { texte: 'Créer ' + this.texteUtile.le_doc },
            bootstrapType: 'primary'
        };
        this.boutonCréer = Fabrique.bouton.bouton(def);
        boutons.push(this.boutonCréer);
        const groupe = new GroupeBoutonsMessages('creer', messages);
        groupe.créeBoutons(boutons);
        groupe.alerte('primary');
        this.groupeCréer = groupe.groupe;
        this.superGroupe.ajoute(groupe.groupe);
    }

    private rafraichitCréer() {
        if (this.document.àSynthétiser.length === 0) {
            this.groupeCréer.nePasAfficher = true;
            return;
        }
        const noSélectionnés: number[] = [];
        const noSélectionnésAnnulés: number[] = [];
        this.document.àSynthétiser.forEach(d => {
            if (d.choisi) {
                if (d.annulé) {
                    noSélectionnésAnnulés.push(d.no);
                } else {
                    noSélectionnés.push(d.no);
                }
            }
        });
        if (noSélectionnés.length === 0) {
            this.étiquetteSélectionnés.fixeTexte(
                `Aucun ${this.texteUtile.def.bon} n'est sélectionné pour ${this.texteUtile.le_doc}.`
            );
            this.boutonCréer.inactivité = true;
        } else {
            this.étiquetteSélectionnés.fixeTexte(`${this.texteUtile.Le_doc} sera créé à partir `
                + (noSélectionnés.length === 1
                    ? `du ${this.texteUtile.def.bon}`
                    : `des ${this.texteUtile.def.bons}`)
                + ` n° ${noSélectionnés.map(no => '' + no).join(', ')}`
            );
            this.boutonCréer.inactivité = false;
        }
        if (noSélectionnésAnnulés.length === 0) {
            this.étiquetteAnnulés.fixeTexte(
                ''
            );
        } else {
            let leBon: string;
            let sera: string;
            let annulé: string;
            if (noSélectionnésAnnulés.length > 1) {
                leBon = `Le ${this.texteUtile.def.bon}`;
                sera = `sera`;
                annulé = `annulé`;
            } else {
                leBon = `Les ${this.texteUtile.def.bons}`;
                sera = `seront`;
                annulé = `annulés`;
            }
            this.étiquetteAnnulés.fixeTexte(
                `${leBon}  n° ${noSélectionnésAnnulés.map(no => '' + no).join(', ')} ${sera} définitivement ${annulé}`
                + ` quand ${this.texteUtile.le_doc} sera enregistré.`
            );
        }
    }

    rafraichit() {
        this.barre.rafraichit();
        this.rafraichitCréer();
        this.étiquetteSélectionnez.nePasAfficher = this.document.àSynthétiser.length === 0;
    }

    avantChargeData() {
        this.site = this.service.navigation.litSiteEnCours();
        this.identifiant = this.service.identification.litIdentifiant();
    }

    chargeData(data: Data) {
        this.clfDocs = data.clfDocs;
        this.document = this.clfDocs.créeDocument();
        this.date = new Date(Date.now());
    }

    initialiseUtile() {
        this.service.changeMode(ModeAction.edite);
    }

    créeSuperGroupe() {
        this.superGroupe = new KfSuperGroupe(this.nom);
        this.superGroupe.créeGereValeur();
        this.superGroupe.sauveQuandChange = true;

        if (this.clfDocs.catalogue.produits.length === 0) {
            const message = `Il n'y a pas de produits dans le catalogue.`;
            const lienDef: ILienDef = {
                urlDef: {
                    routes: FournisseurRoutes,
                    pageDef: FournisseurPages.catalogue,
                    nomSite: this.site.nomSite
                }
            };
            this.superGroupe.ajoute(this.utile.groupeCréationImpossible(this.clfDocs.type, message, lienDef));
        } else {
            // il faut ajouter la case à cocher de l'en-tête de la colonne Inclure
            // pour que son formControl soit créé.
            const groupe = new KfGroupe('');
            groupe.ajoute(this.document.créeCaseACocherTout());
            groupe.nePasAfficher = true;
            this.superGroupe.ajoute(groupe);

            this.étiquetteSélectionnez = new KfEtiquette('');
            this.étiquetteSélectionnez.baliseHtml = KfTypeDeBaliseHTML.p;
            Fabrique.ajouteTexte(this.étiquetteSélectionnez,
                `Sélectionnez les ${this.texteUtile.def.bons} à inclure dans ${this.texteUtile.le_doc}. `,
                { texte: `(Un bon doit être prêt pour pouvoir être sélectionné.)`, balise: KfTypeDeBaliseHTML.small}
            );
            this.superGroupe.ajoute(this.étiquetteSélectionnez);
            this.ajouteGroupeDétails();
        }
        this.ajouteGroupeCréer();

        this.superGroupe.quandTousAjoutés();
    }

    chargeGroupe() {
        if (this.clfDocs.catalogue.produits.length > 0) {
            this._chargeVueTable(this.document.àSynthétiser);
            let lienDef: ILienDef;
            if (this.document.type === 'livraison') {
                lienDef = this.utile.lien.bonVirtuelDef(this.clfDocs);
            }
            this.groupeTable.etat.charge();
        }
        this.rafraichit();
    }

    protected aprèsChargeData() {
        this.subscriptions.push(
            this.service.modeActionIO.observable.subscribe(() => this.rafraichit()),
            this.service.clsBilanIO.observable.subscribe(() => this.rafraichit())
        );
    }

    créePageTableDef() {
        this.pageTableDef = {
            avantChargeData: () => this.avantChargeData(),
            chargeData: (data: Data) => this.chargeData(data),
            créeSuperGroupe: () => this.créeSuperGroupe(),
            initialiseUtile: () => this.initialiseUtile(),
            chargeGroupe: () => this.chargeGroupe(),
            aprèsChargeData: () => this.aprèsChargeData()
        };
    }
}
