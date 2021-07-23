import { ComptePages, CompteRoutes } from '../compte-pages';
import { Component, OnInit } from '@angular/core';
import { PageBaseComponent } from 'src/app/disposition/page-base/page-base.component';
import { ActivatedRoute } from '@angular/router';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { KfTypeDeBaliseHTML } from 'src/app/commun/kf-composants/kf-composants-types';
import { KfSuperGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-super-groupe';
import { ConfirmeEmailModel } from './confirme-email.model';
import { CompteService } from '../compte.service';
import { ApiRequêteAction } from 'src/app/api/api-requete-action';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { ILienDef } from 'src/app/disposition/fabrique/fabrique-lien';
import { KfTexte } from 'src/app/commun/kf-composants/kf-elements/kf-texte/kf-texte';
import { KfstringDef } from 'src/app/commun/kf-composants/kf-elements/kf-texte/kf-textes';
import { ApiResult } from 'src/app/api/api-results/api-result';

@Component({ template: '' })
export abstract class ConfirmeEmailBaseComponent extends PageBaseComponent implements OnInit {


    get titre(): string {
        return this.pageDef.titre;
    }

    avant: KfEtiquette;

    abstract titreSucces: string;
    abstract titreErreur: string;
    abstract defAvant(confirmeEmail: ConfirmeEmailModel): KfstringDef[];
    abstract détailSucces(confirmeEmail: ConfirmeEmailModel): string;
    abstract demandeApi(confirmeEmail: ConfirmeEmailModel): Observable<ApiResult>;

    constructor(
        protected route: ActivatedRoute,
        protected service: CompteService,
    ) {
        super();
    }

    ngOnInit() {
        this.subscriptions.push(this.route.data.pipe(
            switchMap(data => {
                const confirmeEmail: ConfirmeEmailModel = {
                    id: data.idCode.id,
                    email: data.email,
                    code: data.idCode.code
                };
                this.niveauTitre = 0;
                this.créeTitrePage();
                this.superGroupe = new KfSuperGroupe(this.nom);
                this.avant = Fabrique.ajouteEtiquetteP();
                this.avant.ajouteTextes(this.defAvant(confirmeEmail));
                this.superGroupe.ajoute(this.avant);
                const afficheResultat = Fabrique.formulaire.ajouteResultat(this.superGroupe);
                this.superGroupe.ajoute(afficheResultat.groupe);
                const apiRequêteAction: ApiRequêteAction = {
                    demandeApi: () => {
                        return this.demandeApi(confirmeEmail).pipe(
                            tap(() => this.avant.visible = false)
                        );
                    },
                    actionSiOk: () => {
                        const texte = new KfTexte('', this.détailSucces(confirmeEmail));
                        texte.balisesAAjouter = [KfTypeDeBaliseHTML.p];
                        const def: ILienDef = {
                            nom: 'Connection',
                            urlDef: {
                                keys: CompteRoutes.route([ComptePages.connection.urlSegment]),
                                params: [
                                    { nom: 'email', valeur: confirmeEmail.email }
                                ]
                            },
                            contenu: { texte: 'Connection' },
                        };
                        const lien = Fabrique.lien.bouton(def);
                        afficheResultat.fixeDétails([texte, lien]);
                    },
                    afficheResultat,
                    titreSucces: this.titreSucces,
                    titreErreur: this.titreErreur,
                };
                return this.service.actionObs(apiRequêteAction);
            })
        ).subscribe(() => { })
        );
    }

}
