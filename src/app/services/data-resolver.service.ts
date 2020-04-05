import { ActivatedRouteSnapshot, Data, RouterStateSnapshot } from '@angular/router';
import { Site } from '../modeles/site/site';
import { IKeyUidRno } from '../commun/data-par-key/key-uid-rno/i-key-uid-rno';

export abstract class DataResolverService {

    siteEnCours(route: ActivatedRouteSnapshot): Site {
        const fromRoot = route.pathFromRoot;
        for (const snapshot of fromRoot) {
            if (snapshot.data.site) {
                return snapshot.data.site;
            }
        }
    }

    keySiteEnCours(route: ActivatedRouteSnapshot): IKeyUidRno {
        const site = this.siteEnCours(route);
        if (site) {
            return {
                uid: site.uid,
                rno: site.rno
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
