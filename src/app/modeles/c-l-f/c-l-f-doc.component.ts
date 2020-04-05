import { OnInit, OnDestroy } from '@angular/core';

import { ActivatedRoute, Data } from '@angular/router';
import { IKfVueTableColonneDef } from 'src/app/commun/kf-composants/kf-vue-table/i-kf-vue-table-colonne-def';
import { KfGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-groupe';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { IBoutonDef } from 'src/app/disposition/fabrique/fabrique-bouton';
import { BootstrapNom, FabriqueBootstrap } from 'src/app/disposition/fabrique/fabrique-bootstrap';
import { PageTableComponent } from 'src/app/disposition/page-table/page-table.component';
import { CLFLigne } from 'src/app/modeles/c-l-f/c-l-f-ligne';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { GroupeBoutonsMessages } from 'src/app/disposition/fabrique/fabrique-formulaire';
import { KfBouton } from 'src/app/commun/kf-composants/kf-elements/kf-bouton/kf-bouton';
import { ModeTable } from 'src/app/commun/data-par-key/condition-table';
import { ApiRequêteAction } from 'src/app/services/api-requete-action';
import { Observable } from 'rxjs';
import { ApiResult } from 'src/app/commun/api-results/api-result';
import { IGroupeTableDef, GroupeTable } from 'src/app/disposition/page-table/groupe-table';
import { IKfVueTableDef } from 'src/app/commun/kf-composants/kf-vue-table/i-kf-vue-table-def';
import { EtatTable } from 'src/app/disposition/fabrique/etat-table';
import { KfTypeContenuPhrasé } from 'src/app/commun/kf-composants/kf-partages/kf-contenu-phrase/kf-contenu-phrase';
import { KfTexte } from 'src/app/commun/kf-composants/kf-elements/kf-texte/kf-texte';
import { KfTypeDeBaliseHTML } from 'src/app/commun/kf-composants/kf-composants-types';
import { KfComposant } from 'src/app/commun/kf-composants/kf-composant/kf-composant';
import { KfLien } from 'src/app/commun/kf-composants/kf-elements/kf-lien/kf-lien';
import { KfSuperGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-super-groupe';
import { CLFDoc } from 'src/app/modeles/c-l-f/c-l-f-doc';
import { ApiDocument } from 'src/app/modeles/c-l-f/api-document';
import { CLFService } from './c-l-f.service';
import { CLFUtile } from './c-l-f-utile';
import { IKfTableLigne, IKfTableCellule, KfTable } from 'src/app/commun/kf-composants/kf-table/kf-table-composant';
import { KfGéreCss } from 'src/app/commun/kf-composants/kf-partages/kf-gere-css';
import { ModeAction } from './condition-action';
import { BarreTitre } from 'src/app/disposition/fabrique/fabrique-titre-page/fabrique-titre-page';
import { JsPdfTs } from 'src/app/commun/outils/jspdf-ts';
import { TexteOutils } from 'src/app/commun/outils/texte-outils';
import { LigneDocumentCoût } from './cout';
import { CellDefinition } from 'jspdf-autotable';
import { AfficheResultat } from 'src/app/disposition/affiche-resultat/affiche-resultat';
import { IDataKeyComponent } from 'src/app/commun/data-par-key/i-data-key-component';

export abstract class CLFDocComponent extends PageTableComponent<CLFLigne> implements OnInit, OnDestroy, IDataKeyComponent {

    /**
     * clfDoc.clfDocs et clfDoc types
     */
    clfDoc: CLFDoc;

    get titre(): string {
        return `${this.pageDef.titre}${this.clfDoc ? ' n° ' + this.clfDoc.no : ''}`;
    }

    barre: BarreTitre;

    modeTableInitial: ModeTable;

    étiquetteEnvoyé: KfEtiquette;

    afficheResultat: AfficheResultat;

    constructor(
        protected route: ActivatedRoute,
        protected service: CLFService,
    ) {
        super(route, service);
    }

    get utile(): CLFUtile { return this.service.utile; }

    get texteUtileDoc() {
        return this.utile.texte.textes(this.clfDoc.clfDocs.type);
    }

    get texteUtileBon() {
        return this.utile.texte.textes(this.clfDoc.type);
    }

    private apiRequêteActionCréeVide(): ApiRequêteAction {
        const apiRequêteAction: ApiRequêteAction = {
            demandeApi: (): Observable<ApiResult> => {
                return this.service.créeVide(this.clfDoc.clfDocs.keyClient);
            },
            actionSiOk: (créé: ApiDocument): void => {
                this.service.siCréeVideOk(créé);
                this.service.routeur.navigueUrlDef(this.utile.url.bon());
            },
            traiteErreur: this.service.traiteErreur
        };
        return apiRequêteAction;
    }

    private apiRequêteActionCréeCopie(): ApiRequêteAction {
        const apiRequêteAction: ApiRequêteAction = {
            demandeApi: (): Observable<ApiResult> => {
                return this.service.créeCopie(this.clfDoc.clfDocs.keyClient);
            },
            actionSiOk: (créé: ApiDocument): void => {
                this.service.siCréeCopieOk(créé);
                this.service.routeur.navigueUrlDef(this.utile.url.bon());
            },
            traiteErreur: (this.service.traiteErreur).bind(this.service)
        };
        return apiRequêteAction;
    }

    private apiRequêteActionSupprime(): ApiRequêteAction {
        const apiRequêteAction: ApiRequêteAction = {
            formulaire: this.superGroupe,
            demandeApi: (): Observable<ApiResult> => {
                return this.service.supprimeOuRefuse$(this.clfDoc);
            },
            actionSiOk: (): void => {
                this.service.siSupprimeOuRefuseOk(this.clfDoc);
                const url = this.clfDoc.no === 0
                    ? this.utile.url.bons(this.clfDoc.client)
                    : this.utile.lien.url.bon();
                this.service.routeur.navigueUrlDef(url);

            },
            traiteErreur: (this.service.traiteErreur).bind(this.service)
        };
        return apiRequêteAction;
    }

    private créeGroupeEnTête(): KfGroupe {
        const groupe = new KfGroupe('entete');
        const table = new KfTable('');
        table.ajouteClasseDef('kf-doc-avant-table');
        table.corps = [];
        let ligne: IKfTableLigne;
        let cellule: IKfTableCellule;

        ligne = {
            cellules: [],
            géreCss: new KfGéreCss()
        };
        ligne.géreCss.ajouteClasseDef('doc-titre-ligne');
        cellule = { texte: this.clfDoc.clfDocs.site.titre, géreCss: new KfGéreCss() };
        cellule.géreCss.ajouteClasseDef('doc-titre-site');
        ligne.cellules.push(cellule);
        table.corps.push(ligne);

        ligne = {
            cellules: [],
            géreCss: new KfGéreCss()
        };
        ligne.géreCss.ajouteClasseDef('doc-titre-ligne');
        let texte = this.texteUtileDoc.def.Doc;
        if (this.clfDoc.no) {
            texte = `${texte} n° ${this.clfDoc.no}`;
        }
        cellule = { texte, géreCss: new KfGéreCss() };
        cellule.géreCss.ajouteClasseDef('doc-titre-doc');
        ligne.cellules.push(cellule);
        cellule = {
            texte: this.clfDoc.date ? TexteOutils.Initiale(TexteOutils.date.en_lettresAvecJour(this.clfDoc.date)) : '',
            géreCss: new KfGéreCss()
        };
        cellule.géreCss.ajouteClasseDef('doc-titre-date');
        ligne.cellules.push(cellule);
        table.corps.push(ligne);

        ligne = {
            cellules: [],
            géreCss: new KfGéreCss()
        };
        ligne.géreCss.ajouteClasseDef('doc-titre-ligne');
        cellule = { texte: this.clfDoc.type === 'commande' ? 'De ' : 'A ', géreCss: new KfGéreCss() };
        cellule.géreCss.ajouteClasseDef('doc-titre-texte');
        ligne.cellules.push(cellule);
        const etiquette = new KfEtiquette('');
        let kftexte = new KfTexte('', this.clfDoc.client.nom);
        kftexte.suiviDeSaut = true;
        etiquette.contenuPhrase.ajoute(kftexte);
        kftexte = new KfTexte('', this.clfDoc.client.adresse);
        etiquette.contenuPhrase.ajoute(kftexte);
        cellule = { composant: etiquette, géreCss: new KfGéreCss() };
        cellule.géreCss.ajouteClasseDef('doc-titre-texte');
        ligne.cellules.push(cellule);
        table.corps.push(ligne);

        groupe.ajoute(table);
        return groupe;
    }

    private créeGroupePied() {
        const groupe = new KfGroupe('pied');
        const coût = LigneDocumentCoût.quantité().agrége(this.clfDoc.lignes);
        const etiquette = new KfEtiquette('',
            `${this.texteUtileDoc.Ce_doc} comporte ${TexteOutils.en_toutes_lettres(this.clfDoc.lignes.length, {
                unitéFéminin: true,
                unité: 'ligne',
                unités: 'lignes',
            })} pour un montant ${coût.complet
                ? 'total de '
                : 'supérieur à'} ${Fabrique.texte.prixEnToutesLettres(coût.valeur)}.`
        );
        groupe.ajoute(etiquette);
        return groupe;
    }

    créeGroupeTableDef(): IGroupeTableDef<CLFLigne> {
        const vueTableDef: IKfVueTableDef<CLFLigne> = {
            colonnesDef: this.créeColonneDefs(),
        };
        const outils = Fabrique.vueTable.outils<CLFLigne>(this.nom);
        outils.ajoute(this.utile.outils.catégorie());
        outils.ajoute(this.utile.outils.produit());
        if ((this.clfDoc.type === 'commande' && (this.clfDoc.no === 0 || !this.clfDoc.date)
            || (this.clfDoc.type === 'livraison' && this.clfDoc.no === 0))
        ) {
            const outilAjoute = Fabrique.vueTable.outilAjoute(this.utile.lien.ajoute());
            outilAjoute.bbtnGroup.afficherSi(this.utile.conditionTable.edition);
            outils.ajoute(outilAjoute);
        }
        outils.nePasAfficherSi(this.utile.conditionTable.aperçu);
        vueTableDef.outils = outils;
        vueTableDef.superGroupe = (ligne: CLFLigne) => {
            if (!ligne.éditeur) {
                ligne.créeEditeur(this);
                ligne.éditeur.créeSuperGroupe();
                const créeApiRequêteAction: (demandeApi: () => Observable<ApiResult>, actionSiOk: () => void) => ApiRequêteAction =
                    (demandeApi: () => Observable<ApiResult>, actionSiOk: () => void) => {
                        const apiRequêteAction: ApiRequêteAction = {
                            formulaire: this.superGroupe,
                            demandeApi,
                            actionSiOk,
                            traiteErreur: (this.service.traiteErreur).bind(this.service)
                        };
                        return apiRequêteAction;
                    };
                if (ligne.éditeur.kfAFixer) {
                    Fabrique.input.prépareSuitValeurEtFocus(
                        ligne.éditeur.kfAFixer,
                        créeApiRequêteAction(
                            (() => this.service.fixeAFixer(ligne)).bind(this.service),
                            (() => this.service.sifixeAFixerOk(ligne)).bind(this.service))
                        , this.service
                    );
                } else {
                    const apiRequêteAction = créeApiRequêteAction(
                        (() => this.service.editeLigne(ligne)).bind(this.service),
                        (() => this.service.siEditeLigneOk(ligne)).bind(this.service)
                    );
                    [ligne.éditeur.kfQuantité, ligne.éditeur.kfTypeCommande].forEach(kf => {
                        if (kf) {
                            Fabrique.input.prépareSuitValeurEtFocus(kf, apiRequêteAction, this.service);
                        }
                    });
                }
            }
            return ligne.éditeur.superGroupe;
        };
        vueTableDef.id = (ligne: CLFLigne) => {
            return this.utile.url.id('' + ligne.produit.no);
        };
        vueTableDef.optionsDeTrieur = Fabrique.vueTable.optionsDeTrieur([
            { nomTri: 'catégorie' },
            { nomTri: 'produit' }
        ]);
        const etatTable = Fabrique.vueTable.etatTable({
            nePasAfficherSiPasVide: true,
            nbMessages: 1,
            avecSolution: true,
            charge: ((etat: EtatTable) => {
                etat.grBtnsMsgs.messages[0].fixeTexte('Il n\'a pas de lignes de commande.');
                Fabrique.lien.fixeDef(etat.grBtnsMsgs.boutons[0] as KfLien, this.utile.lien.defAjoute());
                etat.grBtnsMsgs.alerte('warning');
            }).bind(this)
        });

        const groupeTableDef: IGroupeTableDef<CLFLigne> = {
            vueTableDef,
            etatTable
        };
        if (this.modeActionInitial === ModeAction.envoi || this.modeActionInitial === ModeAction.aperçu) {
            groupeTableDef.avantTable = this.créeGroupeEnTête.bind(this);
            groupeTableDef.apresTable = this.créeGroupePied.bind(this);
        }
        return groupeTableDef;
    }

    private ajouteGroupeDétails() {
        const groupe = new KfGroupe('details');
        groupe.ajouteClasseDef('kf-doc');
        const groupeTableDef = this.créeGroupeTableDef();
        this.groupeTable = new GroupeTable<CLFLigne>(groupeTableDef);
        this.groupeTable.vueTable.ajouteClasseDef('kf-doc-table');
        this.groupeTable.ajouteA(groupe);
        this.groupeTable.etat.groupe.nePasAfficherSi(this.utile.conditionTable.aperçu);
        this.superGroupe.ajoute(groupe);
    }

    private télécharge(filename: string) {
        const pdf = new JsPdfTs();
        const marge = 20;
        let y = marge;
        const taille = pdf.fontSize;
        pdf.fontSize = 18;
        pdf.text(this.clfDoc.clfDocs.site.titre, marge, y, 'center');
        y += 18; // * doc.getLineHeightFactor();
        pdf.fontSize = 14;
        let texte = this.texteUtileDoc.def.Doc;
        if (this.clfDoc.no) {
            texte = `${texte} n° ${this.clfDoc.no}`;
        }
        pdf.text(texte, marge, y);
        pdf.text(TexteOutils.Initiale(TexteOutils.date.en_lettresAvecJour(this.clfDoc.date)), marge, y, 'right');
        y += 14;
        const de: CellDefinition = {
            rowSpan: 5,
            content: this.clfDoc.type === 'commande' ? 'De ' : 'A ',
        };
        pdf.autoTable({
            body: [
                [
                    de,
                    this.clfDoc.client.nom,
                ],
                [
                    this.clfDoc.client.adresse,
                ]
            ],
            startY: y,
            theme: 'plain',
            styles: {
                fontSize: 14
            }
        });
        y = pdf.previousAutoTableFinalY() + 20;
        pdf.text('1 304,50', marge, y);
        pdf.text('1 305,50', marge + 150, y);
        y += 14;
        pdf.autoTable({
            body: [['1 304,50', '1 305,50']],
            startY: y,
            theme: 'plain',
            styles: {
                fontSize: 14
            }
        });
        y += 30;
        pdf.autoTable({
            body: [
                [
                    '1 304.50',
                    '1 304,500',
                    '1 304,240',
                ],
                [
                    '1 304.50',
                    '1 304,500',
                    '1 304,240',
                ],
                [
                    '1 304.50',
                    '1 304,500',
                    '1 304,240'
                ]
            ],
            startY: y,
            theme: 'plain',
            styles: {
                fontSize: 14
            }
        });
        y = pdf.previousAutoTableFinalY() + 20;
        const contentConfig = pdf.contentConfig(this.vueTable);
        pdf.autoTable({
            body: contentConfig.body,
            head: contentConfig.head,
            foot: contentConfig.foot,
            startY: y,
            margin: {
                left: marge,
                right: marge,
            }
        });
        if (this.clfDoc.type === 'facture') {
            y += pdf.previousAutoTableFinalY() + 30;
            const coût = LigneDocumentCoût.quantité().agrége(this.clfDoc.lignes);
            const arrêté = `Arrêtée la présente facture à la somme de ${Fabrique.texte.prixEnToutesLettres(coût.valeur)}.`;
            pdf.text(arrêté, marge, y);
        }
        window.open(pdf.output('dataurlnewwindow'));
        pdf.save(filename);
    }

    private télécharge1(filename: string) {
        const pdf = new JsPdfTs();
        const marge = 20;
        let y = marge;
        pdf.autoTable({
            body: [['1 304,50', '1 305,50']],
            startY: y,
        });
        y = pdf.previousAutoTableFinalY() + 20;
        pdf.autoTable({
            body: [
                [
                    '1 304.50',
                    '1 304,50',
                    '1 304,24',
                ],
                [
                    '1 304.50',
                    '1 304,50',
                    '1 304,24',
                ],
                [
                    '1 304.50',
                    '1 304,50',
                    '1 304,24',
                ],
                [
                    '1 304.50',
                    '1 304,50',
                    '1 304,24',
                ],
                [
                    '1 304.50',
                    '1 304,500',
                    '1 304,240'
                ],
                [
                    '1 304.50',
                    '1 304,50',
                    '1 304,24',
                ],
            ],
            startY: y,
        });
        window.open(pdf.output('dataurlnewwindow'));
        pdf.save(filename);
    }

    private ajouteGroupeTélécharger() {
        const nom = 'download';
        const groupe = new KfGroupe(nom);
        FabriqueBootstrap.ajouteClasse(groupe, 'alert', BootstrapNom.primary);
        const kfNom = Fabrique.input.texte('filename', 'Nom du fichier');
        kfNom.valeur = `${this.clfDoc.client.nom} - ${this.texteUtileDoc.def.doc} ${this.clfDoc.no}`;
        groupe.ajoute(kfNom);
        const def: IBoutonDef = {
            nom: 'btDownload',
            contenu: { texte: 'Télécharger le pdf' },
            action: (() => this.télécharge(kfNom.valeur)).bind(this),
            bootstrapType: BootstrapNom.primary
        };
        groupe.ajoute(Fabrique.bouton.bouton(def));
        this.superGroupe.ajoute(groupe);
    }

    private ajouteGroupeEtatDernierBon() {
        const groupe = new KfGroupe('');
        groupe.ajouteClasseDef('alert alert-success');
        let etiquette = new KfEtiquette('');
        etiquette = new KfEtiquette('');
        groupe.ajoute(etiquette);
        if (this.clfDoc.no === 0) {
            // bon virtuel: le modèle est la dernière synthèse
            etiquette.fixeTexte(
                `${this.texteUtileDoc.Le_dernier_doc} à ${this.clfDoc.client} (${this.clfDoc.no_du_date}) comprenait les lignes ci-dessous.`
            );
        } else {
            if (this.clfDoc.terminé) {
                const contenus: KfTypeContenuPhrasé[] = [];
                let texte: KfTexte;
                texte = new KfTexte('', `La commande ${this.clfDoc.no_du_date} a été `);
                contenus.push(texte);
                if (this.clfDoc.annulé) {
                    texte = new KfTexte('', 'refusée');
                    texte.ajouteClasseDef('text-danger');
                } else {
                    texte = new KfTexte('', 'traitée');
                }
                contenus.push(texte);
                texte = new KfTexte('', `dans le bon de livraison n° ${this.clfDoc.apiDoc.noGroupe}. `);
                contenus.push(texte);
                etiquette.contenuPhrase.contenus = contenus;
            } else {
                etiquette.fixeTexte(`Le bon de commande ${this.clfDoc.no_du_date} est en cours de préparation.`);
            }
            etiquette = new KfEtiquette('');
            etiquette.fixeTexte(
                `Ce bon de commande comprenait les lignes ci-dessous.`
            );
            groupe.ajoute(etiquette);
        }
        this.superGroupe.ajoute(groupe);
    }

    // pas pour bon virtuel
    private ajouteGroupeCatalogueChangé() {
        const groupe = new KfGroupe('catalogueChangé');
        groupe.ajouteClasseDef('alert alert-warning');
        const etiquette = new KfEtiquette('');
        Fabrique.ajouteTexte(etiquette,
            {
                texte: `Le catalogue a changé depuis l'enregistrement de ${this.texteUtileBon.ce_doc} `
                    + `et les détails ci-dessus peuvent différer de l'original `
                    + `si des produits sont devenus indisponibles ou si des prix ont changé.`,
                suiviDeSaut: true
            },
            `Si vous créez un nouveau ${this.texteUtileBon.def.doc} par une copie, vérifiez le résultat avant de l'envoyer.`
        );
        etiquette.baliseHtml = KfTypeDeBaliseHTML.p;
        groupe.ajoute(etiquette);
        this.superGroupe.ajoute(groupe);
    }

    private ajouteGroupeCréer() {
        const messages: KfComposant[] = [];
        const boutons: (KfBouton | KfLien)[] = [];
        let texteOuvert: string;
        let texteACréer: string;
        let texteACopier: string;
        if (this.clfDoc.no === 0) {
            texteOuvert = `${this.texteUtileBon.def.doc} virtuel`;
            texteACréer = texteOuvert;
            texteACopier = `de ${this.texteUtileDoc.ce_dernier_doc}`;
            boutons.push(Fabrique.lien.boutonAnnuler(this.utile.url.bons(this.clfDoc.client)));
        } else {
            texteOuvert = 'bon de commande ouvert';
            texteACréer = 'nouveau bon de commande';
            texteACopier = `du bon de commande n°${this.clfDoc.no}`;
        }
        Fabrique.ajouteEtiquetteP(messages).fixeTexte(`Il n'a pas de ${texteOuvert}.`);
        boutons.push(Fabrique.bouton.boutonAction('vide', 'Créer', this.apiRequêteActionCréeVide(), this.service));
        if (this.bonCopiable) {
            Fabrique.ajouteEtiquetteP(messages).fixeTexte(
                `Vous pouvez choisir que les lignes ${texteACopier} soient automatiquement copiées dans le ${texteACréer}`
                + ` en cliquant sur Créer et copier.`);
            const btCopier = Fabrique.bouton.boutonAction('copier', 'Créer et copier',
                this.apiRequêteActionCréeCopie(), this.service);
            boutons.push(btCopier);
        }
        const groupe = new GroupeBoutonsMessages('creer', messages);
        groupe.créeBoutons(boutons);
        groupe.alerte('primary');
        this.superGroupe.ajoute(groupe.groupe);
    }

    private ajouteGroupeSupprime() {
        const messages: KfComposant[] = [];
        let texteEtiquette: string;
        let texteBouton: string;
        if (this.clfDoc.no === 0) {
            texteEtiquette = `Le bon de commande virtuel de ${this.clfDoc.client.nom} va être supprimée.`;
            texteBouton = 'Supprimer la commande';
        } else {
            texteEtiquette = `Toutes les lignes de la commande vont être effacées.`;
            texteBouton = 'Effacer la commande';
        }
        Fabrique.ajouteEtiquetteP(messages, 'text-center').fixeTexte(texteEtiquette);
        Fabrique.ajouteEtiquetteP(messages, 'text-center').fixeTexte('Cette action ne pourra pas être annulée.');
        const def: IBoutonDef = {
            nom: '',
            contenu: { texte: 'Annuler' },
            bootstrapType: BootstrapNom.dark,
            action: () => {
                this.service.routeur.navigueUrlDef(this.utile.url.bon());
            }
        };
        const groupe = new GroupeBoutonsMessages('supprime', messages);
        groupe.créeBoutons([
            Fabrique.bouton.bouton(def),
            Fabrique.bouton.boutonAction('supprime', texteBouton, this.apiRequêteActionSupprime(), this.service),
        ]);
        groupe.alerte('warning');
        this.superGroupe.ajoute(groupe.groupe);
    }

    private ajouteGroupeEnvoi() {
        const messages: KfComposant[] = [];
        let etiquette: KfEtiquette;

        etiquette = Fabrique.ajouteEtiquetteP(messages);
        Fabrique.ajouteTexte(etiquette, 'Les lignes ne pourront plus être modifiées.');
        etiquette = Fabrique.ajouteEtiquetteP(messages);
        Fabrique.ajouteTexte(etiquette, 'Cette action ne pourra pas être annulée.');

        const groupe = new GroupeBoutonsMessages('envoi', messages);
        groupe.créeBoutons([
            this.utile.bouton.annulerEnvoiBon(),
            this.utile.bouton.envoieBon(this.clfDoc, this.superGroupe, this.afficheResultat)
        ]);
        groupe.alerte('warning');
        groupe.groupe.afficherSi(this.utile.conditionAction.envoi);
        this.superGroupe.ajoute(groupe.groupe);
    }

    private ajouteGroupeEnvoyé() {
        const messages: KfComposant[] = [];
        let texteDocuments = '';
        if (this.clfDoc.clfDocs.type !== 'commande') {
            texteDocuments = ' et dans ceux du client';
        }
        let etiquette = Fabrique.ajouteEtiquetteP(messages);
        this.étiquetteEnvoyé = etiquette;

        etiquette = Fabrique.ajouteEtiquetteP(messages);
        etiquette.fixeTexte(
            `${this.texteUtileDoc.def.Il} figure maintenant dans vos documents${texteDocuments}. `
            + `Pour le consulter, le télécharger, l'imprimer, suivez le lien ci-dessous.`);

        etiquette = Fabrique.ajouteEtiquetteP(messages);
        etiquette.contenuPhrase.ajoute(this.utile.lien.document(this.clfDoc));

        if (this.clfDoc.type === 'commande') {
            etiquette = Fabrique.ajouteEtiquetteP(messages);
            etiquette.fixeTexte('Si vous avez terminé, pensez à vous ');
            etiquette.contenuPhrase.ajoute(this.utile.lien.déconnection());
        }

        const groupe = new GroupeBoutonsMessages('envoi', messages);
        groupe.alerte('success');
        groupe.groupe.afficherSi(this.utile.conditionAction.envoyé);
        this.superGroupe.ajoute(groupe.groupe);
    }

    rafraichitEtiquetteEnvoyé() {
        let texteNo = '';
        if (this.clfDoc.clfDocs.type !== 'commande') {
            texteNo = ` avec le n° ${this.clfDoc.no}`;
        }
        const texteDate = `${TexteOutils.date.en_chiffresHMin(this.clfDoc.date)}`;
        this.étiquetteEnvoyé.fixeTexte(`${this.texteUtileDoc.Le_doc} a été enregistré${texteNo} et daté (${texteDate}).`);
    }

    get bonCopiable(): boolean {
        return this.clfDoc.lignes && !this.clfDoc.annulé && this.clfDoc.lignes.length > 0;
    }

    protected rafraichit() {
        this.clfDoc.clfDocs.site = this.service.navigation.litSiteEnCours();
        const mode = this.service.modeAction;
        if (mode === ModeAction.envoyé) {
            this.rafraichitEtiquetteEnvoyé();
        }
        if (this.barre) {
            this.barre.rafraichit();
        } else {
            console.log(this.pageDef);
        }
    }

    créeSuperGroupe() {
        this.superGroupe = new KfSuperGroupe(this.nom);
        this.superGroupe.créeGereValeur();
        this.superGroupe.sauveQuandChange = true;
        this.afficheResultat = Fabrique.formulaire.ajouteResultat(this.superGroupe);
        const mode = this.service.modeAction;

        if (mode === ModeAction.edite) {
            this.ajouteGroupeDétails();
        }

        if (mode === ModeAction.aperçu) {
            this.ajouteGroupeDétails();
            this.ajouteGroupeTélécharger();
        }

        if (mode === ModeAction.doitCréer) {
            if (this.bonCopiable) {
                this.ajouteGroupeEtatDernierBon();
                this.ajouteGroupeDétails();
                if (this.clfDoc.no !== 0) {
                    const dateCatalogue = new Date(this.clfDoc.clfDocs.catalogue.date);
                    const date = new Date(this.clfDoc.date);
                    if (dateCatalogue > date) {
                        this.ajouteGroupeCatalogueChangé();
                    }
                }
            }
            this.ajouteGroupeCréer();
        }

        if (mode === ModeAction.supprime) {
            this.ajouteGroupeDétails();
            this.ajouteGroupeSupprime();
        }
        if (mode === ModeAction.envoi) {
            this.ajouteGroupeDétails();
            this.ajouteGroupeEnvoi();
            this.ajouteGroupeEnvoyé();
        }

        this.superGroupe.ajoute(this.afficheResultat.groupe);

        this.superGroupe.quandTousAjoutés();
    }

    chargeStock(clfDoc: CLFDoc) {
        this.clfDoc = clfDoc;
    }

    charge(clfDoc: CLFDoc) {
        this.chargeStock(clfDoc);
        this.chargeGroupe();
    }

    avantChargeData() {
    }

    chargeData(data: Data) {
        this.chargeStock(data.clfDoc);
    }

    protected abstract get modeActionInitial(): ModeAction;

    initialiseUtile() {
        this.service.initialiseModeAction(this.modeActionInitial);
        if (this.modeTableInitial) {
            this.service.changeModeTable(this.modeTableInitial);
        }
        this.service.utile.url.fixeRouteDoc(this.clfDoc);
    }

    protected chargeGroupe() {
        this.groupeTable.etat.charge();
        if (this.clfDoc.lignes) {
            this.utile.outils.chargeCatégories(this.vueTable, this.clfDoc.clfDocs.catalogue.catégories);
            this._chargeVueTable(this.clfDoc.lignes);
        }
        this.rafraichit();
    }

    quandLigneSupprimée(ligne: CLFLigne) {
        const clfDocs = this.service.litStock();
        this.clfDoc = clfDocs.créeBon(this.clfDoc.no);
        this.chargeGroupe();
    }

    protected abstract créeColonneDefs(): IKfVueTableColonneDef<CLFLigne>[];

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
            initialiseUtile: () => this.initialiseUtile(),
            créeSuperGroupe: () => this.créeSuperGroupe(),
            chargeGroupe: () => this.chargeGroupe(),
            aprèsChargeData: () => this.aprèsChargeData()
        };
    }
}
