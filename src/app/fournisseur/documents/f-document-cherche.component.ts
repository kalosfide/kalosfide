import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiResult } from '../../api/api-results/api-result';

import { FormulaireComponent } from '../../disposition/formulaire/formulaire.component';
import { KfGroupe } from '../../commun/kf-composants/kf-groupe/kf-groupe';
import { PageDef } from 'src/app/commun/page-def';
import { KfValidateurs } from 'src/app/commun/kf-composants/kf-partages/kf-validateur';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { ActivatedRoute } from '@angular/router';
import { FDocumentPages } from './f-document-pages';
import { FournisseurCLFService } from '../fournisseur-c-l-f-.service';
import { CLFChercheDoc } from 'src/app/modeles/c-l-f/c-l-f-cherche-doc';
import { KfComposant } from 'src/app/commun/kf-composants/kf-composant/kf-composant';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { apiType, typeCLF, TypeCLF } from 'src/app/modeles/c-l-f/c-l-f-type';
import { KfBootstrap } from 'src/app/commun/kf-composants/kf-partages/kf-bootstrap';
import { TexteOutils } from 'src/app/commun/outils/texte-outils';
import { CLFDocs } from 'src/app/modeles/c-l-f/c-l-f-docs';
import { CLFDoc } from 'src/app/modeles/c-l-f/c-l-f-doc';
import { ApiDoc } from 'src/app/modeles/c-l-f/api-doc';
import { map } from 'rxjs/operators';
import { ApiResult201Created } from 'src/app/api/api-results/api-result-201-created';
import { ApiResult200Ok } from 'src/app/api/api-results/api-result-200-ok';


@Component({
    templateUrl: '../../disposition/page-base/page-base.html',
})
export class FDocumentChercheComponent extends FormulaireComponent implements OnInit {

    pageDef: PageDef = FDocumentPages.cherche;

    groupeRésultat: KfGroupe;
    étiquetteRésultat: KfEtiquette;
    lienRésultat: KfEtiquette;

    constructor(
        protected route: ActivatedRoute,
        protected service: FournisseurCLFService,
    ) {
        super(service);
    }

    get type(): TypeCLF {
        return this.valeur.type;
    }

    get no(): number {
        return this.valeur.no;
    }

    créeBoutonsDeFormulaire = (formulaire: KfGroupe) => {
        this.boutonSoumettre = Fabrique.bouton.soumettre(formulaire, 'Rechercher');
        return [this.boutonSoumettre];
    }

    apiDemande = (): Observable<ApiResult> => {
        return this.service.chercheDoc(this.valeur).pipe(
            map((result: ApiResult200Ok<CLFChercheDoc>) => {
                const result1 = new ApiResult201Created(result.lecture);
                return result1;
            })
        );
    }

    actionSiOk = (chercheDoc: CLFChercheDoc): void => {
        this.groupeRésultat.visible = true;
        const subscription = this.formulaire.formGroup.valueChanges.subscribe(() => {
            this.groupeRésultat.visible = false;
            subscription.unsubscribe();
        });
        const type = typeCLF(this.type);
        const textes = this.service.utile.texte.textes(type);
        if (chercheDoc.uid) {
            // le document existe
            KfBootstrap.ajouteClasseAlerte(this.groupeRésultat, 'success')
            this.étiquetteRésultat.fixeTextes(
                `${textes.Le_doc} n° ${this.no} ${textes.def.adressé} au client `,
                { texte: chercheDoc.nom, classe: KfBootstrap.classeTexte({ poids: 'bold' }) },
                { texte: ` a été ${textes.def.enregistré} le ${TexteOutils.date.en_chiffres(chercheDoc.date)}.`, suiviDeSaut: true },
                `Pour l'ouvrir, cliquez sur le lien ci-dessous.`
            );
            this.lienRésultat.visible = true;
            const clfDocs = new CLFDocs();
            const apiDoc = new ApiDoc();
            apiDoc.id = chercheDoc.uid;
            apiDoc.rno = chercheDoc.rno;
            apiDoc.no = this.no;
            const clfDoc = CLFDoc.nouveau(clfDocs, type, apiDoc);
            this.lienRésultat.fixeContenus(this.service.utile.lien.document(clfDoc));
        } else {
            KfBootstrap.ajouteClasseAlerte(this.groupeRésultat, 'danger');
            this.étiquetteRésultat.fixeTextes(
                `${textes.Le_doc} n° ${this.no} n'existe pas.`
            );
            this.lienRésultat.visible = false;
        }
    }

    créeEdition = (): KfGroupe => {
        const groupe = Fabrique.formulaire.formulaire();
        const étiquette = Fabrique.ajouteEtiquetteP();
        étiquette.fixeTextes(
            `Vous pouvez rechercher le client destinataire d'un bon de livraison ou d'une facture `
            + `et la date de l'enregistrement à partir de son numéro.`
        );
        groupe.ajoute(étiquette);
        const type = Fabrique.listeDéroulante.texte('type', 'Type');
        type.créeEtAjouteOption('Bon de livraison', apiType('livraison'));
        type.créeEtAjouteOption('Facture', apiType('facture'));
        groupe.ajoute(type);
        const no = Fabrique.input.nombre('no', 'Numéro', 'placeholder');
        no.ajouteValidateur(
            KfValidateurs.required,
            KfValidateurs.nombreVirgule(8, 0, '>=')
        );
        groupe.ajoute(no);

        return groupe;
    }

    aprèsBoutons = (): KfComposant[] => {
        this.groupeRésultat = new KfGroupe('resultat');
        this.étiquetteRésultat = Fabrique.ajouteEtiquetteP();
        this.groupeRésultat.ajoute(this.étiquetteRésultat);
        this.lienRésultat = Fabrique.ajouteEtiquetteP();
        this.groupeRésultat.ajoute(this.lienRésultat);
        return [this.groupeRésultat];
    }

    ngOnInit() {
        this.subscriptions.push(this.route.data.subscribe(
            data => {
                this.niveauTitre = 0;
                this.créeTitrePage();
                this.superGroupe = Fabrique.formulaire.superGroupe(this);
            }
        ));
    }

}
