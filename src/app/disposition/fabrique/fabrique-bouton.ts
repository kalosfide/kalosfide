import { KfBouton } from 'src/app/commun/kf-composants/kf-elements/kf-bouton/kf-bouton';
import { KfEvenement, KfTypeDEvenement, KfStatutDEvenement, KfTypeDHTMLEvents } from 'src/app/commun/kf-composants/kf-partages/kf-evenements';
import { KfStringDef } from 'src/app/commun/kf-composants/kf-partages/kf-string-def';
import { KfTypeDeBaliseHTML } from 'src/app/commun/kf-composants/kf-composants-types';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { KfComposant } from 'src/app/commun/kf-composants/kf-composant/kf-composant';
import { IKfNgbPopoverDef } from 'src/app/commun/kf-composants/kf-elements/kf-bouton/kf-ngb-popover';
import { IContenuPhraséDef } from './fabrique-contenu-phrase';
import { FabriqueClasse } from './fabrique';
import { BootstrapTypeBouton, KfBootstrap } from '../../commun/kf-composants/kf-partages/kf-bootstrap';
import { FabriqueMembre } from './fabrique-membre';
import { DataService } from 'src/app/services/data.service';
import { ApiRequêteAction } from 'src/app/api/api-requete-action';
import { IKfIconeDef } from 'src/app/commun/kf-composants/kf-partages/kf-icone-def';
import { Observable, of } from 'rxjs';
import { concatMap, map, tap } from 'rxjs/operators';
import { KfNgbModal } from 'src/app/commun/kf-composants/kf-ngb-modal/kf-ngb-modal';
import { KfGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-groupe';

export interface IPopoverDef { titreDef: string | KfEtiquette; contenusDef: (string | KfComposant)[]; }

export interface IBoutonActionDef {
    /**
     * Si présent .
     */
    active?: () => boolean;
    /**
     * Pour confirmer le lancement de l'action ou pour afficher des infos s'il n'y a pas d'action.
     */
    modalAvant?: KfNgbModal;
    /**
     * Action sans requête Api. Si présent, apiAction est ignoré.
     */
    action?: () => void;
    /**
     * Requête action à demander à l'Api.
     */
    apiAction?: ApiRequêteAction,
    /**
     * Pour indiquer que l'action a réussi. Utilisé seulement si action est absent et apiAction est présent.
     */
    modalAprès?: KfNgbModal;

}
export interface IBoutonDef {
    nom: string;
    contenu?: IContenuPhraséDef;
    bootstrap?: {
        type: BootstrapTypeBouton,
        outline?: 'outline',
    };
    action?: (() => void) | IBoutonActionDef;
    popoverDef?: IPopoverDef;
}

export class FabriqueBouton extends FabriqueMembre {
    constructor(fabrique: FabriqueClasse) { super(fabrique); }

    fixeActionBouton(bouton: KfBouton, actionOuDef: (() => void) | IBoutonActionDef, service?: DataService) {
        this.supprimePopover(bouton);
        bouton.gereHtml.ajouteEvenementASuivre(KfTypeDHTMLEvents.click);
        bouton.gereHtml.supprimeTraiteurs(KfTypeDEvenement.click);
        let action: (evenement: KfEvenement) => void;
        if (typeof (actionOuDef) === 'function') {
            action = (evenement: KfEvenement) => {
                actionOuDef();
                evenement.statut = KfStatutDEvenement.fini;
            };
        } else {
            action = (evenement: KfEvenement) => {
                if (actionOuDef.active && actionOuDef.active()) {
                    // l'action est annulée si le bouton est actif
                    evenement.statut = KfStatutDEvenement.fini;
                    return;
                }
                let observable: Observable<boolean>;
                if (actionOuDef.modalAvant) {
                    observable = service.modalService.confirme(actionOuDef.modalAvant);
                }
                if (actionOuDef.action) {
                    if (observable) {
                        observable = observable.pipe(map((ok: boolean) => {
                            if (ok) {
                                actionOuDef.action();
                            }
                            return ok;
                        }));
                    }
                }
                if (actionOuDef.apiAction) {
                    const actionObs = service.actionObs(actionOuDef.apiAction);
                    observable = observable
                        ? observable.pipe(concatMap((ok: boolean) => {
                            if (ok) {
                                return actionObs;
                            } else {
                                return of(false);
                            }
                        }))
                        : actionObs;
                    if (actionOuDef.modalAprès) {
                        observable = observable.pipe(concatMap((ok: boolean) => {
                            if (ok) {
                                return service.modalService.confirme(actionOuDef.modalAprès);
                            } else {
                                return of(false);
                            }
                        }));
                    }
                }

                if (observable) {
                    const subscription = observable.subscribe(() => {
                        evenement.statut = KfStatutDEvenement.fini;
                        subscription.unsubscribe();
                    });
                } else {
                    if (actionOuDef.action) {
                        actionOuDef.action();
                    }
                    evenement.statut = KfStatutDEvenement.fini;
                }
            }
        }
        bouton.gereHtml.fixeTraiteur(KfTypeDEvenement.click, action);
    }

    private supprimeActionBouton(bouton: KfBouton) {
        bouton.gereHtml.supprimeTraiteurs(KfTypeDEvenement.click);
    }

    fixeDef(bouton: KfBouton, def: IBoutonDef, service?: DataService) {
        if (def.contenu) {
            this.fabrique.contenu.fixeDef(bouton, def.contenu);
        }
        if (def.bootstrap) {
            KfBootstrap.ajouteClasseBouton(bouton, def.bootstrap.type, def.bootstrap.outline);
        }
        if (def.action) {
            this.fixeActionBouton(bouton, def.action, service);
        }
        return bouton;
    }

    bouton(def: IBoutonDef, service?: DataService): KfBouton {
        const bouton = new KfBouton(def.nom);
        this.fixeDef(bouton, def, service);
        return bouton;
    }

    soumettre(formulaire: KfGroupe, texte?: KfStringDef): KfBouton {
        const bouton = new KfBouton('soumettre', texte);
        KfBootstrap.ajouteClasseBouton(bouton, 'primary');
        if (formulaire) {
            bouton.nom = formulaire.nom + '_' + bouton.nom;
            bouton.fixeTypeDeBouton('submit', formulaire);
        }
        return bouton;
    }

    boutonAction(nom: string, texte: string, apiRequêteDef: ApiRequêteAction, dataService: DataService): KfBouton {
        const bouton = this.bouton({
            nom,
            contenu: { texte },
            bootstrap: { type: 'primary' },
            action: () => {
                const subscription = dataService.actionObs(apiRequêteDef).subscribe(() => { subscription.unsubscribe(); });
            }
        });
        return bouton;
    }

    // info popOver
    fixePopover(bouton: KfBouton,
        titreDef: string | KfEtiquette,
        contenusDef: (string | KfComposant)[],
        iconeDef?: IKfIconeDef
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
        if (iconeDef) {
            popOverDef.iconeDef = iconeDef;
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
        const modal = this.fabrique.infoModal(titreModal, contenus, 'info');
        const boutonDef: IBoutonDef = {
            nom,
            contenu: this.fabrique.contenu.aide(titre),
            action: { modalAvant: modal }
        };
        const bouton = this.bouton(boutonDef, dataService);
        return bouton;
    }

    /**
     * Retourne un bouton qui déclenche une action de l'api éventuellement précédée d'une confirmation modale.
     * @param nom nom du bouton
     * @param contenu contenu à afficher dans le bouton
     * @param apiAction action de l'api à déclencher
     * @param dataService service pour déclencher l'action
     * @param confirme si présent, définit la fenêtre modale de confirmation
     */
    boutonAttente(
        nom: string,
        contenu: IContenuPhraséDef,
        apiAction: ApiRequêteAction,
        dataService: DataService,
        confirme?: KfNgbModal
    ): KfBouton {
        const bouton = this.bouton({
            nom,
            contenu,
            action: {
                modalAvant: confirme,
                apiAction
            }
        },
            dataService);
        const kfIcone = bouton.contenuPhrase.kfIcone;
        if (kfIcone) {
            kfIcone.fondVisible = true;
        }
        const icone = this.fabrique.icone.iconeAttente();
        bouton.créeSurvol(icone);
        apiAction.attente = {
            commence: bouton.survol.commence,
            finit: bouton.survol.finit
        };
        return bouton;
    }

    /**
     * Retourne un bouton de colonne qui déclenche une action de l'api éventuellement précédée d'une confirmation modale.
     * @param nom nom du bouton
     * @param contenu contenu à afficher dans le bouton
     * @param apiAction action de l'api à déclencher
     * @param dataService service pour déclencher l'action
     * @param confirme si présent, définit la fenêtre modale de confirmation
     */
    attenteDeColonne(
        nom: string,
        contenu: IContenuPhraséDef,
        apiAction: ApiRequêteAction,
        dataService: DataService,
        confirme?: KfNgbModal
    ): KfBouton {
        contenu.classeTexte = KfBootstrap.texteColor().classe('dark');
        const bouton = this.boutonAttente(nom, contenu, apiAction, dataService, confirme);
        bouton.ajouteClasse(KfBootstrap.classeBouton({ type: 'link' }), KfBootstrap.classeTexte({ décoration: 'none' }));
        return bouton;
    }

    fauxTexteSousIcone(): KfEtiquette {
        const etiquette = new KfEtiquette('');
        etiquette.baliseHtml = KfTypeDeBaliseHTML.span;
        etiquette.ajouteClasse('texte-sous-icone');
        return etiquette;
    }
}
