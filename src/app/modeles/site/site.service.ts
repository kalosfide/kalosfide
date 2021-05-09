import { Injectable } from '@angular/core';
import { Site } from './site';
import { Observable, of } from 'rxjs';
import { ApiResult } from '../../api/api-results/api-result';
import { ApiAction, ApiController } from '../../api/api-route';
import { KeyUidRnoService } from '../../commun/data-par-key/key-uid-rno/key-uid-rno.service';
import { map, take } from 'rxjs/operators';
import { ApiResult200Ok } from '../../api/api-results/api-result-200-ok';
import { ApiRequêteService } from '../../api/api-requete.service';
import { IdEtatSite } from '../etat-site';
import { KeyUidRno } from '../../commun/data-par-key/key-uid-rno/key-uid-rno';
import { SiteUtile } from './site-utile';

@Injectable({
    providedIn: 'root'
})
export class SiteService extends KeyUidRnoService<Site> {

    controllerUrl = ApiController.site;

    constructor(
        protected apiRequeteService: ApiRequêteService,
    ) {
        super(apiRequeteService);
        this.créeUtile();
    }

    protected _créeUtile() {
        this.pUtile = new SiteUtile(this);
    }

    get utile(): SiteUtile {
        return this.pUtile as SiteUtile;
    }

    public trouveParUrl(urlSite: string): Observable<Site> {
        const identifiant = this.identification.litIdentifiant();
        // si pas identifié error
        // si pas dans les roles error
        // si pas fournisseur doit toujours recharger
        if (identifiant && identifiant.sites) {
            const site: Site = identifiant.sites.find(s => s.url === urlSite);
            if (site) {
                return of(site);
            }
        }
        const demandeApi = () => this.get<Site>(this.controllerUrl, ApiAction.site.trouveParUrl, urlSite);
        return this.lectureObs<Site>({ demandeApi });
    }

    public litEtat(site: Site): Observable<IdEtatSite> {
        const demandeApi = () => this.get<Site>(this.controllerUrl, ApiAction.site.etat, KeyUidRno.créeParams(site));
        return this.lectureObs<Site>({ demandeApi }).pipe(
            map(s => s.etat)
        );
    }

    public changeEtatOk(site: Site, état: IdEtatSite) {
        site.etat = état;
        this.navigation.fixeSiteEnCours(site);
        this.identification.fixeSiteIdentifiant(site);
    }

    public vérifieEtat(): Observable<IdEtatSite> {
        const site = this.navigation.litSiteEnCours();
        return this.litEtat(site).pipe(
            take(1),
            map(etat => {
                if (site.etat !== etat) {
                    site.etat = etat;
                    this.navigation.fixeSiteEnCours(site);
                    this.identification.fixeSiteIdentifiant(site);
                }
                return etat;
            })
        );
    }
}
