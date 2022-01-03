import { ActivatedRouteSnapshot, Data, RouterStateSnapshot } from '@angular/router';
import { Site } from '../modeles/site/site';
import { IKeyId } from '../commun/data-par-key/key-id/i-key-id';

export abstract class DataResolverService {

    siteEnCours(route: ActivatedRouteSnapshot): Site {
        const fromRoot = route.pathFromRoot;
        for (const snapshot of fromRoot) {
            if (snapshot.data.site) {
                return snapshot.data.site;
            }
        }
    }

    keySiteEnCours(route: ActivatedRouteSnapshot): IKeyId {
        const site = this.siteEnCours(route);
        if (site) {
            return {
                id: site.id,
            };
        }
    }

    résolu(route: ActivatedRouteSnapshot, nom: string): any {
        const résolu = route.data[nom];
        if (résolu !== undefined) {
            return résolu;
        }
        if (route.parent) {
            return this.résolu(route.parent, nom);
        }
    }

}
