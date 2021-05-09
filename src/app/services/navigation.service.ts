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

/**
 * Rassemble les membres statiques à ajouter à la propriété data d'une Route pour définir
 * les NavigationSegment qui y mènent.
 */
export interface IRouteData {
    /**
     * Si la route a un path non vide, son data doit avoir un pageDef et le path est l'urlSegment de ce pageDef
     */
    pageDef?: PageDef;
    /**
     * Si la route a un path non vide et est redirigée car son premier enfant a un path vide
     * et si son descendant par défaut est le point d'arrivée du routeur, title, titre et path de son NavigationSegment
     * sont composés des title, titre et urlSegment de sa PageDef et de celle du descendant par défaut.
     * Si son descendant par défaut n'est pas le point d'arrivée du routeur, title, titre de son NavigationSegment sont
     * ceux de sa PageDef et le path de son NavigationSegment est composés des urlSegment de sa PageDef
     * et de celle du descendant par défaut.
     */
    pageDefDescendantParDéfaut?: PageDef;
    cheminDeTitre?: string[];
    cheminDeKey?: string[];
    estEnfantPathVide?: boolean;
}

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
        public activatedRoute: ActivatedRoute,
        stockageService: StockageService,
        private pAttenteService: AttenteService,
    ) {
        this.stockageHistorique = stockageService.nouveau<string[]>('Historique');
        this.stockageNavigation = stockageService.nouveau<NavigationSegment[]>('Navigation');
        this.stockageSite = stockageService.nouveau<Site>('SiteEnCours', {
            // Appelé quand l'utilisateur a plusieurs roles et change de site
            // ou quand l'utilisateur est un fournisseur qui modifie les champs de son site
            quandStockChange: (ancien: Site, nouvau: Site): void => {
                this.siteSubject.next(nouvau);
                const keyInchangé = !ancien
                    ? !nouvau
                    : !!nouvau && ancien.uid === nouvau.uid && ancien.rno === nouvau.rno;
                if (!keyInchangé) {
                    // ce n'est plus le même site
                    this.keySiteSubject.next();
                }
            },
            // tous les stockages dépendant du site sont vidés quand le site change
            déclencheVidage: this.keySiteSubject.asObservable()
        });
        this.initialise();
    }

    get attenteService(): AttenteService { return this.pAttenteService; }

    ngOnDestroy() {
        this.stockageHistorique.vide();
        this.stockageNavigation.vide();
        this.stockageSite.vide();
    }

    get navigation(): NavigationSegment[] {
        return this.stockageNavigation.litStock();
    }

    /** appelé par le constructor du AppComponent ? */
    private initialise() {
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd),
            distinctUntilChanged(),
        )
            .subscribe((event) => {
                const navigationEnd = event as NavigationEnd;

                this.stockageHistorique.fixeStock([...this.historique(), navigationEnd.urlAfterRedirects]);
                this.historiqueAChangé.next(true);
                this.stockageNavigation.fixeStock(this.créeNavigationsSegments());

                const urlSite = SiteRoutes.urlSite(navigationEnd.urlAfterRedirects);
                // le seul changement de site qui n'est pas traité par SiteResolver est un retour à la racine
                if (urlSite === undefined && this.stockageSite) {
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

    private créeNavigationsSegments(): NavigationSegment[] {
        /**
         * Les NavigationSegment créés
         */
        const segments: NavigationSegment[] = [];
        /**
         * L'ActivatedRouteSnapshot en cours de traitement. Produira un NavigationSegment
         * si sa Route a un path et un data avec un PagDef.
         */
        let snapshot: ActivatedRouteSnapshot = this.router.routerState.snapshot.root;
        /**
         * Le dernier ActivatedRouteSnapshot traité qui a produit un NavigationSegment
         */
        let dernierSnapshot: ActivatedRouteSnapshot;
        /**
         * Les path des Route des ActivatedRouteSnapshot traités depuis dernierSnapshot qui n'ont pas de data avec un PagDef
         * et le path de l'ActivatedRouteSnapshot en cours de traitement.
         */
        let paths: string[] = [];
        while (snapshot) {
            // Passe les ActivatedRouteSnapshot dont la Route n'a pas de path
            if (!snapshot.routeConfig || !snapshot.routeConfig.path) {
                snapshot = snapshot.firstChild;
                continue;
            }

            let path = snapshot.routeConfig.path;
            const pos2Points = path.indexOf(':');
            let nomParam: string;
            let param: string;
            // Si le path de la Route a un paramètre, remplace le nom de ce paramètre par sa valeur
            if (pos2Points >= 0) {
                nomParam = path.slice(pos2Points + 1);
                param = snapshot.params[nomParam];
                path = path.slice(0, pos2Points) + param;
            }
            // Stocke le résultat
            paths.push(path);

            // Si la Route n'a pas de data avec PageDef, passe au suivant
            if (!snapshot.data || !snapshot.data.pageDef) {
                snapshot = snapshot.firstChild;
                continue;
            }

            let routeData: IRouteData = snapshot.data;
            const pageDef = routeData.pageDef;
            const segment: NavigationSegment = {
                title: pageDef.title,
                titre: pageDef.titre,
                path: paths.join('/')
            };
            // Vide la liste des path des Route des ActivatedRouteSnapshot traités qui n'ont pas de data avec un PagDef
            paths = [];
            if (routeData.cheminDeTitre) {
                // cheminDeTitre est la liste des noms des propriétés à suivre pour obtenir le texte à utiliser comme titre
                let objet: any = routeData;
                for (const propriété of routeData.cheminDeTitre) {
                    objet = objet[propriété];
                    if (!objet) {
                        throw new Error(`Propriété ${propriété} de cheminDeTitre manquante.`);
                    }
                }
                segment.title = objet;
                segment.titre = objet;
            } else {
                if (routeData.cheminDeKey) {
                    // cheminDeKey est la liste des noms des propriétés à suivre pour obtenir le texte à utiliser comme key
                    let objet: any = routeData;
                    for (const propriété of (routeData.cheminDeKey as string[])) {
                        objet = objet[propriété];
                        if (!objet) {
                            throw new Error(`Propriété ${propriété} de cheminDeKey manquante.`);
                        }
                    }
                    segment.title += ' ' + objet;
                    segment.titre += ' ' + objet;
                }
            }

            if (dernierSnapshot) {
                routeData = dernierSnapshot.data;
                if (routeData.pageDefDescendantParDéfaut && routeData.pageDefDescendantParDéfaut === pageDef) {
                    // La Route correspondant au dernier NavigationSegment a une redirection du path vide qui mène à la route traitée.
                    // Elle aura du texte mais pas de lien dans le breadcrumb. Il faut vider le path de son NavigationSegment
                    // en l'ajoutant devant celui du NavigationSegment créé.
                    const dernierSegment = segments[segments.length - 1];
                    segment.path = dernierSegment.path + '/' + segment.path;
                    dernierSegment.path = '';
                }
            }
            segments.push(segment);
            dernierSnapshot = snapshot;
            snapshot = snapshot.firstChild;
        }
        return segments;
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
        return historique.length > 0 && SiteRoutes.urlSite(historique[historique.length - 1]) !== undefined;
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

    /**
     * Emet
     */
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
