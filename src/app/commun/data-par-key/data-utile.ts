import { DataService } from '../../services/data.service';
import { Site } from '../../modeles/site/site';
import { RouteurService } from '../../services/routeur.service';
import { ConditionEtatSite } from './condition-etat-site';
import { ConditionTable, ModeTable } from './condition-table';
import { ValeurEtObservable } from '../outils/valeur-et-observable';
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
    private pConditionTable?: ConditionTable;

    constructor(service: DataService) {
        this.pService = service;
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

    observeModeTable(modeTableIo: ValeurEtObservable<ModeTable>) {
        this.pConditionTable = new ConditionTable(modeTableIo);
    }

    get conditionTable(): ConditionTable {
        return this.pConditionTable;
    }
}
