import { DataService } from '../../services/data.service';
import { Site } from '../../modeles/site/site';
import { RouteurService } from '../../services/routeur.service';
import { ConditionEtatSite } from './condition-etat-site';
import { ConditionTable, ModeTable } from './condition-table';
import { KfInitialObservable } from '../kf-composants/kf-partages/kf-initial-observable';
import { DataUtileUrl } from './data-utile-url';
import { DataUtileLien } from './data-utile-lien';
import { DataUtileColonne } from './data-utile-colonne';
import { DataUtileBouton } from './data-utile-bouton';
import { DataUtileOutils } from './data-utile-outils';

export class DataUtile {
    protected pService: DataService;
    protected pUrl: DataUtileUrl;
    protected pLien: DataUtileLien;
    protected pBouton?: DataUtileBouton;
    protected pOutils?: DataUtileOutils;
    protected pColonne: DataUtileColonne;
    private pConditionSite: ConditionEtatSite;
    private pConditionTable?: ConditionTable;

    constructor(service: DataService) {
        this.pService = service;
        this.pConditionSite = new ConditionEtatSite(service.navigation);
    }

    get url(): DataUtileUrl {
        return this.pUrl;
    }

    get lien(): DataUtileLien {
        return this.pLien;
    }

    get colonne(): DataUtileColonne {
        return this.pColonne;
    }

    get service(): DataService {
        return this.pService;
    }

    get site(): Site {
        return this.pService.navigation.litSiteEnCours();
    }

    get routeur(): RouteurService {
        return this.pService.routeur;
    }

    get conditionSite(): ConditionEtatSite {
        return this.pConditionSite;
    }

    observeModeTable(modeTableIo: KfInitialObservable<ModeTable>) {
        this.pConditionTable = new ConditionTable(modeTableIo);
    }

    get conditionTable(): ConditionTable {
        return this.pConditionTable;
    }
}
