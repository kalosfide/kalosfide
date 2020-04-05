import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionIndexComponent } from './gestion-index.component';

describe('GestionIndexComponent', () => {
  let component: GestionIndexComponent;
  let fixture: ComponentFixture<GestionIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
