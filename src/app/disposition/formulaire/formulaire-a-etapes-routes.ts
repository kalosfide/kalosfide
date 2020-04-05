import { Routes } from '@angular/router';
import { EtapeDeFormulaireComponent } from './etape-de-formulaire.component';
import { FormulaireAEtapeResolverService } from './formulaire-a-etapes-resolver.service';

export const FormulaireAEtapeRoutes: Routes = [
    {
        path: '*',
        component: EtapeDeFormulaireComponent,
        resolve: {
            etape: FormulaireAEtapeResolverService,
        }
    },
];
