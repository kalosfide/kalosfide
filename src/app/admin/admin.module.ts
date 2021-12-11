import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommunModule } from '../commun/commun.module';
import { DispositionModule } from '../disposition/disposition.module';
import { ErreursModule } from '../erreurs/erreurs.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AdminRoutingModule } from './admin.routing.module';
import { AdminComponent } from './admin.component';
import { AdminAccueilComponent } from './admin-accueil.component';
import { FournisseursResolverService } from './fournisseurs/fournisseurs-resolver.service';
import { FournisseursIndexComponent } from './fournisseurs/fournisseurs-index.component';
import { AdminService } from './admin.service';
import { AdminGardeService } from './admin-garde.service';

@NgModule({
    imports: [
        CommonModule,
        NgbModule,
        CommunModule,
        DispositionModule,
        ErreursModule,
        AdminRoutingModule,
    ],
    declarations: [
        AdminComponent,
        AdminAccueilComponent,
        FournisseursIndexComponent
    ],
    providers: [
        AdminService,
        AdminGardeService,
        FournisseursResolverService,
    ],
})
export class AdminModule { }
