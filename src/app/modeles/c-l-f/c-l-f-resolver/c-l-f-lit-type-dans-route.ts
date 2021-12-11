import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { TypeCLF, TypesCLF } from "../c-l-f-type";

/**
 * Classe de base des gardes et resolver devant déterminer leur TypeCLF à partir du data de leur Route.
 */
export class CLFLitTypeDansRoute {

    /**
     * Lit le champ typeCLF dans le data d'une route. Lance une erreur si ce champ n'existe pas ou n'est pas un TypeCLF.
     * @param route 
     * @returns 
     */
    litType(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): TypeCLF {
        const type = route.data.typeCLF;
        if (type) {
            const typeCLF = TypesCLF.find(t => t === type);
            if (typeCLF) {
                return typeCLF;
            }
        }
        throw new Error(`Il manque un typeCLF dans le data de la route: ${state.url}`)
    }
}