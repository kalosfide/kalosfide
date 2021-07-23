import { CLFUtileUrl } from './c-l-f-utile-url';
import { CLFUtileLien } from './c-l-f-utile-lien';
import { CLFUtileBouton } from './c-l-f-utile-bouton';
import { CLFUtileOutils } from './c-l-f-utile-outils';
import { CLFUtileColonne } from './c-l-f-utile-colonne';
import { ConditionAction, ModeAction } from './condition-action';
import { ValeurEtObservable } from 'src/app/commun/outils/valeur-et-observable';
import { DataKeyUtile } from 'src/app/commun/data-par-key/data-key-utile';
import { ApiDocument } from './api-document';
import { CLFLigne } from './c-l-f-ligne';
import { CLFService } from './c-l-f.service';
import { CLFUtileTexte } from './c-l-f-utile-texte';
import { ILienDef } from 'src/app/disposition/fabrique/fabrique-lien';
import { KfGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-groupe';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { GroupeBoutonsMessages } from 'src/app/disposition/fabrique/fabrique-formulaire';
import { TypeCLF } from './c-l-f-type';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';


export class CLFUtile extends DataKeyUtile<ApiDocument> {
    private pTexte: CLFUtileTexte;

    private pConditionAction: ConditionAction;

    utilisateurEstLeClient: boolean;

    constructor(service: CLFService) {
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

    get nom(): {
        client: string,
        catégorie: string,
        produit: string,
        préparation: string,
        type: string,
        choisit: string,
    } {
        return {
            client: 'client',
            produit: 'produit',
            catégorie: 'catégorie',
            préparation: 'préparation',
            type: 'type',
            choisit: 'choisit',
        };
    }

    inactivité(ligne: CLFLigne): boolean {
        return ligne.parent.crééParLeClient && !ligne.parent.apiDoc.noGroupe;
    }

    observeModeAction(modeActioIO: ValeurEtObservable<ModeAction>) {
        this.pConditionAction = new ConditionAction(modeActioIO);
    }

    get conditionAction(): ConditionAction {
        return this.pConditionAction;
    }

    groupeCréationImpossible(type: TypeCLF, message: string, lienDef: ILienDef): KfGroupe {
        const messages: KfEtiquette[] = [];
        let etiquette = Fabrique.ajouteEtiquetteP(messages);
        etiquette.fixeTexte(`La création de ${this.texte.textes(type).def.doc} est impossible.`);
        etiquette = Fabrique.ajouteEtiquetteP(messages);
        etiquette.fixeTexte(message);
        const bouton = Fabrique.lien.bouton(lienDef);
        const grBtnsMsgs = new GroupeBoutonsMessages('créationImpossible', { messages, boutons: [bouton] });
        grBtnsMsgs.alerte('danger');
        return grBtnsMsgs.groupe;
    }

}
