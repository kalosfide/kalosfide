import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GestionRoutingModule } from './gestion-routing.module';
import { GestionComponent } from './gestion/gestion.component';
import { GestionIndexComponent } from './gestion-index/gestion-index.component';

@NgModule({
  imports: [
    CommonModule,
    GestionRoutingModule
  ],
  declarations: [GestionComponent, GestionIndexComponent]
})
export class GestionModule { }
