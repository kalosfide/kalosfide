import { KfBouton } from 'src/app/commun/kf-composants/kf-elements/kf-bouton/kf-bouton';
import { KfEvenement, KfTypeDEvenement, KfStatutDEvenement, KfTypeDHTMLEvents } from 'src/app/commun/kf-composants/kf-partages/kf-evenements';
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
import { BootstrapType, BootstrapNom, KfBootstrap } from '../../commun/kf-composants/kf-partages/kf-bootstrap';
import { FabriqueMembre } from './fabrique-membre';
import { DataService } from 'src/app/services/data.service';
import { ApiRequêteAction } from 'src/app/api/api-requete-action';
import { IUrlDef } from './fabrique-url';
import { IKfIconeDef } from 'src/app/commun/kf-composants/kf-partages/kf-icone-def';
import { Observable, of } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { KfNgbModal } from 'src/app/commun/kf-composants/kf-ngb-modal/kf-ngb-modal';
import { KfGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-groupe';

export interface IPopoverDef { titreDef: string | KfEtiquette; contenusDef: (string | KfComposant)[]; }

export interface IBoutonDef {
    nom: string;
    contenu?: IContenuPhraseDef;
    bootstrap?: {
        type: BootstrapType,
        outline?: 'outline',
    };
    action?: (evenement?: KfEvenement) => void;
    popoverDef?: IPopoverDef;
}

export class FabriqueBouton extends FabriqueMembre {
    constructor(fabrique: FabriqueClasse) { super(fabrique); }

    fixeActionBouton(bouton: KfBouton, action: (evenement: KfEvenement) => void) {
        this.supprimePopover(bouton);
        bouton.gereHtml.ajouteEvenementASuivre(KfTypeDHTMLEvents.click);
        bouton.gereHtml.supprimeTraiteurs(KfTypeDEvenement.click);
        bouton.gereHtml.fixeTraiteur(KfTypeDEvenement.click,
            (evenement: KfEvenement) => {
                action(evenement);
                evenement.statut = KfStatutDEvenement.fini;
            });
    }

    private supprimeActionBouton(bouton: KfBouton) {
        bouton.gereHtml.supprimeTraiteurs(KfTypeDEvenement.click);
    }

    fixeDef(bouton: KfBouton, def: IBoutonDef) {
        if (def.contenu) {
            this.fabrique.contenu.fixeDef(bouton, def.contenu);
        }
        if (def.bootstrap) {
            KfBootstrap.ajouteClasse(bouton, 'btn', def.bootstrap.type, def.bootstrap.outline);
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

    nomBoutonSoumettre(formulaire: KfGroupe): string {
        return formulaire.nom + '_soumettre';
    }
    soumettre(formulaire: KfGroupe, texte?: KfTexteDef): KfBouton {
        const bouton = new KfBouton(this.nomBoutonSoumettre(formulaire), texte);
        KfBootstrap.ajouteClasse(bouton, 'btn', BootstrapNom.primary);
        bouton.fixeTypeDeBouton('submit', formulaire);
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

    info(nom: string, titre?: string): KfBouton {
        const boutonDef: IBoutonDef = {
            nom,
            bootstrap: { type: 'link' },
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
        bouton.gereHtml.ajouteTraiteur(KfTypeDEvenement.click,
            (evenement: KfEvenement) => {
                const subscription = dataService.modalService.confirme(modal).subscribe(() => {
                    subscription.unsubscribe();
                    evenement.statut = KfStatutDEvenement.fini;
                });
            });
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
        contenu: IContenuPhraseDef,
        apiAction: ApiRequêteAction,
        dataService: DataService,
        confirme?: KfNgbModal
    ): KfBouton {
        const action = (evenement: KfEvenement) => {
            let obs: Observable<boolean>;
            if (confirme) {
                obs = dataService.modalService.confirme(confirme).pipe(
                    concatMap(ok => {
                        if (ok) {
                            return dataService.actionObs(apiAction);
                        }
                        return of(false);
                    })
                );
            } else {
                obs = dataService.actionObs(apiAction);
            }
            evenement.statut = KfStatutDEvenement.fini;
            const subscription = obs.subscribe(() => {
                subscription.unsubscribe();
                evenement.statut = KfStatutDEvenement.fini;
            });
        };
        const bouton = this.bouton({
            nom,
            contenu,
            action
        });
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
        contenu: IContenuPhraseDef,
        apiAction: ApiRequêteAction,
        dataService: DataService,
        confirme?: KfNgbModal
    ): KfBouton {
        const bouton = this.boutonAttente(nom, contenu, apiAction, dataService, confirme);
        bouton.ajouteClasse('btn btn-light');
        return bouton;
    }

    fauxTexteSousIcone(): KfEtiquette {
        const etiquette = new KfEtiquette('');
        etiquette.baliseHtml = KfTypeDeBaliseHTML.span;
        etiquette.ajouteClasse('texte-sous-icone');
        return etiquette;
    }
}
