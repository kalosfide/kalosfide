import { CLFUtileUrl } from './c-l-f-utile-url';
import { CLFUtileLien } from './c-l-f-utile-lien';
import { CLFUtileBouton } from './c-l-f-utile-bouton';
import { CLFUtileOutils } from './c-l-f-utile-outils';
import { CLFUtileColonne } from './c-l-f-utile-colonne';
import { ConditionAction, ModeAction } from './condition-action';
import { KfInitialObservable } from 'src/app/commun/kf-composants/kf-partages/kf-initial-observable';
import { DataKeyUtile } from 'src/app/commun/data-par-key/data-key-utile';
import { DataKeyService } from 'src/app/commun/data-par-key/data-key.service';
import { Conditions } from 'src/app/commun/condition/condition';
import { ApiDocument } from './api-document';
import { CLFLigne } from './c-l-f-ligne';
import { CLFService } from './c-l-f.service';
import { CLFUtileTexte } from './c-l-f-utile-texte';
import { ILienDef } from 'src/app/disposition/fabrique/fabrique-lien';
import { KfGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-groupe';
import { KfComposant } from 'src/app/commun/kf-composants/kf-composant/kf-composant';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { GroupeBoutonsMessages } from 'src/app/disposition/fabrique/fabrique-formulaire';
import { FabriqueBootstrap } from 'src/app/disposition/fabrique/fabrique-bootstrap';
import { TypeCLF } from './c-l-f-type';

class ConditionsComposées extends Conditions<string> {
    constructor(utile: CLFUtile) {
        super();
        this.ajoute('catalogueOuPasDeClients', KfInitialObservable.ou(utile.conditionSite.catalogue,
            KfInitialObservable.nouveau(utile.site.nbClients === 0)));
        this.ajoute('editeOuAperçu', KfInitialObservable.ou(utile.conditionAction.edite, utile.conditionAction.aperçu));
    }

    /**
     * vrai si le site est dans l'état Catalogue ou n'a pas de client
     */
    get catalogueOuPasDeClients(): KfInitialObservable<boolean> {
        return this.conditionIO('catalogueOuPasDeClients');
    }

    /**
     * vrai si le site n'est pas dans l'état Catalogue et a des clients
     */
    get non_catalogueOuPasDeClients(): KfInitialObservable<boolean> {
        return this.pas_conditionIO('catalogueOuPasDeClients');
    }

    /**
     * vrai si le site n'est pas dans l'état Livraison ou si l'action est Edite ou Aperçu
     */
    get editeOuAperçu(): KfInitialObservable<boolean> {
        return this.conditionIO('editeOuAperçu');
    }
}

export class CLFUtile extends DataKeyUtile<ApiDocument> {
    private pTexte: CLFUtileTexte;

    private pConditionAction: ConditionAction;
    private pCondition: ConditionsComposées;

    utilisateurEstLeClient: boolean;

    constructor(service: DataKeyService<ApiDocument>) {
        super(service);
        this.pUrl = new CLFUtileUrl(this);
        this.pLien = new CLFUtileLien(this);
        this.pOutils = new CLFUtileOutils(this);
        this.pBouton = new CLFUtileBouton(this);
        this.pColonne = new CLFUtileColonne(this);
        this.pTexte = new CLFUtileTexte();
    }

    get service(): CLFService {
        return this.pService as CLFService;
    }

    get url(): CLFUtileUrl {
        return this.pUrl as CLFUtileUrl;
    }

    get lien(): CLFUtileLien {
        return this.pLien as CLFUtileLien;
    }

    get outils(): CLFUtileOutils {
        return this.pOutils as CLFUtileOutils;
    }

    get bouton(): CLFUtileBouton {
        return this.pBouton as CLFUtileBouton;
    }

    get colonne(): CLFUtileColonne {
        return this.pColonne as CLFUtileColonne;
    }

    get texte(): CLFUtileTexte {
        return this.pTexte;
    }

    inactivité(ligne: CLFLigne): boolean {
        return ligne.parent.crééParLeClient && !ligne.parent.apiDoc.noGroupe;
    }

    observeModeAction(modeActioIO: KfInitialObservable<ModeAction>) {
        this.pConditionAction = new ConditionAction(modeActioIO);
    }

    get conditionAction(): ConditionAction {
        return this.pConditionAction;
    }

    créeAutresConditions() {
        this.pCondition = new ConditionsComposées(this);
    }

    get condition(): ConditionsComposées {
        return this.pCondition;
    }

    groupeCréationImpossible(type: TypeCLF, message: string, lienDef: ILienDef): KfGroupe {
        const messages: KfComposant[] = [];
        let etiquette = Fabrique.ajouteEtiquetteP(messages);
        etiquette.fixeTexte(`La création de ${this.texte.textes(type).def.doc} est impossible.`);
        etiquette = Fabrique.ajouteEtiquetteP(messages);
        etiquette.fixeTexte(message);
        const grBtnsMsgs = new GroupeBoutonsMessages('créationImpossible', messages);
        FabriqueBootstrap.ajouteClasse(grBtnsMsgs.groupe, 'alert', 'danger');
        const bouton = Fabrique.lien.petitBouton(lienDef);
        grBtnsMsgs.créeBoutons([bouton]);
        return grBtnsMsgs.groupe;
    }

}
