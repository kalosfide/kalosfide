import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChild, ParamMap, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CLFDocs } from 'src/app/modeles/c-l-f/c-l-f-docs';
import { CLFPages } from 'src/app/modeles/c-l-f/c-l-f-pages';
import { CLFEnfantsDeBonGarde, CLFEnfantsDeBonGardeService } from 'src/app/modeles/c-l-f/c-l-f-resolver/c-l-f-enfants-de-bon-garde.service';
import { NomParam } from 'src/app/modeles/nom-param';
import { ClientCLFService } from '../client-c-l-f.service';

@Injectable()
export class CEnfantsDeBonGardeService extends CLFEnfantsDeBonGardeService implements CanActivateChild {

    constructor(
        protected service: ClientCLFService
    ) {
        super(service);
    }

    /**
     * Crée la liste des conditions-redirections.
     * @param path de la route à garder
     */
    protected créeGardes(path: string) {
        if (path === CLFPages.nouveau.path) {
            const nouveau: CLFEnfantsDeBonGarde = {
                condition: () => !this.clfDoc.existe || !this.clfDoc.estOuvert,
                redirection: CLFPages.lignes.path
            };
            return { gardes: [nouveau] };
        }
        const lignes: CLFEnfantsDeBonGarde = {
            condition: () => this.clfDoc.existe && this.clfDoc.estOuvert,
            redirection: CLFPages.nouveau.path
        }
        switch (path) {
            case CLFPages.lignes.path:
            case CLFPages.annule.path:
            case CLFPages.choixProduit.path:
                return { gardes: [lignes] };
            case CLFPages.ajoute.path + '/:' + NomParam.noLigne:
                return {
                    gardes: [lignes, this.lignePasDansBon],
                    avecNoLigne: true
                };
            default:
                this.erreur(`path inconnu`);
                break;
        }
    }

    /**
     * Crée le bon et éventuellement fixe le no de la ligne.
     * @param clfDocs lu dans le stock
     * @param paramMap de la route à garder
     * @returns false si les paramètres sont incorrects
     */
    protected créeBon(clfDocs: CLFDocs, paramMap: ParamMap, avecNoLigne?: boolean): boolean {
        this.clfDoc = clfDocs.créeBon();
        if (avecNoLigne) {
            const noString = paramMap.get(NomParam.noLigne);
            if (!noString) {
                return false;
            }
            this.noLigne = +noString
        }
        return true;
    }

    /**
     * Vérifie ou charge le clfDocs depuis l'Api et redirige si le contexte a changé.
     * Lit le path de la route dans son routeConfig.
     * Si le path correspond à la dernière redirection, laisse passer.
     * Sinon crée la liste des conditions-redirections nécessaires pour garder la route
     * Crée le bon et éventuellement fixe le no de la ligne à partir du clfDocs stocké et des paramétres de la route.
     * Applique chaque condition au bon créé et redirige si la condition n'est pas satisfaite.
     * @param route route à garder
     */
    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | boolean | UrlTree {
        return this.service.chargeDocumentOuContexte().pipe(
            map((result: boolean | UrlTree) => {
                if (result === true) {
                    return this.garde(route, state);
                }
                return result;
            })
        );
    }

}
