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
import { NavigationSegment } from 'src/app/services/navigation-segment';
import { KfComposant } from 'src/app/commun/kf-composants/kf-composant/kf-composant';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { KfTypeDeBaliseHTML } from 'src/app/commun/kf-composants/kf-composants-types';

// TODO: Add Angular decorator.
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
        this.breadcrumb.ajouteClasse('breadcrumb');
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

    /**
     * Met à jour le menu et affiche une alerte lors de la connection et de la déconnection
     * @param identifiant identifiant de l'utilisateur à la connection, null à la déconnection
     */
    protected utilisateurChange(identifiant: Identifiant) {
        this.menu.identifiant = identifiant;
        this.menu.rafraichit();
        this.alerteService.alertes = [AlerteConnection(identifiant)];
    }

    /**
     * Fixe le title de l'onglet du navigateur et le breadcrumb.
     */
    private pageDefChange() {
        const titles: string[] = [];
        const breadcrumbs: KfComposant[] = [];
        let url = '';
        this.navigation.navigation.forEach((segment: NavigationSegment) => {
            titles.push(segment.title);
            if (segment.path === '') {
                const étiquette = new KfEtiquette('', segment.titre);
                étiquette.baliseHtml = KfTypeDeBaliseHTML.span;
                breadcrumbs.push(étiquette);
            } else {
                url = `${url}/${segment.path}`;
                const lien = new KfLien('', url, segment.titre);
                breadcrumbs.push(lien);
            }
        });
        const title = titles.join(' - ');
        this.titleService.setTitle(title);
        this.breadcrumbUl.contenus = breadcrumbs;
    }

    ngOnDestroy() {
        this.subscriptions.forEach(
            subscription => subscription.unsubscribe()
        );
    }

}
