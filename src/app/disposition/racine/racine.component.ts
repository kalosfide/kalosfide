import { OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';


import { AttenteService } from '../../services/attente.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { Menu } from 'src/app/disposition/menu/menu';
import { IdentificationService } from 'src/app/securite/identification.service';
import { Title } from '@angular/platform-browser';
import { Identifiant } from 'src/app/securite/identifiant';
import { AlerteService } from 'src/app/disposition/alerte/alerte-service';
import { AlerteConnection } from '../alerte/alerte-connection';
import { KfGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-groupe';
import { Fabrique } from '../fabrique/fabrique';
import { KfLien } from 'src/app/commun/kf-composants/kf-elements/kf-lien/kf-lien';
import { KfUlComposant } from 'src/app/commun/kf-composants/kf-ul/kf-ul-composant';

export abstract class RacineComponent implements OnDestroy {

    subscriptions: Subscription[] = [];

    animeAttente: KfGroupe;

    menu: Menu;
    breadcrumb: KfGroupe;
    breadcrumbUl: KfUlComposant;

    constructor(
        protected titleService: Title,
        protected attenteService: AttenteService,
        protected identification: IdentificationService,
        protected navigation: NavigationService,
        protected alerteService: AlerteService,
    ) {
        this.breadcrumb = new KfGroupe('breadcrumb');
        this.breadcrumb.ajouteClasseDef('breadcrumb');
        this.breadcrumbUl = new KfUlComposant('');
        this.breadcrumb.ajoute(this.breadcrumbUl);
    }

    abstract créeMenu(): Menu;

    protected _ngOnInit() {
        this.animeAttente = Fabrique.animeAttenteGlobal();
        this.pageDefChange();

        this.subscriptions.push(
            this.navigation.changementDePageDef().subscribe(() => {
                this.pageDefChange();
            }),
            this.attenteService.enCours().subscribe(enCours => {
                this.animeAttente.visible = enCours;
            })
        );

        this.menu = this.créeMenu();
        this.menu.identifiant = this.identification.litIdentifiant();
    }

    protected utilisateurChange() {
        const identifiant: Identifiant = this.identification.litIdentifiant();
        this.menu.identifiant = identifiant;
        this.menu.rafraichit();
        this.alerteService.alertes = [AlerteConnection(identifiant)];
    }

    private pageDefChange() {
        const titles: string[] = [];
        const liens: KfLien[] = [];
        let url = '';
        this.navigation.navigation.forEach(n => {
            titles.push(n.title);
            url = `${url}/${n.path}`;
            const lien = new KfLien('', url, n.title);
            liens.push(lien);
        });
        const title = titles.join(' - ');
        this.titleService.setTitle(title);
        this.breadcrumbUl.contenus = liens;
    }

    ngOnDestroy() {
        this.subscriptions.forEach(
            subscription => subscription.unsubscribe()
        );
    }

}
