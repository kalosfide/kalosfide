import { KfBouton } from 'src/app/commun/kf-composants/kf-elements/kf-bouton/kf-bouton';
import { KfEvenement, KfTypeDEvenement, KfStatutDEvenement } from 'src/app/commun/kf-composants/kf-partages/kf-evenements';
import { ILienDef } from './fabrique-lien';
import { RouteurService } from 'src/app/services/routeur.service';
import { ValeurTexteDef, KfTexteDef } from 'src/app/commun/kf-composants/kf-partages/kf-texte-def';
import { KfSuperGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-super-groupe';
import { KfTypeDeBouton, KfTypeDeBaliseHTML } from 'src/app/commun/kf-composants/kf-composants-types';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { KfComposant } from 'src/app/commun/kf-composants/kf-composant/kf-composant';
import { IKfNgbPopoverDef } from 'src/app/commun/kf-composants/kf-elements/kf-bouton/kf-ngb-popover';
import { IContenuPhraseDef } from './fabrique-contenu-phrase';
import { FabriqueClasse } from './fabrique';
import { BootstrapType, BootstrapNom, FabriqueBootstrap } from './fabrique-bootstrap';
import { FabriqueMembre } from './fabrique-membre';
import { DataService } from 'src/app/services/data.service';
import { ApiRequêteAction } from 'src/app/services/api-requete-action';
import { IUrlDef } from './fabrique-url';
import { FANomIcone } from 'src/app/commun/kf-composants/kf-partages/kf-icone-def';
import { Observable, of } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { IKfNgbModalDef, KfNgbModal } from 'src/app/commun/kf-composants/kf-ngb-modal/kf-ngb-modal';
import { KfGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-groupe';

export interface IPopoverDef { titreDef: string | KfEtiquette; contenusDef: (string | KfComposant)[]; }

export interface IBoutonDef {
    nom: string;
    contenu?: IContenuPhraseDef;
    bootstrapType?: BootstrapType;
    action?: (evenement?: KfEvenement) => void;
    popoverDef?: IPopoverDef;
}

export class FabriqueBouton extends FabriqueMembre {
    constructor(fabrique: FabriqueClasse) { super(fabrique); }

    fixeActionBouton(bouton: KfBouton, action: (evenement: KfEvenement) => void) {
        this.supprimePopover(bouton);
        bouton.gereHtml.supprimeTraiteurs(KfTypeDEvenement.clic);
        bouton.gereHtml.fixeTraiteur(KfTypeDEvenement.clic,
            (evenement: KfEvenement) => {
                action(evenement);
                evenement.statut = KfStatutDEvenement.fini;
            });
    }

    private supprimeActionBouton(bouton: KfBouton) {
        bouton.gereHtml.supprimeTraiteurs(KfTypeDEvenement.clic);
    }

    private fixeActionLien(bouton: KfBouton, urlDef: IUrlDef, routeur: RouteurService) {
        this.fixeActionBouton(bouton, () => {
            const route: any[] = [ValeurTexteDef(this.fabrique.url.url(urlDef))];
            if (urlDef.params) {
                route.push(urlDef.params);
            }
            routeur.navigueUrlDef(urlDef);
        });
    }

    private fixeActionApi(bouton: KfBouton, apiRequêteAction: ApiRequêteAction, dataService: DataService) {
        this.fixeActionBouton(bouton, () => {
            const subscription = dataService.actionOkObs(apiRequêteAction).subscribe(() => { subscription.unsubscribe(); });
        });
    }

    fixeDef(bouton: KfBouton, def: IBoutonDef) {
        if (def.contenu) {
            this.fabrique.contenu.fixeDef(bouton, def.contenu);
        }
        if (def.bootstrapType) {
            FabriqueBootstrap.ajouteClasse(bouton, 'btn', def.bootstrapType);
        }
        if (def.action) {
            this.fixeActionBouton(bouton, def.action);
        }
        return bouton;
    }

    bouton(def: IBoutonDef): KfBouton {
        const bouton = new KfBouton(def.nom);
        this.fixeDef(bouton, def);
        return bouton;
    }
    boutonLien(nom: string, lienDef: ILienDef, routeur: RouteurService): KfBouton {
        const bouton = new KfBouton(nom);
        this.fabrique.contenu.fixeDef(bouton, lienDef.contenu);
        this.fixeActionLien(bouton, lienDef.urlDef, routeur);
        return bouton;
    }
    nomBoutonSoumettre(formulaire: KfSuperGroupe): string {
        return formulaire.nom + '_soumettre';
    }
    boutonSoumettre(formulaire: KfSuperGroupe, texte?: KfTexteDef): KfBouton {
        const bouton = this.bouton({
            nom: this.nomBoutonSoumettre(formulaire),
            contenu: { texte },
            bootstrapType: BootstrapNom.primary
        });
        bouton.typeDeBouton = KfTypeDeBouton.soumettre;
        return bouton;
    }

    boutonAction(nom: string, texte: string, apiRequêteDef: ApiRequêteAction, dataService: DataService): KfBouton {
        const bouton = this.bouton({
            nom,
            contenu: { texte },
            bootstrapType: 'primary'
        });
        this.fixeActionApi(bouton, apiRequêteDef, dataService);
        return bouton;
    }

    // info popOver
    fixePopover(bouton: KfBouton,
                titreDef: string | KfEtiquette,
                contenusDef: (string | KfComposant)[],
                nomIcone?: FANomIcone
    ): KfBouton {
        let titre: KfEtiquette;
        if (typeof (titreDef) === 'string') {
            titre = new KfEtiquette('', titreDef);
        } else {
            titre = titreDef;
        }
        const contenus: KfComposant[] = contenusDef.map(
            contenu => {
                if (typeof (contenu) === 'string') {
                    const etiquette = new KfEtiquette('', contenu);
                    etiquette.baliseHtml = KfTypeDeBaliseHTML.p;
                    return etiquette;
                } else {
                    return contenu;
                }
            }
        );
        const popOverDef: IKfNgbPopoverDef = {
            titre,
            contenus,
            container: 'body',
            placement: 'bottom',
        };
        if (nomIcone) {
            popOverDef.nomIcone = nomIcone;
        }
        bouton.ngbPopover = popOverDef;
        //        bouton.ajouteClasseDef('dropdown-toggle');
        this.supprimeActionBouton(bouton);
        return bouton;
    }
    supprimePopover(bouton: KfBouton) {
        bouton.ngbPopover = undefined;
        //        bouton.supprimeClasseDef('dropdown-toggle');
    }

    info(nom: string, titre?: string): KfBouton {
        const boutonDef: IBoutonDef = {
            nom,
            bootstrapType: 'link',
            contenu: this.fabrique.contenu.info(titre)
        };
        const bouton = this.bouton(boutonDef);
        return bouton;
    }

    aide(options: {
        nom: string,
        titre?: string,
        titreInfos?: string,
        infos?: KfComposant[]
    }): KfBouton {
        const boutonDef: IBoutonDef = {
            nom: options.nom,
            contenu: this.fabrique.contenu.aide(options.titre)
        };
        const bouton = this.bouton(boutonDef);
        if (options.titreInfos || options.infos) {
            this.fixePopover(bouton, options.titreInfos, options.infos);
        }
        return bouton;
    }

    aideModal(
        nom: string,
        titre: string,
        titreModal: string,
        contenus: KfComposant[],
        dataService: DataService,
     ) {
        const boutonDef: IBoutonDef = {
            nom,
            contenu: this.fabrique.contenu.info(titre)
        };
        const bouton = this.bouton(boutonDef);
        const modal = this.fabrique.infoModal(titreModal, contenus);
        bouton.gereHtml.ajouteTraiteur(KfTypeDEvenement.clic,
            (evenement: KfEvenement) => {
                const subscription = dataService.modalService.confirme(modal).subscribe(() => {
                    subscription.unsubscribe();
                    evenement.statut = KfStatutDEvenement.fini;
                });
            });
        return bouton;
    }

    boutonAttente(
        nom: string,
        contenu: IContenuPhraseDef,
        apiRequêteDef: ApiRequêteAction,
        dataService: DataService,
        confirme?: KfNgbModal
    ): KfBouton {
        const bouton = new KfBouton(nom);
        bouton.fixeStyleDef('position', 'relative');
        this.fabrique.contenu.fixeDef(bouton, contenu);
        const kfIcone = bouton.contenuPhrase.kfIcone;
        if (kfIcone) {
            kfIcone.fondVisible = true;
        }
        const icone = this.fabrique.icone.préparePourAttente(bouton.contenuPhrase.kfIcone.géreCssFond, apiRequêteDef);
        bouton.contenuPhrase.ajoute(icone);
        bouton.gereHtml.ajouteTraiteur(KfTypeDEvenement.clic,
            (evenement: KfEvenement) => {
                let obs: Observable<boolean>;
                if (confirme) {
                    obs = dataService.modalService.confirme(confirme).pipe(
                        concatMap(ok => {
                            if (ok) {
                                return dataService.actionOkObs(apiRequêteDef);
                            }
                            return of(false);
                        })
                    );
                } else {
                    obs = dataService.actionOkObs(apiRequêteDef);
                }
                const subscription = obs.subscribe(() => {
                    subscription.unsubscribe();
                    evenement.statut = KfStatutDEvenement.fini;
                });
            });
        return bouton;
    }

    boutonAttenteDeColonne(
        nom: string,
        contenu: IContenuPhraseDef,
        apiRequêteDef: ApiRequêteAction,
        dataService: DataService,
        confirme?: KfNgbModal
    ): KfBouton {
        const bouton = this.boutonAttente(nom, contenu, apiRequêteDef, dataService, confirme);
        bouton.ajouteClasseDef('btn btn-light');
        return bouton;
    }

    fauxTexteSousIcone(): KfEtiquette {
        const etiquette = new KfEtiquette('');
        etiquette.baliseHtml = KfTypeDeBaliseHTML.span;
        etiquette.ajouteClasseDef('texte-sous-icone');
        return etiquette;
    }
}
