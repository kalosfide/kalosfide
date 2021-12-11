import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, ParamMap, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { CLFEnfantsDeBonGarde, CLFEnfantsDeBonGardesDef, CLFEnfantsDeBonGardeService } from '../modeles/c-l-f/c-l-f-resolver/c-l-f-enfants-de-bon-garde.service';
import { CLFPages } from '../modeles/c-l-f/c-l-f-pages';
import { CLFDocs } from '../modeles/c-l-f/c-l-f-docs';
import { NomParam } from '../modeles/nom-param';
import { FournisseurCLFService } from './fournisseur-c-l-f-.service';
import { Injectable } from '@angular/core';

@Injectable()
export class LFEnfantsDeBonGardeService extends CLFEnfantsDeBonGardeService implements CanActivateChild {

    constructor(
        protected service: FournisseurCLFService
    ) {
        super(service);
    }

    /**
     * Crée la liste des conditions-redirections.
     * @param path de la route à garder
     */
    protected créeGardes(path: string): CLFEnfantsDeBonGardesDef {
        if (path === CLFPages.nouveau.path) {
            const nouveau: CLFEnfantsDeBonGarde = {
                condition: () => this.clfDoc.estVirtuel && (!this.clfDoc.existe || !this.clfDoc.estOuvert),
                redirection: CLFPages.lignes.path
            };
            return { gardes: [nouveau] };
        }
        const lignes: CLFEnfantsDeBonGarde = {
            condition: () => !this.clfDoc.estVirtuel || (this.clfDoc.existe && this.clfDoc.estOuvert),
            redirection: CLFPages.nouveau.path
        }
        if (path === CLFPages.lignes.path) {
            return { gardes: [lignes] };
        }
        const estVirtuel: CLFEnfantsDeBonGarde = {
            condition: () => this.clfDoc.estVirtuel,
            redirection: CLFPages.lignes.path
        }
        switch (path) {
            case CLFPages.annule.path:
            case CLFPages.choixProduit.path:
                return { gardes: [lignes, estVirtuel] };
            case CLFPages.ajoute.path + '/:' + NomParam.noLigne:
                return {
                    gardes: [lignes, estVirtuel, this.lignePasDansBon],
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
        const noString = paramMap.get(NomParam.noDoc);
        if (!noString) {
            return false;
        }
        this.clfDoc = clfDocs.créeBon(+noString);
        if (!this.clfDoc.estVirtuel && !this.clfDoc.existe) {
            return false;
        }
        if (avecNoLigne) {
            const no2String = paramMap.get(NomParam.noLigne);
            if (!no2String) {
                return false;
            }
            this.noLigne = +no2String;
        }
        return true;
    }

    /**
     * Lit le path de la route dans son routeConfig.
     * Si le path correspond à la dernière redirection, laisse passer.
     * Sinon crée la liste des conditions-redirections nécessaires pour garder la route
     * Crée le bon et éventuellement fixe le no de la ligne à partir du clfDocs stocké et des paramétres de la route.
     * Applique chaque condition au bon créé et redirige si la condition n'est pas satisfaite.
     * @param route route à garder
     */
    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | boolean | UrlTree {
        return this.garde(route, state);
    }

}
