import { Injectable, OnDestroy } from '@angular/core';
import { Site } from '../modeles/site/site';
import { Observable, Subject } from 'rxjs';
import { Router, NavigationEnd, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { filter, distinctUntilChanged } from 'rxjs/operators';
import { PageDef } from '../commun/page-def';
import { AttenteService } from './attente.service';
import { SiteRoutes } from '../site/site-pages';
import { StockageService } from './stockage/stockage.service';
import { Stockage } from './stockage/stockage';
import { KeyUidRno } from '../commun/data-par-key/key-uid-rno/key-uid-rno';
import { NavigationSegment } from './navigation-segment';

@Injectable({
    providedIn: 'root'
})
export class NavigationService implements OnDestroy {

    private stockageHistorique: Stockage<string[]>;

    private stockageNavigation: Stockage<NavigationSegment[]>;

    private stockageSite: Stockage<Site>;

    private historiqueAChangé = new Subject<boolean>();

    private ANavigué = new Subject<boolean>();

    private siteSubject = new Subject<Site>();

    private keySiteSubject = new Subject<Site>();

    private actionsAprèsNavigation: (() => void)[] = [];
    private actionsAprèsNavigationCommencées: boolean;

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        stockageService: StockageService,
        private pAttenteService: AttenteService,
    ) {
        this.stockageHistorique = stockageService.nouveau<string[]>('Historique', {
            rafraichit: 'aucun',
        });
        this.stockageNavigation = stockageService.nouveau<NavigationSegment[]>('Navigation', {
            rafraichit: 'aucun',
            quandStockChange: () => {
            }
        });
        this.stockageSite = stockageService.nouveau<Site>('SiteEnCours', {
            quandStockChange: (ancien: Site, nouvau: Site): void => {
                if (!Site.compare(ancien, nouvau)) {
                    this.siteSubject.next(nouvau);
                    const keyInchangé = !ancien
                        ? !nouvau
                        : !!nouvau && ancien.uid === nouvau.uid && ancien.rno === nouvau.rno;
                    if (!keyInchangé) {
                        this.keySiteSubject.next();
                    }
                }
            },
            rafraichit: 'déclenche',
            doitRéinitialiser: this.keySiteSubject.asObservable()
        });
        this.initialise();
    }

    get attenteService(): AttenteService { return this.pAttenteService; }

    ngOnDestroy() {
        this.stockageHistorique.initialise();
        this.stockageNavigation.initialise();
        this.stockageSite.initialise();
    }

    get navigation(): NavigationSegment[] {
        return this.stockageNavigation.litStock();
    }

    /** appelé par le constructor du AppComponent ? */
    public initialise() {
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd),
            distinctUntilChanged(),
        )
            .subscribe((event) => {
                const navigationEnd = event as NavigationEnd;

                this.stockageHistorique.fixeStock([...this.historique(), navigationEnd.urlAfterRedirects]);
                this.historiqueAChangé.next(true);

                let lastChild = this.router.routerState.snapshot.root;
                while (lastChild.firstChild) {
                    lastChild = lastChild.firstChild;
                }
                const defs: NavigationSegment[] = [];
                let paths: string[] = [];
                const snapshots = lastChild.pathFromRoot.filter(s => s.routeConfig && s.routeConfig.path)
                    .map(s => ({
                        path: s.routeConfig.path,
                        pathSplit: s.routeConfig.path.split('/:'),
                        params: s.params,
                        data: s.data,
                        component: s.component
                    }));

                let dernierSnapshot: ActivatedRouteSnapshot;
                for (const snapshot of lastChild.pathFromRoot.filter(s => s.routeConfig && s.routeConfig.path)) {
                    let path = snapshot.routeConfig.path;
                    const pos2Points = path.indexOf(':');
                    let nomParam: string;
                    let param: string;
                    if (pos2Points >= 0) {
                        nomParam = path.slice(pos2Points + 1);
                        param = snapshot.params[nomParam];
                        path = path.slice(0, pos2Points) + param;
                    }
                    paths.push(path);
                    const pageDef = snapshot.data.pageDef;
                    if (pageDef) {
                        let def: NavigationSegment;
                        if (snapshot.data.cheminDeTitre) {
                            let data: any = snapshot.data;
                            for (const propriété of (snapshot.data.cheminDeTitre as string[])) {
                                data = data[propriété];
                                if (!data) {
                                    break;
                                }
                                def = {
                                    title: data as string,
                                    titre: data as string,
                                    path: paths.join('/')
                                };
                            }
                        } else {
                            if (snapshot.data.cheminDeKey) {
                                let data: any = snapshot.data;
                                for (const propriété of (snapshot.data.cheminDeKey as string[])) {
                                    data = data[propriété];
                                    if (!data) {
                                        break;
                                    }
                                    param = data;
                                }
                            }
                            const no = param ? ' ' + param : '';
                            def = {
                                title: pageDef.title + no,
                                titre: pageDef.titre + no,
                                path: paths.join('/')
                            };
                        }
                        const dernièreDef = defs[defs.length - 1];
                        if (snapshot.data.estEnfantPathVide && defs.length > 0) {
                            // la route est aussi celle du path vide
                            // il faut ajouter son path et ses titres à ceux de la dernière def de defs
                            dernièreDef.path = `${dernièreDef.path}/${def.path}`;
                            dernièreDef.title = `${dernièreDef.title} - ${def.title}`;
                            dernièreDef.titre = `${dernièreDef.titre} - ${def.titre}`;
                        } else {
                            if (dernierSnapshot && dernierSnapshot.data.pageDefEnfantPathVide) {
                                // la route parent a une redirection du path vide
                                // il faut ajouter les titres de la redirection à la def de la route parent
                                const pageDefEnfantPathVide: PageDef = dernierSnapshot.data.pageDefEnfantPathVide;
                                dernièreDef.title = `${dernièreDef.title} - ${pageDefEnfantPathVide.title}`;
                                dernièreDef.titre = `${dernièreDef.titre} - ${pageDefEnfantPathVide.titre}`;
                            }
                            defs.push(def);
                        }
                        paths = [];
                    }
                    dernierSnapshot = snapshot;
                }
                this.stockageNavigation.fixeStock(defs);

                const nomSite = SiteRoutes.nomSite(navigationEnd.urlAfterRedirects);
                // le seul changement de site qui n'est pas traité par SiteResolver est un retour à la racine
                if (nomSite === undefined && this.stockageSite) {
                    this.fixeSiteEnCours(null);
                }

                if (this.actionsAprèsNavigation.length > 0) {
                    this.actionsAprèsNavigationCommencées = true;
                    this.actionsAprèsNavigation.forEach(action => action());
                    this.actionsAprèsNavigation = [];
                    this.actionsAprèsNavigationCommencées = false;
                }
                this.ANavigué.next(true);
            });
    }

    public historique(): string[] {
        const stock = this.stockageHistorique.litStock();
        return stock ? stock : [];
    }

    public dernièreUrl(): string {
        const historique = this.historique();
        return historique.length > 0 ? historique[historique.length - 1] : null;
    }

    public urlPrécédente(): string {
        const historique = this.historique();
        return historique.length > 1 ? historique[historique.length - 2] : null;
    }

    public routePasseParSite(): boolean {
        const historique = this.historique();
        return historique.length > 0 && SiteRoutes.nomSite(historique[historique.length - 1]) !== undefined;
    }

    public litSiteEnCours(): Site {
        const isite = this.stockageSite.litStock();
        return isite ? new Site(isite) : null;
    }
    public fixeSiteEnCours(site: Site) {
        this.stockageSite.fixeStock(site);
    }

    public siteObs(): Observable<Site> {
        return this.siteSubject.asObservable();
    }

    public keySiteObs(): Observable<KeyUidRno> {
        return this.keySiteSubject.asObservable();
    }

    public changementDePageDef(): Observable<boolean> {
        return this.ANavigué.asObservable();
    }

    public changementHistorique(): Observable<boolean> {
        return this.historiqueAChangé.asObservable();
    }

    public fixeActionsAprèsNavigation(action: () => void) {
        if (!this.actionsAprèsNavigationCommencées) {
            this.actionsAprèsNavigation.push(action);
        }
    }
}
